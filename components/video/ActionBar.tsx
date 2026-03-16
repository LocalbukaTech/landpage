"use client";

import { Heart, MessageCircle, Bookmark, Share2, Repeat } from "lucide-react";
import { formatCount } from "@/constants/mockVideos";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface ActionBarProps {
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  reposts?: number;
  onCommentClick?: () => void;
}

export function ActionBar({ likes, comments, saves, shares, reposts = 0, onCommentClick }: ActionBarProps) {
  const { requireAuth } = useRequireAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isReposted, setIsReposted] = useState(false);

  const actions = [
    {
      icon: Heart,
      count: likes,
      label: "Like",
      isActive: isLiked,
      onClick: () => requireAuth(() => setIsLiked(!isLiked)),
      activeClass: "text-red-500",
    },
    {
      icon: MessageCircle,
      count: comments,
      label: "Comment",
      isActive: false,
      onClick: () => onCommentClick?.(),
      activeClass: "",
    },
    {
      icon: Bookmark,
      count: saves,
      label: "Save",
      isActive: isSaved,
      onClick: () => requireAuth(() => setIsSaved(!isSaved)),
      activeClass: "text-[#fbbe15]",
    },
    {
      icon: Share2,
      count: shares,
      label: "Share",
      isActive: false,
      onClick: () => {},
      activeClass: "",
    },
    {
      icon: Repeat,
      count: reposts as number,
      label: "Repost",
      isActive: isReposted,
      onClick: () => requireAuth(() => setIsReposted(!isReposted)),
      activeClass: "text-green-500",
    },
  ];

  return (
    <div className="flex flex-col gap-4 pb-4 items-center">
      {actions.map((action) => (
        <button
          key={action.label}
          className={cn(
            "flex flex-col items-center gap-1.5 bg-transparent border-none text-white cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95",
            action.isActive ? action.activeClass : ""
          )}
          onClick={action.onClick}
          aria-label={action.label}
        >
          <div className="flex items-center justify-center w-9 h-9">
            <action.icon
              size={24}
              fill={action.isActive ? "currentColor" : "none"}
            />
          </div>
          <h6 className="text-xs font-medium text-white">{formatCount(action.count)}</h6>
        </button>
      ))}
    </div>
  );
}
