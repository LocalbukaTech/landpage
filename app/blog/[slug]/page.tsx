'use client';

import {Footer} from '@/components/layout/footer';
import GoBack from '@/components/layout/GoBack';
import {Navbar} from '@/components/layout/navbar';
import Image from 'next/image';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {getBlogPostBySlug, getSimilarPosts, BlogPost} from '@/lib/blog-data';

const BlogDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const blogPost = getBlogPostBySlug(slug);
  const similarBlogs = getSimilarPosts(slug, 3);

  if (!blogPost) {
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
            <GoBack color='white' url='/blog' />
            {/* Date and Read Time */}
            <div className='flex items-center gap-2 text-sm text-primary font-medium mb-4'>
              <span>{blogPost.date}</span>
              <span>•</span>
              <span>{blogPost.readTime}</span>
              <span>•</span>
              <span className='bg-primary/10 px-2 py-1 rounded'>
                {blogPost.category}
              </span>
            </div>

            {/* Title */}
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1F44] dark:text-white leading-tight mb-8'>
              {blogPost.title}
            </h1>

            {/* Hero Image */}
            <div className='relative w-full aspect-video rounded-2xl overflow-hidden mb-10'>
              <Image
                src={blogPost.image}
                alt={blogPost.title}
                fill
                className='object-cover'
                priority
              />
            </div>

            {/* Content */}
            <div className='prose prose-lg max-w-none'>
              {blogPost.content.map((block, index) => {
                if (block.type === 'paragraph') {
                  return (
                    <p
                      key={index}
                      className='text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-sm sm:text-base'>
                      {block.text}
                    </p>
                  );
                }

                if (block.type === 'heading') {
                  return (
                    <h2
                      key={index}
                      className='text-xl sm:text-2xl font-bold text-[#0A1F44] dark:text-white mt-10 mb-4'>
                      {block.text}
                    </h2>
                  );
                }

                if (block.type === 'quote') {
                  return (
                    <blockquote
                      key={index}
                      className='border-l-4 border-primary pl-6 py-4 my-8 bg-[#FFF9E8] dark:bg-gray-900 rounded-r-lg'>
                      <p className='italic text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-3'>
                        {block.text}
                      </p>
                      {block.author && (
                        <cite className='text-sm text-primary font-medium not-italic'>
                          — {block.author}
                        </cite>
                      )}
                    </blockquote>
                  );
                }

                if (block.type === 'list' && block.items) {
                  return (
                    <ul
                      key={index}
                      className='list-disc list-inside space-y-2 mb-6 ml-4'>
                      {block.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className='text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed'>
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                }

                if (block.type === 'image') {
                  return (
                    <div
                      key={index}
                      className='relative w-full aspect-video rounded-2xl overflow-hidden my-10'>
                      <Image
                        src={block.src!}
                        alt={block.alt || 'Blog image'}
                        fill
                        className='object-cover'
                      />
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        </article>

        {/* Similar Blogs Section */}
        <section className='bg-[#FFF9E8] dark:bg-gray-950 py-16 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-7xl mx-auto'>
            {/* Section Header */}
            <div className='flex items-center justify-between mb-10'>
              <h2 className='text-2xl sm:text-3xl font-bold text-[#0A1F44] dark:text-white'>
                Similar Blogs
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
                    <div className='relative aspect-4/3 rounded-2xl overflow-hidden mb-4'>
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className='object-cover transition-transform duration-300 group-hover:scale-105'
                      />
                    </div>

                    {/* Content */}
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className='text-lg font-bold text-[#0A1F44] dark:text-white leading-tight group-hover:text-primary transition-colors'>
                        {post.title}
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2'>
                        {post.description}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default BlogDetailPage;
