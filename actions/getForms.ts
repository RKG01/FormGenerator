import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const getForms = async () => {
  const user = await currentUser();
  
  
  if (!user) {
    return { success: false, message: "User not found" };
  }

  const forms = await prisma.form.findMany({
    where: {
      ownerId: user.id,
    },
  });

  if (!forms) {
    return { success: false, message: "Form not found" };
  }

  return { success: true, message: "Forms found", data: forms };
};
