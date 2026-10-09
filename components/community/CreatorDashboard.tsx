"use client";

import { useState } from "react";
import { DashboardTab } from "./types";
import { OverviewTab } from "./OverviewTab";
import { ContentManagementTab } from "./ContentManagementTab";
import { MembersTab } from "./MembersTab";
import { MonetizationTab } from "./MonetizationTab";
import { SettingsTab } from "./SettingsTab";
import { cn } from "@/lib/utils";

interface CreatorDashboardProps {
  initialTab?: DashboardTab;
}

const DASHBOARD_TABS: DashboardTab[] = [
  "Overview",
  "Content and feed management",
  "Members",
  "Monetization",
  "Settings",
];

export function CreatorDashboard({
  initialTab = "Settings",
}: CreatorDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);

  return (
    <div className="w-full text-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Creator management dashboard
        </h1>
        <div className="mt-3 border-b border-white/10" />
      </div>

      {/* Tabs Row */}
      <div className="mb-7 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-max">
          {DASHBOARD_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#f5c94d] text-[#111111] font-semibold shadow-sm"
                    : "bg-[#252525] text-white/70 hover:bg-[#2e2e2e] hover:text-white"
                )}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="w-full pb-16">
        {activeTab === "Overview" && <OverviewTab />}
        {activeTab === "Content and feed management" && <ContentManagementTab />}
        {activeTab === "Members" && <MembersTab />}
        {activeTab === "Monetization" && <MonetizationTab />}
        {activeTab === "Settings" && <SettingsTab />}
      </div>
    </div>
  );
}
