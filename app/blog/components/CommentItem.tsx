'use client';

import {useState, type ChangeEvent} from 'react';
import {formatDistanceToNow} from 'date-fns';
import {ThumbsUp, Reply as ReplyIcon, ChevronDown} from 'lucide-react';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import type {Comment, Reply} from '@/lib/api/services/blog.service';
import {
  useLikeCommentMutation,
  useReplyCommentMutation,
} from '@/lib/api/services/blog.hooks';
import {isUserAuthenticated} from '@/lib/auth';
import {useRouter, usePathname} from 'next/navigation';
import {useToast} from '@/hooks/use-toast';

const REPLIES_PER_PAGE = 5;

// Helper to get display name from user object (handles both fullName and first_name/last_name)
const getDisplayName = (user?: { first_name?: string; last_name?: string; fullName?: string }) => {
  if (!user) return 'User';
  if (user.fullName) return user.fullName;
  if (user.first_name || user.last_name) {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim();
  }
  return 'User';
};

// Helper to get avatar initial from user object
const getAvatarInitial = (user?: { first_name?: string; last_name?: string; fullName?: string }) => {
  if (!user) return 'U';
  if (user.fullName) {
    const firstName = user.fullName.split(' ')[0];
    return firstName?.[0]?.toUpperCase() || 'U';
  }
  return user.first_name?.[0]?.toUpperCase() || 'U';
};

// Recursive ReplyItem component for unlimited nesting
interface ReplyItemProps {
  reply: Reply;
  blogId: string;
  depth: number;
}

