'use client';

import {useState} from 'react';
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
import {blogPosts as blogData} from '@/lib/blog-data';

const PAGE_SIZE = 6;

interface BlogPostItem {
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  status: string;
}

// Transform blog data for admin list
const allBlogPosts: BlogPostItem[] = blogData.map((post) => ({
  slug: post.slug,
  title: post.title,
  description: post.description,
  image: post.image,
  date: post.date,
  category: post.category,
  status: 'published',
}));

const DemoBlogListPage = () => {
  const {toast} = useToast();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletePost, setDeletePost] = useState<BlogPostItem | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Filter posts based on search
  const filteredPosts = allBlogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + PAGE_SIZE);

  const handleDelete = () => {
    if (!deletePost) return;
    // In production, this would call an API to delete the post
    toast({
      title: 'Blog post deleted',
      description: `"${deletePost.title}" has been deleted successfully.`,
    });
    setDeletePost(null);
  };

  const toggleMenu = (slug: string) => {
    setOpenMenuId(openMenuId === slug ? null : slug);
  };

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-950'>
      {/* Demo Header Banner */}
      <div className='bg-primary text-white py-2 px-4 text-center text-sm'>
        🎯 Demo Mode - Blog Post Management Preview
      </div>

      <div className='max-w-7xl mx-auto p-6 space-y-6'>
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
          <Link href='/demo-blog-admin/create'>
            <Button className='bg-primary hover:bg-primary/90 text-white'>
              <Plus className='w-4 h-4 mr-2' />
              Add BlogPost
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4'>
          <div className='relative'>
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
        </div>

        {/* Blog Posts Grid */}
        {currentPosts.length === 0 ? (
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
              <Link href='/demo-blog-admin/create'>
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
              {currentPosts.map((post) => (
                <div
                  key={post.slug}
                  className='bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
                  {/* Image */}
                  <div className='relative aspect-4/3'>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className='object-cover'
                    />
                    {post.status === 'draft' && (
                      <div className='absolute top-3 left-3 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded'>
                        Draft
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className='p-4'>
                    {/* Date */}
                    <div className='flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-2'>
                      <Calendar className='w-3.5 h-3.5' />
                      {post.date}
                    </div>

                    {/* Title with menu */}
                    <div className='flex items-start justify-between gap-2 mb-2'>
                      <h3 className='font-bold text-[#0A1F44] dark:text-white leading-tight line-clamp-2 flex-1'>
                        {post.title}
                      </h3>
                      <div className='relative'>
                        <button
                          onClick={() => toggleMenu(post.slug)}
                          className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'>
                          <MoreVertical className='w-5 h-5 text-gray-500' />
                        </button>

                        {/* Dropdown Menu */}
                        {openMenuId === post.slug && (
                          <>
                            <div
                              className='fixed inset-0 z-10'
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div className='absolute right-0 top-8 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 py-1'>
                              <Link
                                href={`/blog/${post.slug}`}
                                target='_blank'
                                className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'>
                                <Eye className='w-4 h-4' />
                                View
                              </Link>
                              <Link
                                href={`/demo-blog-admin/edit/${post.slug}`}
                                className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'>
                                <Pencil className='w-4 h-4' />
                                Edit
                              </Link>
                              <button
                                onClick={() => {
                                  setDeletePost(post);
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

                    {/* Description */}
                    <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-3'>
                      {post.description}
                    </p>

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

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deletePost}
          onOpenChange={() => setDeletePost(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{deletePost?.title}&quot;?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className='bg-red-600 hover:bg-red-700 text-white'>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default DemoBlogListPage;
