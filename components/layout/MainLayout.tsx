"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#1a1a1a]">
      <Sidebar />
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center pt-14 pb-16 md:py-6 md:px-6 min-h-screen">
        {children}
      </main>
    </div>
  );
}
