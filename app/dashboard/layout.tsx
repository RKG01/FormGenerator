import DashboardSidebar from "@/components/Sidebar"; 
import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "@/components/Navbar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <div className="flex flex-col flex-1 w-full min-h-screen">
        <Navbar />
        <main className="mx-6 my-4 flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default layout;