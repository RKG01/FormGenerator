import SubmissionsDetails from "@/components/SubmissionDetails";
import AiSummaryReport from "@/components/AiSummaryReport";
import prisma from "@/lib/prisma";
import React from "react";

const Submissions = async ({
  params,
}: {
  params: Promise<{ formId: string }>;
}) => {
  const formId = (await params).formId;

  const form = await prisma.form.findUnique({
    where: {
      id: Number(formId),
    },
    include: {
      FormSubmissions: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!form) {
    return (
      <div className="text-center py-10">
        <h1 className="text-xl font-bold">Form not found</h1>
      </div>
    );
  }

  const submissions = form.FormSubmissions;
  const formContent = form.content as any;
  const formTitle = formContent?.title || "Untitled Form";

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="font-extrabold text-3xl mb-2 text-foreground">
        {formTitle}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Manage responses, view submission timelines, and analyze insights.
      </p>

      {submissions.length > 0 && (
        <AiSummaryReport formId={form.id} initialSummary={form.aiSummary} />
      )}

      {submissions.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-secondary/5">
          <h2 className="text-lg font-bold mb-1">No Submissions Yet</h2>
          <p className="text-sm text-muted-foreground">
            Share your form link to start collecting submissions.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {submissions.map((submission: any, index: number) => (
            <SubmissionsDetails
              key={submission.id}
              submission={submission}
              index={submissions.length - 1 - index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Submissions;
