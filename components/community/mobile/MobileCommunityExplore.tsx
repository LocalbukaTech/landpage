"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, Search, Users } from "lucide-react";
import { MobileCommunityItem } from "./types";
import { cn } from "@/lib/utils";

interface MobileCommunityExploreProps {
  communities: MobileCommunityItem[];
  onSelectCommunity: (community: MobileCommunityItem) => void;
  onOpenMenu?: () => void;
  onOpenSearch?: () => void;
  onNavigateTab?: (tab: "community" | "foryou" | "following") => void;
  onViewEmptyState?: () => void;
}

type FilterCategory = "Recommended" | "Trending" | "Free" | "Paid";

export function MobileCommunityExplore({
  communities,
  onSelectCommunity,
  onOpenMenu,
  onOpenSearch,
  onNavigateTab,
  onViewEmptyState,
}: MobileCommunityExploreProps) {
  const [activeCategory, setActiveCategory] =
    useState<FilterCategory>("Recommended");

  const categories: FilterCategory[] = [
    "Recommended",
    "Trending",
    "Free",
    "Paid",
  ];

  const filteredCommunities = communities.filter((item) => {
    if (activeCategory === "Free") return item.isFree;
    if (activeCategory === "Paid") return !item.isFree;
    return true;
  });

  // Recommended row
  const recommendedItems =
    activeCategory === "Trending"
      ? communities.slice(4)
      : filteredCommunities.slice(0, 4);

  // Trending list
  const trendingItems =
    activeCategory === "Trending"
      ? communities.slice(2)
      : filteredCommunities.slice(2).length > 0
      ? filteredCommunities.slice(2)
      : filteredCommunities;

  return (
    <div className="flex flex-col w-full min-h-full bg-[#141414] text-white">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-2 sm:px-4 h-14 bg-[#141414]/95 backdrop-blur-md border-b border-white/5">
        <button
          type="button"
          onClick={onOpenMenu}
          className="w-8 sm:w-9 h-9 flex shrink-0 items-center justify-start text-white/90 hover:text-white cursor-pointer active:scale-95"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Center Tabs: Community | For You | Following */}
        <div className="flex items-center gap-2.5 sm:gap-5 text-[12px] sm:text-sm font-bold min-w-0">
          <button
            type="button"
            className="relative py-2 text-white font-bold cursor-pointer whitespace-nowrap"
          >
            Community
            {/* Active yellow underline */}
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#fbbe15] rounded-full" />
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab?.("foryou")}
            className="py-2 text-white/50 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            For You
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab?.("following")}
            className="py-2 text-white/50 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Following
          </button>
        </div>

        {/* Search Icon */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-8 sm:w-9 h-9 flex shrink-0 items-center justify-end text-white/90 hover:text-white cursor-pointer active:scale-95"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 pt-3 pb-8 space-y-6">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer",
                activeCategory === cat
                  ? "bg-[#fbbe15] text-[#121212] shadow-sm font-bold"
                  : "bg-[#222222] text-white/70 hover:bg-[#2b2b2b] hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Empty State when no real communities exist yet */}
        {filteredCommunities.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#1e1e1e] p-8 text-center space-y-3 my-4">
            <Users size={32} className="mx-auto text-[#fbbe15]" />
            <h3 className="text-base font-bold text-white">
              {activeCategory === "Paid"
                ? "Paid Communities · Coming Soon"
                : "No communities created yet"}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {activeCategory === "Paid"
                ? "Paid creator communities with Paystack & Korapay are launching soon."
                : "Only real creator communities appear here. Create a community to get started!"}
            </p>
          </div>
        ) : (
          <>
        {/* Section 1: Recommended for you */}
        <section className="space-y-3">
          <h2 className="text-[17px] font-bold text-white tracking-tight">
            Recommended for you
          </h2>

          {/* Horizontal Slider of Cards */}
          <div className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 snap-x">
            {recommendedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectCommunity(item)}
                className="group snap-start shrink-0 w-[172px] sm:w-[190px] rounded-2xl bg-[#1e1e1e] border border-white/8 overflow-hidden cursor-pointer hover:border-white/20 active:scale-[0.98] transition-all flex flex-col justify-between"
              >
                {/* Image & Pill Header */}
                <div className="relative h-28 w-full bg-zinc-800">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                  {/* Creator tag badge */}
                  <div className="absolute top-2 left-2 rounded-full bg-black/40 backdrop-blur-md px-2 py-0.5 text-[9.5px] font-medium text-white/90 border border-white/10">
                    {item.creator}
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white leading-tight line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      {item.members} · {item.posts}
                    </p>
                  </div>

                  {/* Price Badge */}
                  <div>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-tight",
                        item.isFree
                          ? "bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30"
                          : "bg-[#fbbe15]/15 text-[#fbbe15] border border-[#fbbe15]/30"
                      )}
                    >
                      {item.priceBadge}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Trending this week */}
        <section className="space-y-3 pt-1">
          <h2 className="text-[17px] font-bold text-white tracking-tight">
            Trending this week
          </h2>

          <div className="space-y-2.5">
            {trendingItems.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => onSelectCommunity(item)}
                className="group flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#1e1e1e] border border-white/6 hover:border-white/15 cursor-pointer active:scale-[0.99] transition-all"
              >
                {/* Left Side: Thumbnail & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-13 h-13 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-zinc-800">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="52px"
                    />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-400 font-medium truncate">
                        {item.creator}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white truncate leading-snug">
                      {item.name}
                    </h3>

                    <p className="text-[11px] text-zinc-400">
                      {item.members} · {item.posts}
                    </p>
                  </div>
                </div>

                {/* Right Side: Badge */}
                <div className="shrink-0">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-tight",
                      item.isFree
                        ? "bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30"
                        : "bg-[#fbbe15]/15 text-[#fbbe15] border border-[#fbbe15]/30"
                    )}
                  >
                    {item.priceBadge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
          </>
        )}
      </div>
    </div>
  );
}
