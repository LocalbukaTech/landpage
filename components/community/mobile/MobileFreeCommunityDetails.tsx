"use client";

import Image from "next/image";
import { ArrowLeft, BookOpen, MessageCircle, Video } from "lucide-react";
import { MobileCommunityItem } from "./types";

interface MobileFreeCommunityDetailsProps {
  community: MobileCommunityItem;
  onBack: () => void;
  onJoin: () => void;
  onSelectPost?: () => void;
}

export function MobileFreeCommunityDetails({
  community,
  onBack,
  onJoin,
  onSelectPost,
}: MobileFreeCommunityDetailsProps) {
  const shares = community.shares || [
    { id: "1", icon: "recipe", title: "Recipes and cooking tips" },
    { id: "2", icon: "chat", title: "Food discussions" },
    { id: "3", icon: "media", title: "Photos and short videos" },
  ];

  return (
    <div className="flex flex-col w-full min-h-full bg-[#141414] text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center px-4 h-13 bg-[#141414]/95 backdrop-blur-md">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 -ml-1 flex items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft size={21} />
        </button>
      </header>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-8 space-y-5">
        {/* Title & Description */}
        <div className="space-y-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
            {community.name}
          </h1>

          <p className="text-sm text-zinc-300 leading-relaxed">
            {community.description}
          </p>

          {/* Free badge */}
          <div>
            <span className="inline-flex rounded-full bg-[#22c55e]/15 border border-[#22c55e]/30 px-3 py-0.5 text-xs font-bold text-[#22c55e]">
              Free
            </span>
          </div>

          <p className="text-xs text-zinc-400">
            {community.ownerLine}
          </p>
        </div>

        {/* Big Yellow CTA Button: + Join Community */}
        <div>
          <button
            type="button"
            onClick={onJoin}
            className="w-full py-3.5 px-6 rounded-xl bg-[#fbbe15] hover:bg-[#eab308] active:scale-[0.98] transition-all font-bold text-[#141414] text-[15px] shadow-lg shadow-[#fbbe15]/20 cursor-pointer text-center"
          >
            + Join Community
          </button>
        </div>

        {/* What members share card */}
        <div className="rounded-2xl bg-[#1e1e1e] border border-white/8 p-5 space-y-4">
          <h2 className="text-base font-bold text-white tracking-tight">
            What members share
          </h2>

          <div className="space-y-3.5">
            {shares.map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-sm text-zinc-200">
                <div className="w-5 h-5 flex items-center justify-center text-zinc-400">
                  {item.icon === "recipe" ? (
                    <BookOpen size={16} />
                  ) : item.icon === "chat" ? (
                    <MessageCircle size={16} />
                  ) : (
                    <Video size={16} />
                  )}
                </div>
                <span className="text-xs font-medium text-zinc-200">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent posts */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-white tracking-tight">
            Recent posts
          </h2>

          <div
            onClick={onSelectPost || onJoin}
            className="group relative w-32 h-24 rounded-xl overflow-hidden border border-white/10 bg-zinc-800 cursor-pointer active:scale-95 transition-all"
          >
            <Image
              src={
                community.recentPostImage ||
                "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80"
              }
              alt="Recent post"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="150px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
