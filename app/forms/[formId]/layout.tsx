import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <main className="max-w-2xl w-full">{children}</main>
    </div>
  );
};

export default layout;