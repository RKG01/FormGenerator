"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const updateFormIntegrations = async (
  formId: number,
  data: {
    webhookUrl: string | null;
    notionApiKey: string | null;
    notionDatabaseId: string | null;
    googleSheetUrl: string | null;
  }
) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const form = await prisma.form.findUnique({
      where: {
        id: formId,
      },
    });

    if (!form) {
      return { success: false, message: "Form not found" };
    }

    if (form.ownerId !== user.id) {
      return { success: false, message: "Unauthorized access" };
    }

    const formatAndValidateUrl = (url: string | null) => {
      if (!url) return null;
      let trimmed = url.trim();
      if (trimmed === "") return null;
      
      // Auto-prefix protocol if missing
      if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
        trimmed = `https://${trimmed}`;
      }
      
      try {
        new URL(trimmed);
        return trimmed;
      } catch (_) {
        throw new Error(`Invalid URL format: "${url}". Please enter a valid URL (e.g. https://example.com).`);
      }
    };

    let formattedWebhookUrl: string | null = null;
    let formattedGoogleSheetUrl: string | null = null;

    try {
      formattedWebhookUrl = formatAndValidateUrl(data.webhookUrl);
      formattedGoogleSheetUrl = formatAndValidateUrl(data.googleSheetUrl);
    } catch (validationError: any) {
      return { success: false, message: validationError.message };
    }

    const trimField = (val: string | null) => {
      if (!val) return null;
      const trimmed = val.trim();
      return trimmed === "" ? null : trimmed;
    };

    await prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        webhookUrl: formattedWebhookUrl,
        notionApiKey: trimField(data.notionApiKey),
        notionDatabaseId: trimField(data.notionDatabaseId),
        googleSheetUrl: formattedGoogleSheetUrl,
      },
    });

    revalidatePath(`/dashboard/forms/${formId}/integrations`);
    return { success: true, message: "Integrations updated successfully" };
  } catch (error: any) {
    console.error("Error updating integrations:", error);
    return { success: false, message: error.message || "Failed to update integrations" };
  }
};
