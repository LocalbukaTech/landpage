"use client";

import { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  Lock,
  Sparkles,
  LayoutDashboard,
  Compass,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { CreatorDashboard } from "@/components/community/CreatorDashboard";
import { PaymentCheckoutCard } from "@/components/community/PaymentCheckoutCard";
import { DashboardTab } from "@/components/community/types";
import { cn } from "@/lib/utils";

type CommunityTab = "Recommended" | "Trending" | "Free" | "Paid";

type CommunityItem = {
  id: string;
  name: string;
  creator: string;
  members: string;
  posts: string;
  price: string;
  priceAmount: number;
  isFree: boolean;
  image: string;
  accent: "yellow" | "blue" | "green" | "rose";
};

const tabs: CommunityTab[] = [
  "Recommended",
  "Trending",
  "Free",
  "Paid",
];

const featuredCommunities: CommunityItem[] = [
  {
    id: "nigeria-food",
    name: "Nigeria food and culture",
    creator: "Localbuka owned",
    members: "12.4k members",
    posts: "340 posts",
    price: "Free",
    priceAmount: 0,
    isFree: true,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    accent: "green",
  },
  {
    id: "chef-amaka",
    name: "Chef Amaka's kitchen",
    creator: "By Amaka Obi",
    members: "2.1k members",
    posts: "210 posts",
    price: "Paid · N2,500/mo",
    priceAmount: 2500,
    isFree: false,
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
    accent: "yellow",
  },
  {
    id: "street-food",
    name: "Street food lovers",
    creator: "Localbuka owned",
    members: "8.7k members",
    posts: "210 posts",
    price: "Free",
    priceAmount: 0,
    isFree: true,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    accent: "rose",
  },
  {
    id: "taste-hunters",
    name: "Taste Hunters",
    creator: "By Wilson",
    members: "3.7k members",
    posts: "90 posts",
    price: "Free",
    priceAmount: 0,
    isFree: true,
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80",
    accent: "blue",
  },
  {
    id: "budget-bites",
    name: "Budget bites",
    creator: "Localbuka owned",
    members: "5.3k members",
    posts: "96 posts",
    price: "Free",
    priceAmount: 0,
    isFree: true,
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
    accent: "yellow",
  },
  {
    id: "food-travel",
    name: "Food and travel",
    creator: "By Blessing",
    members: "2.1k members",
    posts: "58 posts",
    price: "Paid · N1,200/mo",
    priceAmount: 1200,
    isFree: false,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    accent: "blue",
  },
  {
    id: "grill-masters",
    name: "Grill masters NG",
    creator: "By Grill Masters",
    members: "3.7k members",
    posts: "170 posts",
    price: "Free",
    priceAmount: 0,
    isFree: true,
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
    accent: "green",
  },
  {
    id: "food-room",
    name: "The food room",
    creator: "By Festus Ojo",
    members: "1.3k members",
    posts: "78 posts",
    price: "Paid · N1,200/mo",
    priceAmount: 1200,
    isFree: false,
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
    accent: "rose",
  },
];

const COMMUNITY_COPY = {
  plus: [
    "Recipes and cook-alongs from Chef Amaka.",
    "Private food spot recommendations.",
  ],
};

function CommunityPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode =
    searchParams.get("view") === "creator"
      ? "creator"
      : "explore";
  const [viewMode, setViewMode] = useState<"creator" | "explore">(initialMode);

  // Tab from URL if specified
  const tabParam = searchParams.get("tab");
  const initialDashboardTab: DashboardTab =
    tabParam === "content"
      ? "Content and feed management"
      : tabParam === "members"
      ? "Members"
      : tabParam === "monetization"
      ? "Monetization"
      : tabParam === "overview"
      ? "Overview"
      : "Content and feed management";

  // Explore view state
  const [activeTab, setActiveTab] = useState<CommunityTab>("Recommended");
  const [showModal, setShowModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityItem | null>(
    featuredCommunities[1] // Chef Amaka's kitchen
  );
  const [isCheckingOut, setIsCheckingOut] = useState(
    searchParams.get("checkout") === "true"
  );

  const visibleCommunities = useMemo(() => {
    if (activeTab === "Free") {
      return featuredCommunities.filter((item) => item.isFree);
    }
    if (activeTab === "Paid") {
      return featuredCommunities.filter((item) => !item.isFree);
    }
    if (activeTab === "Trending") {
      return featuredCommunities.slice(4);
    }
    return featuredCommunities;
  }, [activeTab]);

  const recommendedItems = useMemo(
    () => featuredCommunities.slice(0, 4),
    []
  );

  const trendingItems = useMemo(
    () => featuredCommunities.slice(4),
    []
  );

  const handleCardClick = (community: CommunityItem) => {
    setSelectedCommunity(community);
    if (!community.isFree) {
      // Option to show preview modal or navigate to detail
      setShowModal(true);
    } else {
      router.push(`/community/${community.id}`);
    }
  };

  const handleStartCheckout = () => {
    setShowModal(false);
    if (selectedCommunity) {
      router.push(`/community/${selectedCommunity.id}/subscribe`);
    } else {
      setIsCheckingOut(true);
    }
  };

  return (
    <MainLayout>
      <div className="w-full max-w-[1240px] mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 text-white min-h-[calc(100vh-120px)]">
        {/* ── Top Header with Responsive View Mode Switcher ── */}
        <div className="mb-5 sm:mb-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-white/8 pb-4 sm:pb-5">
          <div className="space-y-0.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Community
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Discover food communities, connect with creators, and share authentic dishes
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="inline-flex items-center gap-1 rounded-full bg-[#202020] p-1 border border-white/5">
              <button
                type="button"
                onClick={() => {
                  setViewMode("explore");
                  setIsCheckingOut(false);
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 sm:px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                  viewMode === "explore"
                    ? "bg-[#f5c94d] text-black shadow-sm font-bold"
                    : "text-white/60 hover:text-white"
                )}
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Explore</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("creator")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 sm:px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                  viewMode === "creator"
                    ? "bg-[#f5c94d] text-black shadow-sm font-bold"
                    : "text-white/60 hover:text-white"
                )}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Creator Dashboard</span>
              </button>
            </div>

            {viewMode === "explore" && (
              <button
                type="button"
                onClick={() => setViewMode("creator")}
                className="inline-flex sm:hidden items-center gap-1 rounded-full bg-[#f5c94d] px-3 py-1.5 text-xs font-bold text-black active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 stroke-[3]" />
                <span>Create</span>
              </button>
            )}
          </div>
        </div>

        {/* ── View 1: Creator Management Dashboard ── */}
        {viewMode === "creator" && (
          <CreatorDashboard initialTab={initialDashboardTab} />
        )}

        {/* ── View 2: Explore Member Feed & Checkout ── */}
        {viewMode === "explore" && (
          <div className="space-y-6">
            {/* Filter Tabs Bar + Desktop "Create community" Yellow Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-white/8 pb-4">
              {/* Category Pills (horizontally scrollable on mobile) */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 -mx-3 px-3 sm:mx-0 sm:px-0">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab);
                      setIsCheckingOut(false);
                    }}
                    className={cn(
                      "rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0",
                      !isCheckingOut && activeTab === tab
                        ? "bg-[#f5c94d] text-[#111111] font-bold shadow-[0_0_0_1px_rgba(245,201,77,0.4)]"
                        : "bg-[#252525] text-white/70 hover:bg-[#2f2f2f] hover:text-white"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setViewMode("creator")}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#f5c94d] px-5 py-2 text-xs sm:text-sm font-bold text-black hover:bg-[#eab308] active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>Create community</span>
              </button>
            </div>

            {/* Inline Payment Checkout View */}
            {isCheckingOut ? (
              <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to all communities</span>
                  </button>
                </div>

                <PaymentCheckoutCard
                  communityName={selectedCommunity?.name || "Chef Amaka's kitchen"}
                  amount={selectedCommunity?.priceAmount || 2500}
                  onCancel={() => setIsCheckingOut(false)}
                  onSuccess={() => {
                    setTimeout(() => {
                      setIsCheckingOut(false);
                      setViewMode("creator");
                    }, 1200);
                  }}
                />
              </div>
            ) : activeTab === "Recommended" ? (
              /* ── Standard Explore Flow: Recommended + Trending ── */
              <div className="space-y-8 pt-1">
                {/* 1. Recommended Section */}
                <section className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Recommended for you
                    </h2>
                  </div>

                  {/* Mobile View (< md): Horizontal Touch Snap Slider */}
                  <div className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-none -mx-3 px-3 snap-x md:hidden">
                    {recommendedItems.map((community) => (
                      <div
                        key={community.id}
                        onClick={() => handleCardClick(community)}
                        className="group snap-start shrink-0 w-[180px] rounded-2xl bg-[#1c1c1d] border border-white/8 overflow-hidden cursor-pointer hover:border-white/20 active:scale-[0.98] transition-all flex flex-col justify-between shadow-lg"
                      >
                        <div className="relative h-28 w-full bg-zinc-800">
                          <Image
                            src={community.image}
                            alt={community.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="200px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                          <div className="absolute top-2 left-2 rounded-full bg-black/50 backdrop-blur-md px-2 py-0.5 text-[9.5px] font-medium text-white/90 border border-white/10">
                            {community.creator}
                          </div>
                        </div>

                        <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                          <div className="space-y-1">
                            <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                              {community.name}
                            </h3>
                            <p className="text-[11px] text-zinc-400">
                              {community.members} · {community.posts}
                            </p>
                          </div>

                          <div>
                            <span
                              className={cn(
                                "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-tight",
                                community.isFree
                                  ? "bg-[#22c55e]/15 text-[#74e3a4] ring-1 ring-[#22c55e]/30"
                                  : "bg-[#f5c94d]/15 text-[#f5c94d] ring-1 ring-[#f5c94d]/30"
                              )}
                            >
                              {community.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop View (≥ md): Responsive Multi-Column Grid */}
                  <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                    {recommendedItems.map((community) => (
                      <article
                        key={community.id}
                        onClick={() => handleCardClick(community)}
                        className="group relative cursor-pointer overflow-hidden rounded-[20px] border border-white/8 bg-[#1c1c1d] shadow-[0_10px_35px_rgba(0,0,0,0.18)] hover:border-white/20 transition-all flex flex-col justify-between"
                      >
                        <div className="relative h-56 w-full overflow-hidden bg-zinc-800">
                          <Image
                            src={community.image}
                            alt={community.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#111214]/90 via-[#111214]/15 to-transparent" />
                          <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                            {community.creator}
                          </div>
                        </div>

                        <div className="space-y-3 p-4 pb-5 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <h3 className="text-lg font-bold leading-snug text-white line-clamp-1 group-hover:text-[#f5c94d] transition-colors">
                              {community.name}
                            </h3>
                            <div className="flex items-center justify-between gap-2 text-xs text-white/60">
                              <span>{community.members}</span>
                              <span>{community.posts}</span>
                            </div>
                          </div>

                          <div className="pt-2">
                            <span
                              className={cn(
                                "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                                community.isFree
                                  ? "bg-[#22c55e]/15 text-[#74e3a4] ring-1 ring-[#22c55e]/30"
                                  : "bg-[#f5c94d]/15 text-[#f5c94d] ring-1 ring-[#f5c94d]/30"
                              )}
                            >
                              {community.price}
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                {/* 2. Trending Section */}
                <section className="space-y-3 sm:space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Trending this week
                    </h2>
                  </div>

                  {/* Mobile View (< md): Stacked Tap-able Rows */}
                  <div className="space-y-2.5 md:hidden">
                    {trendingItems.map((community) => (
                      <div
                        key={community.id}
                        onClick={() => handleCardClick(community)}
                        className="group flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#1c1c1d] border border-white/6 hover:border-white/15 cursor-pointer active:scale-[0.99] transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-zinc-800">
                            <Image
                              src={community.image}
                              alt={community.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>

                          <div className="min-w-0 space-y-0.5">
                            <span className="text-[10px] text-zinc-400 font-medium truncate block">
                              {community.creator}
                            </span>
                            <h3 className="text-sm font-bold text-white truncate leading-snug">
                              {community.name}
                            </h3>
                            <p className="text-[11px] text-zinc-400">
                              {community.members} · {community.posts}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-tight",
                              community.isFree
                                ? "bg-[#22c55e]/15 text-[#74e3a4] ring-1 ring-[#22c55e]/30"
                                : "bg-[#f5c94d]/15 text-[#f5c94d] ring-1 ring-[#f5c94d]/30"
                            )}
                          >
                            {community.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop View (≥ md): Multi-Column Grid */}
                  <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                    {trendingItems.map((community) => (
                      <article
                        key={community.id}
                        onClick={() => handleCardClick(community)}
                        className="group relative cursor-pointer overflow-hidden rounded-[20px] border border-white/8 bg-[#1c1c1d] shadow-[0_10px_35px_rgba(0,0,0,0.18)] hover:border-white/20 transition-all flex flex-col justify-between"
                      >
                        <div className="relative h-56 w-full overflow-hidden bg-zinc-800">
                          <Image
                            src={community.image}
                            alt={community.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#111214]/90 via-[#111214]/15 to-transparent" />
                          <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                            {community.creator}
                          </div>
                        </div>

                        <div className="space-y-3 p-4 pb-5 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <h3 className="text-lg font-bold leading-snug text-white line-clamp-1 group-hover:text-[#f5c94d] transition-colors">
                              {community.name}
                            </h3>
                            <div className="flex items-center justify-between gap-2 text-xs text-white/60">
                              <span>{community.members}</span>
                              <span>{community.posts}</span>
                            </div>
                          </div>

                          <div className="pt-2">
                            <span
                              className={cn(
                                "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                                community.isFree
                                  ? "bg-[#22c55e]/15 text-[#74e3a4] ring-1 ring-[#22c55e]/30"
                                  : "bg-[#f5c94d]/15 text-[#f5c94d] ring-1 ring-[#f5c94d]/30"
                              )}
                            >
                              {community.price}
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              /* ── Filtered Communities Grid (Trending / Free / Paid) ── */
              <div className="mt-4 space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {activeTab === "Trending"
                    ? "Trending this week"
                    : activeTab === "Paid"
                    ? "Exclusive Creator Communities"
                    : "Free Communities"}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                  {visibleCommunities.map((community) => (
                    <article
                      key={community.id}
                      onClick={() => handleCardClick(community)}
                      className="group relative cursor-pointer overflow-hidden rounded-[20px] border border-white/8 bg-[#1c1c1d] shadow-[0_10px_35px_rgba(0,0,0,0.18)] hover:border-white/20 transition-all flex flex-col justify-between"
                    >
                      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-zinc-800">
                        <Image
                          src={community.image}
                          alt={community.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111214]/90 via-[#111214]/15 to-transparent" />
                        <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                          {community.creator}
                        </div>
                      </div>

                      <div className="space-y-3 p-4 pb-5 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <h3 className="text-base sm:text-lg font-bold leading-snug text-white line-clamp-1 group-hover:text-[#f5c94d] transition-colors">
                            {community.name}
                          </h3>
                          <div className="flex items-center justify-between gap-2 text-xs text-white/60">
                            <span>{community.members}</span>
                            <span>{community.posts}</span>
                          </div>
                        </div>

                        <div className="pt-2">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                              community.isFree
                                ? "bg-[#22c55e]/15 text-[#74e3a4] ring-1 ring-[#22c55e]/30"
                                : "bg-[#f5c94d]/15 text-[#f5c94d] ring-1 ring-[#f5c94d]/30"
                            )}
                          >
                            {community.price}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Explore Unlock Modal for Paid Community Selection */}
            {showModal && selectedCommunity && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
                <div className="relative w-full max-w-[500px] rounded-[24px] border border-white/10 bg-[#1c1c1f] p-5 sm:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.65)] animate-in fade-in zoom-in-95 duration-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white/50 transition-colors hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    ✕
                  </button>

                  <div className="mx-auto mb-5 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border border-[#f5c94d]/50 bg-[#f5c94d] text-[#111111] shadow-[0_0_0_8px_rgba(245,201,77,0.12)]">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/10">
                      <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                  </div>

                  <div className="space-y-5 text-center">
                    <div>
                      <p className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                        {selectedCommunity.name}
                      </p>
                    </div>

                    <div className="space-y-2 rounded-2xl border border-white/8 bg-[#252528] px-4 py-4 text-left text-white">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-[#f5c94d]" />
                        <p className="text-base font-semibold">
                          Members-only content
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-400">
                        Subscribe to see exclusive dishes, tutorials, recipes and direct Q&amp;A.
                      </p>
                    </div>

                    <div className="space-y-2.5 text-left">
                      <p className="text-xs sm:text-sm font-medium text-white/90">
                        Unlock everything in this community:
                      </p>
                      <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                        {COMMUNITY_COPY.plus.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#f5c94d] text-[10px] text-[#111111]">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        type="button"
                        onClick={handleStartCheckout}
                        className="w-full rounded-xl bg-[#f5c94d] px-5 py-3 text-sm sm:text-base font-bold text-[#111111] transition-all hover:bg-[#efbe29] cursor-pointer shadow-lg active:scale-95"
                      >
                        Subscribe to unlock N{selectedCommunity.priceAmount.toLocaleString("en-NG")}/mo
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          router.push(`/community/${selectedCommunity.id}`);
                        }}
                        className="w-full py-2 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        View community details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default function CommunityPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
          Loading Community...
        </div>
      }
    >
      <CommunityPageContent />
    </Suspense>
  );
}
