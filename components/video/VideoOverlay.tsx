"use client";

import { BadgeCheck } from "lucide-react";
import { useState } from "react";
import type { Post } from "@/types/post";
import { cn, formatRelativeShort } from "@/lib/utils";

interface VideoOverlayProps {
  post: Post;
  showTimestamp?: boolean;
}

export function VideoOverlay({ post, showTimestamp }: VideoOverlayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!post) return null;

  const displayedCaption = post.caption?.replace(/#\w+/g, '').trim();
  const isLongCaption = displayedCaption?.length > 100 || (displayedCaption?.split('\n').length > 2);
  
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/70 to-transparent z-5 pointer-events-none">
      <div className="flex flex-col gap-1.5 max-w-[85%] pointer-events-auto">
        <div className="flex items-center gap-1.5 text-white font-semibold text-[15px]">
          <span>@{post.user?.username || post.user?.firstName || 'user'}</span>
          {showTimestamp && post.createdAt && (
            <>
              <span className="text-white/40 font-normal">·</span>
              <span className="text-white/60 font-medium text-sm">
                {formatRelativeShort(post.createdAt)}
              </span>
            </>
          )}
          {post.user?.isVerified && (
            <BadgeCheck className="text-sky-400 fill-sky-400" size={16} />
          )}
        </div>
        
        <div className="relative">
          <p 
            className={cn(
              "text-white text-sm transition-all duration-300",
              !isExpanded && "line-clamp-2"
            )}
          >
            {post.caption?.replace(/#\w+/g, '').trim()}
          </p>
          
          {isLongCaption && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white/60 text-xs font-bold mt-1 hover:text-white transition-colors cursor-pointer"
            >
              {isExpanded ? "see less" : "see more"}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mt-1">
          {post.tags?.map((tag) => (
            <span key={tag} className="text-[#FFC727] font-medium text-[13px]">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
