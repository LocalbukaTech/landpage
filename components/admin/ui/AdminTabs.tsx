"use client";

import { cn } from "@/lib/utils";

interface AdminTabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export function AdminTabs({ tabs, activeTab, onChange }: AdminTabsProps) {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-800">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={cn(
              "px-6 py-3 text-sm font-semibold transition-colors border-b-2 relative -bottom-px cursor-pointer bg-transparent",
              isActive 
                ? "border-[#fbbe15] text-[#fbbe15]" 
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
