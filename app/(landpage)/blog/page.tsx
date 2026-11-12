'use client';

import {useState} from 'react';
import {Footer} from '@/components/layout/footer';
import {Navbar} from '@/components/layout/navbar';
import SectionHeader from '@/components/SectionHeader';
import Image from 'next/image';
import Link from 'next/link';
import {ChevronLeft, ChevronRight, Loader2, FileText} from 'lucide-react';
import {useBlogsQuery} from '@/lib/api/services/blog.hooks';
import {format} from 'date-fns';
import {stripHtmlContent} from '@/lib/utils';
import {BlogAdCard} from '@/components/ads/BlogAdCard';

const POSTS_PER_PAGE = 9;

const FOUNDATIONAL_ARTICLES = [
  {
    id: 'guide-lagos-buka-culture',
    title: 'The Essential Guide to Authentic Buka Culture in Lagos and Abuja',
    category: 'Restaurant Guides',
    date: 'Nov 10, 2026',
    readTime: '6 min read',
    summary:
      'From smoky firewood Jollof rice and rich Efo Riro in Surulere to traditional Tuwo Shinkafa spots in Wuse, discover how neighborhood bukas preserve centuries of Nigerian culinary heritage while feeding millions every day.',
    highlights:
      'Covers hygiene verification, regional specialties across South-West and North-Central Nigeria, pricing expectations, and how LocalBuka community reviewers verify kitchen quality.',
  },
  {
    id: 'regional-soups-nigeria',
    title: 'Six Iconic Nigerian Soups and the Indigenous Ingredients Behind Them',
    category: 'Culinary Heritage',
    date: 'Nov 08, 2026',
    readTime: '7 min read',
    summary:
      'Explore the culinary science and regional traditions behind Egusi, Banga, Afang, Edikang Ikong, Oha, and Gbegiri—from palm-fruit extraction techniques in the Niger Delta to locust bean fermentation (Iru and Dawadawa).',
    highlights:
      'Breaks down flavor profiles, traditional swallow pairings, nutritional benefits of indigenous leafy greens, and where to experience authentic preparations.',
  },
  {
    id: 'hygiene-and-trust-in-local-dining',
    title: 'How Community Reviews Are Raising Food Safety Standards Across Local Dining',
    category: 'Food Safety & Trust',
    date: 'Nov 05, 2026',
    readTime: '5 min read',
    summary:
      'Finding a great local meal should never require guesswork. Learn how transparent diner reviews, verified video walk-throughs, and hygiene ratings empower both food lovers and independent restaurant owners.',
    highlights:
      'Details LocalBuka verification criteria, clean water and food-handling benchmarks, and how local kitchens grow loyal customer bases through transparency.',
  },
  {
    id: 'street-food-traditions-west-africa',
    title: 'Evening Street Food Traditions: Suya, Masa, Akara, and Bole Explained',
    category: 'Food Culture',
    date: 'Nov 02, 2026',
    readTime: '6 min read',
    summary:
      'A deep dive into West Africa’s vibrant street food economy—from northern Yaji spice blends crafted with ginger, cloves, and groundnut cake to Port Harcourt roasted plantain (Bole) served with peppered grilled fish.',
    highlights:
      'Explores preparation methods, spice sourcing, cultural history, and top-rated neighborhood spots recommended by the LocalBuka community.',
  },
  {
    id: 'supporting-independent-food-creators',
    title: 'Empowering Culinary Creators and Local Kitchens in the Digital Economy',
    category: 'Creator Economy',
    date: 'Oct 28, 2026',
    readTime: '5 min read',
    summary:
      'How chefs, home cooks, and culinary storytellers use LocalBuka communities to share traditional recipes, host tasting events, and build sustainable culinary businesses across Africa.',
    highlights:
      'Highlights recipe documentation, kitchen storytelling, and community-driven discovery for emerging food entrepreneurs.',
  },
  {
    id: 'seasonal-ingredients-nigerian-kitchen',
    title: 'Farm to Buka: Seasonal Nigerian Ingredients Every Food Lover Should Know',
    category: 'Ingredients & Nutrition',
    date: 'Oct 24, 2026',
    readTime: '6 min read',
    summary:
      'Understanding harvest cycles for yam, fluted pumpkin (Ugu), fresh palm nut, uziza, and native grains—and how seasonal freshness shapes the menu at your favorite local buka.',
    highlights:
      'Includes seasonal availability charts, sourcing tips from local markets, and interviews with veteran buka chefs.',
  },
];

const BlogPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const {data: blogsResponse, isLoading} = useBlogsQuery({
    page: currentPage,
    size: POSTS_PER_PAGE
  });

  const blogs = blogsResponse?.data?.data?.docs || [];
  const totalPages = blogsResponse?.data?.data?.total_pages || 1;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

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

  const blogSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': 'https://localbuka.com/blog#blog',
        url: 'https://localbuka.com/blog',
        name: 'LocalBuka Food & Culture Blog',
        description:
          'Stories, restaurant guides, authentic Nigerian recipes, and culinary culture across Africa from LocalBuka.',
        publisher: { '@id': 'https://localbuka.com/#organization' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://localbuka.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://localbuka.com/blog',
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <main className='bg-[#FFF9E8] dark:bg-black min-h-screen'>
        <Navbar />
        <div className='pt-24 pb-16 px-4 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='text-center mb-12'>
            <div className='flex flex-row justify-center w-full'>
              <SectionHeader title='Explore our Blog' />
            </div>
          </div>

          {isLoading ? (
            <div className='flex justify-center items-center min-h-[40vh]'>
              <Loader2 className='w-12 h-12 animate-spin text-primary' />
            </div>
          ) : (
            <div className='max-w-7xl mx-auto'>
              {blogs.length > 0 ? (
                <>
                  {/* Blog Cards Grid with Inline Native Ad */}
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10'>
                    {blogs.slice(0, 3).map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className='group'>
                        <article>
                          {/* Image */}
                          <div className='relative aspect-4/3 rounded-2xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800'>
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
                              <span className='bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded'>
                                {post.category || 'General'}
                              </span>
                            </div>
                            <h2 className='text-lg md:text-xl font-bold text-[#0A1F44] dark:text-white leading-tight group-hover:text-primary transition-colors line-clamp-2'>
                              {post.title}
                            </h2>
                            <p className='text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3'>
                              {stripHtmlContent(post.content)}
                            </p>
                          </div>
                        </article>
                      </Link>
                    ))}

                    {/* Inline Ad Card */}
                    <BlogAdCard slot='4012538754' />

                    {/* Remaining Blog Cards */}
                    {blogs.slice(3).map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className='group'>
                        <article>
                          {/* Image */}
                          <div className='relative aspect-4/3 rounded-2xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800'>
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
                              <span className='bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded'>
                                {post.category || 'General'}
                              </span>
                            </div>
                            <h2 className='text-lg md:text-xl font-bold text-[#0A1F44] dark:text-white leading-tight group-hover:text-primary transition-colors line-clamp-2'>
                              {post.title}
                            </h2>
                            <p className='text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3'>
                              {stripHtmlContent(post.content)}
                            </p>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
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
                  )}
                </>
              ) : (
                <div className='text-center py-8'>
                  <p className='text-gray-600 dark:text-gray-300 text-base'>
                    Explore our foundational editorial guides on Nigerian and African culinary culture below.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Crawlable Editorial Guides & Foundational Articles for SEO & AdSense Content Depth */}
          <section
            aria-label='Featured Culinary Guides and Editorial Articles'
            className='max-w-7xl mx-auto mt-14 pt-12 border-t border-gray-200 dark:border-zinc-800'>
            <div className='mb-8 text-left'>
              <span className='inline-block text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full mb-2'>
                Editorial Library & Guides
              </span>
              <h2 className='text-2xl md:text-3xl font-bold text-[#0A1F44] dark:text-white'>
                Foundational Guides to Nigerian &amp; African Food Culture
              </h2>
              <p className='mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-3xl'>
                In-depth culinary journalism, regional dish histories, restaurant hygiene standards, and neighborhood dining guides curated by the LocalBuka editorial team.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {FOUNDATIONAL_ARTICLES.map((article) => (
                <article
                  key={article.id}
                  className='rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 shadow-xs flex flex-col justify-between'>
                  <div>
                    <div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3'>
                      <span>{article.date}</span>
                      <span>•</span>
                      <span className='bg-primary/10 text-primary font-semibold px-2.5 py-0.5 rounded'>
                        {article.category}
                      </span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className='text-lg font-bold text-[#0A1F44] dark:text-white mb-2 leading-snug'>
                      {article.title}
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3'>
                      {article.summary}
                    </p>
                  </div>
                  <p className='text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-zinc-800 pt-3 leading-relaxed'>
                    <strong className='text-[#0A1F44] dark:text-gray-200'>Key Takeaways: </strong>
                    {article.highlights}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogPage;
