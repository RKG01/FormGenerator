"use server";

import prisma from "@/lib/prisma";

// Helper to retry a promise-returning function with exponential backoff
const retry = async (fn: () => Promise<any>, retries = 2, delay = 1000) => {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 2);
  }
};

const isValidUrl = (urlStr: string) => {
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_) {
    return false;
  }
};

export const triggerIntegrations = async (
  formId: number,
  submissionId: number,
  formData: any
) => {
  try {
    const form = await prisma.form.findUnique({
      where: {
        id: formId,
      },
    });

    if (!form) {
      console.error(`Form not found for integrations: ${formId}`);
      return;
    }

    const formTitle = (form.content as any)?.title || "Form Submission";
    const payload = {
      formId,
      formTitle,
      submissionId,
      submittedAt: new Date(),
      data: formData,
    };

    // 1. Generic Webhook Integration
    if (form.webhookEnabled && form.webhookUrl) {
      if (isValidUrl(form.webhookUrl)) {
        console.log(`Triggering Generic Webhook for Form ${formId}...`);
        
        const executeWebhook = async () => {
          const res = await fetch(form.webhookUrl!, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            throw new Error(`HTTP Error Status ${res.status}: ${res.statusText}`);
          }
          return res;
        };

        // Update last sync time
        await prisma.form.update({
          where: { id: formId },
          data: { webhookLastSync: new Date() }
        });

        retry(executeWebhook, 2, 1000)
          .then(async () => {
            // Success
            await prisma.form.update({
              where: { id: formId },
              data: {
                webhookStatus: "CONNECTED",
                webhookLastSuccess: new Date()
              }
            });

            await prisma.integrationLog.create({
              data: {
                formId,
                submissionId,
                integrationType: "WEBHOOK",
                status: "SUCCESS",
                message: "Webhook payload delivered successfully."
              }
            });
          })
          .catch(async (error: any) => {
            // Failure after retries
            await prisma.form.update({
              where: { id: formId },
              data: { webhookStatus: "SYNC_FAILED" }
            });

            await prisma.integrationLog.create({
              data: {
                formId,
                submissionId,
                integrationType: "WEBHOOK",
                status: "FAILED",
                message: error.message || "Failed to deliver webhook payload after 3 attempts."
              }
            });
          });
      } else {
        await prisma.integrationLog.create({
          data: {
            formId,
            submissionId,
            integrationType: "WEBHOOK",
            status: "FAILED",
            message: `Invalid Webhook URL: ${form.webhookUrl}`
          }
        });
      }
    }

    // 2. Google Sheets Integration
    if (form.googleSheetEnabled && form.googleSheetUrl) {
      if (isValidUrl(form.googleSheetUrl)) {
        console.log(`Triggering Google Sheets Webhook for Form ${formId}...`);

        const executeGoogleSheets = async () => {
          const res = await fetch(form.googleSheetUrl!, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            throw new Error(`HTTP Error Status ${res.status}: ${res.statusText}`);
          }
          return res;
        };

        // Update last sync time
        await prisma.form.update({
          where: { id: formId },
          data: { googleSheetLastSync: new Date() }
        });

        retry(executeGoogleSheets, 2, 1000)
          .then(async () => {
            // Success
            await prisma.form.update({
              where: { id: formId },
              data: {
                googleSheetStatus: "CONNECTED",
                googleSheetLastSuccess: new Date()
              }
            });

            await prisma.integrationLog.create({
              data: {
                formId,
                submissionId,
                integrationType: "GOOGLE_SHEET",
                status: "SUCCESS",
                message: "Synced row to Google Sheet successfully."
              }
            });
          })
          .catch(async (error: any) => {
            // Failure after retries
            await prisma.form.update({
              where: { id: formId },
              data: { googleSheetStatus: "SYNC_FAILED" }
            });

            await prisma.integrationLog.create({
              data: {
                formId,
                submissionId,
                integrationType: "GOOGLE_SHEET",
                status: "FAILED",
                message: error.message || "Failed to sync to Google Sheet after 3 attempts."
              }
            });
          });
      } else {
        await prisma.integrationLog.create({
          data: {
            formId,
            submissionId,
            integrationType: "GOOGLE_SHEET",
            status: "FAILED",
            message: `Invalid Google Sheet Apps Script URL: ${form.googleSheetUrl}`
          }
        });
      }
    }

    // 3. Notion REST API Integration
    if (form.notionEnabled && form.notionApiKey && form.notionDatabaseId) {
      console.log(`Syncing submission ${submissionId} to Notion Database ${form.notionDatabaseId}...`);

      const executeNotion = async () => {
        const notionProperties: any = {
          Name: {
            title: [
              {
                text: {
                  content: `Submission #${submissionId} - ${formTitle}`,
                },
              },
            ],
          },
        };

        const childrenBlocks = [
          {
            object: "block",
            type: "heading_2",
            heading_2: {
              rich_text: [
                {
                  type: "text",
                  text: { content: "Submission Responses" },
                },
              ],
            },
          },
          ...Object.entries(formData).map(([key, val]) => ({
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  type: "text",
                  text: { content: `${key}: ` },
                  annotations: { bold: true, color: "purple" },
                },
                {
                  type: "text",
                  text: { content: String(val) },
                },
              ],
            },
          })),
        ];

        const res = await fetch("https://api.notion.com/v1/pages", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${form.notionApiKey}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            parent: { database_id: form.notionDatabaseId },
            properties: notionProperties,
            children: childrenBlocks,
          }),
        });

        if (!res.ok) {
          const errBody = await res.text().catch(() => "");
          let errDetail = `Status ${res.status}`;
          if (res.status === 401) {
            errDetail = "401 Unauthorized (Invalid API token)";
          } else if (res.status === 404) {
            errDetail = "404 Not Found (Invalid Database ID or permission missing)";
          } else {
            try {
              const parsed = JSON.parse(errBody);
              if (parsed.message) errDetail = parsed.message;
            } catch (_) {}
          }
          throw new Error(errDetail);
        }
        return res;
      };

      // Update last sync time
      await prisma.form.update({
        where: { id: formId },
        data: { notionLastSync: new Date() }
      });

      retry(executeNotion, 2, 1000)
        .then(async () => {
          // Success
          await prisma.form.update({
            where: { id: formId },
            data: {
              notionStatus: "CONNECTED",
              notionLastSuccess: new Date()
            }
          });

          await prisma.integrationLog.create({
            data: {
              formId,
              submissionId,
              integrationType: "NOTION",
              status: "SUCCESS",
              message: "Created page in Notion database successfully."
            }
          });
        })
        .catch(async (error: any) => {
          // Failure after retries
          let newStatus = "SYNC_FAILED";
          if (error.message.includes("401")) {
            newStatus = "INVALID_CREDENTIALS";
          } else if (error.message.includes("404")) {
            newStatus = "INVALID_CREDENTIALS";
          }

          await prisma.form.update({
            where: { id: formId },
            data: { notionStatus: newStatus }
          });

          await prisma.integrationLog.create({
            data: {
              formId,
              submissionId,
              integrationType: "NOTION",
              status: "FAILED",
              message: error.message || "Failed to sync to Notion after 3 attempts."
            }
          });
        });
    }
  } catch (error) {
    console.error("Error triggering integrations:", error);
  }
};
