"use server";

import prisma from "@/lib/prisma";

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

    const isValidUrl = (urlStr: string) => {
      try {
        const parsed = new URL(urlStr);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch (_) {
        return false;
      }
    };

    // 1. Generic Webhook Integration
    if (form.webhookUrl && isValidUrl(form.webhookUrl)) {
      console.log(`Triggering Generic Webhook for Form ${formId}...`);
      fetch(form.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => console.error("Generic Webhook Error:", err));
    } else if (form.webhookUrl) {
      console.error(`Invalid Generic Webhook URL ignored: ${form.webhookUrl}`);
    }

    // 2. Google Sheets Webhook Integration
    if (form.googleSheetUrl && isValidUrl(form.googleSheetUrl)) {
      console.log(`Triggering Google Sheets Webhook for Form ${formId}...`);
      fetch(form.googleSheetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => console.error("Google Sheets Webhook Error:", err));
    } else if (form.googleSheetUrl) {
      console.error(`Invalid Google Sheets Webhook URL ignored: ${form.googleSheetUrl}`);
    }

    // 3. Notion REST API Integration
    if (form.notionApiKey && form.notionDatabaseId) {
      console.log(`Syncing submission ${submissionId} to Notion...`);
      
      const notionProperties: any = {
        // Notion databases default title field can be 'Name' or 'title'
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

      // Create page children blocks for the responses so they render cleanly in the page body
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

      fetch("https://api.notion.com/v1/pages", {
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
      })
        .then(async (res) => {
          if (!res.ok) {
            const errBody = await res.text();
            console.error(`Notion API returned error status ${res.status}:`, errBody);
          } else {
            console.log(`Successfully synced submission #${submissionId} to Notion!`);
          }
        })
        .catch((err) => console.error("Notion Integration Error:", err));
    }
  } catch (error) {
    console.error("Error triggering integrations:", error);
  }
};
