"use server";

import { currentUser } from "@clerk/nextjs/server";

export const testIntegration = async (
  type: "webhook" | "sheets" | "notion",
  data: {
    webhookUrl?: string;
    googleSheetUrl?: string;
    notionApiKey?: string;
    notionDatabaseId?: string;
  }
) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const isValidUrl = (urlStr: string) => {
      try {
        const parsed = new URL(urlStr);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch (_) {
        return false;
      }
    };

    if (type === "webhook") {
      const url = data.webhookUrl?.trim();
      if (!url) return { success: false, message: "Webhook URL is required" };
      if (!isValidUrl(url)) return { success: false, message: "Invalid URL format. Must start with http:// or https://" };

      const payload = {
        event: "webhook.test",
        timestamp: new Date(),
        message: "Test payload from AI Form Generator webhook verification.",
        data: {
          testField: "Success",
        },
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        return { success: true, message: "Webhook connection tested successfully! (200 OK)" };
      } else {
        return { success: false, message: `Webhook returned status ${res.status}: ${res.statusText}` };
      }
    }

    if (type === "sheets") {
      const url = data.googleSheetUrl?.trim();
      if (!url) return { success: false, message: "Google Sheets Web App URL is required" };
      if (!isValidUrl(url)) return { success: false, message: "Invalid URL format. Must start with http:// or https://" };

      const payload = {
        submissionId: 0,
        formTitle: "Test Connection",
        submittedAt: new Date(),
        data: {
          "Test Column": "Connection working!",
        },
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        return { success: true, message: "Google Sheets connection tested successfully! (200 OK)" };
      } else {
        return { success: false, message: `Google Sheets returned status ${res.status}: ${res.statusText}` };
      }
    }

    if (type === "notion") {
      const apiKey = data.notionApiKey?.trim();
      const databaseId = data.notionDatabaseId?.trim();

      if (!apiKey) return { success: false, message: "Notion Integration Token is required" };
      if (!databaseId) return { success: false, message: "Notion Database ID is required" };

      // We test the connection by requesting the Database metadata from Notion API.
      // This validates the credentials without inserting a test page.
      const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Notion-Version": "2022-06-28",
        },
      });

      if (res.ok) {
        return { success: true, message: "Notion connection tested successfully! Connected to database." };
      } else {
        if (res.status === 401) {
          return { success: false, message: "Unauthorized: Invalid Notion Integration Token." };
        }
        if (res.status === 404) {
          return { success: false, message: "Not Found: Database not found. Make sure the database is shared with your Integration." };
        }
        const errorData = await res.json().catch(() => ({}));
        return { success: false, message: errorData.message || `Notion returned status ${res.status}` };
      }
    }

    return { success: false, message: "Unknown integration type" };
  } catch (error: any) {
    console.error(`Test ${type} connection failed:`, error);
    return { success: false, message: error.message || "Failed to reach endpoint due to a network error." };
  }
};
