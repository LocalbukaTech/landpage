"use client";

import { useState, useEffect } from "react";
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
  initialTab = "Overview",
}: CreatorDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <div className="w-full text-white">
      {/* Desktop-only Header */}
      <div className="hidden md:block mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Creator Management Dashboard
        </h1>
        <div className="mt-3 border-b border-white/10" />
      </div>

      {/* Sticky Tabs Bar matching Mobile Screens in Figma design */}
      <div className="sticky top-0 z-20 bg-[#1a1a1a]/95 backdrop-blur-md -mx-3 sm:-mx-6 md:mx-0 px-3 sm:px-6 md:px-0 py-2 sm:py-3 mb-5 sm:mb-7 overflow-x-auto scrollbar-none border-b border-white/5 md:border-b-0">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-max">
          {DASHBOARD_TABS.map((tab) => {
            const isActive = activeTab === tab;
            const displayLabel = tab === "Monetization" ? "Earnings" : tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap",
                  isActive
                    ? "bg-[#f5c94d] text-[#111111] shadow-sm font-bold"
                    : "bg-[#202020] text-white/60 hover:text-white hover:bg-[#282828]"
                )}
              >
                {displayLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="w-full pb-16">
        {activeTab === "Overview" && (
          <OverviewTab
            onNavigateToContent={() => setActiveTab("Content and feed management")}
            onNavigateToMembers={() => setActiveTab("Members")}
            onNavigateToEarnings={() => setActiveTab("Monetization")}
          />
        )}
        {activeTab === "Content and feed management" && <ContentManagementTab />}
        {activeTab === "Members" && <MembersTab />}
        {activeTab === "Monetization" && <MonetizationTab />}
        {activeTab === "Settings" && <SettingsTab />}
      </div>
    </div>
  );
}
