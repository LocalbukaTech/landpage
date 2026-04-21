'use client';

import {Suspense, useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {
  Search,
  UtensilsCrossed,
  Users,
  FileText,
  Loader2,
  SearchX,
  Star,
  MapPin,
  User as UserIcon,
  Play,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {MainLayout} from '@/components/layout/MainLayout';
import {useSearchAll} from '@/lib/api/services/restaurants.hooks';
import {RESTAURANT_PLACEHOLDER_IMG} from '@/lib/constants';

type Category = 'all' | 'restaurants' | 'posts' | 'users';

const CATEGORIES: {id: Category; label: string; Icon: React.ElementType}[] = [
  {id: 'all', label: 'All', Icon: Search},
  {id: 'restaurants', label: 'Restaurants', Icon: UtensilsCrossed},
  {id: 'posts', label: 'Posts', Icon: FileText},
  {id: 'users', label: 'People', Icon: Users},
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function RestaurantResult({item}: {item: any}) {
  const image = item.photos?.[0] ?? item.image ?? RESTAURANT_PLACEHOLDER_IMG;
  const rating = item.avgRating ?? item.googleRating ?? 0;
  return (
    <Link
      href={item.id ? `/buka/restaurant/${item.id}` : '#'}
      className='flex items-center gap-3 p-3 rounded-xl bg-[#222] hover:bg-[#2a2a2a] transition-colors'>
      <div className='relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-zinc-800'>
        {image && image !== RESTAURANT_PLACEHOLDER_IMG ? (
          <Image
            src={image}
            alt={item.name}
            fill
            className='object-cover'
            sizes='56px'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center'>
            <UtensilsCrossed size={20} className='text-zinc-600' />
          </div>
        )}
      </div>
      <div className='flex-1 min-w-0'>
        <p className='text-white text-sm font-semibold truncate'>{item.name}</p>
        {item.address && (
          <p className='text-zinc-400 text-xs truncate flex items-center gap-1 mt-0.5'>
            <MapPin size={11} /> {item.address}
          </p>
        )}
        {rating > 0 && (
          <p className='text-xs text-green-400 flex items-center gap-1 mt-0.5'>
            <Star size={11} className='fill-green-400' />{' '}
            {Number(rating).toFixed(1)}
          </p>
        )}
      </div>
    </Link>
  );
}

function PostResult({item}: {item: any}) {
  return (
    <Link
      href={item.id ? `/posts/${item.id}` : '#'}
      className='flex items-center gap-3 p-3 rounded-xl bg-[#222] hover:bg-[#2a2a2a] transition-colors'>
      <div className='relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-zinc-800 flex items-center justify-center'>
        {(item.thumbnail ?? item.url) && (
          <Image
            src={item.thumbnail ?? item.url}
            alt='post'
            fill
            className='object-cover opacity-60'
            sizes='56px'
          />
        )}
        <div className='relative z-10 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center'>
          <Play size={14} className='text-white ml-0.5' fill='white' />
        </div>
      </div>
      <div className='flex-1 min-w-0'>
        <p className='text-white text-sm font-medium line-clamp-2'>
          {item.description || item.caption || item.title || 'Post'}
        </p>
        {item.user?.fullName && (
          <p className='text-zinc-400 text-xs mt-0.5'>
            by {item.user.fullName}
          </p>
        )}
      </div>
    </Link>
  );
}

function UserResult({item}: {item: any}) {
  const avatar = item.avatar || item.image_url || item.profilePicture;
  return (
    <Link
      href={item.id ? `/other-profile?id=${item.id}` : '#'}
      className='flex items-center gap-3 p-3 rounded-xl bg-[#222] hover:bg-[#2a2a2a] transition-colors'>
      <div className='relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-zinc-800 border border-white/10'>
        {avatar ? (
          <Image
            src={avatar}
            alt={item.fullName ?? 'user'}
            fill
            className='object-cover'
            sizes='48px'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center'>
            <UserIcon size={20} className='text-zinc-600' />
          </div>
        )}
      </div>
      <div className='flex-1 min-w-0'>
        <p className='text-white text-sm font-semibold truncate'>
          {item.fullName || item.username}
        </p>
        {item.username && (
          <p className='text-zinc-400 text-xs truncate'>@{item.username}</p>
        )}
        {item.bio && (
          <p className='text-zinc-500 text-xs truncate mt-0.5'>{item.bio}</p>
        )}
      </div>
    </Link>
  );
}

// ─── Main content ──────────────────────────────────────────────────────────────

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get('q') ?? '';
  const categoryParam = (searchParams.get('category') ?? 'all') as Category;

  const [inputValue, setInputValue] = useState(q);
  const [category, setCategory] = useState<Category>(categoryParam);

  // Keep local state in sync when URL params change (e.g. back/forward)
  useEffect(() => {
    setInputValue(q);
    setCategory(categoryParam);
  }, [q, categoryParam]);

  const {data, isLoading, isFetching} = useSearchAll(
    {q, type: category === 'all' ? undefined : category},
    q.length >= 2,
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = inputValue.trim();
    if (!term) return;
    const params = new URLSearchParams({q: term, category});
    router.push(`/search?${params.toString()}`);
  };

  const handleCategory = (cat: Category) => {
    setCategory(cat);
    if (q) {
      router.push(
        `/search?${new URLSearchParams({q, category: cat}).toString()}`,
        {
          scroll: false,
        },
      );
    }
  };

  // Normalise the response — the API may return { restaurants, posts, users }
  // or a flat paginated list depending on the type filter
  const raw = (data as any)?.data ?? data;
  const restaurants: any[] =
    raw?.restaurants ??
    (category === 'restaurants' ? (raw?.data ?? raw ?? []) : []);
  const posts: any[] =
    raw?.posts ?? (category === 'posts' ? (raw?.data ?? raw ?? []) : []);
  const users: any[] =
    raw?.users ?? (category === 'users' ? (raw?.data ?? raw ?? []) : []);

  const hasResults =
    restaurants.length > 0 || posts.length > 0 || users.length > 0;
  const isSearching = isLoading || isFetching;
  const showEmpty = q.length >= 2 && !isSearching && !hasResults;

  return (
    <MainLayout>
      <div className='w-full max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6'>
        {/* Search bar */}
        <form onSubmit={handleSearch} className='w-full'>
          <div className='relative'>
            <Search
              size={18}
              className='absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none'
            />
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder='Search restaurants, posts, people…'
              className='w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#222] border border-white/10 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#fbbe15] transition-colors'
              autoFocus
            />
            {isSearching && (
              <Loader2
                size={16}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 animate-spin'
              />
            )}
          </div>
        </form>

        {/* Category tabs */}
        <div className='flex gap-2 overflow-x-auto pb-1 scrollbar-hide'>
          {CATEGORIES.map(({id, label, Icon}) => (
            <button
              key={id}
              onClick={() => handleCategory(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                category === id
                  ? 'bg-[#fbbe15] text-[#1a1a1a]'
                  : 'bg-[#222] text-zinc-400 hover:text-white'
              }`}>
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Results */}
        {q.length < 2 && (
          <div className='flex flex-col items-center justify-center py-20 text-center'>
            <Search size={40} className='text-zinc-700 mb-4' />
            <p className='text-zinc-400 text-sm'>Start typing to search…</p>
          </div>
        )}

        {showEmpty && (
          <div className='flex flex-col items-center justify-center py-20 text-center'>
            <SearchX size={40} className='text-zinc-700 mb-4' />
            <p className='text-white font-semibold mb-1'>No results found</p>
            <p className='text-zinc-500 text-sm'>
              Try a different keyword or category.
            </p>
          </div>
        )}

        {hasResults && (
          <div className='flex flex-col gap-6'>
            {/* Restaurants */}
            {(category === 'all' || category === 'restaurants') &&
              restaurants.length > 0 && (
                <section>
                  {category === 'all' && (
                    <h2 className='text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2'>
                      <UtensilsCrossed size={13} /> Restaurants
                    </h2>
                  )}
                  <div className='flex flex-col gap-2'>
                    {restaurants.map((item: any, i: number) => (
                      <RestaurantResult key={item.id ?? i} item={item} />
                    ))}
                  </div>
                </section>
              )}

            {/* Posts */}
            {(category === 'all' || category === 'posts') &&
              posts.length > 0 && (
                <section>
                  {category === 'all' && (
                    <h2 className='text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2'>
                      <FileText size={13} /> Posts
                    </h2>
                  )}
                  <div className='flex flex-col gap-2'>
                    {posts.map((item: any, i: number) => (
                      <PostResult key={item.id ?? i} item={item} />
                    ))}
                  </div>
                </section>
              )}

            {/* Users */}
            {(category === 'all' || category === 'users') &&
              users.length > 0 && (
                <section>
                  {category === 'all' && (
                    <h2 className='text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2'>
                      <Users size={13} /> People
                    </h2>
                  )}
                  <div className='flex flex-col gap-2'>
                    {users.map((item: any, i: number) => (
                      <UserResult key={item.id ?? i} item={item} />
                    ))}
                  </div>
                </section>
              )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <MainLayout>
          <div className='w-full flex items-center justify-center py-20'>
            <Loader2 className='w-8 h-8 animate-spin text-[#fbbe15]' />
          </div>
        </MainLayout>
      }>
      <SearchContent />
    </Suspense>
  );
}
