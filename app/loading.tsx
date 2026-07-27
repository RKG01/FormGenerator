import React from "react";

export default function RootLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin border-t-primary" />
        {/* Inner Glowing Point */}
        <div className="absolute w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_var(--primary)]" />
      </div>
      <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">
        Loading...
      </p>
    </div>
  );
}
