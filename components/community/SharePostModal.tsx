'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Check, Copy, Link2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export type SharePlatform =
  | 'whatsapp'
  | 'instagram'
  | 'snapchat'
  | 'x'
  | 'facebook'
  | 'copy_link';

export interface ShareablePost {
  id: string;
  username: string;
  avatar?: string;
  text: string;
  image?: string;
}

export interface SharePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: ShareablePost | null;
  communityId: string;
  communityName: string;
  onShareRecorded?: (postId: string, platform: SharePlatform) => void;
}

export function SharePostModal({
  isOpen,
  onClose,
  post,
  communityId,
  communityName,
  onShareRecorded,
}: SharePostModalProps) {
  const { toast } = useToast();
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const copied = Boolean(isOpen && post?.id && copiedPostId === post.id);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'https://localbuka.com';

  const shareUrl = `${origin}/community/${encodeURIComponent(communityId)}/feed?post=${encodeURIComponent(post.id)}`;
  const shortText =
    post.text.length > 140 ? `${post.text.slice(0, 137)}...` : post.text;
  const shareText = `${post.username} in ${communityName}: "${shortText}"`;

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      // Fallback for older browsers / insecure contexts
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  };

  const handleCopyLink = async () => {
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      setCopiedPostId(post.id);
      onShareRecorded?.(post.id, 'copy_link');
      toast({
        title: 'Link Copied!',
        description: 'Post URL copied to your clipboard.',
      });
      setTimeout(() => setCopiedPostId(null), 2500);
    } else {
      toast({
        title: 'Copy failed',
        description: 'Select the URL box and copy manually.',
        variant: 'destructive',
      });
    }
  };

  const handlePlatformShare = async (platform: Exclude<SharePlatform, 'copy_link'>) => {
    onShareRecorded?.(post.id, platform);

    if (platform === 'whatsapp') {
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (platform === 'x') {
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (platform === 'facebook') {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (platform === 'instagram') {
      await copyToClipboard(`${shareText} ${shareUrl}`);
      toast({
        title: 'Copied for Instagram!',
        description: 'Link copied — paste it into your Instagram Story, DM, or Bio.',
      });
      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
      return;
    }

    if (platform === 'snapchat') {
      await copyToClipboard(shareUrl);
      toast({
        title: 'Opening Snapchat…',
        description: 'Post link is also copied to your clipboard.',
      });
      const snapUrl = `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(shareUrl)}`;
      window.open(snapUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200'
      onClick={onClose}
      role='dialog'
      aria-modal='true'
      aria-labelledby='share-modal-title'
    >
      <div
        className='relative w-full max-w-[460px] rounded-[22px] bg-[#1a1a1d] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] p-6 text-white animate-in zoom-in-95 duration-200 space-y-5'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between'>
          <h3 id='share-modal-title' className='text-lg font-bold tracking-tight text-white'>
            Share post
          </h3>
          <button
            type='button'
            onClick={onClose}
            className='p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer'
            aria-label='Close share dialog'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Post Preview */}
        <div className='flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/8'>
          {post.image ? (
            <div className='relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-zinc-800'>
              <Image
                src={post.image}
                alt={post.username}
                fill
                unoptimized
                className='object-cover'
              />
            </div>
          ) : (
            <div className='relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-zinc-800 border border-white/10'>
              <Image
                src={post.avatar || '/images/community/avatar-1.png'}
                alt={post.username}
                fill
                unoptimized
                className='object-cover'
              />
            </div>
          )}
          <div className='min-w-0 flex-1'>
            <p className='text-xs font-semibold text-[#FFC533] truncate'>
              {communityName} · <span className='text-zinc-300 font-medium'>{post.username}</span>
            </p>
            <p className='text-xs text-zinc-300 line-clamp-2 mt-0.5 leading-relaxed'>
              {post.text || 'Check out this post on LocalBuka'}
            </p>
          </div>
        </div>

        {/* Social Platforms Grid */}
        <div className='space-y-2.5'>
          <p className='text-xs font-medium text-zinc-400 uppercase tracking-wider'>
            Share via
          </p>
          <div className='grid grid-cols-5 gap-2.5'>
            {/* WhatsApp */}
            <button
              type='button'
              onClick={() => void handlePlatformShare('whatsapp')}
              className='flex flex-col items-center gap-2 group cursor-pointer'
            >
              <div className='w-12 h-12 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/30 group-hover:bg-[#25D366] text-[#25D366] group-hover:text-white flex items-center justify-center transition-all group-hover:scale-105 shadow-md'>
                <svg width='22' height='22' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M12.031 2C6.508 2 2.025 6.483 2.025 12.006c0 1.763.461 3.485 1.337 5.002L2 22l5.125-1.344a9.956 9.956 0 0 0 4.906 1.288h.004c5.522 0 10.005-4.484 10.006-10.007A9.946 9.946 0 0 0 19.11 4.93 9.943 9.943 0 0 0 12.031 2zm5.82 14.23c-.246.693-1.43 1.326-1.976 1.408-.503.076-1.14.108-1.842-.115-.426-.135-.972-.317-1.674-.62-2.944-1.271-4.866-4.242-5.013-4.438-.147-.196-1.196-1.592-1.196-3.038 0-1.445.758-2.156 1.027-2.45.269-.294.588-.368.784-.368.196 0 .392.002.564.01.181.009.423-.068.662.505.246.588.833 2.034.907 2.181.073.147.122.318.024.514-.098.196-.147.318-.294.49-.147.171-.309.383-.441.514-.147.147-.3.307-.129.601.171.294.762 1.257 1.636 2.036 1.124 1.002 2.071 1.313 2.365 1.46.294.147.465.122.637-.074.171-.196.735-.858.931-1.152.196-.294.392-.245.662-.147.269.098 1.715.809 2.009.956.294.147.49.221.563.343.074.122.074.711-.172 1.404z' />
                </svg>
              </div>
              <span className='text-[11px] font-medium text-zinc-300 group-hover:text-white'>
                WhatsApp
              </span>
            </button>

            {/* Instagram */}
            <button
              type='button'
              onClick={() => void handlePlatformShare('instagram')}
              className='flex flex-col items-center gap-2 group cursor-pointer'
            >
              <div className='w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f09433]/20 via-[#dc2743]/20 to-[#bc1888]/20 border border-[#dc2743]/35 group-hover:from-[#f09433] group-hover:via-[#dc2743] group-hover:to-[#bc1888] text-[#f77737] group-hover:text-white flex items-center justify-center transition-all group-hover:scale-105 shadow-md'>
                <svg width='21' height='21' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <rect width='20' height='20' x='2' y='2' rx='5' ry='5' />
                  <path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' />
                  <line x1='17.5' x2='17.51' y1='6.5' y2='6.5' />
                </svg>
              </div>
              <span className='text-[11px] font-medium text-zinc-300 group-hover:text-white'>
                Instagram
              </span>
            </button>

            {/* Snapchat */}
            <button
              type='button'
              onClick={() => void handlePlatformShare('snapchat')}
              className='flex flex-col items-center gap-2 group cursor-pointer'
            >
              <div className='w-12 h-12 rounded-2xl bg-[#FFFC00]/15 border border-[#FFFC00]/35 group-hover:bg-[#FFFC00] text-[#FFFC00] group-hover:text-black flex items-center justify-center transition-all group-hover:scale-105 shadow-md'>
                <svg width='22' height='22' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M12.166 3C8.555 3 6.86 5.588 6.86 8.308c0 .903.112 1.727.177 2.263-.217.114-.524.185-.843.185-.318 0-.64-.086-.906-.22a.896.896 0 0 0-.402-.096c-.456 0-.826.317-.826.736 0 .548.552.86 1.37 1.15.276.098.613.217.756.405.134.178.082.46-.038.742-.43 1.015-1.56 2.51-3.36 2.912-.413.092-.688.366-.688.724 0 .647.926 1.01 2.238 1.228.146.024.24.16.298.374.115.424.228.867.743.867.224 0 .485-.062.815-.126.447-.086.995-.183 1.662-.183.633 0 1.222.142 1.87.488.622.333 1.326.71 2.44.71 1.113 0 1.818-.377 2.44-.71.648-.346 1.237-.488 1.87-.488.667 0 1.215.097 1.662.183.33.064.591.126.815.126.515 0 .628-.443.743-.867.058-.214.152-.35.298-.374 1.312-.218 2.238-.581 2.238-1.228 0-.358-.275-.632-.688-.724-1.8-.402-2.93-1.897-3.36-2.912-.12-.282-.172-.564-.038-.742.143-.188.48-.307.756-.405.818-.29 1.37-.602 1.37-1.15 0-.419-.37-.736-.826-.736-.14 0-.277.033-.402.096-.266.134-.588.22-.906.22-.319 0-.626-.071-.843-.185.065-.536.177-1.36.177-2.263C17.472 5.588 15.777 3 12.166 3z' />
                </svg>
              </div>
              <span className='text-[11px] font-medium text-zinc-300 group-hover:text-white'>
                Snapchat
              </span>
            </button>

            {/* X / Twitter */}
            <button
              type='button'
              onClick={() => void handlePlatformShare('x')}
              className='flex flex-col items-center gap-2 group cursor-pointer'
            >
              <div className='w-12 h-12 rounded-2xl bg-white/10 border border-white/20 group-hover:bg-white text-white group-hover:text-black flex items-center justify-center transition-all group-hover:scale-105 shadow-md'>
                <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                </svg>
              </div>
              <span className='text-[11px] font-medium text-zinc-300 group-hover:text-white'>
                X
              </span>
            </button>

            {/* Facebook */}
            <button
              type='button'
              onClick={() => void handlePlatformShare('facebook')}
              className='flex flex-col items-center gap-2 group cursor-pointer'
            >
              <div className='w-12 h-12 rounded-2xl bg-[#1877F2]/15 border border-[#1877F2]/35 group-hover:bg-[#1877F2] text-[#1877F2] group-hover:text-white flex items-center justify-center transition-all group-hover:scale-105 shadow-md'>
                <svg width='21' height='21' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                </svg>
              </div>
              <span className='text-[11px] font-medium text-zinc-300 group-hover:text-white'>
                Facebook
              </span>
            </button>
          </div>
        </div>

        {/* Copy URL Section */}
        <div className='space-y-2 pt-1'>
          <label
            htmlFor='share-post-url-input'
            className='text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5'
          >
            <Link2 className='w-3.5 h-3.5' />
            Copy post link
          </label>
          <div className='flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-[#121214] border border-white/10 focus-within:border-[#FFC533]/60 transition-colors'>
            <input
              id='share-post-url-input'
              type='text'
              readOnly
              value={shareUrl}
              onFocus={(e) => e.currentTarget.select()}
              className='flex-1 min-w-0 bg-transparent text-xs sm:text-sm text-zinc-300 focus:outline-none truncate'
            />
            <button
              type='button'
              onClick={() => void handleCopyLink()}
              className={`shrink-0 px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                copied
                  ? 'bg-[#22C55E] text-white'
                  : 'bg-[#FFC533] hover:bg-[#e6b12d] text-black'
              }`}
            >
              {copied ? (
                <>
                  <Check className='w-3.5 h-3.5 stroke-[2.5]' />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className='w-3.5 h-3.5' />
                  Copy URL
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
