'use client';

import {useState, useEffect} from 'react';
import {
  ArrowRight,
  Bell,
  Bookmark,
  Home,
  Loader2,
  MapPin,
  Menu,
  Plus,
  PlusCircle,
  Search,
  Store,
  User,
  Users,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {CgSpinner} from 'react-icons/cg';
import type {BukaRestaurant} from '@/components/buka/BukaCard';
import {MobileRestaurantCard} from './MobileRestaurantCard';
import {MobileRestaurantRow} from './MobileRestaurantRow';
import {useAuth} from '@/context/AuthContext';
import {useUnreadCount} from '@/lib/api/services/notifications.hooks';
import {cn} from '@/lib/utils';
import {Drawer, DrawerContent, DrawerTitle} from '@/components/ui/drawer';
import {useGeolocation} from '@/hooks/useGeolocation';
import {Typewriter} from '@/components/anim/Typewriter';
import {motion, AnimatePresence} from 'framer-motion';
import {BUKA_HERO_LANGUAGES} from '@/lib/constants';
import {useRequireAuth} from '@/hooks/useRequireAuth';
import {
  getMobileDrawerNavItems,
  FOOTER_LINKS,
  type NavItemConfig,
} from '@/components/layout/sidebar.config';

function useLocationLabel() {
  const {lat, lng, loading: geoLoading} = useGeolocation();
  const [label, setLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (geoLoading || lat === null || lng === null) return;
    let cancelled = false;
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`,
      {headers: {'Accept-Language': 'en'}},
    )
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const addr = data?.address ?? {};
        const city =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.suburb ||
          addr.county ||
          addr.state_district ||
          addr.state ||
          '';
        const country = addr.country_code
          ? addr.country_code.toUpperCase()
          : addr.country || '';
        setLabel(
          city
            ? `${city}, ${country}`
            : (data?.display_name?.split(',')[0] ?? null),
        );
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [lat, lng, geoLoading]);

  return {label, loading: geoLoading || loading};
}

const CUISINE_SLUGS: Record<string, string> = {
  'Nigeria Cuisine': 'nigeria-cuisine',
  'Yoruba Cuisine': 'yoruba-cuisine',
  'Igbo Cuisine': 'igbo-cuisine',
  'Hausa Cuisine': 'hausa-cuisine',
  'Calabar Cuisine': 'calabar-cuisine',
  'Edo Cuisine': 'edo-cuisine',
};

const CUISINE_EMOJIS: Record<string, string> = {
  'Nigeria Cuisine': '🇳🇬',
  'Yoruba Cuisine': '🍲',
  'Igbo Cuisine': '🥘',
  'Hausa Cuisine': '🫕',
  'Calabar Cuisine': '🐟',
  'Edo Cuisine': '🍛',
};

interface Props {
  isLoading: boolean;
  topRestaurants: BukaRestaurant[];
  topBukas: BukaRestaurant[];
  hiddenGems: BukaRestaurant[];
  streetFavorites: BukaRestaurant[];
  cuisines: {name: string; image: string}[];
}

function SectionHeader({
  title,
  href = '/buka/restaurant',
}: {
  title: string;
  href?: string;
}) {
  return (
    <div className='flex items-center justify-between px-4 mb-3'>
      <h3 className='text-white font-bold text-[15px]'>{title}</h3>
      <Link
        href={href}
        className='text-[#fbbe15] text-xs font-medium flex items-center gap-0.5 active:opacity-70'>
        See all <ArrowRight size={12} />
      </Link>
    </div>
  );
}

const year = new Date().getFullYear();

export function MobileBukaHome({
  isLoading,
  topRestaurants,
  topBukas,
  hiddenGems,
  streetFavorites,
  cuisines,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const {user, isAuthenticated} = useAuth();
  const {requireAuth} = useRequireAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {data: unreadCountResponse} = useUnreadCount();
  const unreadCount = (unreadCountResponse as any)?.data?.count ?? 0;
  const {label: locationLabel, loading: locationLoading} = useLocationLabel();
  const [activeHeroLangIndex, setActiveHeroLangIndex] = useState(0);
  const activeHeroContent =
    BUKA_HERO_LANGUAGES[activeHeroLangIndex] || BUKA_HERO_LANGUAGES[0];

  const isItemActive = (itemHref: string) => {
    if (!pathname) return false;
    if (itemHref === '#') return false;

    if (itemHref === '/buka') {
      if (!pathname.startsWith('/buka')) return false;
      if (
        pathname.startsWith('/buka/my-restaurant') ||
        pathname.startsWith('/buka/list-resturant')
      ) {
        return false;
      }
      return true;
    }

    if (
      itemHref === '/buka/my-restaurant' ||
      itemHref === '/buka/list-resturant'
    ) {
      return (
        pathname.startsWith('/buka/my-restaurant') ||
        pathname.startsWith('/buka/list-resturant')
      );
    }

    if (itemHref === '/') return pathname === '/' || pathname === '/feeds';
    return pathname.startsWith(itemHref.split('?')[0]);
  };

  const navItems = getMobileDrawerNavItems(isAuthenticated);

  const handleNavItemClick = (e: React.MouseEvent, item: NavItemConfig) => {
    setIsMenuOpen(false);

    if (item.authRequirement === 'auth-prompt' && !isAuthenticated) {
      e.preventDefault();
      requireAuth(() => router.push(item.href));
      return;
    }
  };

  const userAvatar = isAuthenticated
    ? user?.avatar || '/images/profile.png'
    : null;

  return (
    <div className='w-full min-h-screen bg-[#111] pb-24'>
      {/* ── Sticky App Header ── */}
      <div className='sticky top-0 z-30 bg-[#111]/96 backdrop-blur-md px-4 pt-3 pb-2 border-b border-white/5'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Image
              src='/images/localBuka_logo.png'
              alt='LocalBuka'
              width={30}
              height={30}
              className='rounded-xl'
            />
            <span className='text-white font-bold text-base tracking-tight'>
              LocalBuka
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setIsMenuOpen(true)}
              className='w-9 h-9 flex items-center justify-center rounded-full bg-[#1e1e1e] border border-white/8 active:opacity-70'>
              <Menu size={17} className='text-zinc-300' />
            </button>
          </div>
        </div>

        {/* Location row */}
        <div className='flex items-center gap-1 mt-2'>
          <MapPin size={13} className='text-[#fbbe15] shrink-0' />
          {locationLoading ? (
            <Loader2 size={12} className='text-zinc-500 animate-spin' />
          ) : (
            <span className='text-zinc-300 text-sm font-medium'>
              {locationLabel ?? 'Location unavailable'}
            </span>
          )}
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className='px-4 pt-3 pb-1'>
        <button
          onClick={() => router.push('/buka/restaurant')}
          className='w-full flex items-center gap-3 bg-[#1e1e1e] rounded-2xl px-4 py-3 border border-white/8 active:border-white/20 transition-colors'>
          <Search size={17} className='text-zinc-500 shrink-0' />
          <span className='text-zinc-500 text-sm'>
            Search restaurants, cuisines...
          </span>
        </button>
      </div>

      {/* ── Hero Banner ── */}
      <div className='px-4 mt-3'>
        <div className='relative w-full rounded-3xl overflow-hidden bg-zinc-900'>
          {/* Aspect ratio: 16:7 */}
          <div className='aspect-16/7'>
            <Image
              src='/images/buka_hero.png'
              alt='Discover local restaurants'
              fill
              className='object-cover'
              priority
            />
          </div>
          <div className='absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent' />
          <div className='absolute bottom-0 left-0 p-4 max-w-[75%]'>
            <span className='inline-block bg-[#fbbe15]/20 text-[#fbbe15] text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 border border-[#fbbe15]/30'>
              FEATURED
            </span>
            <h2 className='text-white text-sm sm:text-base font-bold leading-snug min-h-[22px] flex items-center'>
              <Typewriter
                words={BUKA_HERO_LANGUAGES.map((item) => item.headline)}
                typingSpeed={50}
                deletingSpeed={25}
                pauseTime={2500}
                onIndexChange={setActiveHeroLangIndex}
                className='text-white'
                cursorClassName='bg-[#fbbe15] w-[2px]'
              />
            </h2>
            <div className='min-h-[28px] flex items-center'>
              <AnimatePresence mode='wait'>
                <motion.p
                  key={activeHeroLangIndex}
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                  transition={{ duration: 0.25 }}
                  className='text-white/70 text-xs mt-0.5 line-clamp-2 leading-tight'>
                  {activeHeroContent.body}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
          <Link
            href='/buka/restaurant'
            className='absolute bottom-4 right-4 bg-[#fbbe15] text-[#1a1a1a] text-xs font-bold px-3 py-1.5 rounded-full active:opacity-80 transition-opacity'>
            Explore →
          </Link>
        </div>
      </div>

      {/* ── Cuisine Categories ── */}
      <div className='mt-5'>
        <SectionHeader title='Cuisines' />
        <div className='flex gap-4 px-4 overflow-x-auto scrollbar-hide pb-1'>
          {cuisines.map((c) => {
            const slug =
              CUISINE_SLUGS[c.name] ?? c.name.toLowerCase().replace(/\s/g, '-');
            return (
              <Link
                key={c.name}
                href={`/buka/${slug}`}
                className='flex flex-col items-center gap-1.5 shrink-0 active:opacity-70'>
                <div className='w-16 h-16 rounded-2xl overflow-hidden relative border-2 border-white/8'>
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    className='object-cover'
                    sizes='64px'
                  />
                  <div className='absolute inset-0 bg-black/40' />
                  <span className='absolute inset-0 flex items-center justify-center text-2xl'>
                    {CUISINE_EMOJIS[c.name] ?? '🍽️'}
                  </span>
                </div>
                <span className='text-zinc-400 text-[10px] font-medium text-center w-16 leading-tight'>
                  {c.name.replace(' Cuisine', '')}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Loading Spinner ── */}
      {isLoading ? (
        <div className='flex items-center justify-center py-16'>
          <CgSpinner className='animate-spin text-[#fbbe15] text-3xl' />
        </div>
      ) : (
        <>
          {/* ── Top Picks Near You ── */}
          {topRestaurants.length > 0 && (
            <div className='mt-6'>
              <SectionHeader title='Top Picks Near You' />
              <div className='flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-2'>
                {topRestaurants.map((r) => (
                  <MobileRestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            </div>
          )}

          {/* ── Top Bukas ── */}
          {topBukas.length > 0 && (
            <div className='mt-6'>
              <SectionHeader title="Top Buka's" />
              <div className='flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-2'>
                {topBukas.map((r) => (
                  <MobileRestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            </div>
          )}

          {/* ── Hidden Gems — vertical list ── */}
          {hiddenGems.length > 0 && (
            <div className='mt-6 px-4'>
              <SectionHeader title='Hidden Gems' />
              <div className='flex flex-col gap-2.5'>
                {hiddenGems.slice(0, 6).map((r) => (
                  <MobileRestaurantRow key={r.id} restaurant={r} />
                ))}
              </div>
            </div>
          )}

          {/* ── Street Favorites ── */}
          {streetFavorites.length > 0 && (
            <div className='mt-6'>
              <SectionHeader title='Street Favorites' />
              <div className='flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-2'>
                {streetFavorites.map((r) => (
                  <MobileRestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── List Your Restaurant CTA ── */}
      <div className='mx-4 mt-6'>
        <button
          onClick={() => {
            requireAuth(() => {
              router.push('/buka/my-restaurant');
            });
          }}
          className='w-full flex items-center justify-between bg-linear-to-r from-[#fbbe15]/15 to-transparent border border-[#fbbe15]/25 rounded-2xl p-4 active:opacity-80 text-left cursor-pointer border-none'>
          <div>
            <p className='text-white font-bold text-sm'>List your restaurant</p>
            <p className='text-zinc-400 text-xs mt-0.5'>
              Get discovered by hungry food lovers
            </p>
          </div>
          <div className='w-10 h-10 rounded-full bg-[#fbbe15] flex items-center justify-center shrink-0'>
            <Plus size={20} className='text-[#1a1a1a]' />
          </div>
        </button>
      </div>

      {/* ── Waitlist Banner (unauthenticated) ── */}

      {/* ── Right-Side Nav Drawer ── */}
      <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen} direction='right'>
        <DrawerContent className='fixed top-0 bottom-0 right-0 left-auto w-[78vw] max-w-[320px] h-full mt-0 rounded-none rounded-l-2xl bg-[#141414] border-l border-white/8 flex flex-col overflow-y-auto z-50'>
          <DrawerTitle>{''}</DrawerTitle>
          {/* Header */}
          <div className='flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/8'>
            <div className='flex items-center gap-2'>
              <Image
                src='/images/localBuka_logo.png'
                alt='LocalBuka'
                width={28}
                height={28}
                className='rounded-xl'
              />
              <span className='text-white font-bold text-base tracking-tight'>
                LocalBuka
              </span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className='w-8 h-8 flex items-center justify-center rounded-full bg-[#2a2a2a] text-zinc-400 active:opacity-70'>
              <X size={16} />
            </button>
          </div>

          {/* Profile pill (authenticated) */}
          {isAuthenticated && (
            <Link
              href='/profile'
              onClick={() => setIsMenuOpen(false)}
              className='flex items-center gap-3 mx-4 mt-4 p-3 rounded-xl bg-[#1e1e1e] border border-white/8 active:opacity-70'>
              <Image
                src={userAvatar!}
                alt='Profile'
                width={36}
                height={36}
                className='rounded-full object-cover ring-2 ring-[#fbbe15]/40'
                style={{width: 36, height: 36}}
              />
              <div className='flex flex-col min-w-0'>
                <span className='text-white text-sm font-semibold truncate'>
                  {user?.fullName || user?.username || 'My Profile'}
                </span>
                <span className='text-zinc-500 text-xs truncate'>
                  @{user?.username || 'profile'}
                </span>
              </div>
            </Link>
          )}

          {/* Nav Items */}
          <nav className='flex flex-col gap-1 px-3 mt-4 flex-1'>
            {navItems.map((item) => {
              const isActive = isItemActive(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavItemClick(e, item)}
                  className={cn(
                    'flex items-center gap-3.5 px-3 py-3 rounded-xl text-[15px] font-medium transition-colors active:opacity-70 relative',
                    isActive
                      ? 'bg-[#fbbe15]/10 text-[#fbbe15]'
                      : 'text-zinc-300 hover:bg-white/5',
                  )}>
                  {item.id === 'profile' && userAvatar ? (
                    <Image
                      src={userAvatar}
                      alt='Profile'
                      width={22}
                      height={22}
                      className={cn(
                        'rounded-full object-cover',
                        isActive ? 'ring-2 ring-[#fbbe15]' : '',
                      )}
                      style={{width: 22, height: 22}}
                    />
                  ) : (
                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  )}
                  <span>{item.label}</span>
                  {item.id === 'notifications' && unreadCount > 0 && (
                    <span className='ml-auto min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1'>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className='px-5 pb-8 pt-4 border-t border-white/8 mt-auto flex flex-col gap-1.5'>
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target='_blank'
                className='text-xs text-zinc-500 hover:text-zinc-300 transition-colors'>
                {link.label}
              </Link>
            ))}
            <span className='text-[11px] text-zinc-700 mt-1'>
              &copy; {year} LocalBuka
            </span>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