const ReplyItem = ({reply, blogId, depth}: ReplyItemProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const {toast} = useToast();
  
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [visibleReplies, setVisibleReplies] = useState(REPLIES_PER_PAGE);
  
  const likeCommentMutation = useLikeCommentMutation();
  const replyCommentMutation = useReplyCommentMutation();
  
  const nestedReplies = reply.replies || [];
  const displayedReplies = nestedReplies.slice(0, visibleReplies);
  const hasMoreReplies = visibleReplies < nestedReplies.length;

  const handleAuthCheck = () => {
    if (!isUserAuthenticated()) {
      router.push(`/signin?redirect=${pathname}`);
      return false;
    }
    return true;
  };

  const handleLike = () => {
    if (reply.is_liked) return;
    if (!handleAuthCheck()) return;
    likeCommentMutation.mutate({commentId: reply.id.toString(), blogId});
  };

  const toggleReply = () => {
    if (!handleAuthCheck()) return;
    setIsReplying(!isReplying);
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;
    
    try {
      const response = await replyCommentMutation.mutateAsync({
        blogId,
        commentId: reply.id.toString(),
        data: {comment: replyContent},
      });
      setReplyContent('');
      setIsReplying(false);
      toast({
        title: 'Success',
        description: response.message || 'Your reply has been added successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to post reply. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='flex gap-3 pt-3'>
      <Avatar className='w-8 h-8 shrink-0'>
        <AvatarImage src={reply.author?.image_url} alt={getDisplayName(reply.author)} />
        <AvatarFallback className='text-xs'>
          {getAvatarInitial(reply.author)}
        </AvatarFallback> 
      </Avatar>
      
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 mb-1'>
          <span className='font-semibold text-xs text-[#0A1F44] dark:text-white'>
            {getDisplayName(reply.author)}
          </span>
          <span className='text-[10px] text-gray-500'>
            {formatDistanceToNow(new Date(reply.created_at), {addSuffix: true})}
          </span>
        </div>
        <p className='text-sm text-gray-600 dark:text-gray-300 mb-2'>
          {reply.comment}
        </p>
        
        {/* Actions */}
        <div className='flex items-center gap-4 mb-2'>
          <button
            onClick={handleLike}
            disabled={!!reply.is_liked}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              reply.is_liked || Number(reply.like_counts) > 0 ? 'text-primary' : 'text-gray-500 hover:text-primary'
            } ${reply.is_liked ? 'cursor-not-allowed' : ''}`}>
            <ThumbsUp className={`w-3 h-3 ${reply.is_liked || Number(reply.like_counts) > 0 ? 'fill-primary' : ''}`} />
            {Number(reply.like_counts) > 0 && <span>{reply.like_counts}</span>}
            Like
          </button>
          
          <button
            onClick={toggleReply}
            className='flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary transition-colors'>
            <ReplyIcon className='w-3 h-3' />
            Reply
          </button>
        </div>
        
        {/* Reply Form */}
        {isReplying && (
          <div className='mb-4 space-y-2'>
            <Textarea
              placeholder='Write a reply...'
              value={replyContent}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReplyContent(e.target.value)}
              className='min-h-[60px] text-sm resize-none'
            />
            <div className='flex justify-end gap-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsReplying(false)}>
                Cancel
              </Button>
              <Button
                size='sm'
                onClick={handleSubmitReply}
                disabled={!replyContent.trim() || replyCommentMutation.isPending}>
                {replyCommentMutation.isPending ? 'Posting...' : 'Reply'}
              </Button>
            </div>
          </div>
        )}
        
        {/* Nested Replies - Recursive */}
        {displayedReplies.length > 0 && (
          <div className='pl-3 border-l-2 border-gray-100 dark:border-gray-700 space-y-2'>
            {displayedReplies.map((nestedReply) => (
              <ReplyItem 
                key={nestedReply.id} 
                reply={nestedReply} 
                blogId={blogId} 
                depth={depth + 1} 
              />
            ))}
            
            {/* Read More Replies Button */}
            {hasMoreReplies && (
              <button
                onClick={() => setVisibleReplies(prev => prev + REPLIES_PER_PAGE)}
                className='flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium py-1'>
                <ChevronDown className='w-3 h-3' />
                Read more replies ({nestedReplies.length - visibleReplies} remaining)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Main CommentItem component (for top-level comments)
interface CommentItemProps {
  comment: Comment;
  blogId: string;
  index: number;
  length: number;
}

const CommentItem = ({comment, blogId, index, length}: CommentItemProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const {toast} = useToast();
  
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [visibleReplies, setVisibleReplies] = useState(REPLIES_PER_PAGE);
  
  const likeCommentMutation = useLikeCommentMutation();
  const replyCommentMutation = useReplyCommentMutation();
  
  const replies = comment.replies || [];
  const displayedReplies = replies.slice(0, visibleReplies);
  const hasMoreReplies = visibleReplies < replies.length;

  const handleAuthCheck = () => {
    if (!isUserAuthenticated()) {
      router.push(`/signin?redirect=${pathname}`);
      return false;
    }
    return true;
  };

  const handleLike = () => {
    if (comment.is_liked) return;
    if (!handleAuthCheck()) return;
    likeCommentMutation.mutate({commentId: comment.id.toString(), blogId});
  };

  const toggleReply = () => {
    if (!handleAuthCheck()) return;
    setIsReplying(!isReplying);
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;
    
    try {
      const response = await replyCommentMutation.mutateAsync({
        blogId,
        commentId: comment.id.toString(),
        data: {comment: replyContent},
      });
      setReplyContent('');
      setIsReplying(false);
      toast({
        title: 'Success',
        description: response.message || 'Your reply has been added successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to post reply. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={`flex gap-4 p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mb-4 ${index === length-1 ? '' : 'border-b'}`}>
      <Avatar className='w-10 h-10 shrink-0'>
        <AvatarImage src={comment.author?.image_url} alt={getDisplayName(comment.author)} />
        <AvatarFallback>
          {getAvatarInitial(comment.author)}
        </AvatarFallback>
      </Avatar>

      <div className='flex-1 min-w-0'>
        {/* Header */}
        <div className='flex items-center gap-2 mb-1'>
          <span className='font-semibold text-sm text-[#0A1F44] dark:text-white'>
            {getDisplayName(comment.author)}
          </span>
          <span className='text-xs text-gray-500'>
            {formatDistanceToNow(new Date(comment.created_at), {addSuffix: true})}
          </span>
        </div>

        {/* Content */}
        <p className='text-sm text-gray-700 dark:text-gray-300 mb-3'>
          {comment.comment}
        </p>

        {/* Actions */}
        <div className='flex items-center gap-4 mb-4'>
          <button
            onClick={handleLike}
            disabled={!!comment.is_liked}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              comment.is_liked || Number(comment.like_counts) > 0 ? 'text-primary' : 'text-gray-500 hover:text-primary'
            } ${comment.is_liked ? 'cursor-not-allowed' : ''}`}>
            <ThumbsUp className={`w-3.5 h-3.5 ${comment.is_liked || Number(comment.like_counts) > 0 ? 'fill-primary' : ''}`} />
            {Number(comment.like_counts) > 0 && <span>{comment.like_counts}</span>}
            Like
          </button>
          
          <button
            onClick={toggleReply}
            className='flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary transition-colors'>
            <ReplyIcon className='w-3.5 h-3.5' />
            Reply
          </button>
        </div>

        {/* Reply Form */}
        {isReplying && (
          <div className='mb-6 space-y-3'>
            <Textarea
              placeholder='Write a reply...'
              value={replyContent}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReplyContent(e.target.value)}
              className='min-h-[80px] text-sm resize-none'
            />
            <div className='flex justify-end gap-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsReplying(false)}>
                Cancel
              </Button>
              <Button
                size='sm'
                onClick={handleSubmitReply}
                disabled={!replyContent.trim() || replyCommentMutation.isPending}>
                {replyCommentMutation.isPending ? 'Posting...' : 'Reply'}
              </Button>
            </div>
          </div>
        )}

        {/* Nested Replies with Pagination */}
        {displayedReplies.length > 0 && (
          <div className='pl-4 border-l-2 border-gray-100 dark:border-gray-700 space-y-2'>
            {displayedReplies.map((reply) => (
              <ReplyItem 
                key={reply.id} 
                reply={reply} 
                blogId={blogId} 
                depth={1} 
              />
            ))}
            
            {/* Read More Replies Button */}
            {hasMoreReplies && (
              <button
                onClick={() => setVisibleReplies(prev => prev + REPLIES_PER_PAGE)}
                className='flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium py-2'>
                <ChevronDown className='w-3 h-3' />
                Read more replies ({replies.length - visibleReplies} remaining)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;

