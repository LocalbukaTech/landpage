"use client";

import { cn } from "@/lib/utils";

interface AdminTabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export function AdminTabs({ tabs, activeTab, onChange }: AdminTabsProps) {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={cn(
              "px-6 py-3 text-sm font-semibold transition-colors border-b-2 relative -bottom-px",
              isActive 
                ? "border-blue-900 text-blue-900" // the design uses a dark blue/gray for active tab lines
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
