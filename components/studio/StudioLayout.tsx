'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Video,
  Image as ImageIcon,
  PlusCircle,
  ArrowLeft,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import {useMe} from '@/lib/api/services/auth.hooks';
import { ensureHttps } from '@/lib/utils';

interface StudioLayoutProps {
  children: React.ReactNode;
  activeTab: 'overview' | 'videos' | 'images' | 'create' | 'edit';
  onTabChange: (tab: 'overview' | 'videos' | 'images' | 'create' | 'edit') => void;
  onOpenCreate: () => void;
}

export function StudioLayout({
  children,
  activeTab,
  onTabChange,
  onOpenCreate,
}: StudioLayoutProps) {
  const {data: meResponse} = useMe();
  const user = (meResponse as any)?.data?.data || (meResponse as any)?.data;

  // Collapsible Desktop Sidebar state
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Mobile Drawer state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Determine display values
  const displayName =
    user?.fullName ||
    user?.username ||
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
    '';

  const studioNavItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'videos',
      label: 'Videos',
      icon: Video,
    },
    {
      id: 'images',
      label: 'Images',
      icon: ImageIcon,
    },
  ] as const;

  return (
    <div className='h-screen max-h-screen overflow-hidden bg-[#0b0b0e] text-white flex flex-col md:flex-row antialiased selection:bg-[#FBBE15] selection:text-black'>
      {/* ----------------- DESKTOP STUDIO SIDEBAR ----------------- */}
      <aside
        className={`hidden md:flex flex-col shrink-0 h-screen z-30 bg-[#121217] border-r border-white/10 shadow-2xl transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-56 lg:w-60'
        }`}>
        {/* Brand Header */}
        <div className='p-3.5 border-b border-white/10 flex items-center justify-between bg-[#121217] h-14 shrink-0'>
          <div className='flex items-center gap-2.5 min-w-0'>
            {!isCollapsed && (
              <div className='relative w-8 h-8 rounded-full overflow-hidden border border-[#FBBE15]/40 shadow-sm shrink-0 bg-black'>
                <Image
                  src='/images/localBuka_logo.png'
                  alt='Localbuka Studio'
                  fill
                  className='object-cover p-1 rounded-full'
                />
              </div>
            )}
            {!isCollapsed && (
              <div className='min-w-0 animate-in fade-in duration-200'>
                <span className='font-bold text-sm text-white tracking-tight block truncate'>
                  Localbuka Studio
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className='p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/10 shrink-0'
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Sticky Create / Upload Button */}
        <div className='p-3 border-b border-white/10 bg-[#121217] shrink-0'>
          <button
            onClick={onOpenCreate}
            className={`w-full bg-[#FBBE15] text-[#0b0b0e] font-bold rounded-lg hover:bg-amber-400 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-none shadow-sm ${
              isCollapsed ? 'p-2.5' : 'py-2.5 px-3 gap-2 text-xs'
            }`}
            title='Upload / Create New Post'>
            <PlusCircle size={17} className='stroke-[2.5] shrink-0' />
            {!isCollapsed && <span className='tracking-wide'>Upload Post</span>}
          </button>
        </div>

        {/* Studio Navigation Links */}
        <nav className='flex-1 p-2.5 space-y-1 overflow-y-auto scrollbar-hide'>
          {!isCollapsed && (
            <div className='px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500'>
              Dashboard Menu
            </div>
          )}

          {studioNavItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                title={item.label}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-left cursor-pointer border text-xs ${
                  isCollapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-[#FBBE15]/10 border-[#FBBE15]/30 text-white font-bold'
                    : 'bg-transparent border-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200 font-medium'
                }`}>
                <div
                  className={`p-1.5 rounded-md transition-colors shrink-0 ${
                    isActive
                      ? 'bg-[#FBBE15] text-black shadow-xs'
                      : 'bg-white/5 text-zinc-400'
                  }`}>
                  <Icon size={16} />
                </div>
                {!isCollapsed && (
                  <span className='flex-1 truncate tracking-tight'>
                    {item.label}
                  </span>
                )}
                {!isCollapsed && isActive && (
                  <div className='w-1.5 h-1.5 rounded-full bg-[#FBBE15] shrink-0' />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className='p-3 border-t border-white/10 bg-[#0e0e12] flex items-center justify-between shrink-0'>
          <div className='flex items-center gap-2 min-w-0'>
            <div className='relative w-8 h-8 rounded-full overflow-hidden border border-white/15 bg-zinc-800 shrink-0'>
              <Image
                src={
                  ensureHttps(user?.avatar || user?.profilePicture) ||
                  '/images/default-avatar.png'
                }
                alt={displayName || 'User Avatar'}
                fill
                className='object-cover'
              />
            </div>
            {!isCollapsed && (
              <div className='min-w-0 animate-in fade-in duration-150'>
                <div className='text-xs font-bold text-white truncate'>
                  {displayName || 'Creator'}
                </div>
                <div className='text-[10px] text-zinc-500 truncate'>
                  @{user?.username || 'user'}
                </div>
              </div>
            )}
          </div>

          <Link
            href='/feeds'
            className='p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors shrink-0'
            title='Exit Studio to Feed'>
            <LogOut size={15} />
          </Link>
        </div>
      </aside>

      {/* ----------------- MOBILE SLIDE-OUT DRAWER ----------------- */}
      {isMobileDrawerOpen && (
        <div className='fixed inset-0 z-50 md:hidden flex'>
          {/* Backdrop */}
          <div
            className='fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200'
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className='relative w-4/5 max-w-xs bg-[#121217] border-r border-white/10 h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200'>
            <div className='p-4 border-b border-white/10 flex items-center justify-between'>
              <div className='flex items-center gap-2.5'>
                <div className='relative w-8 h-8 rounded-full overflow-hidden border border-[#FBBE15]/40 bg-black'>
                  <Image
                    src='/images/localBuka_logo.png'
                    alt='Studio'
                    fill
                    className='object-cover p-0.5 rounded-full'
                  />
                </div>
                <span className='font-bold text-base text-white tracking-tight'>
                  Localbuka Studio
                </span>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className='p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10'>
                <X size={18} />
              </button>
            </div>

            <div className='p-3.5 border-b border-white/10'>
              <button
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  onOpenCreate();
                }}
                className='w-full py-2.5 px-4 bg-[#FBBE15] text-black font-bold rounded-lg flex items-center justify-center gap-2 text-xs shadow-md'>
                <PlusCircle size={17} />
                <span>Upload Post</span>
              </button>
            </div>

            <nav className='flex-1 p-3 space-y-1 overflow-y-auto'>
              {studioNavItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      onTabChange(item.id);
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-left border ${
                      isActive
                        ? 'bg-[#FBBE15]/15 border-[#FBBE15]/30 text-white font-bold'
                        : 'bg-transparent border-transparent text-zinc-400 hover:bg-white/5 font-medium'
                    }`}>
                    <Icon size={17} className={isActive ? 'text-[#FBBE15]' : ''} />
                    <span className='text-xs'>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className='p-3.5 border-t border-white/10 bg-[#0e0e12] flex items-center justify-between'>
              <div className='flex items-center gap-2.5'>
                <div className='relative w-8 h-8 rounded-full overflow-hidden border border-white/15 bg-zinc-800'>
                  <Image
                    src={
                      ensureHttps(user?.avatar || user?.profilePicture) ||
                      '/images/default-avatar.png'
                    }
                    alt={displayName || 'User Avatar'}
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='text-xs font-bold text-white truncate'>
                  {displayName || 'Creator'}
                </div>
              </div>
              <Link
                href='/feeds'
                className='text-xs font-bold text-[#FBBE15] hover:underline'>
                Exit Studio →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MAIN STUDIO CONTENT AREA ----------------- */}
      <main className='flex-1 flex flex-col min-w-0 h-screen max-h-screen overflow-hidden bg-[#0b0b0e] pb-14 md:pb-0'>
        {/* Top Header Bar */}
        <header className='h-14 shrink-0 px-4 md:px-6 border-b border-white/10 bg-[#121217] flex items-center justify-between z-20'>
          <div className='flex items-center gap-3'>
            {/* Mobile Drawer Trigger */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className='md:hidden p-1.5 rounded-lg bg-white/5 text-zinc-300 hover:text-white border border-white/10 cursor-pointer'
              title='Open Menu'>
              <Menu size={18} />
            </button>

            <h2 className='text-sm font-bold text-white capitalize flex items-center gap-2'>
              {activeTab === 'edit'
                ? 'Edit Post'
                : activeTab === 'create'
                ? 'Create New Post'
                : `${activeTab} Dashboard`}
            </h2>
          </div>

          <div className='flex items-center gap-2 md:gap-3'>
            <Link
              href='/feeds'
              className='text-xs font-bold text-zinc-400 hover:text-white transition-colors border border-white/10 px-2.5 py-1.5 rounded-lg bg-white/5 flex items-center gap-1'>
              <ArrowLeft size={13} className='hidden sm:inline' />
              <span>Exit Studio</span>
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <div className='flex-1 min-h-0 p-3 sm:p-4 md:p-6 overflow-y-auto'>{children}</div>
      </main>

      {/* ----------------- MOBILE BOTTOM NAVIGATION BAR ----------------- */}
      <nav className='md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#121217] border-t border-white/10 z-40 flex items-center justify-around px-2 shadow-xl'>
        <button
          onClick={() => onTabChange('overview')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-lg transition-all cursor-pointer ${
            activeTab === 'overview' ? 'text-[#FBBE15]' : 'text-zinc-400'
          }`}>
          <LayoutDashboard size={18} />
          <span className='text-[10px] font-bold'>Overview</span>
        </button>

        <button
          onClick={() => onTabChange('videos')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-lg transition-all cursor-pointer ${
            activeTab === 'videos' ? 'text-[#FBBE15]' : 'text-zinc-400'
          }`}>
          <Video size={18} />
          <span className='text-[10px] font-bold'>Videos</span>
        </button>

        <button
          onClick={onOpenCreate}
          className='flex flex-col items-center justify-center -mt-4 bg-[#FBBE15] text-black p-3 rounded-full shadow-lg cursor-pointer active:scale-95 transition-transform'>
          <PlusCircle size={20} className='stroke-[2.5]' />
        </button>

        <button
          onClick={() => onTabChange('images')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-lg transition-all cursor-pointer ${
            activeTab === 'images' ? 'text-[#FBBE15]' : 'text-zinc-400'
          }`}>
          <ImageIcon size={18} />
          <span className='text-[10px] font-bold'>Images</span>
        </button>
      </nav>
    </div>
  );
}
