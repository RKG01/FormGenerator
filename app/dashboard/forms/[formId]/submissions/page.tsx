import SubmissionsDetails from "@/components/SubmissionDetails";
import prisma from "@/lib/prisma";
import React from "react";

const Submissions = async ({
  params,
}: {
  params: Promise<{ formId: string }>;
}) => {
  const formId = (await params).formId;

  const submissions = await prisma.submissions.findMany({
    where: {
      formId: Number(formId),
    },
    include: {
      form: true,
    },
  });

  if (!submissions || submissions.length === 0) {
    return <h1>No submissions found for form id {formId}</h1>;
  }

  return (
    <div>
      {submissions.map((submission: any, index: number) => (
        <SubmissionsDetails key={index} submission={submission} index={index} />
      ))}
    </div>
  );
};

export default Submissions;
