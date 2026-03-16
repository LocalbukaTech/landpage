"use client";

import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex bg-[#F9F9FB] font-sans h-screen overflow-hidden">
      {/* Sidebar is fixed on the left */}
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header takes up its required space and doesn't shrink */}
        <div className="shrink-0">
          <AdminHeader />
        </div>
        
        {/* Main content is exactly the remaining height and scrolls internally */}
        <main className="flex-1 p-8 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
