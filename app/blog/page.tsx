'use client';

import {useState} from 'react';
import {Footer} from '@/components/layout/footer';
import {Navbar} from '@/components/layout/navbar';
import SectionHeader from '@/components/SectionHeader';
import Image from 'next/image';
import Link from 'next/link';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {blogPosts} from '@/lib/blog-data';

// Use real blog posts data
const allPosts = blogPosts;

const POSTS_PER_PAGE = 9;

const BlogPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }

    return pages;
  };

  const getMobilePageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, '...', totalPages);
      } else if (currentPage >= totalPages - 1) {
        pages.push(1, '...', totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }

    return pages;
  };

  return (
    <>
      <main className='bg-[#FFF9E8] dark:bg-black min-h-screen'>
        <Navbar />
        <div className='pt-24 pb-16 px-4 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='text-center mb-12'>
            <div className='flex flex-row justify-center w-full'>
              <SectionHeader title='Explore our Blog' />
            </div>
          </div>

          {/* Blog Grid */}
          <div className='max-w-7xl mx-auto'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10'>
              {currentPosts.map((post) => (
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
                      <h2 className='text-lg md:text-xl font-bold text-[#0A1F44] dark:text-white leading-tight group-hover:text-primary transition-colors'>
                        {post.title}
                      </h2>
                      <p className='text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3'>
                        {post.description}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className='mt-16 flex items-center justify-center'>
              {/* Mobile Pagination */}
              <div className='flex md:hidden items-center gap-2'>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className='p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed'>
                  <ChevronLeft className='w-5 h-5' />
                </button>

                <div className='flex items-center gap-1'>
                  {getMobilePageNumbers().map((page, index) =>
                    page === '...' ? (
                      <span
                        key={`ellipsis-${index}`}
                        className='px-2 text-gray-400'>
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page as number)}
                        className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-[#0A1F44] text-white'
                            : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}>
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className='p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed'>
                  <ChevronRight className='w-5 h-5' />
                </button>
              </div>

              {/* Desktop Pagination */}
              <div className='hidden md:flex items-center gap-2'>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className='flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed dark:text-gray-400 dark:hover:text-gray-200'>
                  <ChevronLeft className='w-4 h-4' />
                  Previous
                </button>

                <div className='flex items-center gap-1 mx-4'>
                  {getPageNumbers().map((page, index) =>
                    page === '...' ? (
                      <span
                        key={`ellipsis-${index}`}
                        className='px-3 text-gray-400'>
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page as number)}
                        className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-[#0A1F44] text-white'
                            : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}>
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className='flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed dark:text-gray-400 dark:hover:text-gray-200'>
                  Next
                  <ChevronRight className='w-4 h-4' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogPage;
