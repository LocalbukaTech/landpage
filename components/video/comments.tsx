"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import CommentItem from "@/components/video/commentItem";
import CommentInput from "@/components/video/commentInput";
import { X, Loader2 } from "lucide-react";
import { useComments, useAddComment, useReplyToComment } from "@/lib/api/services/posts.hooks";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useState, useEffect } from "react";
import type { PostComment } from "@/types/post";

interface CommentsProps {
  postId: string | null;
  open: boolean;
  onClose: () => void;
}

export default function Comments({
  postId,
  open,
  onClose,
}: CommentsProps) {
  const { requireAuth } = useRequireAuth();
  
  // Fetch comments only when a valid postId is passed and drawer is open
  // We use enabled: !!postId && open to prevent fetching unnecessarily
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [allComments, setAllComments] = useState<PostComment[]>([]);

  const { data: commentsResponse, isLoading, isError, isFetching } = useComments(postId as string, { 
    page, 
    pageSize 
  });
  
  // Reconstruct the tree from the flat list returned by the API
  const buildCommentTree = (comments: PostComment[]) => {
    const commentMap = new Map<string, PostComment>();
    const roots: PostComment[] = [];

    // First pass: map all comments and initialize empty replies to avoid duplication
    comments.forEach(c => {
      commentMap.set(c.id, { ...c, replies: [] });
    });

    // Second pass: attach children to parents
    comments.forEach(c => {
      const commentInMap = commentMap.get(c.id)!;
      if (c.parentId && commentMap.has(c.parentId)) {
        const parent = commentMap.get(c.parentId)!;
        // Check if already added to avoid duplicates
        if (!parent.replies.some(r => r.id === c.id)) {
          parent.replies.push(commentInMap);
        }
      } else if (c.parentId === null) {
        roots.push(commentInMap);
      }
    });

    return roots;
  };

  const topLevelComments = buildCommentTree(allComments);
  
  // Append new comments when they are fetched
  useEffect(() => {
    if (commentsResponse?.data) {
      if (page === 1) {
        setAllComments(commentsResponse.data);
      } else {
        setAllComments(prev => {
          // Filter out duplicates just in case
          const existingIds = new Set(prev.map(c => c.id));
          const newComments = commentsResponse.data.filter(c => !existingIds.has(c.id));
          return [...prev, ...newComments];
        });
      }
    }
  }, [commentsResponse, page]);

  // Reset when postId changes or drawer opens
  useEffect(() => {
    if (open) {
      setPage(1);
    }
  }, [postId, open]);

  const hasMore = commentsResponse ? allComments.length < commentsResponse.total : false;
  
  const handleLoadMore = () => {
    if (hasMore && !isFetching) {
      setPage(prev => prev + 1);
    }
  };
  
  const addCommentMutation = useAddComment();
  const replyMutation = useReplyToComment();

  // State to track if we are replying to a specific comment
  const [replyingTo, setReplyingTo] = useState<{ id: string; username: string } | null>(null);

  const handleSend = (text: string) => {
    requireAuth(() => {
      if (!postId) return;

      if (replyingTo) {
        replyMutation.mutate({
          postId,
          commentId: replyingTo.id,
          comment: text
        }, {
          onSuccess: () => setReplyingTo(null)
        });
      } else {
        addCommentMutation.mutate({
          postId,
          comment: text
        });
      }
    });
  };

  const clearReplyState = () => {
    setReplyingTo(null);
  };

  return (
    <Drawer
      direction="right"
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          clearReplyState();
          onClose();
        }
      }}
    >
      <DrawerContent className="w-[95vw] md:w-[400px] max-w-sm flex flex-col bg-[#1f1f1f] text-white border border-[#3a3a3a] h-full rounded-none">
        
        <DrawerHeader className="border-b border-[#3a3a3a] shrink-0">
          <div className="flex items-center justify-between w-full h-8">
            <DrawerTitle className="text-lg font-semibold text-white">
              Comments {commentsResponse?.total ? `(${commentsResponse.total})` : ''}
            </DrawerTitle>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#333] rounded-full transition-colors"
              aria-label="Close comments"
            >
              <X size={20} />
            </button>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto bg-[#242424]">
          {isLoading && (
            <div className="flex items-center justify-center p-8 text-neutral-400">
              <Loader2 className="animate-spin w-6 h-6 mr-2" />
              <span>Loading comments...</span>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center p-8 text-neutral-500 text-sm">
              <p>Failed to load comments.</p>
            </div>
          )}

          {!isLoading && !isError && allComments.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-neutral-500 text-sm h-full">
              <p>No comments yet.</p>
              <p>Be the first to comment!</p>
            </div>
          )}

          {!isLoading && !isError && topLevelComments.length > 0 && (
            <div className="pb-4">
              {topLevelComments.map((c) => (
                <CommentItem 
                  key={c.id} 
                  comment={c} 
                  onReplyClick={(id, username) => setReplyingTo({ id, username })}
                />
              ))}

              {hasMore && (
                <div className="flex justify-center py-4">
                  <button 
                    onClick={handleLoadMore}
                    disabled={isFetching}
                    className="text-sm font-semibold text-[#fbbe15] hover:text-[#e5ac10] transition-colors disabled:opacity-50"
                  >
                    {isFetching ? "Loading more..." : "Load more comments"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reply indicator & Input combined container */}
        <div className="mt-auto shrink-0 w-full mb- bezpieczna-strefa">
          <CommentInput 
            onSend={handleSend} 
            replyingTo={replyingTo}
            onCancelReply={clearReplyState}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
