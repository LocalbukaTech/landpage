'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Users, Search, Sparkles, Flame, Check, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CommunityItem {
  id: string;
  name: string;
  description: string;
  image: string;
  avatar: string;
  membersCount: number;
  category: 'free' | 'paid';
  price?: string;
  isTrending?: boolean;
  tags: string[];
}

const mockCommunities: CommunityItem[] = [
  {
    id: '1',
    name: 'Lagos Street Food Explorers',
    description: 'Discover the hidden buka gems, late-night spots, and authentic street flavors across Lagos.',
    image: '/images/community/food-table.jpg',
    avatar: '/images/community/avatar-1.png',
    membersCount: 4280,
    category: 'free',
    isTrending: true,
    tags: ['Street Food', 'Lagos', 'Night Life'],
  },
  {
    id: '2',
    name: 'Suya & BBQ Masters Guild',
    description: 'Exclusive recipes, masterclasses, and tasting meetups for grilled meat and suya enthusiasts.',
    image: '/images/community/carousel-3.jpg',
    avatar: '/images/community/avatar-2.png',
    membersCount: 1850,
    category: 'paid',
    price: '₦2,500/mo',
    isTrending: true,
    tags: ['Suya', 'Grills', 'Masterclass'],
  },
  {
    id: '3',
    name: 'Calabar & Delta Cuisine Connoisseurs',
    description: 'Celebrating rich soups, seafood delicacies, and indigenous southern culinary traditions.',
    image: '/images/community/carousel-2.jpg',
    avatar: '/images/community/avatar-3.png',
    membersCount: 3120,
    category: 'free',
    isTrending: false,
    tags: ['Traditional', 'Seafood', 'Soups'],
  },
  {
    id: '4',
    name: 'Foodie Content Creators Club',
    description: 'Connect with food bloggers, chefs, and photographers sharing tips, collaborations, and gear reviews.',
    image: '/images/community/carousel-1.jpg',
    avatar: '/images/community/avatar-4.png',
    membersCount: 960,
    category: 'paid',
    price: '₦2,500/mo',
    isTrending: true,
    tags: ['Creators', 'Networking', 'Filmmaking'],
  },
];

interface CommunityExploreListProps {
  filterType: 'recommended' | 'trending' | 'free' | 'paid';
  onOpenCreatorFlow: () => void;
}

export function CommunityExploreList({
  filterType,
  onOpenCreatorFlow,
}: CommunityExploreListProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedCommunities, setJoinedCommunities] = useState<Record<string, boolean>>({});

  const filteredList = mockCommunities.filter((item) => {
    if (filterType === 'trending' && !item.isTrending) return false;
    if (filterType === 'free' && item.category !== 'free') return false;
    if (filterType === 'paid' && item.category !== 'paid') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const toggleJoin = (id: string, name: string) => {
    setJoinedCommunities((prev) => {
      const next = !prev[id];
      toast({
        title: next ? 'Joined Community! 🎉' : 'Left Community',
        description: next
          ? `You are now a member of "${name}".`
          : `You left "${name}".`,
      });
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className='w-full space-y-6'>
      {/* Search and Action Bar */}
      <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
          <input
            type='text'
            placeholder='Search communities, topics, or tags...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-2.5 bg-[#242424] border border-white/10 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC533] focus:border-transparent transition-all'
          />
        </div>

        <button
          onClick={onOpenCreatorFlow}
          className='flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFC533] hover:bg-[#e6b12d] text-gray-900 font-semibold text-xs tracking-wide transition-colors shadow-sm'
        >
          <Plus className='w-4 h-4' />
          <span>Create Community</span>
        </button>
      </div>

      {/* Grid of Community Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
        {filteredList.map((item) => {
          const isJoined = joinedCommunities[item.id];

          return (
            <div
              key={item.id}
              className='group bg-[#1e1e1e] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col justify-between shadow-md'
            >
              <div>
                {/* Cover Image */}
                <div className='relative h-40 w-full overflow-hidden bg-gray-800'>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />

                  {/* Badge */}
                  <div className='absolute top-3 right-3'>
                    {item.category === 'paid' ? (
                      <span className='px-2.5 py-1 rounded-full bg-emerald-500 text-white font-bold text-[11px] shadow-sm'>
                        {item.price || 'Paid'}
                      </span>
                    ) : (
                      <span className='px-2.5 py-1 rounded-full bg-[#FFC533] text-black font-bold text-[11px] shadow-sm'>
                        Free
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className='p-5'>
                  {/* Avatar & Title */}
                  <div className='flex items-center gap-3 mb-2.5'>
                    <div className='relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/10 shrink-0'>
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div>
                      <h3 className='font-bold text-white text-base leading-tight group-hover:text-[#FFC533] transition-colors'>
                        {item.name}
                      </h3>
                      <div className='flex items-center gap-1.5 text-xs text-gray-400 mt-0.5'>
                        <Users className='w-3 h-3' />
                        <span>{item.membersCount.toLocaleString()} members</span>
                      </div>
                    </div>
                  </div>

                  <p className='text-xs text-gray-300 line-clamp-2 leading-relaxed mb-4'>
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className='flex flex-wrap gap-1.5'>
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className='text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-gray-400 border border-white/5'
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className='px-5 pb-5 pt-2 border-t border-white/5 flex items-center justify-between'>
                <span className='text-xs text-gray-400'>
                  {item.category === 'paid' ? 'Membership required' : 'Open to everyone'}
                </span>

                <button
                  onClick={() => toggleJoin(item.id, item.name)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isJoined
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-[#FFC533] hover:bg-[#e6b12d] text-gray-900 shadow-sm'
                  }`}
                >
                  {isJoined ? (
                    <>
                      <Check className='w-3.5 h-3.5' />
                      <span>Joined</span>
                    </>
                  ) : (
                    <span>Join</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
