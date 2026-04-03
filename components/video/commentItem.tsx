import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Trash2, MoreHorizontal } from "lucide-react";
import type { PostComment } from "@/types/post";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useDeleteComment } from "@/lib/api/services/posts.hooks";
import { useMe } from "@/lib/api/services/auth.hooks";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CommentItemProps {
  comment: PostComment;
  onReplyClick?: (commentId: string, username: string) => void;
  isReply?: boolean;
}

export default function CommentItem({ comment, onReplyClick, isReply = false }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: me } = useMe();
  const deleteCommentMutation = useDeleteComment();

  const isAuthor = me?.data?.id === comment.userId;
  const isLongComment = comment.text.length > 150;
  const displayedComment = isLongComment && !isExpanded 
    ? comment.text.slice(0, 150) + "..." 
    : comment.text;

  // Fallback to current date or specific string if not valid
  let timeAgo = "Just now";
  try {
    if (comment.createdAt) {
      timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
    }
  } catch (e) {
    // ignore
  }

  const handleDelete = () => {
    deleteCommentMutation.mutate({ 
      postId: (comment as any).postId || "", 
      commentId: comment.id 
    });
  };

  const avatarSrc = comment.user?.avatar || comment.user?.profilePicture || "/images/profile.png";
  const username = comment.user?.fullName || comment.user?.username || "Unknown User";
  const initial = username !== "Unknown User" ? username.charAt(0).toUpperCase() : "U";

  const replies = comment.replies || [];
  const hasReplies = replies && replies.length > 0;
  const initialRepliesCount = 3;
  const [repliesLimit, setRepliesLimit] = useState(initialRepliesCount);
  const visibleReplies = replies.slice(0, repliesLimit);
  const hasMoreReplies = replies.length > repliesLimit;

  return (
    <div className={cn("flex flex-col text-white transition-colors", !isReply && "border-b border-neutral-800/50 py-4")}>
      <div className="flex items-start gap-3 px-3">
        {/* Avatar */}
        <Avatar className={cn("shrink-0", isReply ? "h-6 w-6" : "h-10 w-10")}>
          {avatarSrc ? (
            <AvatarImage src={avatarSrc} />
          ) : (
            <AvatarFallback className="text-black bg-neutral-200">{initial}</AvatarFallback>
          )}
        </Avatar>

        {/* Comment Content */}
        <div className="flex flex-col flex-1">
          {/* Row: Name + Time + Heart */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-neutral-400">{username}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {isAuthor && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button 
                      className="text-neutral-500 hover:text-red-500 transition-colors p-1"
                      disabled={deleteCommentMutation.isPending}
                    >
                      <Trash2 size={14} />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#1f1f1f] border-[#3a3a3a] text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete comment?</AlertDialogTitle>
                      <AlertDialogDescription className="text-neutral-400">
                        Are you sure you want to delete this comment? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-transparent border-[#3a3a3a] text-white hover:bg-[#333] hover:text-white">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600 text-white border-none"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              {/* <Heart
                size={16}
                strokeWidth={1.5}
                className="text-neutral-500 hover:text-white cursor-pointer transition-colors"
              /> */}
            </div>
          </div>

          {/* Text */}
          <div className="text-sm mt-1 mb-1 leading-snug">
            {displayedComment}
            {isLongComment && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-1 text-neutral-400 font-medium hover:text-white"
              >
                {isExpanded ? "less" : "more"}
              </button>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-4 mt-1.5 px-0.5">
            <span className="text-[11px] text-neutral-400 shrink-0">{timeAgo}</span>
            
            {/* Reply Button */}
            {onReplyClick && (
              <button 
                onClick={() => onReplyClick(comment.id, username)}
                className="text-xs text-neutral-400 hover:text-white transition-colors font-semibold"
              >
                Reply
              </button>
            )}

            {/* Replies Toggle (if any) */}
            {hasReplies && (
              <button 
                onClick={() => setShowReplies(!showReplies)}
                className="text-xs text-neutral-400 font-semibold flex items-center gap-1 hover:text-neutral-300 transition-colors ml-auto"
              >
                {showReplies ? "Hide ▲" : `${replies.length} replies ▼`}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Render Nested Replies */}
      {showReplies && hasReplies && (
        <div className="pl-14 pr-3 pt-2 flex flex-col gap-3">
          {visibleReplies.map((reply) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              isReply={true} 
              onReplyClick={onReplyClick}
            />
          ))}
          
          {hasMoreReplies && (
            <button 
              onClick={() => setRepliesLimit(prev => prev + 10)}
              className="text-xs text-neutral-400 font-semibold hover:text-neutral-300 w-fit mt-1"
            >
              View more replies ({replies.length - repliesLimit})
            </button>
          )}
        </div>
      )}
    </div>
  );
}

