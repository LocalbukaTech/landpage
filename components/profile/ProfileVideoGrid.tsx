"use client";

import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { Video } from "@/types/video";
import { formatCount } from "@/constants/mockVideos";

interface ProfileVideoGridProps {
  videos: Video[];
}

export function ProfileVideoGrid({ videos }: ProfileVideoGridProps) {
  const router = useRouter();

  const handleVideoClick = (videoId: string) => {
    router.push(`/?video=${videoId}`);
  };

  if (!videos || videos.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-zinc-500 text-sm">
        No videos yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
      {videos.map((video) => (
        <button
          key={video.id}
          onClick={() => handleVideoClick(video.id)}
          className="relative aspect-3/4 rounded-lg overflow-hidden group cursor-pointer bg-[#2a2a2a] border-0"
        >
          {/* Video Thumbnail */}
          <video
            src={video.src}
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="metadata"
            onLoadedData={(e) => {
              // Seek to 1 second to get a proper thumbnail frame
              const videoEl = e.currentTarget;
              videoEl.currentTime = 1;
            }}
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200" />

          {/* Play count overlay */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-semibold">
            <Play size={14} fill="white" />
            <span>{formatCount(video.likes)}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
