'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, Menu, X, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { SearchOverlay } from '@/components/layout/SearchOverlay';
import { NotificationOverlay } from '@/components/layout/NotificationOverlay';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useUnreadCount } from '@/lib/api/services/notifications.hooks';
import { feedStore, type FeedType } from '@/lib/feed-state';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useTranslation } from '@/context/LanguageContext';
import {
  getDesktopNavItems,
  getMobileBottomNavItems,
  getMobileDrawerNavItems,
  FOOTER_LINKS,
  type NavItemConfig,
} from './sidebar.config';

const navKeyMap: Record<string, string> = {
  home: 'nav.home',
  buka: 'nav.buka',
  'list-restaurant': 'nav.listRestaurant',
  upload: 'nav.upload',
  notifications: 'nav.notifications',
  saved: 'nav.saved',
  community: 'nav.community',
  rewards: 'nav.rewards',
  profile: 'nav.profile',
};

export function Sidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { requireAuth } = useRequireAuth();
  const { user, isAuthenticated } = useAuth();

  const isFeedPage = pathname === '/' || pathname === '/feeds';
  const typeParam = searchParams.get('type');
  const feedType: FeedType = typeParam === 'following' ? 'following' : 'foryou';

  const setFeedType = (type: FeedType) => {
    router.push(`/?type=${type}`);
  };

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userAvatar = isAuthenticated
    ? user?.avatar || '/images/profile.png'
    : null;

  // Modular nav item lists based on auth state
  const desktopNavItems = getDesktopNavItems(isAuthenticated);
  const mobileBottomNavItems = getMobileBottomNavItems(isAuthenticated);
  const mobileDrawerNavItems = getMobileDrawerNavItems(isAuthenticated);

  // Fetch unread notification count
  const { data: unreadCountResponse } = useUnreadCount();
  const unreadCount = (unreadCountResponse as any)?.data?.count ?? 0;

  const isCollapsed = isSearchOpen || isNotificationOpen;

  /**
   * Determine if a navigation link is currently active
   */
  const isItemActive = (itemHref: string) => {
    if (!pathname) return false;
    if (itemHref === '#') return false;

    // Handle query param match (e.g. /profile?tab=saved)
    if (itemHref.includes('?')) {
      const [itemPath, queryString] = itemHref.split('?');
      if (pathname !== itemPath) return false;
      const params = new URLSearchParams(queryString);
      for (const [key, value] of params.entries()) {
        if (searchParams.get(key) !== value) return false;
      }
      return true;
    }

    // Profile without query params shouldn't be active if tab=saved is active
    if (itemHref === '/profile') {
      if (pathname !== '/profile') return false;
      return searchParams.get('tab') !== 'saved';
    }

    // Standalone check for Buka vs List Restaurant
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

    if (itemHref === '/') {
      return pathname === '/' || pathname === '/feeds';
    }

    return pathname.startsWith(itemHref);
  };

  /**
   * Centralized click handler for any nav item.
   * Handles auth prompting, overlays, and feed resetting.
   */
  const handleNavItemClick = (
    e: React.MouseEvent,
    item: NavItemConfig,
    options?: { isDrawer?: boolean }
  ) => {
    if (options?.isDrawer) {
      setIsMenuOpen(false);
    }

    // 1. Auth-prompt check
    if (item.authRequirement === 'auth-prompt' && !isAuthenticated) {
      e.preventDefault();
      requireAuth(() => router.push(item.href));
      return;
    }

    // 2. Action Type checks
    if (item.id === 'home') {
      // Explicit Home tap resets feed to top
      feedStore.reset();
    }

    if (item.actionType === 'notification-overlay') {
      e.preventDefault();
      setIsNotificationOpen(true);
      setIsSearchOpen(false);
      return;
    }

    // Close overlays if navigating to a normal link
    setIsSearchOpen(false);
    setIsNotificationOpen(false);
  };

  const year = new Date().getFullYear();

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        className={cn(
          'hidden md:flex flex-col justify-between p-6 min-h-screen border-r border-white/5 bg-[#1a1a1a] transition-[width] duration-300 z-50 sticky top-0 h-screen overflow-y-auto scrollbar-hide',
          isCollapsed ? 'w-20 px-3 items-center' : 'w-60'
        )}>
        <div
          className={cn(
            'flex flex-col gap-6',
            isCollapsed ? 'w-full items-center' : ''
          )}>
          {/* Logo */}
          <Link
            href='/'
            className={cn(
              'flex items-center gap-1 py-2 text-2xl font-bold italic',
              isCollapsed ? 'justify-center' : ''
            )}>
            {!isCollapsed && (
              <span className='text-xl md:text-2xl text-white font-normal font-display'>
                LocalBuka
              </span>
            )}
            <Image
              src='/images/localBuka_logo.png'
              alt='LocalBuka'
              width={40}
              height={40}
              className='h-8 w-8 rounded-full'
              priority
            />
          </Link>

          {/* Search Bar / Icon */}
          <div
            className={cn(
              'relative flex items-center cursor-pointer bg-[#2a2a2a] rounded-lg transition-all',
              isCollapsed ? 'w-10 h-10 justify-center mx-auto' : 'w-full'
            )}
            onClick={() => {
              setIsSearchOpen(true);
              setIsNotificationOpen(false);
            }}
            role='button'
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsSearchOpen(true);
                setIsNotificationOpen(false);
              }
            }}>
            {isCollapsed ? (
              <div
                className='w-[18px] h-[18px]'
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E")`,
                  backgroundSize: 'cover',
                }}
              />
            ) : (
              <>
                <Search className='absolute left-3 text-zinc-400' size={18} />
                <span className='w-full py-2.5 px-3 pl-10 text-sm text-zinc-400 rounded-lg'>
                  {t('nav.search', 'Search')}
                </span>
              </>
            )}
          </div>

          {/* Desktop Navigation Items */}
          <nav
            className={cn(
              'flex flex-col gap-1 mt-4',
              isCollapsed ? 'w-full' : ''
            )}>
            {desktopNavItems.map((item) => {
              const isActive = isItemActive(item.href);
              const isNotificationItem = item.actionType === 'notification-overlay';
              const activeState =
                isNotificationItem && isNotificationOpen
                  ? true
                  : isActive && !isNotificationOpen;

              const displayLabel = navKeyMap[item.id]
                ? t(navKeyMap[item.id], item.label)
                : item.label;

              if (isNotificationItem && isAuthenticated) {
                return (
                  <div key={item.id}>
                    <button
                      onClick={(e) => handleNavItemClick(e, item)}
                      className={cn(
                        'w-full flex items-center gap-3.5 p-3 rounded-lg text-[15px] font-medium transition-colors cursor-pointer border-none bg-transparent relative',
                        activeState
                          ? 'text-[#fbbe15]'
                          : 'text-white hover:bg-white/5',
                        isCollapsed ? 'justify-center py-3' : ''
                      )}>
                      <div className='relative'>
                        <item.icon
                          size={22}
                          strokeWidth={activeState ? 2.5 : 2}
                        />
                        {unreadCount > 0 && (
                          <div className='absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse' />
                        )}
                      </div>
                      {!isCollapsed && <span>{displayLabel}</span>}
                    </button>
                  </div>
                );
              }

              return (
                <div key={item.id}>
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavItemClick(e, item)}
                    className={cn(
                      'flex items-center gap-3.5 p-3 rounded-lg text-[15px] font-medium transition-colors',
                      activeState
                        ? 'text-[#fbbe15]'
                        : 'text-white hover:bg-white/5',
                      isCollapsed ? 'justify-center py-3' : ''
                    )}>
                    {item.id === 'profile' && userAvatar ? (
                      <Image
                        src={userAvatar}
                        alt='Profile'
                        width={22}
                        height={22}
                        className={cn(
                          'rounded-full object-cover',
                          activeState ? 'ring-2 ring-[#fbbe15]' : ''
                        )}
                        style={{ width: 22, height: 22 }}
                      />
                    ) : (
                      <item.icon
                        size={22}
                        strokeWidth={activeState ? 2.5 : 2}
                      />
                    )}
                    {!isCollapsed && <span>{displayLabel}</span>}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className='flex flex-col gap-6 pt-4 mt-auto'>
          {!isCollapsed && (
            <footer className='flex flex-col gap-2'>
              <div className='flex flex-col gap-x-3 gap-y-1'>
                {FOOTER_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    target='_blank'
                    className='text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors whitespace-nowrap'>
                    {link.label}
                  </Link>
                ))}
              </div>
              <Link href='/company' className='text-[11px] text-zinc-600 mt-1'>
                &copy; {year} LocalBuka
              </Link>
            </footer>
          )}
        </div>
      </aside>

      {/* ── Mobile Top Header ── */}
      <div
        className={cn(
          'md:hidden fixed top-0 left-0 right-0 h-14 z-50 flex items-center justify-between px-4 transition-all duration-300',
          isFeedPage
            ? 'bg-transparent border-none'
            : 'bg-[#1a1a1a] border-b border-white/5'
        )}>
        <button
          onClick={() => setIsMenuOpen(true)}
          className='w-8 flex items-center justify-start text-white hover:opacity-80 active:opacity-75 transition-opacity cursor-pointer border-none bg-transparent'>
          <Menu size={22} />
        </button>

        {isFeedPage ? (
          <div className='flex items-center gap-5 select-none'>
            <button
              onClick={() => alert('Community feed coming soon!')}
              className='text-[15px] font-bold text-white/50 hover:text-white transition-colors cursor-pointer bg-transparent border-none outline-none relative py-1'>
              {t('nav.community', 'Community')}
            </button>
            <button
              onClick={() => {
                requireAuth(() => {
                  setFeedType('following');
                });
              }}
              className={cn(
                'text-[15px] font-bold transition-all bg-transparent border-none outline-none relative py-1 cursor-pointer',
                feedType === 'following'
                  ? 'text-white'
                  : 'text-white/50 hover:text-white'
              )}>
              {t('nav.following', 'Following')}
              {feedType === 'following' && (
                <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-white rounded-full shadow-xs' />
              )}
            </button>
            <button
              onClick={() => setFeedType('foryou')}
              className={cn(
                'text-[15px] font-bold transition-all bg-transparent border-none outline-none relative py-1 cursor-pointer',
                feedType === 'foryou'
                  ? 'text-white'
                  : 'text-white/50 hover:text-white'
              )}>
              {t('nav.forYou', 'For You')}
              {feedType === 'foryou' && (
                <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-white rounded-full shadow-xs' />
              )}
            </button>
          </div>
        ) : (
          <div className='flex items-center gap-2'>
            <span
              className='text-xl text-white font-normal'
              style={{ fontFamily: 'var(--font-hakuna), sans-serif' }}>
              LocalBuka
            </span>
            <Image
              src='/images/localBuka_logo.png'
              alt='LocalBuka'
              width={24}
              height={24}
              className='h-6 w-6 rounded-full'
            />
          </div>
        )}

        <button
          onClick={() => {
            setIsSearchOpen(true);
            setIsNotificationOpen(false);
          }}
          className='w-8 flex justify-end text-white hover:opacity-80 active:opacity-75 transition-opacity cursor-pointer border-none bg-transparent outline-none'>
          <Search size={22} />
        </button>
      </div>

      {/* ── Mobile Bottom Navigation Bar ── */}
      <div className='md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#1a1a1a] border-t border-white/5 flex items-center justify-around z-50 pb-safe'>
        {mobileBottomNavItems.map((item) => {
          const isActive = isItemActive(item.href);
          const rawLabel = item.mobileBottomLabel || item.label;
          const displayLabel = item.mobileBottomLabel
            ? t('nav.inbox', item.mobileBottomLabel)
            : navKeyMap[item.id]
            ? t(navKeyMap[item.id], item.label)
            : rawLabel;

          // Special central upload button
          if (item.actionType === 'upload-button') {
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavItemClick(e, item)}
                className='flex flex-col items-center gap-1'>
                <PlusCircle
                  size={32}
                  className='fill-[#fbbe15] text-[#1a1a1a]'
                />
              </Link>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 w-12',
                isActive ? 'text-white' : 'text-zinc-500'
              )}
              onClick={(e) => handleNavItemClick(e, item)}>
              {item.id === 'profile' && userAvatar ? (
                <Image
                  src={userAvatar}
                  alt='Profile'
                  width={22}
                  height={22}
                  className={cn(
                    'rounded-full object-cover',
                    isActive ? 'ring-2 ring-white' : ''
                  )}
                  style={{ width: 22, height: 22 }}
                />
              ) : (
                <div className='relative'>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {item.id === 'notifications' && unreadCount > 0 && (
                    <div className='absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full' />
                  )}
                </div>
              )}
              <span className='text-[10px] font-medium'>{displayLabel}</span>
            </Link>
          );
        })}
      </div>

      {/* Overlays */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <NotificationOverlay
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* ── Mobile Left-Side Nav Drawer ── */}
      <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen} direction='left'>
        <DrawerContent className='fixed top-0 bottom-0 left-0 right-auto w-[78vw] max-w-[320px] h-full mt-0 rounded-none rounded-r-2xl bg-[#141414] border-r border-white/8 flex flex-col overflow-y-auto z-50'>
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
              className='w-8 h-8 flex items-center justify-center rounded-full bg-[#2a2a2a] text-zinc-400 active:opacity-70 border-none'>
              <X size={16} />
            </button>
          </div>

          {/* Profile pill (authenticated) */}
          {isAuthenticated && (
            <Link
              href='/profile'
              onClick={() => setIsMenuOpen(false)}
              className='flex items-center gap-3 mx-4 mt-4 p-3 rounded-xl bg-[#1e1e1e] border border-white/8 active:opacity-70'>
              {userAvatar && (
                <Image
                  src={userAvatar}
                  alt='Profile'
                  width={36}
                  height={36}
                  className='rounded-full object-cover ring-2 ring-[#fbbe15]/40'
                  style={{ width: 36, height: 36 }}
                />
              )}
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

          {/* Drawer Navigation Items */}
          <nav className='flex flex-col gap-1 px-3 mt-4 flex-1'>
            {mobileDrawerNavItems.map((item) => {
              const isActive = isItemActive(item.href);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={(e) =>
                    handleNavItemClick(e, item, { isDrawer: true })
                  }
                  className={cn(
                    'flex items-center gap-3.5 px-3 py-3 rounded-xl text-[15px] font-medium transition-colors active:opacity-70 relative',
                    isActive
                      ? 'bg-[#fbbe15]/10 text-[#fbbe15]'
                      : 'text-zinc-300 hover:bg-white/5'
                  )}>
                  {item.id === 'profile' && userAvatar ? (
                    <Image
                      src={userAvatar}
                      alt='Profile'
                      width={22}
                      height={22}
                      className={cn(
                        'rounded-full object-cover',
                        isActive ? 'ring-2 ring-[#fbbe15]' : ''
                      )}
                      style={{ width: 22, height: 22 }}
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
    </>
  );
}
