'use client';

import {useState, type ChangeEvent} from 'react';
import {MessageCircle, Send, ChevronDown} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {
  useBlogCommentsQuery,
  useCreateCommentMutation,
} from '@/lib/api/services/blog.hooks';
import CommentItem from './CommentItem';
import {useUser} from '@/lib/hooks/use-user';
import {isUserAuthenticated} from '@/lib/auth';
import {useRouter, usePathname} from 'next/navigation';
import {useToast} from '@/hooks/use-toast';
import {Loader2} from 'lucide-react';

interface CommentSectionProps {
  blogId: string;
}

const COMMENTS_PER_PAGE = 10;

// Helper to count all comments including nested replies
const countAllReplies = (replies: any[]): number => {
  if (!replies || replies.length === 0) return 0;
  return replies.reduce((acc, reply) => {
    return acc + 1 + countAllReplies(reply.replies || []);
  }, 0);
};

const countTotalComments = (comments: any[]): number => {
  if (!comments || comments.length === 0) return 0;
  return comments.reduce((acc, comment) => {
    return acc + 1 + countAllReplies(comment.replies || []);
  }, 0);
};

const CommentSection = ({blogId}: CommentSectionProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const {toast} = useToast();
  
  const [comment, setComment] = useState('');
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);
  
  // Queries & Mutations
  const {data: commentsResponse, isLoading} = useBlogCommentsQuery(blogId);
  const createCommentMutation = useCreateCommentMutation();
  
  const allComments = commentsResponse?.data?.data?.docs || [];
  const totalCount = countTotalComments(allComments); // Count all comments + replies
  const comments = allComments.slice(0, visibleCount);
  const hasMoreComments = visibleCount < allComments.length;
  const {user} = useUser();

  const handleAuthCheck = () => {
    if (!isUserAuthenticated()) {
      router.push(`/signin?redirect=${pathname}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!handleAuthCheck()) return;
    if (!comment.trim()) return;

    try {
      const response = await createCommentMutation.mutateAsync({
        blogId,
        data: {comment},
      });
      setComment('');
      toast({
        title: 'Success',
        description: response.message || 'Your comment has been added successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to post comment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='max-w-3xl mx-auto mt-16 pt-10 border-t border-gray-200 dark:border-gray-800'>
      <div className='flex items-center gap-2 mb-8'>
        <h3 className='text-xl font-bold text-[#0A1F44] dark:text-white'>
          Comments
        </h3>
        <span className='bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full'>
          {totalCount}
        </span>
      </div>

      {/* Comment Form */}
      <div className='flex gap-4 mb-10'>
        <Avatar className='w-10 h-10'>
          <AvatarImage src={user?.image_url} />
          <AvatarFallback className='text-lg uppercase font-semibold'>
            {user ? (user.first_name ? user.first_name[0] : user.fullName?.[0] || '?') : '?'}
          </AvatarFallback>
        </Avatar>
        <div className='flex-1 space-y-3'>
          <Textarea
            placeholder='Share your thoughts...'
            value={comment}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
            className='min-h-[100px] resize-none bg-white dark:bg-gray-800'
          />
          <div className='flex justify-end'>
            <Button 
              onClick={handleSubmit} 
              disabled={!comment.trim() || createCommentMutation.isPending}
              className='bg-primary text-white hover:bg-primary/90'>
              {createCommentMutation.isPending ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Posting...
                </>
              ) : (
                <>
                  Post Comment
                  <Send className='w-4 h-4 ml-2' />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className='flex justify-center py-10'>
          <Loader2 className='w-8 h-8 animate-spin text-primary' />
        </div>
      ) : allComments.length > 0 ? (
        <div className='space-y-6 border rounded-xl p-2'>
          {comments.map((comment, index, {length}) => (
            <CommentItem key={comment.id} comment={comment} blogId={blogId} index={index} length={length} />
          ))}
          
          {/* Read More Comments Button */}
          {hasMoreComments && (
            <div className='flex justify-center pt-4 border-t border-gray-100 dark:border-gray-700'>
              <Button
                variant='ghost'
                onClick={() => setVisibleCount(prev => prev + COMMENTS_PER_PAGE)}
                className='text-primary hover:text-primary/80'>
                <ChevronDown className='w-4 h-4 mr-2' />
                Read More Comments ({allComments.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className='text-center py-10 bg-gray-50 dark:bg-gray-900 rounded-xl'>
          <MessageCircle className='w-10 h-10 text-gray-300 mx-auto mb-3' />
          <p className='text-gray-500'>No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
