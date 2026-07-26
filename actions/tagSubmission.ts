"use server";

import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const tagSubmission = async (submissionId: number) => {
  try {
    const submission = await prisma.submissions.findUnique({
      where: { id: submissionId },
      include: { form: true },
    });

    if (!submission) {
      return { success: false, message: "Submission not found" };
    }

    const content = submission.content as Record<string, any>;
    const answersText = Object.entries(content)
      .map(([q, a]) => `Question: "${q}" -> Answer: "${Array.isArray(a) ? a.join(", ") : a}"`)
      .join("\n");

    const formContent = submission.form.content as any;
    const formTitle = formContent?.title || "Untitled Form";

    const prompt = `
You are an AI classifier that analyzes user form submissions and assigns standard category tags.
The form is titled "${formTitle}".

Here is the user submission content:
${answersText}

Analyze the user's answers and select 1 to 3 highly relevant tags from the following list:
- "Urgent" (if they report critical errors, express frustration, or ask for immediate support)
- "Lead" (if they are interested in registering, purchasing, scheduling a demo, or buying something)
- "Billing" (if they mention payments, pricing, invoices, or subscriptions)
- "Feedback" (if they provide suggestions, opinions, or comments on products/services)
- "Question" (if they ask how to do something or require general information)
- "Spam" (if the content looks like gibberish, promotional links, advertising, or bot submissions)

If none of these standard tags apply, you may generate 1 custom tag (keep it a single word, capitalized, e.g. "Support" or "Bug").

Return ONLY a valid JSON array of strings containing the selected tags, e.g., ["Urgent", "Billing"]. Do not include markdown code block formatting or any other text.
`;

    const aiResponse = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    let rawText = aiResponse.response.text().trim();
    
    // Clean code blocks if returned
    if (rawText.startsWith("```json")) {
      rawText = rawText.substring(7, rawText.lastIndexOf("```")).trim();
    } else if (rawText.startsWith("```")) {
      rawText = rawText.substring(3, rawText.lastIndexOf("```")).trim();
    }

    let tags: string[] = [];
    try {
      tags = JSON.parse(rawText);
      if (!Array.isArray(tags)) {
        tags = [];
      }
    } catch (e) {
      console.error("Failed to parse tags JSON:", rawText, e);
      // Fallback: search for words
      const validTags = ["Urgent", "Lead", "Billing", "Feedback", "Question", "Spam"];
      tags = validTags.filter(t => rawText.toLowerCase().includes(t.toLowerCase()));
    }

    // Save tags in database
    await prisma.submissions.update({
      where: { id: submissionId },
      data: { tags },
    });

    return { success: true, tags };
  } catch (error) {
    console.error("Error tagging submission:", error);
    return { success: false, message: "An error occurred during tagging" };
  }
};
