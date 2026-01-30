'use client';

import {Footer} from '@/components/layout/footer';
import GoBack from '@/components/layout/GoBack';
import {Navbar} from '@/components/layout/navbar';
import Image from 'next/image';
import Link from 'next/link';
import {useParams, useRouter, usePathname} from 'next/navigation';
import {
  useBlogBySlugQuery,
  useLikeBlogMutation,
  useBlogsQuery,
} from '@/lib/api/services/blog.hooks';
import {Loader2, ThumbsUp, Calendar, Clock, FileText} from 'lucide-react';
import {Button} from '@/components/ui/button';
import CommentSection from './CommentSection';
import {getUser, isUserAuthenticated} from '@/lib/auth';
import {useToast} from '@/hooks/use-toast';
import {format} from 'date-fns';

const BlogDetailClient = ({slug}: {slug: string}) => {
  const router = useRouter();
  const pathname = usePathname();
  const {toast} = useToast();

  // API Hooks
  // Fetch by SLUG using the new endpoint
  const {data: blogResponse, isLoading} = useBlogBySlugQuery(slug);
  const likeBlogMutation = useLikeBlogMutation();
  
  // Fetch some blogs for "Similar Blogs" (just showing recent ones for now)
  const {data: similarBlogsResponse} = useBlogsQuery({page: 1, size: 3});

  const blog = blogResponse?.data?.data;
  // Derive ID from the fetched blog for use in mutations (likes, comments)
  const id = blog?.id;
  const similarBlogs = similarBlogsResponse?.data?.data?.docs?.filter(b => String(b.id) !== id).slice(0, 3) || [];

  // Mutations

  const handleAuthCheck = () => {
    if (!isUserAuthenticated()) {
      router.push(`/signin?redirect=${pathname}`);
      return false;
    }
    return true;
  };
 const userId = getUser()?.id;
//  alert(userId)

  const handleLike = () => {
    if (blog?.is_liked) return;
    if (!isUserAuthenticated()) {
      router.push(`/signin?redirect=${pathname}`);
      return;
    }
    // Use the ID derived from the blog response
    if (id) {
      likeBlogMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };
  
  // Calculate read time roughly (200 words per minute)
  const calculateReadTime = (content: string) => {
    if (!content) return '1 min read';
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  if (isLoading) {
    return (
      <>
        <main className='bg-white dark:bg-black min-h-screen'>
          <Navbar />
          <div className='flex justify-center items-center min-h-[60vh]'>
            <Loader2 className='w-12 h-12 animate-spin text-primary' />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <main className='bg-white dark:bg-black min-h-screen'>
          <Navbar />
          <div className='pt-24 pb-16 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-4xl mx-auto text-center'>
              <GoBack color='white' url='/blog' />
              <h1 className='text-2xl font-bold text-[#0A1F44] dark:text-white mt-8'>
                Blog post not found
              </h1>
              <p className='text-gray-600 dark:text-gray-300 mt-4'>
                The article you&apos;re looking for doesn&apos;t exist.
              </p>
              <Link
                href='/blog'
                className='inline-block mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors'>
                Back to Blog
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main className='bg-white dark:bg-black min-h-screen'>
        <Navbar />

        <article className='pt-24 pb-16 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto'>
            <div className='mb-6'>
              <GoBack color='black' url='/blog' />
            </div>
            {/* Date and Read Time */}
            <div className='flex items-center gap-2 text-sm text-primary font-medium mb-4 mt-6'>
              <Calendar className='w-4 h-4' />
              <span>{formatDate(blog.created_at)}</span>
              <span>•</span>
              <Clock className='w-4 h-4' />
              <span>{calculateReadTime(blog.content)}</span>
              <span>•</span>
              <span className='bg-primary/10 px-2 py-1 rounded text-xs'>
                {blog.category || 'General'}
              </span>
            </div>

            {/* Title */}
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1F44] dark:text-white leading-tight mb-8'>
              {blog.title}
            </h1>

            {/* Hero Image */}
            <div className='relative w-full aspect-video rounded-2xl overflow-hidden mb-10 bg-gray-100 dark:bg-gray-800'>
              {blog.image_url ? (
                <Image
                  src={blog.image_url}
                  alt={blog.title}
                  fill
                  className='object-cover'
                  priority
                />
              ) : (
                <div className='flex items-center justify-center w-full h-full text-gray-400'>
                  <FileText className='w-16 h-16' />
                </div>
              )}
            </div>

            {/* Content */}
            <div 
              className='prose prose-lg max-w-none dark:prose-invert'
              dangerouslySetInnerHTML={{__html: blog.content}}
            />

            {/* Like Button & Stats */}
            <div className='mt-12 flex items-center justify-between border-t border-b border-gray-100 dark:border-gray-800 py-6'>
              <div className='flex items-center gap-6'>
               
                  <Button
                  variant='outline'
                  onClick={handleLike}
                  className={`flex items-center gap-2 rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors ${
                    blog.is_liked ? 'bg-primary/5 border-primary/40' : ''
                  }`}>
                  <ThumbsUp className={`w-5 h-5 ${Number(blog?.like_counts) > 0 || blog.is_liked ? 'fill-primary text-primary' : ''}`} />
                  <span className='font-medium'>
                    {blog?.like_counts || 0} {Number(blog?.like_counts) === 1 ? 'Like' : 'Likes'}
                  </span>
                </Button>
                
                <div className='text-gray-500 text-sm'>
                  {blog?.comment_counts || 0} {Number(blog?.comment_counts) === 1 ? 'Comment' : 'Comments'}
                </div>
              </div>
              
              {/* Share buttons could go here */}
            </div>

            {/* <CommentSection blogId={id} /> - Removed duplicate */ }
          </div>
        </article>

        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16'>
          {id && <CommentSection blogId={id} />}
        </div>

        {/* Similar Blogs Section */}
        {similarBlogs.length > 0 && (
          <section className='bg-[#FFF9E8] dark:bg-gray-950 py-16 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-7xl mx-auto'>
              {/* Section Header */}
              <div className='flex items-center justify-between mb-10'>
                <h2 className='text-2xl sm:text-3xl font-bold text-[#0A1F44] dark:text-white'>
                  More to Read
                </h2>
                <Link
                  href='/blog'
                  className='text-primary hover:text-primary/80 font-medium text-sm sm:text-base transition-colors'>
                  View All
                </Link>
              </div>

              {/* Blog Cards Grid */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {similarBlogs.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className='group'>
                    <article>
                      {/* Image */}
                      <div className='relative aspect-4/3 rounded-2xl overflow-hidden mb-4 bg-white'>
                        {post.image_url ? (
                          <Image
                            src={post.image_url}
                            alt={post.title}
                            fill
                            className='object-cover transition-transform duration-300 group-hover:scale-105'
                          />
                        ) : (
                          <div className='flex items-center justify-center w-full h-full text-gray-400'>
                            <FileText className='w-12 h-12' />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className='space-y-2'>
                        <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                          <span>{formatDate(post.created_at)}</span>
                          <span>•</span>
                          <span>{calculateReadTime(post.content)}</span>
                        </div>
                        <h3 className='text-lg font-bold text-[#0A1F44] dark:text-white leading-tight group-hover:text-primary transition-colors line-clamp-2'>
                          {post.title}
                        </h3>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

export default BlogDetailClient;
