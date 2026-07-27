import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const getForms = async (userId?: string) => {
  let resolvedUserId = userId;
  if (!resolvedUserId) {
    const user = await currentUser();
    if (!user) {
      return { success: false, message: "User not found" };
    }
    resolvedUserId = user.id;
  }

  const forms = await prisma.form.findMany({
    where: {
      ownerId: resolvedUserId,
    },
  });

  if (!forms) {
    return { success: false, message: "Form not found" };
  }

  return { success: true, message: "Forms found", data: forms };
};
