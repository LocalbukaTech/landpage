'use client';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import CommentItem from '@/components/video/commentItem';
import CommentInput from '@/components/video/commentInput';
import {X, Loader2} from 'lucide-react';
import {
  useComments,
  useAddComment,
  useReplyToComment,
} from '@/lib/api/services/posts.hooks';
import {useRequireAuth} from '@/hooks/useRequireAuth';
import {useState, useEffect, useRef, useMemo} from 'react';
import type {PostComment} from '@/types/post';

interface CommentsProps {
  postId: string | null;
  open: boolean;
  onClose: () => void;
}

/**
 * Detects mobile viewport (< 768px).
 * Uses a lazy useState initializer so the correct value is available on the
 * very first render (no cascading setState-in-effect). The effect only
 * attaches the resize listener for subsequent viewport changes.
 */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 767px)').matches;
  });
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

export default function Comments({postId, open, onClose}: CommentsProps) {
  const {requireAuth} = useRequireAuth();
  const isMobile = useIsMobile();

  // ─── Pagination ───────────────────────────────────────────────────────────
  // Track previous postId/open so we can reset to page 1 during render
  // (render-time setState is React's recommended pattern for derived resets
  //  and does NOT trigger cascading renders the way useEffect does).
  const prevPostIdRef = useRef(postId);
  const prevOpenRef = useRef(open);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  if (prevPostIdRef.current !== postId || (!prevOpenRef.current && open)) {
    prevPostIdRef.current = postId;
    prevOpenRef.current = open;
    if (page !== 1) setPage(1);
  }

  const {
    data: commentsResponse,
    isLoading,
    isError,
    isFetching,
  } = useComments(postId as string, {
    page,
    pageSize,
  });

  // ─── Comment accumulation ─────────────────────────────────────────────────
  // Store each fetched page in a ref (mutation in render is fine for refs and
  // avoids setState-in-effect). useMemo re-derives the flat list whenever
  // commentsResponse or page changes (which already triggers a re-render via
  // React Query's state update).
  const commentPagesRef = useRef<Map<number, PostComment[]>>(new Map());
  const lastPostIdRef = useRef(postId);

  if (lastPostIdRef.current !== postId) {
    lastPostIdRef.current = postId;
    commentPagesRef.current = new Map();
  }

  if (commentsResponse?.data) {
    commentPagesRef.current.set(page, commentsResponse.data);
  }

  const allComments = useMemo(() => {
    const entries = [...commentPagesRef.current.entries()].sort(
      ([a], [b]) => a - b,
    );
    return entries.flatMap(([, data]) => data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentsResponse, page]);

  // ─── Comment tree ─────────────────────────────────────────────────────────
  const topLevelComments = useMemo(() => {
    const commentMap = new Map<string, PostComment>();
    allComments.forEach((c) => commentMap.set(c.id, {...c, replies: []}));
    const roots: PostComment[] = [];
    allComments.forEach((c) => {
      const node = commentMap.get(c.id)!;
      if (c.parentId && commentMap.has(c.parentId)) {
        const parent = commentMap.get(c.parentId)!;
        if (!parent.replies.some((r) => r.id === c.id))
          parent.replies.push(node);
      } else if (c.parentId === null) {
        roots.push(node);
      }
    });
    return roots;
  }, [allComments]);

  const hasMore = commentsResponse
    ? allComments.length < commentsResponse.total
    : false;

  const handleLoadMore = () => {
    if (hasMore && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  const addCommentMutation = useAddComment();
  const replyMutation = useReplyToComment();

  // State to track if we are replying to a specific comment
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    username: string;
  } | null>(null);

  const handleSend = (text: string) => {
    requireAuth(() => {
      if (!postId) return;

      if (replyingTo) {
        replyMutation.mutate(
          {
            postId,
            commentId: replyingTo.id,
            comment: text,
          },
          {
            onSuccess: () => setReplyingTo(null),
          },
        );
      } else {
        addCommentMutation.mutate({
          postId,
          comment: text,
        });
      }
    });
  };

  const clearReplyState = () => {
    setReplyingTo(null);
  };

  return (
    <Drawer
      direction={isMobile ? 'bottom' : 'right'}
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          clearReplyState();
          onClose();
        }
      }}>
      <DrawerContent
        className={
          isMobile
            ? 'h-[80vh]! max-h-[80vh]! mt-0! w-full flex flex-col bg-[#1f1f1f] text-white border-t border-[#3a3a3a] rounded-t-2xl'
            : 'w-[400px]! max-w-[400px]! h-full! flex flex-col bg-[#1f1f1f] text-white border border-[#3a3a3a] rounded-none'
        }>
        <DrawerHeader className='border-b border-[#3a3a3a] shrink-0'>
          <div className='flex items-center justify-between w-full h-8'>
            <DrawerTitle className='text-lg font-semibold text-white'>
              Comments{' '}
              {commentsResponse?.total ? `(${commentsResponse.total})` : ''}
            </DrawerTitle>

            <button
              onClick={onClose}
              className='p-1.5 hover:bg-[#333] rounded-full transition-colors'
              aria-label='Close comments'>
              <X size={20} />
            </button>
          </div>
        </DrawerHeader>

        <div className='flex-1 overflow-y-auto bg-[#242424]'>
          {isLoading && (
            <div className='flex items-center justify-center p-8 text-neutral-400'>
              <Loader2 className='animate-spin w-6 h-6 mr-2' />
              <span>Loading comments...</span>
            </div>
          )}

          {isError && (
            <div className='flex flex-col items-center justify-center p-8 text-neutral-500 text-sm'>
              <p>Failed to load comments.</p>
            </div>
          )}

          {!isLoading && !isError && allComments.length === 0 && (
            <div className='flex flex-col items-center justify-center p-8 text-neutral-500 text-sm h-full'>
              <p>No comments yet.</p>
              <p>Be the first to comment!</p>
            </div>
          )}

          {!isLoading && !isError && topLevelComments.length > 0 && (
            <div className='pb-4'>
              {topLevelComments.map((c) => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  onReplyClick={(id, username) => setReplyingTo({id, username})}
                  postId={postId ?? undefined}
                />
              ))}

              {hasMore && (
                <div className='flex justify-center py-4'>
                  <button
                    onClick={handleLoadMore}
                    disabled={isFetching}
                    className='text-sm font-semibold text-[#fbbe15] hover:text-[#e5ac10] transition-colors disabled:opacity-50'>
                    {isFetching ? 'Loading more...' : 'Load more comments'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reply indicator & Input combined container */}
        <div className='mt-auto shrink-0 w-full'>
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
