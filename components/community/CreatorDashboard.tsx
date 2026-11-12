"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { DashboardTab, CommunityPost } from "./types";
import { OverviewTab } from "./OverviewTab";
import { ContentManagementTab, INITIAL_CREATOR_POSTS } from "./ContentManagementTab";
import { MembersTab } from "./MembersTab";
import { MonetizationTab } from "./MonetizationTab";
import { SettingsTab } from "./SettingsTab";
import type { CreatorCommunityFormData } from "./CreatorCommunityForm";
import { cn } from "@/lib/utils";

interface CreatorDashboardProps {
  initialTab?: DashboardTab;
  community?: CreatorCommunityFormData;
  onCreateNewCommunity?: () => void;
  onUpdateCommunity?: (updates: Partial<CreatorCommunityFormData>) => void;
}

const DASHBOARD_TABS: DashboardTab[] = [
  "Overview",
  "Content and feed management",
  "Members",
  "Monetization",
  "Settings",
];

const STORAGE_KEY = "localbuka_creator_posts_v1";

export function CreatorDashboard({
  initialTab = "Members",
  community,
  onCreateNewCommunity,
  onUpdateCommunity,
}: CreatorDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // ignore storage errors
      }
    }
    return INITIAL_CREATOR_POSTS;
  });

  useEffect(() => {
    if (initialTab) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleUpdatePosts = (nextPosts: CommunityPost[]) => {
    setPosts(nextPosts);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPosts));
      } catch {
        // ignore quota errors for large data URLs
      }
    }
  };

  return (
    <div className="w-full text-white">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Creator management dashboard
            </h1>
            {community?.name && (
              <p className="text-xs sm:text-sm text-white/60 mt-1">
                Managing:{" "}
                <span className="font-semibold text-[#f5c94d]">
                  {community.name}
                </span>{" "}
                ·{" "}
                <span>
                  {community.category === "free"
                    ? "Free Community"
                    : `₦${Math.max(2000, community.pricePerMonth || 2000).toLocaleString("en-NG")}/${
                        community.billingSchedule === "yearly"
                          ? "yr"
                          : community.billingSchedule === "quarterly"
                          ? "qtr"
                          : "mo"
                      }`}
                </span>
              </p>
            )}
          </div>

          {onCreateNewCommunity && (
            <button
              type="button"
              onClick={onCreateNewCommunity}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#f5c94d]/15 border border-[#f5c94d]/40 px-4 py-2 text-xs font-bold text-[#f5c94d] hover:bg-[#f5c94d] hover:text-black transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Create / Edit Community Setup</span>
            </button>
          )}
        </div>
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
                  "rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer",
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
        {activeTab === "Overview" && (
          <OverviewTab
            posts={posts}
            onNavigateToContent={() => setActiveTab("Content and feed management")}
            onNavigateToMembers={() => setActiveTab("Members")}
            onNavigateToMonetization={() => setActiveTab("Monetization")}
            communityName={community?.name}
            pricePerMonth={community?.pricePerMonth}
          />
        )}
        {activeTab === "Content and feed management" && (
          <ContentManagementTab
            posts={posts}
            onPostsChange={handleUpdatePosts}
            communitySlug={
              community?.name
                ? community.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "")
                : "chef-amaka"
            }
          />
        )}
        {activeTab === "Members" && <MembersTab />}
        {activeTab === "Monetization" && <MonetizationTab community={community} />}
        {activeTab === "Settings" && (
          <SettingsTab
            communityName={community?.name}
            communityBio={community?.bio}
            initialPrice={
              community?.category === "free"
                ? 0
                : Math.max(2000, community?.pricePerMonth ?? 2000)
            }
            initialBenefits={community?.benefits}
            onUpdateCommunity={onUpdateCommunity}
          />
        )}
      </div>
    </div>
  );
}
