"use client";

import { Menu, Search, Users } from "lucide-react";

interface MobileCommunityEmptyStateProps {
  onOpenMenu?: () => void;
  onOpenSearch?: () => void;
  onCreateCommunity: () => void;
  onBackToExplore?: () => void;
}

export function MobileCommunityEmptyState({
  onOpenMenu,
  onOpenSearch,
  onCreateCommunity,
  onBackToExplore,
}: MobileCommunityEmptyStateProps) {
  return (
    <div className="flex flex-col w-full min-h-full bg-[#141414] text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-13 bg-[#141414]/95 backdrop-blur-md border-b border-white/5">
        <button
          type="button"
          onClick={onOpenMenu}
          className="w-9 h-9 flex items-center justify-start text-white/90 hover:text-white cursor-pointer active:scale-95"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Center Tabs: Community | For You | Following */}
        <div className="flex items-center gap-5 text-sm font-bold">
          <button
            type="button"
            onClick={onBackToExplore}
            className="relative py-2 text-white font-bold cursor-pointer"
          >
            Community
            {/* Active yellow underline */}
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#fbbe15] rounded-full" />
          </button>
          <span className="py-2 text-white/50 cursor-default">For You</span>
          <span className="py-2 text-white/50 cursor-default">Following</span>
        </div>

        {/* Search */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-9 h-9 flex items-center justify-end text-white/90 hover:text-white cursor-pointer active:scale-95"
          aria-label="Search"
        >
          <Search size={21} />
        </button>
      </header>

      {/* Centered Empty State Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-5">
        {/* Two-people outline icon */}
        <div className="text-zinc-600 flex items-center justify-center">
          <Users size={68} strokeWidth={1.3} />
        </div>

        {/* Text */}
        <div className="space-y-2 max-w-xs mx-auto">
          <h1 className="text-lg font-bold text-white tracking-tight">
            No communities yet
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            There&apos;s nothing here right now. Check back soon, or start your own
            community around the food you love.
          </p>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-5 pb-8 space-y-2">
        <button
          type="button"
          onClick={onCreateCommunity}
          className="w-full py-3.5 px-6 rounded-xl bg-[#fbbe15] hover:bg-[#eab308] active:scale-[0.98] transition-all font-bold text-[#141414] text-[15px] shadow-lg shadow-[#fbbe15]/20 cursor-pointer text-center"
        >
          Create a community
        </button>

        {onBackToExplore && (
          <button
            type="button"
            onClick={onBackToExplore}
            className="w-full py-2 text-xs text-zinc-400 hover:text-white text-center cursor-pointer"
          >
            ← Back to explore communities
          </button>
        )}
      </div>
    </div>
  );
}
