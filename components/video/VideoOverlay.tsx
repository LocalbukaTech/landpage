"use client";

import { BadgeCheck } from "lucide-react";

interface VideoOverlayProps {
  username: string;
  isVerified: boolean;
  hashtags: string[];
}

export function VideoOverlay({ username, isVerified, hashtags }: VideoOverlayProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent z-[5]">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-white font-semibold text-[15px]">
          <span>{username}</span>
          {isVerified && (
            <BadgeCheck className="text-sky-400 fill-sky-400" size={16} />
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {hashtags.map((tag) => (
            <span key={tag} className="text-white/80 text-[13px]">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
