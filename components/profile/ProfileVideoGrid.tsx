'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Trash2, Pencil, Archive, RotateCcw } from "lucide-react";
import type { Post } from "@/types/post";
import { formatCount } from "@/constants/mockVideos";
import {
  useDeletePost,
  useToggleSave,
  useArchivePost,
  useUnarchivePost,
} from "@/lib/api/services/posts.hooks";
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
import { ensureHttps, getVideoThumbnailUrl } from "@/lib/utils";

interface ProfileVideoGridProps {
  posts: Post[];
  isLoading?: boolean;
  isEditing?: boolean;
  activeTab?: string;
  onToggleEdit?: () => void;
  isEditable?: boolean;
  isOtherProfile?: boolean;
}

function PostMediaThumbnail({ post }: { post: Post }) {
  const [imgError, setImgError] = useState(false);
  const isImage =
    post.mediaType === 'image' ||
    (typeof post.mediaUrl === 'string' &&
      !post.mediaUrl.match(/\.(mp4|mov|webm|m4v|3gp|avi)(\?.*)?$/i));

  const thumbnail = isImage ? ensureHttps(post.mediaUrl) : getVideoThumbnailUrl(post);

  if (thumbnail && !imgError) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={thumbnail}
        className="w-full h-full object-cover"
        alt={post.caption || "Post thumbnail"}
        loading="lazy"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <video
      src={`${ensureHttps(post.mediaUrl)}#t=0.001`}
      poster={thumbnail || undefined}
      className='w-full h-full object-cover'
      muted
      playsInline
      preload='metadata'
    />
  );
}

export function ProfileVideoGrid({
  posts,
  isLoading,
  isEditing = false,
  activeTab,
  onToggleEdit,
  isEditable = false,
  isOtherProfile = false,
}: ProfileVideoGridProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const deletePostMutation = useDeletePost();
  const toggleSaveMutation = useToggleSave();
  const archivePostMutation = useArchivePost();
  const unarchivePostMutation = useUnarchivePost();

  const [pressTimer, setPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [didLongPress, setDidLongPress] = useState(false);

  const canEdit = isEditable && !isOtherProfile;

  const handleArchive = (postId: string) => {
    archivePostMutation.mutate(postId, {
      onSuccess: () => {
        toast({
          title: 'Archived',
          description: 'Post moved to your archive.',
          variant: 'success',
        });
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Could not archive post. Please try again.',
          variant: 'destructive',
        });
      },
    });
  };

  const handleUnarchive = (postId: string) => {
    unarchivePostMutation.mutate(postId, {
      onSuccess: () => {
        toast({
          title: 'Restored',
          description: 'Post restored back to your profile.',
          variant: 'success',
        });
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Could not restore post. Please try again.',
          variant: 'destructive',
        });
      },
    });
  };

  const handlePressStart = () => {
    setDidLongPress(false);
    if (!canEdit || !onToggleEdit) return;

    const timer = setTimeout(() => {
      setDidLongPress(true);
      onToggleEdit();
    }, 600);

    setPressTimer(timer);
  };

  const handlePressEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleVideoClick = (videoId: string) => {
    if (didLongPress) {
      setDidLongPress(false);
      return;
    }

    router.push(`/posts/single/${videoId}`);
  };

  const handleAction = () => {
    if (!postToDelete) return;

    if (activeTab === 'saved') {
      // Remove from saved
      toggleSaveMutation.mutate(postToDelete.id, {
        onSuccess: () => {
          toast({
            title: 'Removed',
            description: 'Video removed from saved list.',
          });
          setPostToDelete(null);
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Could not remove from saved. Please try again.',
            variant: 'destructive',
          });
        },
      });
    } else {
      // Delete post
      deletePostMutation.mutate(postToDelete.id, {
        onSuccess: () => {
          toast({
            title: 'Deleted',
            description: 'Post deleted successfully.',
          });
          setPostToDelete(null);
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Could not delete post. Please try again.',
            variant: 'destructive',
          });
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3'>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className='aspect-3/4 rounded-lg bg-[#2a2a2a] animate-pulse'
          />
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className='flex items-center justify-center py-16 text-zinc-500 text-sm'>
        {activeTab === 'archive' ? 'No archived posts yet' : 'No posts yet'}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3'>
      {posts.map((post) => (
        <div key={post.id} className='relative group'>
          <button
            onClick={() => !(canEdit && isEditing) && handleVideoClick(post.id)}
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            className={`relative w-full aspect-3/4 rounded-lg overflow-hidden group cursor-pointer bg-[#2a2a2a] border-0 ${
              canEdit && isEditing ? "cursor-default" : ""
            }`}
          >
            {/* Media Thumbnail */}
            <PostMediaThumbnail post={post} />

            {/* Hover overlay */}
            <div
              className={`absolute inset-0 bg-black/0 transition-all duration-200 ${
                !(canEdit && isEditing) ? 'group-hover:bg-black/30' : ''
              }`}
            />

            {/* Play count overlay */}
            <div className='absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-semibold z-10'>
              <Play size={14} fill='white' />
              <span>{formatCount(post.likeCount || post.likesCount || 0)}</span>
            </div>
          </button>

          {/* Edit, Archive & Delete Action Overlays (Only on own editable profile) */}
          {canEdit && isEditing && (
            <div className='absolute top-2 right-2 flex items-center gap-1.5 z-10'>
              {activeTab === 'archive' ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnarchive(post.id);
                  }}
                  title='Restore / Unarchive Post'
                  className='p-1.5 bg-[#001F3F] text-white rounded-full shadow-lg hover:bg-blue-900 transition-colors border-none cursor-pointer'>
                  <RotateCcw size={15} />
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArchive(post.id);
                  }}
                  title='Archive Post'
                  className='p-1.5 bg-[#001F3F] text-white rounded-full shadow-lg hover:bg-blue-900 transition-colors border-none cursor-pointer'>
                  <Archive size={15} />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/studio?edit=${post.id}`);
                }}
                title='Edit Post in Localbuka Studio'
                className='p-1.5 bg-[#fbbe15] text-[#141414] rounded-full shadow-lg hover:bg-amber-400 transition-colors border-none cursor-pointer'>
                <Pencil size={15} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPostToDelete(post);
                }}
                title='Delete Post'
                className='p-1.5 bg-red-600 rounded-full text-white shadow-lg hover:bg-red-700 transition-colors border-none cursor-pointer'>
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Confirmation Dialog */}
      <AlertDialog
        open={!!postToDelete}
        onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent className='bg-zinc-900 border-zinc-800 text-white'>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {activeTab === 'saved' ? 'Remove from saved?' : 'Delete post?'}
            </AlertDialogTitle>
            <AlertDialogDescription className='text-zinc-400'>
              {activeTab === 'saved'
                ? 'This will remove the video from your saved list.'
                : 'This action cannot be undone. This post will be permanently deleted.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='bg-transparent border-zinc-700 text-white hover:bg-zinc-800'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className='bg-red-600 text-white hover:bg-red-700 font-bold'>
              {activeTab === 'saved' ? 'Remove' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
