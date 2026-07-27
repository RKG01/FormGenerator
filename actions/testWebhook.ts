"use server";

import { currentUser } from "@clerk/nextjs/server";

export const testWebhook = async (webhookUrl: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (!webhookUrl) {
      return { success: false, message: "Webhook URL is required" };
    }

    let trimmed = webhookUrl.trim();
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      trimmed = `https://${trimmed}`;
    }

    try {
      new URL(trimmed);
    } catch (_) {
      return { success: false, message: "Invalid URL format" };
    }

    const payload = {
      event: "webhook.test",
      timestamp: new Date(),
      message: "This is a test notification from AI Form Generator.",
      testData: {
        formId: 0,
        formTitle: "Test Form Integration",
        submissionId: 0,
        data: {
          fullName: "Jane Doe",
          email: "jane.doe@example.com",
          message: "Hello! This is a test response to verify your webhook integration.",
        },
      },
    };

    console.log(`Sending test webhook to ${trimmed}...`);
    const response = await fetch(trimmed, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return { success: true, message: "Test payload sent successfully!" };
    } else {
      return {
        success: false,
        message: `Webhook returned status code ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error: any) {
    console.error("Test Webhook Error:", error);
    return { success: false, message: error.message || "Failed to send test payload" };
  }
};
