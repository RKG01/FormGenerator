import Analytics from "@/components/Analytics";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const page = async () => {
  const user = await currentUser();
  const res = await prisma.form.aggregate({
    where: {
      ownerId: user?.id as string,
    },

    _sum: {
      submissions: true,
    },
  });

  const numberOfSubmissions = res._sum.submissions || 0;

  return (
    <div>
      <Analytics numberOfSubmissions={numberOfSubmissions}/>
    </div>
  );
};

export default page;
