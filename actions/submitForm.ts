"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { tagSubmission } from "@/actions/tagSubmission";
import { triggerIntegrations } from "@/actions/triggerIntegrations";

export const submitForm = async (formId: number, formData: any) => {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (!formId) {
      return { success: false, message: "Form id not found" };
    }

    const form = await prisma.form.findUnique({
      where: {
        id: formId,
      },
    });

    if (!form) {
      return { success: false, message: "form not found" };
    }

    const submission = await prisma.submissions.create({
      data: {
        formId,
        content: formData,
      },
    });

    // Tag and trigger integrations in the background without blocking responses
    tagSubmission(submission.id).catch((err) =>
      console.error("Background tagging error:", err)
    );
    triggerIntegrations(formId, submission.id, formData).catch((err) =>
      console.error("Background integrations error:", err)
    );

    await prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        submissions: {
          increment: 1,
        },
      },
    });

    return { success: true, message: "Form submitted successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "An unexpected error occurred" };
  }
};
