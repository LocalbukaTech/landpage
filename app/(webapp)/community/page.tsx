"use client";

import { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Check, Lock, Sparkles, LayoutDashboard, Compass, ArrowLeft } from "lucide-react";
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
  const searchParams = useSearchParams();
  const initialMode =
    searchParams.get("view") === "explore" ? "explore" : "creator";
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

  const handleCardClick = (community: CommunityItem) => {
    setSelectedCommunity(community);
    if (!community.isFree) {
      setShowModal(true);
    } else {
      setViewMode("creator");
    }
  };

  const handleStartCheckout = () => {
    setShowModal(false);
    setIsCheckingOut(true);
  };

  return (
    <MainLayout>
      <div className="w-full max-w-[1100px] mx-auto px-4 md:px-8 py-3 md:py-6 text-white">
        {/* Top View Mode Switcher */}
        <div className="mb-4 flex items-center justify-end">
          <div className="inline-flex items-center gap-1 rounded-full bg-[#202020] p-1 border border-white/5">
            <button
              type="button"
              onClick={() => setViewMode("creator")}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                viewMode === "creator"
                  ? "bg-[#f5c94d] text-black shadow-sm"
                  : "text-white/60 hover:text-white"
              )}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Creator Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode("explore");
                setIsCheckingOut(false);
              }}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                viewMode === "explore"
                  ? "bg-[#f5c94d] text-black shadow-sm"
                  : "text-white/60 hover:text-white"
              )}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Explore Communities</span>
            </button>
          </div>
        </div>

        {/* View Mode 1: Creator Management Dashboard (Screenshots 1, 2, 4, 5) */}
        {viewMode === "creator" && (
          <CreatorDashboard initialTab={initialDashboardTab} />
        )}

        {/* View Mode 2: Explore Member Feed & Checkout (Screenshot 3) */}
        {viewMode === "explore" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-[2.1rem] font-bold tracking-tight text-white">
                Community
              </h1>
            </div>

            {/* Navigation Tabs Bar with "Create community" Yellow Button (Matching Screenshot 3) */}
            <div className="border-b border-white/10 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab);
                        setIsCheckingOut(false);
                      }}
                      className={cn(
                        "rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer",
                        !isCheckingOut && activeTab === tab
                          ? "bg-[#f5c94d] text-[#111111] font-semibold shadow-[0_0_0_1px_rgba(245,201,77,0.4)]"
                          : "bg-[#2b2b2b] text-white/70 hover:bg-[#323232] hover:text-white"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Yellow "Create community" Pill Button */}
                <button
                  type="button"
                  onClick={() => setViewMode("creator")}
                  className="rounded-full bg-[#f5c94d] px-5 sm:px-6 py-2 text-xs sm:text-sm font-bold text-black hover:bg-[#eab308] active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  Create community
                </button>
              </div>
            </div>

            {/* Payment Checkout View (Exact Match to Screenshot 3 / 16.49.00.png) */}
            {isCheckingOut ? (
              <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
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
            ) : (
              /* Communities Grid */
              <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[2rem] md:text-[2.4rem] font-bold tracking-tight">
                    {activeTab === "Trending"
                      ? "Trending this week"
                      : activeTab === "Paid"
                      ? "Exclusive Creator Communities"
                      : "Recommended for you"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(true)}
                    className="text-xs text-white/50 hover:text-[#f5c94d] transition-colors underline"
                  >
                    Preview payment checkout card
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
                  {visibleCommunities.map((community) => (
                    <article
                      key={community.id}
                      onClick={() => handleCardClick(community)}
                      className="group relative cursor-pointer overflow-hidden rounded-[18px] border border-white/8 bg-[#1c1c1d] shadow-[0_10px_35px_rgba(0,0,0,0.18)] hover:border-white/20 transition-all"
                    >
                      <div className="relative h-64 w-full overflow-hidden">
                        <Image
                          src={community.image}
                          alt={community.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111214]/90 via-[#111214]/15 to-transparent" />

                        <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/25 px-2 py-1 text-[10px] font-medium text-white/90 backdrop-blur-sm">
                          {community.creator}
                        </div>
                      </div>

                      <div className="space-y-3 p-4 pb-5">
                        <h3 className="text-[1.55rem] md:text-[1.8rem] font-bold leading-tight text-white">
                          {community.name}
                        </h3>

                        <div className="flex items-center justify-between gap-2 text-sm text-white/70">
                          <span>{community.members}</span>
                          <span>{community.posts}</span>
                        </div>

                        <div className="pt-1">
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

            {/* Explore Unlock Modal */}
            {showModal && selectedCommunity && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] px-4">
                <div className="relative w-full max-w-[540px] rounded-[22px] border border-white/8 bg-[#171717] p-5 sm:p-6 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="absolute right-4 top-4 text-sm font-medium text-white/50 transition-colors hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>

                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#f5c94d]/50 bg-[#f5c94d] text-[#111111] shadow-[0_0_0_8px_rgba(245,201,77,0.12)]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/10">
                      <Sparkles className="h-7 w-7" />
                    </div>
                  </div>

                  <div className="space-y-5 text-center">
                    <div>
                      <p className="text-[1.7rem] font-bold tracking-tight text-white">
                        {selectedCommunity.name}
                      </p>
                    </div>

                    <div className="space-y-3 rounded-2xl border border-white/8 bg-[#f2f2f2] px-4 py-5 text-left text-[#1b1b1b]">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-[#111111]" />
                        <p className="text-lg font-semibold">
                          Members-only content
                        </p>
                      </div>

                      <p className="text-sm text-[#4d4d4d]">
                        Subscribe to see exclusive dishes, tutorials and recipes
                      </p>
                    </div>

                    <div className="space-y-3 text-left">
                      <p className="text-[0.95rem] text-white/80">
                        Unlock everything in this community.
                      </p>
                      <ul className="space-y-2 text-sm text-white/70">
                        {COMMUNITY_COPY.plus.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#f5c94d] text-[10px] text-[#111111]">
                              <Check className="h-3 w-3" />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={handleStartCheckout}
                      className="w-full rounded-full bg-[#f5c94d] px-5 py-3 text-base font-semibold text-[#111111] transition-colors hover:bg-[#efbe29] cursor-pointer shadow-lg active:scale-95"
                    >
                      Subscribe to unlock N{selectedCommunity.priceAmount.toLocaleString("en-NG")}/mo
                    </button>
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
        <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
          Loading Community...
        </div>
      }
    >
      <CommunityPageContent />
    </Suspense>
  );
}
