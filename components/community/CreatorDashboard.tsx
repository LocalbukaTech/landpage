"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { DashboardTab, CommunityPost } from "./types";
import { OverviewTab } from "./OverviewTab";
import { ContentManagementTab } from "./ContentManagementTab";
import { MembersTab } from "./MembersTab";
import { MonetizationTab } from "./MonetizationTab";
import { SettingsTab } from "./SettingsTab";
import type { CreatorCommunityFormData } from "./CreatorCommunityForm";
import { useAuth } from "@/context/AuthContext";
import { useCommunityFeed } from "@/lib/api/services/community.hooks";
import { cn } from "@/lib/utils";
import { getMediaBlobUrl } from "@/lib/storage/media-storage";

function normalizeMediaUrl(url?: string | null): string {
  if (!url) return "";
  return url.startsWith("http://res.cloudinary.com")
    ? url.replace("http://", "https://")
    : url;
}

function isVideoMediaUrl(url?: string | null): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.includes("/video/upload/") ||
    lower.includes(".mp4") ||
    lower.includes(".webm") ||
    lower.includes(".mov") ||
    lower.includes(".m4v") ||
    lower.includes(".ogg") ||
    lower.startsWith("data:video/")
  );
}

function formatRelativeTimestamp(iso?: string): string {
  if (!iso) return "Recently";
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return "Recently";
  const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface ManagedCommunityOption {
  id: string;
  slug: string;
  name: string;
  isFree: boolean;
}

interface CreatorDashboardProps {
  initialTab?: DashboardTab;
  community?: CreatorCommunityFormData;
  communitySlug?: string;
  managedCommunities?: ManagedCommunityOption[];
  onSelectCommunity?: (slug: string) => void;
  onCreateNewCommunity?: () => void;
  onUpdateCommunity?: (updates: Partial<CreatorCommunityFormData>) => void;
  onDeleteCommunity?: () => void;
}

const DASHBOARD_TABS: DashboardTab[] = [
  "Overview",
  "Content and feed management",
  "Members",
  "Monetization",
  "Settings",
];

const STORAGE_KEY = "localbuka_creator_posts_v1";
const SEED_PLACEHOLDER_POST_IDS = new Set(["post-1", "post-2"]);

export function CreatorDashboard({
  initialTab = "Members",
  community,
  communitySlug,
  managedCommunities,
  onSelectCommunity,
  onCreateNewCommunity,
  onUpdateCommunity,
  onDeleteCommunity,
}: CreatorDashboardProps) {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);

  const realAuthorName =
    authUser?.fullName ||
    authUser?.username ||
    (community?.payoutAccount?.accountName &&
    community.payoutAccount.accountName !== "Tolu Olawale"
      ? community.payoutAccount.accountName
      : community?.name || "Creator");

  const realAuthorHandle = authUser?.username
    ? `@${authUser.username.replace(/^@/, "")}`
    : `@${realAuthorName
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "")}`;

  const realAuthorAvatar =
    authUser?.avatar ||
    authUser?.image_url ||
    community?.avatar ||
    community?.coverImage ||
    "/images/community/cover-1.jpg";

  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const realOnly = parsed
              .filter((p: any) => p && !SEED_PLACEHOLDER_POST_IDS.has(p.id))
              .map((p: CommunityPost) => {
                // Clean up any old saved post that had the hardcoded @chef_tolu placeholder
                if (
                  p.authorHandle === "@chef_tolu" ||
                  p.authorName === "Chef Tolu"
                ) {
                  return {
                    ...p,
                    authorName: realAuthorName,
                    authorHandle: realAuthorHandle,
                    authorAvatar: realAuthorAvatar,
                    communityName: community?.name || p.communityName,
                  };
                }
                return p;
              });
            return realOnly;
          }
        }
      } catch {
        // ignore storage errors
      }
    }
    return [];
  });

  // Keep existing posts' author handle synced once authUser hydrates from cookies
  useEffect(() => {
    if (!authUser) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosts((prev) =>
      prev.map((p) => {
        if (
          p.authorHandle === "@chef_tolu" ||
          p.authorName === "Chef Tolu" ||
          p.authorHandle === "@tolu_olawale"
        ) {
          return {
            ...p,
            authorName: realAuthorName,
            authorHandle: realAuthorHandle,
            authorAvatar: realAuthorAvatar,
          };
        }
        return p;
      })
    );
  }, [authUser, realAuthorName, realAuthorHandle, realAuthorAvatar]);

  useEffect(() => {
    if (initialTab) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Resolve persistent IndexedDB media URLs for local video/image posts on mount
  useEffect(() => {
    void (async () => {
      let changed = false;
      const resolved = await Promise.all(
        posts.map(async (p) => {
          if (p.mediaUrl?.startsWith("idb://")) {
            const blobUrl = await getMediaBlobUrl(p.mediaUrl);
            if (blobUrl) {
              changed = true;
              return { ...p, mediaUrl: blobUrl };
            }
          }
          return p;
        })
      );
      if (changed) {
        setPosts(resolved);
      }
    })();
  }, []);

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

  const effectiveCommunitySlug =
    communitySlug ||
    (community?.name
      ? community.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      : "");

  // Fetch authoritative published posts for this community from the live backend
  const { data: liveFeedData, isLoading: isLoadingFeed } = useCommunityFeed(
    effectiveCommunitySlug,
    { limit: 50 }
  );

  const mergedPosts = useMemo<CommunityPost[]>(() => {
    const backendPosts: CommunityPost[] = (liveFeedData?.items ?? []).map((p) => {
      const mediaUrl = normalizeMediaUrl(p.mediaUrls?.[0] || "");
      const authorFullName = p.author?.fullName || realAuthorName;
      const authorHandleValue = `@${authorFullName
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "")}`;
      return {
        id: p.id,
        communityName: community?.name || "Community",
        communitySlug: effectiveCommunitySlug,
        communityAvatar:
          normalizeMediaUrl(community?.avatar || community?.coverImage) ||
          "/images/community/cover-1.jpg",
        authorName: authorFullName,
        authorHandle: authorHandleValue,
        authorAvatar:
          normalizeMediaUrl(p.author?.avatar) ||
          normalizeMediaUrl(realAuthorAvatar) ||
          "/images/community/cover-1.jpg",
        timestamp: formatRelativeTimestamp(p.createdAt),
        caption: p.content || "",
        mediaUrl,
        mediaType: isVideoMediaUrl(mediaUrl) ? "video" : "image",
        location: p.location || undefined,
        tags: p.tags || [],
        hashtags: p.hashtags || [],
        likes: String(p.likesCount ?? 0),
        comments: String(p.commentsCount ?? 0),
        bookmarks: String(p.savesCount ?? 0),
        shares: String(p.sharesCount ?? 0),
        isLiked: Boolean(p.hasLiked),
        isBookmarked: Boolean(p.hasSaved),
        isPinned: Boolean(p.isPinned),
      };
    });

    const backendIds = new Set(backendPosts.map((p) => p.id));
    const backendSignatures = new Set(
      backendPosts.map((p) => `${p.caption.trim()}::${p.mediaUrl}`)
    );

    const pendingLocalPosts = posts.filter((p) => {
      if (SEED_PLACEHOLDER_POST_IDS.has(p.id)) return false;
      if (effectiveCommunitySlug && p.communitySlug && p.communitySlug !== effectiveCommunitySlug) {
        return false;
      }
      if (
        !p.communitySlug &&
        community?.name &&
        p.communityName &&
        p.communityName.toLowerCase() !== community.name.toLowerCase()
      ) {
        return false;
      }
      if (backendIds.has(p.id)) return false;
      if (backendSignatures.has(`${(p.caption || "").trim()}::${normalizeMediaUrl(p.mediaUrl)}`)) {
        return false;
      }
      // Once backend has synced, only keep truly unsynced optimistic posts (non-UUID temporary IDs)
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.id);
      if (isUuid && liveFeedData) return false;
      return true;
    });

    return [...pendingLocalPosts, ...backendPosts];
  }, [
    liveFeedData,
    posts,
    community,
    effectiveCommunitySlug,
    realAuthorName,
    realAuthorAvatar,
  ]);

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
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-white/60 mt-1">
                <span>Managing:</span>
                {managedCommunities && managedCommunities.length > 1 && onSelectCommunity ? (
                  <select
                    value={effectiveCommunitySlug}
                    onChange={(e) => onSelectCommunity(e.target.value)}
                    aria-label="Select community to manage"
                    className="rounded-lg bg-[#252525] border border-[#f5c94d]/40 px-2.5 py-1 text-xs sm:text-sm font-semibold text-[#f5c94d] focus:outline-none focus:border-[#f5c94d] cursor-pointer"
                  >
                    {managedCommunities.map((item) => (
                      <option key={item.id} value={item.slug} className="bg-[#1c1c1d] text-white">
                        {item.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="font-semibold text-[#f5c94d]">
                    {community.name}
                  </span>
                )}
                <span>·</span>
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
              </div>
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
            posts={mergedPosts}
            isLoadingFeed={isLoadingFeed}
            onNavigateToContent={() => setActiveTab("Content and feed management")}
            onNavigateToMembers={() => setActiveTab("Members")}
            onNavigateToMonetization={() => setActiveTab("Monetization")}
            communityName={community?.name}
            communitySlug={effectiveCommunitySlug}
            pricePerMonth={community?.category === "free" ? 0 : community?.pricePerMonth}
          />
        )}
        {activeTab === "Content and feed management" && (
          <ContentManagementTab
            posts={mergedPosts}
            onPostsChange={handleUpdatePosts}
            communityName={community?.name}
            communityAvatar={community?.avatar || community?.coverImage}
            authorName={realAuthorName}
            authorHandle={realAuthorHandle}
            authorAvatar={realAuthorAvatar}
            communitySlug={effectiveCommunitySlug}
          />
        )}
        {activeTab === "Members" && (
          <MembersTab
            communityName={community?.name}
            communitySlug={effectiveCommunitySlug}
          />
        )}
        {activeTab === "Monetization" && (
          <MonetizationTab
            community={community}
            onUpdateCommunity={onUpdateCommunity}
          />
        )}
        {activeTab === "Settings" && (
          <SettingsTab
            communityName={community?.name}
            communitySlug={effectiveCommunitySlug || undefined}
            communityBio={community?.bio}
            initialCoverImage={community?.coverImage || community?.avatar}
            initialPrice={
              community?.category === "free"
                ? 0
                : Math.max(2000, community?.pricePerMonth ?? 2000)
            }
            initialBenefits={community?.benefits}
            onUpdateCommunity={onUpdateCommunity}
            onDeleteCommunity={onDeleteCommunity}
          />
        )}
      </div>
    </div>
  );
}
