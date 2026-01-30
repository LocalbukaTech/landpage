'use client';

import {useState, useEffect} from 'react';
import {
  FileText,
  Search,
  Plus,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  FileEdit,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {useToast} from '@/hooks/use-toast';
import {useBlogsQuery, useDeleteBlogMutation} from '@/lib/api';
import {getDrafts, deleteDraft as removeDraft, type BlogDraft} from '@/lib/blog-drafts';

const PAGE_SIZE = 6;

const BlogListPage = () => {
  const {toast} = useToast();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [deletePostTitle, setDeletePostTitle] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  // Draft state
  const [showDrafts, setShowDrafts] = useState(false);
  const [drafts, setDrafts] = useState<BlogDraft[]>([]);
  const [deleteDraftId, setDeleteDraftId] = useState<string | null>(null);

  // API hooks
  const {data: blogsData, isLoading, refetch} = useBlogsQuery({
    page,
    size: PAGE_SIZE,
  });
  const deleteBlogMutation = useDeleteBlogMutation();

  // Load drafts on mount
  useEffect(() => {
    setDrafts(getDrafts());
  }, [showDrafts]);

  const blogs = blogsData?.data?.data?.docs || [];
  const totalPages = blogsData?.data?.data?.total_pages || 1;

  // Filter blogs based on search
  const filteredBlogs = blogs.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter drafts based on search
  const filteredDrafts = drafts.filter(
    (draft) =>
      draft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      draft.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deletePostId) return;
    
    try {
      await deleteBlogMutation.mutateAsync(deletePostId);
      toast({
        title: 'Blog post deleted',
        description: 'The blog post has been deleted successfully.',
      });
      refetch();
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Failed to delete the blog post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletePostId(null);
      setDeletePostTitle('');
    }
  };

  const handleDeleteDraft = () => {
    if (!deleteDraftId) return;
    removeDraft(deleteDraftId);
    setDrafts(getDrafts());
    toast({
      title: 'Draft deleted',
      description: 'The draft has been deleted successfully.',
    });
    setDeleteDraftId(null);
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground mb-2'>
            Blog Posts
          </h1>
          <p className='text-muted-foreground'>
            Manage and create blog articles for LocalBuka
          </p>
        </div>
        <Link href='/secure-admin/blog/create'>
          <Button className='bg-primary hover:bg-primary/90 text-white'>
            <Plus className='w-2 h-4 mr-2' />
            Add BlogPost
          </Button>
        </Link>
      </div>

      {/* Search + Drafts Toggle */}
      <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4'>
        <div className='flex flex-col sm:flex-row gap-3'>
          {/* Search */}
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
            <input
              type='text'
              placeholder='Search by title or category...'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className='w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent'
            />
          </div>
          
          {/* Drafts Toggle */}
          <Button
            variant={showDrafts ? 'default' : 'outline'}
            onClick={() => setShowDrafts(!showDrafts)}
            className={showDrafts ? 'bg-primary' : ''}>
            <FileEdit className='w-4 h-4 mr-2' />
            Drafts
            {drafts.length > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                showDrafts ? 'bg-white text-primary' : 'bg-primary text-white'
              }`}>
                {drafts.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && !showDrafts && (
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='w-8 h-8 animate-spin text-primary' />
        </div>
      )}

      {/* Drafts View */}
      {showDrafts && (
        <>
          {filteredDrafts.length === 0 ? (
            <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center'>
              <FileEdit className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
              <h3 className='text-xl font-semibold text-foreground mb-2'>
                No drafts found
              </h3>
              <p className='text-muted-foreground mb-6'>
                Drafts you save will appear here
              </p>
            </div>
          ) : (
            <div className='bg-[#FFF9E8] dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredDrafts.map((draft) => (
                  <div
                    key={draft.id}
                    className='bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
                    {/* Image */}
                    <div className='relative aspect-4/3 bg-gray-100 dark:bg-gray-700'>
                      {draft.coverImage ? (
                        <Image
                          src={draft.coverImage}
                          alt={draft.title || 'Draft'}
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <div className='flex items-center justify-center h-full'>
                          <FileEdit className='w-12 h-12 text-gray-400' />
                        </div>
                      )}
                      <div className='absolute top-3 left-3 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded'>
                        Draft
                      </div>
                    </div>

                    {/* Content */}
                    <div className='p-4'>
                      {/* Date */}
                      <div className='flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-2'>
                        <Calendar className='w-3.5 h-3.5' />
                        {formatDate(draft.updatedAt)}
                      </div>

                      {/* Title with menu */}
                      <div className='flex items-start justify-between gap-2 mb-2'>
                        <h3 className='font-bold text-[#0A1F44] dark:text-white leading-tight line-clamp-2 flex-1'>
                          {draft.title || '[Untitled]'}
                        </h3>
                        <div className='relative'>
                          <button
                            onClick={() => toggleMenu(draft.id)}
                            className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'>
                            <MoreVertical className='w-5 h-5 text-gray-500' />
                          </button>

                          {/* Dropdown Menu */}
                          {openMenuId === draft.id && (
                            <>
                              <div
                                className='fixed inset-0 z-10'
                                onClick={() => setOpenMenuId(null)}
                              />
                              <div className='absolute right-0 bottom-8 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 py-1'>
                                <Link
                                  href={`/secure-admin/blog/create?draft=${draft.id}`}
                                  className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'>
                                  <Pencil className='w-4 h-4' />
                                  Continue Editing
                                </Link>
                                <button
                                  onClick={() => {
                                    setDeleteDraftId(draft.id);
                                    setOpenMenuId(null);
                                  }}
                                  className='flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full'>
                                  <Trash2 className='w-4 h-4' />
                                  Delete Draft
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Category Tag */}
                      {draft.category && (
                        <div className='mt-3'>
                          <span className='inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded'>
                            {draft.category}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Published Blog Posts Grid */}
      {!showDrafts && !isLoading && (
        <>
          {filteredBlogs.length === 0 ? (
            <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center'>
              <FileText className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
              <h3 className='text-xl font-semibold text-foreground mb-2'>
                No blog posts found
              </h3>
              <p className='text-muted-foreground mb-6'>
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Create your first blog post to get started'}
              </p>
              {!searchQuery && (
                <Link href='/secure-admin/blog/create'>
                  <Button className='bg-primary hover:bg-primary/90 text-white'>
                    <Plus className='w-4 h-4 mr-2' />
                    Create Blog Post
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className='bg-[#FFF9E8] dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredBlogs.map((post) => (
                  <div
                    key={post.id}
                    className='bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
                    {/* Image */}
                    <div className='relative aspect-4/3'>
                      {post.image_url ? (
                        <Image
                          src={post.image_url}
                          alt={post.title}
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <div className='flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700'>
                          <FileText className='w-12 h-12 text-gray-400' />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className='p-4'>
                      {/* Date */}
                      <div className='flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-2'>
                        <Calendar className='w-3.5 h-3.5' />
                        {formatDate(post.created_at)}
                      </div>

                      {/* Title with menu */}
                      <div className='flex items-start justify-between gap-2 mb-2'>
                        <h3 className='font-bold text-[#0A1F44] dark:text-white leading-tight line-clamp-2 flex-1'>
                          {post.title}
                        </h3>
                        <div className='relative'>
                          <button
                            onClick={() => toggleMenu(String(post.id))}
                            className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'>
                            <MoreVertical className='w-5 h-5 text-gray-500' />
                          </button>

                          {/* Dropdown Menu */}
                          {openMenuId === String(post.id) && (
                            <>
                              <div
                                className='fixed inset-0 z-10'
                                onClick={() => setOpenMenuId(null)}
                              />
                              <div className='absolute right-0 bottom-8 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 py-1'>
                                <Link
                                  href={`/blog/${post.slug}`} // View public (slug in URL is fine for SEO, but ID is what matters)
                                  target='_blank'
                                  className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'>
                                  <Eye className='w-4 h-4' />
                                  View
                                </Link>
                                <Link
                                  href={`/secure-admin/blog/edit/${post.id}`} // Edit using ID
                                  className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'>
                                  <Pencil className='w-4 h-4' />
                                  Edit
                                </Link>
                                <button
                                  onClick={() => {
                                    setDeletePostId(String(post.id));
                                    setDeletePostTitle(post.title);
                                    setOpenMenuId(null);
                                  }}
                                  className='flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full'>
                                  <Trash2 className='w-4 h-4' />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Category Tag */}
                      <div className='mt-3'>
                        <span className='inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded'>
                          {post.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='flex items-center justify-center gap-2 pt-4'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}>
                <ChevronLeft className='w-4 h-4 mr-1' />
                Previous
              </Button>

              <div className='flex items-center gap-1'>
                {Array.from(
                  {length: Math.min(totalPages, 10)},
                  (_, i) => i + 1
                ).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                      page === pageNum
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}>
                    {pageNum}
                  </button>
                ))}
              </div>

              <Button
                variant='outline'
                size='sm'
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}>
                Next
                <ChevronRight className='w-4 h-4 ml-1' />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Delete Blog Post Confirmation Dialog */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletePostTitle}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteBlogMutation.isPending}
              className='bg-red-600 hover:bg-red-700 text-white'>
              {deleteBlogMutation.isPending ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Draft Confirmation Dialog */}
      <AlertDialog open={!!deleteDraftId} onOpenChange={() => setDeleteDraftId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Draft</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this draft?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDraft}
              className='bg-red-600 hover:bg-red-700 text-white'>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogListPage;
