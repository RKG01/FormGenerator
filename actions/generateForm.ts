"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// use valid model name
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateForm = async (prevState: unknown, formData: FormData) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // validate form input
    const schema = z.object({
      description: z.string().min(1, "Description is required"),
    });

    const result = schema.safeParse({
      description: formData.get("description") as string,
    });

    if (!result.success) {
      return {
        success: false,
        message: "Invalid form data",
        error: result.error.errors,
      };
    }

    const description = result.data.description;

    if (!process.env.GEMINI_API_KEY) {
      return { success: false, message: "GEMINI API key not found" };
    }

    const prompt =
      "Create a JSON form with the following fields: title, fields (If any field includes options, keep them inside an array, not an object), button.";

    // request Gemini
    const aiResponse = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `${prompt} ${description}` }],
        },
      ],
    });

    let formContent = aiResponse.response.text();

    // clean response
    formContent = formContent.substring(
      formContent.indexOf("{"),
      formContent.lastIndexOf("}") + 1
    );

    if (!formContent) {
      return { success: false, message: "Failed to generate form content" };
    }

    let formJsonData;
    try {
      formJsonData = JSON.parse(formContent);
    } catch (error) {
      console.error("Error parsing JSON", error);
      return {
        success: false,
        message: "Generated form content is not valid JSON",
      };
    }

    // save to db
    const form = await prisma.form.create({
      data: {
        ownerId: user.id,
        content: formJsonData,
      },
    });

    revalidatePath("/dashboard/forms");

    return {
      success: true,
      message: "Form generated successfully",
      data: form,
    };
  } catch (error) {
    console.error("Error generating form", error);
    return {
      success: false,
      message: "An error occurred while generating the form",
    };
  }
};
