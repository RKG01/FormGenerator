import React from "react";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import IntegrationsForm from "@/components/IntegrationsForm";

type Props = {
  params: Promise<{ formId: string }>;
};

const IntegrationsPage = async ({ params }: Props) => {
  const formId = (await params).formId;
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!formId) {
    return (
      <div className="text-center py-10">
        <h1 className="text-xl font-bold">Form ID not found</h1>
      </div>
    );
  }

  const form = await prisma.form.findUnique({
    where: {
      id: Number(formId),
    },
  });

  if (!form) {
    return (
      <div className="text-center py-10">
        <h1 className="text-xl font-bold">Form not found</h1>
      </div>
    );
  }

  if (form.ownerId !== user.id) {
    return (
      <div className="text-center py-10">
        <h1 className="text-xl font-bold text-destructive">Unauthorized</h1>
        <p className="text-sm text-muted-foreground mt-1">
          You do not have permission to view integrations for this form.
        </p>
      </div>
    );
  }

  const formContent = form.content as any;
  const formTitle = formContent?.title || "Untitled Form";

  // Package initial settings to send to client component
  const initialSettings = {
    webhookUrl: form.webhookUrl || "",
    notionApiKey: form.notionApiKey || "",
    notionDatabaseId: form.notionDatabaseId || "",
    googleSheetUrl: form.googleSheetUrl || "",
  };

  return (
    <main className="max-w-4xl mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          Integrations & Automations
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Automatically route submissions from <strong className="text-foreground">{formTitle}</strong> to your favorite external apps.
        </p>
      </div>

      <IntegrationsForm formId={form.id} initialSettings={initialSettings} />
    </main>
  );
};

export default IntegrationsPage;
