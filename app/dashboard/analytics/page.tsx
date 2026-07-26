import Analytics from "@/components/Analytics";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const page = async () => {
  const user = await currentUser();
  if (!user) {
    return (
      <div className="text-center py-10">
        <h1 className="text-xl font-bold">User not found</h1>
      </div>
    );
  }

  // Fetch all forms and submissions
  const forms = await prisma.form.findMany({
    where: {
      ownerId: user.id,
    },
    include: {
      FormSubmissions: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalForms = forms.length;
  const publishedForms = forms.filter((f) => f.published).length;
  const totalSubmissions = forms.reduce((acc, f) => acc + f.submissions, 0);

  // Flatten and process all submissions
  const allSubmissions = forms.flatMap((f) =>
    f.FormSubmissions.map((sub) => ({
      ...sub,
      formTitle: (f.content as any)?.title || "Untitled Form",
    }))
  );

  // Sort all submissions by date to get recent ones
  const recentSubmissions = allSubmissions
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5)
    .map((sub) => ({
      id: sub.id,
      createdAt: sub.createdAt,
      formTitle: sub.formTitle,
      tags: sub.tags,
    }));

  // Tag frequency distributions
  const tagCounts: Record<string, number> = {};
  allSubmissions.forEach((sub) => {
    if (Array.isArray(sub.tags)) {
      sub.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  const urgentCount = tagCounts["Urgent"] || 0;

  // Format tag distributions for rendering
  const tagDistribution = Object.entries(tagCounts)
    .map(([tag, count]) => ({
      tag,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  // Performance data per form
  const formsData = forms.map((f) => ({
    id: f.id,
    title: (f.content as any)?.title || "Untitled Form",
    submissions: f.submissions,
    published: f.published,
  }));

  const stats = {
    totalForms,
    publishedForms,
    totalSubmissions,
    urgentCount,
    recentSubmissions,
    tagDistribution,
    formsData,
  };

  return (
    <div>
      <Analytics stats={stats} />
    </div>
  );
};

export default page;
