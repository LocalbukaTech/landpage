"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Send,
} from "lucide-react";
import { MobileCommunityItem, CommunityComment } from "./types";
import { INITIAL_COMMENTS } from "./mockData";
import { cn } from "@/lib/utils";
import {
  useCommunityFeed,
  useTogglePostLike,
  usePostComments,
  useCreatePostComment,
} from "@/lib/api/services/community.hooks";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface MobileCommunityFeedProps {
  community: MobileCommunityItem;
  onBack: () => void;
}

export function MobileCommunityFeed({
  community,
  onBack,
}: MobileCommunityFeedProps) {
  const communityKey = (community as any).slug || community.id;
  const { data: liveFeed } = useCommunityFeed(communityKey);
  const livePost = liveFeed?.items?.[0] || null;
  const activePostId = livePost?.id || "";
  const isRealPost = UUID_REGEX.test(activePostId);

  const toggleLikeMutation = useTogglePostLike();
  const { data: liveCommentsData } = usePostComments(
    isRealPost ? activePostId : ""
  );
  const createCommentMutation = useCreatePostComment(activePostId);

  const [localLiked, setLocalLiked] = useState<boolean | null>(null);
  const [localLikeCount, setLocalLikeCount] = useState<number | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [fallbackComments, setFallbackComments] =
    useState<CommunityComment[]>(INITIAL_COMMENTS);
  const [newCommentText, setNewCommentText] = useState("");

  const isLiked =
    localLiked !== null ? localLiked : Boolean(livePost?.hasLiked);
  const likeCount =
    localLikeCount !== null
      ? localLikeCount
      : livePost
      ? livePost.likesCount
      : 24;

  const comments: CommunityComment[] = useMemo(() => {
    if (isRealPost && liveCommentsData?.comments) {
      return liveCommentsData.comments.map((c) => ({
        id: c.id,
        author: c.author?.fullName || "@member",
        text: c.content,
        timeAgo: "Recently",
      }));
    }
    return fallbackComments;
  }, [isRealPost, liveCommentsData, fallbackComments]);

  const handleToggleLike = async () => {
    const nextLiked = !isLiked;
    setLocalLiked(nextLiked);
    setLocalLikeCount(Math.max(0, likeCount + (nextLiked ? 1 : -1)));

    if (isRealPost) {
      try {
        const res = await toggleLikeMutation.mutateAsync(activePostId);
        const result = (res as any)?.data ?? res;
        if (typeof result?.liked === "boolean") setLocalLiked(result.liked);
        if (typeof result?.likesCount === "number") {
          setLocalLikeCount(result.likesCount);
        }
      } catch {
        setLocalLiked(!nextLiked);
        setLocalLikeCount(likeCount);
      }
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCommentText.trim();
    if (!trimmed) return;

    if (isRealPost) {
      try {
        await createCommentMutation.mutateAsync({ content: trimmed });
        setNewCommentText("");
        return;
      } catch {
        // fallback below if unauthenticated
      }
    }

    const newComment: CommunityComment = {
      id: `c-${Date.now()}`,
      author: "@you",
      text: trimmed,
      timeAgo: "Just now",
    };

    setFallbackComments((prev) => [...prev, newComment]);
    setNewCommentText("");
  };

  return (
    <div className="flex flex-col w-full min-h-full bg-[#141414] text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 flex items-center gap-3 px-4 h-13 bg-[#141414]/95 backdrop-blur-md border-b border-white/5">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 -ml-1 flex items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft size={21} />
        </button>

        {/* Community Avatar & Name */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-md overflow-hidden bg-[#fbbe15] shrink-0 flex items-center justify-center p-0.5">
            <Image
              src="/images/localBuka_logo.png"
              alt="Community Logo"
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
          <h1 className="text-sm font-bold text-white truncate">
            {community.name}
          </h1>
        </div>
      </header>

      {/* Main Post & Comments Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-20">
        {/* Post Container */}
        <article className="space-y-3 pb-3 border-b border-white/8">
          {/* Post Author */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-700 shrink-0 relative">
              <Image
                src="/images/avatar-bryan.jpg"
                alt="@chef_tolu"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-sm font-bold text-white">
                {livePost?.author?.fullName || "@chef_tolu"}
              </span>
              <span className="text-xs text-zinc-400 ml-1.5">
                · {livePost ? "Live" : "3h"}
              </span>
            </div>
          </div>

          {/* Post Content */}
          <p className="text-sm text-zinc-200 leading-relaxed">
            {livePost?.content ||
              "Tried jollof with smoked paprika this time, unexpectedly good. Anyone else experiment with theirs?"}
          </p>

          {/* Interaction Bar */}
          <div className="flex items-center gap-6 pt-1 text-zinc-400 text-xs">
            {/* Like */}
            <button
              type="button"
              onClick={() => void handleToggleLike()}
              className={cn(
                "flex items-center gap-1.5 transition-colors cursor-pointer",
                isLiked ? "text-red-500 font-bold" : "hover:text-white"
              )}
            >
              <Heart
                size={17}
                className={isLiked ? "fill-red-500 stroke-red-500" : ""}
              />
              <span>{livePost ? likeCount : `${likeCount}k`}</span>
            </button>

            {/* Comment */}
            <div className="flex items-center gap-1.5 text-zinc-400">
              <MessageCircle size={17} />
              <span>{livePost ? comments.length : comments.length > 3 ? "4.1k" : "4k"}</span>
            </div>

            {/* Bookmark */}
            <button
              type="button"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={cn(
                "flex items-center gap-1.5 transition-colors cursor-pointer",
                isBookmarked ? "text-[#fbbe15]" : "hover:text-white"
              )}
            >
              <Bookmark
                size={17}
                className={isBookmarked ? "fill-[#fbbe15] stroke-[#fbbe15]" : ""}
              />
              <span>1k</span>
            </button>

            {/* Share */}
            <button
              type="button"
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer ml-auto"
            >
              <Share2 size={16} />
              <span className="text-[11px]">Share</span>
            </button>
          </div>
        </article>

        {/* Comments Section */}
        <div className="space-y-3 pt-1">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-0.5 text-xs">
              <span className="font-bold text-white mr-1.5">
                {comment.author}
              </span>
              <span className="text-zinc-300 leading-relaxed">
                {comment.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Comment Bar */}
      <div className="sticky bottom-0 z-30 bg-[#161616] border-t border-white/8 px-4 py-2.5">
        <form
          onSubmit={handleAddComment}
          className="flex items-center gap-2.5"
        >
          {/* User Avatar */}
          <div className="w-7 h-7 rounded-full bg-[#fbbe15] overflow-hidden shrink-0 flex items-center justify-center text-xs font-bold text-black">
            J
          </div>

          {/* Comment Input */}
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Add a comment"
              className="w-full bg-[#202020] rounded-full py-2 px-4 pr-10 text-xs text-white placeholder-zinc-500 outline-none border border-white/5 focus:border-[#fbbe15]/40"
            />
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="absolute right-2 text-[#fbbe15] disabled:text-zinc-600 transition-colors p-1 cursor-pointer"
              aria-label="Send comment"
            >
              <Send size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
