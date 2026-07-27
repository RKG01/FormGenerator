import Navbar from "@/components/Navbar";
import React from "react";
import PageTransition from "@/components/PageTransition";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <PageTransition>{children}</PageTransition>
    </div>
  );
};

export default layout;
