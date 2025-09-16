"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

import { GoogleGenerativeAI } from "@google/generative-ai"; // Import Gemini
import { revalidatePath } from "next/cache";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Specify the right model

export const generateForm = async (prevState: unknown, formData: FormData) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Define schema for validation
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
      return { success: false, message: "GEMINI api key not found" };
    }

    const prompt =
      "Create a json form with the following field: title, fields (If any field includes options, then keep it inside an array, not an object), button";

    // Request Gemini to generate the form content
    const res = await model.generateContent(`${prompt} ${description}`);
    let formContent = res.response.text();

    // Extract and clean up form content
    formContent = formContent.substring(
      formContent.indexOf("{"),
      formContent.lastIndexOf("}") + 1
    );
    console.log("Gemini-generated the form ->", formContent);

    if (!formContent) {
      return { success: false, message: "Failed to generate form content" };
    }

    let formJsonData;
    try {
      formJsonData = JSON.parse(formContent);
    } catch (error) {
      console.log("Error parsing JSON", error);
      return {
        success: false,
        message: "Generated form content is not valid JSON",
      };
    }

    // Save the generated form to the database
    try {
      const form = await prisma.form.create({
        data: {
          ownerId: user.id,
          content: formJsonData ? formJsonData : null,
        },
      });

      revalidatePath("/dashboard/forms"); // Optionally revalidate a path if necessary

      return {
        success: true,
        message: "Form generated successfully",
        data: form,
      };
    } catch (dbError) {
      console.error("Error saving form to database", dbError);
      return {
        success: false,
        message: "Failed to save the form to the database",
      };
    }
  } catch (error) {
    console.log("Error generating form", error);
    return {
      success: false,
      message: "An error occurred while generating the form",
    };
  }
};
