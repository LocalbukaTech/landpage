"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { VideoFeed } from "@/components/video/VideoFeed";
import { usePost } from "@/lib/api/services/posts.hooks";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Post } from "@/types/post";

interface PostClientProps {
  id: string;
  initialPost?: Post;
}

export function PostClient({ id, initialPost }: PostClientProps) {
  const { data: response, isLoading, isError } = usePost(id, {
    initialData: initialPost ? { data: { data: initialPost } } : undefined,
    enabled: !!id,
  });

  // Extract post from API response shape
  const post = (response as any)?.data?.data || (response as any)?.data || response;

  return (
    <div className="relative w-full h-full bg-black">
      {/* Back Button */}
      <Link 
        href="/profile"
        className="absolute top-6 left-6 z-50 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-all backdrop-blur-sm"
      >
        <ArrowLeft size={24} />
      </Link>

      {isLoading && !post ? (
        <div className="flex flex-col items-center justify-center h-full w-full text-white/70 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFC727]" />
          <p className="font-medium text-sm">Loading post...</p>
        </div>
      ) : isError && !post ? (
        <div className="flex flex-col items-center justify-center h-full w-full text-white/70 space-y-4">
          <p className="font-medium text-sm">Post not found or failed to load.</p>
          <Link 
            href="/feeds" 
            className="px-6 py-2 bg-[#FFC727] text-black font-bold rounded-full hover:bg-yellow-500 transition-colors"
          >
            Back to Feed
          </Link>
        </div>
      ) : post ? (
        <VideoFeed posts={[post]} initialIndex={0} initialMuted={false} />
      ) : null}
    </div>
  );
}
