import Navbar from "@/components/Navbar";
import React from "react";
import PageTransition from "@/components/PageTransition";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Navbar />
      <main className="mx-6 my-4 flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
};

export default layout;