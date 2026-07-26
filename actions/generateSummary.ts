"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateSummary = async (formId: number) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: { FormSubmissions: true },
    });

    if (!form) {
      return { success: false, message: "Form not found" };
    }

    if (form.ownerId !== user.id) {
      return { success: false, message: "Unauthorized" };
    }

    const submissions = form.FormSubmissions;
    if (submissions.length === 0) {
      return { success: false, message: "No submissions found to summarize" };
    }

    // Format submissions data for the AI prompt
    const formattedSubmissions = submissions.map((sub, idx) => {
      const content = sub.content as Record<string, any>;
      const answers = Object.entries(content)
        .map(([q, a]) => `Question: "${q}" -> Answer: "${Array.isArray(a) ? a.join(", ") : a}"`)
        .join("\n");
      return `--- Submission #${idx + 1} (Submitted: ${sub.createdAt.toISOString()}) ---\n${answers}`;
    }).join("\n\n");

    const formContent = form.content as any;
    const formTitle = formContent?.title || "Untitled Form";

    const prompt = `
You are an expert data analyst. You are analyzing form submission responses for a form titled "${formTitle}".
Below is the raw list of submissions containing questions and user answers.

${formattedSubmissions}

Please analyze these submissions and output a clean, visually appealing report in standard Markdown format containing:
1. **Executive Summary**: A short, high-level summary of the overall responses (2-3 sentences).
2. **Sentiment Analysis**: Analyze the overall tone/sentiment of responders (e.g., Positive, Neutral, Negative, or Mixed) with brief justification.
3. **Key Takeaways & Trends**: A bulleted list of main takeaways, interesting patterns, or standout feedback points.
4. **Actionable Recommendations**: 2-3 logical steps the form owner could take based on these insights.

Keep your tone professional, constructive, and concise. Use emojis for visual structure. Do not output HTML.
`;

    const aiResponse = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const summaryText = aiResponse.response.text();

    if (!summaryText) {
      return { success: false, message: "AI failed to generate a summary" };
    }

    // Cache the summary in the database
    await prisma.form.update({
      where: { id: formId },
      data: { aiSummary: summaryText },
    });

    revalidatePath(`/dashboard/forms/${formId}/submissions`);

    return {
      success: true,
      message: "AI Summary generated successfully",
      data: summaryText,
    };
  } catch (error) {
    console.error("Error generating AI summary:", error);
    return {
      success: false,
      message: "An error occurred while generating the summary report",
    };
  }
};
