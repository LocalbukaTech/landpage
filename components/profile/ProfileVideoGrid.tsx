"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Trash2 } from "lucide-react";
import type { Post } from "@/types/post";
import { formatCount } from "@/constants/mockVideos";
import { useDeletePost, useToggleSave } from "@/lib/api/services/posts.hooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface ProfileVideoGridProps {
  posts: Post[];
  isLoading?: boolean;
  isEditing?: boolean;
  activeTab?: string;
}

export function ProfileVideoGrid({ posts, isLoading, isEditing, activeTab }: ProfileVideoGridProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const deletePostMutation = useDeletePost();
  const toggleSaveMutation = useToggleSave();

  const handleAction = () => {
    if (!postToDelete) return;

    if (activeTab === "saved") {
      // Remove from saved
      toggleSaveMutation.mutate(postToDelete.id, {
        onSuccess: () => {
          toast({
            title: "Removed",
            description: "Video removed from saved list.",
          });
          setPostToDelete(null);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Could not remove from saved. Please try again.",
            variant: "destructive",
          });
        }
      });
    } else {
      // Delete post
      deletePostMutation.mutate(postToDelete.id, {
        onSuccess: () => {
          toast({
            title: "Deleted",
            description: "Post deleted successfully.",
          });
          setPostToDelete(null);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Could not delete post. Please try again.",
            variant: "destructive",
          });
        }
      });
    }
  };

  const handleVideoClick = (videoId: string) => {
    router.push(`/posts/${videoId}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-3/4 rounded-lg bg-[#2a2a2a] animate-pulse" />
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-zinc-500 text-sm">
        No posts yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
      {posts.map((post) => (
        <div key={post.id} className="relative group">
          <button
            onClick={() => !isEditing && handleVideoClick(post.id)}
            className={`relative w-full aspect-3/4 rounded-lg overflow-hidden group cursor-pointer bg-[#2a2a2a] border-0 ${isEditing ? "cursor-default" : ""}`}
          >
            {/* Video Thumbnail */}
            {/* Media Rendering (Image or Video) */}
            {post.mediaType === 'image' || !post.mediaUrl.match(/\.(mp4|mov|webm)$/i) ? (
              <img 
                src={post.mediaUrl} 
                className="w-full h-full object-cover" 
                alt={post.caption || "Post"}
              />
            ) : (
              <video
                src={post.mediaUrl}
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
            )}

            {/* Hover overlay */}
            <div className={`absolute inset-0 bg-black/0 transition-all duration-200 ${!isEditing ? "group-hover:bg-black/30" : ""}`} />

            {/* Play count overlay */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-semibold">
              <Play size={14} fill="white" />
              <span>{formatCount(post.likeCount || post.likesCount || 0)}</span>
            </div>
          </button>

          {/* Delete Icon Overlay */}
          {isEditing && (
            <button
               onClick={(e) => {
                 e.stopPropagation();
                 setPostToDelete(post);
               }}
               className="absolute top-2 right-2 p-1.5 bg-red-600 rounded-full text-white shadow-lg hover:bg-red-700 transition-colors z-10 border-none cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}

      {/* Confirmation Dialog */}
      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {activeTab === "saved" ? "Remove from saved?" : "Delete post?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              {activeTab === "saved" 
                ? "This will remove the video from your saved list." 
                : "This action cannot be undone. This post will be permanently deleted."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleAction}
              className="bg-red-600 text-white hover:bg-red-700 font-bold"
            >
              {activeTab === "saved" ? "Remove" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
