'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, MoreHorizontal, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import type { Post } from '@/types/post';
import { VideoOverlay } from '@/components/video/VideoOverlay';
import { cn, ensureHttps } from '@/lib/utils';

interface VideoPlayerProps {
  post: Post;
  isActive: boolean;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  isMuted: boolean;
  onMuteChange: (muted: boolean) => void;
  showTimestamp?: boolean;
  onLikeToggle?: () => void;
}

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
}

export function VideoPlayer({
  post,
  isActive,
  onSwipeUp,
  onSwipeDown,
  isMuted,
  onMuteChange,
  showTimestamp = true,
  onLikeToggle,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [post.id]);

  // Scrubber state
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Play/pause icon overlay state
  const [showPlayPauseIcon, setShowPlayPauseIcon] = useState(false);
  const [lastAction, setLastAction] = useState<'play' | 'pause'>('pause');
  const iconTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isVideo = post.mediaType === 'video';
  const mediaUrls = post.mediaUrls || [];

  // Play/pause based on active state and video changes
  useEffect(() => {
    if (videoRef.current && isVideo) {
      if (isActive) {
        // Reset video to beginning when switching
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {
          // Autoplay might be blocked
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive, post.id, isVideo]);

  // Double-tap heart particles state
  const [heartParticles, setHeartParticles] = useState<HeartParticle[]>([]);
  const lastTapTimeRef = useRef<number>(0);
  const singleTapTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
    };
  }, []);

  const showIcon = useCallback((action: 'play' | 'pause') => {
    setLastAction(action);
    setShowPlayPauseIcon(true);
    if (iconTimeoutRef.current) clearTimeout(iconTimeoutRef.current);
    iconTimeoutRef.current = setTimeout(() => {
      setShowPlayPauseIcon(false);
    }, 800);
  }, []);

  useEffect(() => {
    return () => {
      if (iconTimeoutRef.current) clearTimeout(iconTimeoutRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (!isVideo) return; // Images don't play/pause

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        showIcon('pause');
      } else {
        videoRef.current.play();
        showIcon('play');
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't trigger tap if user was swiping/scrolling
    if (isScrolling.current) {
      isScrolling.current = false;
      return;
    }

    // Ignore clicks on buttons, inputs, links, or elements marked to prevent tap
    const target = e.target as HTMLElement;
    if (target.closest('button, input, a, [data-prevent-tap]')) {
      return;
    }

    const now = Date.now();
    const DOUBLE_TAP_DELAY = 280;

    if (now - lastTapTimeRef.current < DOUBLE_TAP_DELAY) {
      // DOUBLE TAP DETECTED!
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
        singleTapTimerRef.current = null;
      }

      const rect = containerRef.current?.getBoundingClientRect();
      const x = rect ? e.clientX - rect.left : 200;
      const y = rect ? e.clientY - rect.top : 300;
      const rotation = (Math.random() - 0.5) * 30;

      const particleId = now + Math.random();
      setHeartParticles((prev) => [...prev, { id: particleId, x, y, rotation }]);

      setTimeout(() => {
        setHeartParticles((prev) => prev.filter((p) => p.id !== particleId));
      }, 1000);

      onLikeToggle?.();
      lastTapTimeRef.current = 0;
    } else {
      lastTapTimeRef.current = now;

      if (isVideo) {
        if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
        singleTapTimerRef.current = setTimeout(() => {
          togglePlay();
          singleTapTimerRef.current = null;
        }, DOUBLE_TAP_DELAY);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current && isVideo) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      onMuteChange(newMuted);
    }
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
    touchEndY.current = null;
    touchEndX.current = null;
    isScrolling.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartY.current === null || touchEndY.current === null) {
      if (touchStartX.current !== null && touchEndX.current !== null) {
        const diffX = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50;
        if (Math.abs(diffX) > minSwipeDistance && !isVideo && mediaUrls.length > 1) {
          if (diffX > 0 && activeImageIndex < mediaUrls.length - 1) {
            setActiveImageIndex((prev) => prev + 1);
          } else if (diffX < 0 && activeImageIndex > 0) {
            setActiveImageIndex((prev) => prev - 1);
          }
        }
      }
      touchStartY.current = null;
      touchEndY.current = null;
      touchStartX.current = null;
      touchEndX.current = null;
      return;
    }

    const diffY = touchStartY.current - touchEndY.current;
    const diffX = touchStartX.current !== null && touchEndX.current !== null 
      ? touchStartX.current - touchEndX.current 
      : 0;

    const minSwipeDistance = 50;

    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > minSwipeDistance) {
      isScrolling.current = true;
      if (diffY > 0 && onSwipeUp) {
        onSwipeUp();
      } else if (diffY < 0 && onSwipeDown) {
        onSwipeDown();
      }
    } else if (Math.abs(diffX) > minSwipeDistance && !isVideo && mediaUrls.length > 1) {
      isScrolling.current = true;
      if (diffX > 0 && activeImageIndex < mediaUrls.length - 1) {
        setActiveImageIndex((prev) => prev + 1);
      } else if (diffX < 0 && activeImageIndex > 0) {
        setActiveImageIndex((prev) => prev - 1);
      }
    }

    touchStartY.current = null;
    touchEndY.current = null;
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Video scrubber handlers
  const handleTimeUpdate = () => {
    if (videoRef.current && !isDragging) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      if (dur > 0) {
        setProgress((current / dur) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (videoRef.current) {
      const newTime = (newProgress / 100) * duration;
      videoRef.current.currentTime = newTime;
    }
  };

  const handleSeekStart = () => setIsDragging(true);
  const handleSeekEnd = () => setIsDragging(false);

  return (
    <div
      ref={containerRef}
      className={`relative w-[420px] h-full bg-black rounded-2xl overflow-hidden ${isVideo ? 'cursor-pointer' : ''}`}
      onClick={handleContainerClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}>
      <style jsx global>{`
        @keyframes heartPopBounce {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.2);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.35);
          }
          35% {
            transform: translate(-50%, -50%) scale(0.92);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
          }
          75% {
            opacity: 1;
            transform: translate(-50%, -85%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -135%) scale(0.75);
          }
        }
      `}</style>

      {/* Double Tap Heart Particles Overlay */}
      {heartParticles.map((particle) => (
        <div
          key={particle.id}
          className='absolute z-40 pointer-events-none select-none flex items-center justify-center -translate-x-1/2 -translate-y-1/2'
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            animation: 'heartPopBounce 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          }}>
          {/* Radial Aura */}
          <div className='absolute w-24 h-24 rounded-full bg-red-500/25 blur-lg pointer-events-none' />

          {/* Heart Icon */}
          <svg
            width='90'
            height='90'
            viewBox='0 0 24 24'
            style={{ transform: `rotate(${particle.rotation}deg)` }}
            className='drop-shadow-[0_4px_20px_rgba(239,68,68,0.95)] filter transition-transform'>
            <defs>
              <linearGradient id={`heartGrad-${particle.id}`} x1='0%' y1='0%' x2='100%' y2='100%'>
                <stop offset='0%' stopColor='#ff2b56' />
                <stop offset='50%' stopColor='#ef4444' />
                <stop offset='100%' stopColor='#fbbe15' />
              </linearGradient>
            </defs>
            <path
              fill={`url(#heartGrad-${particle.id})`}
              strokeLinejoin='round'
              d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
            />
          </svg>
        </div>
      ))}
      {isVideo ? (
        <video
          ref={videoRef}
          src={ensureHttps(post.mediaUrl)}
          poster={post.thumbnailUrl ? ensureHttps(post.thumbnailUrl) : undefined}
          className='w-full h-full object-cover'
          loop
          muted={isMuted}
          playsInline
          preload='auto'
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      ) : (
        <div className='relative w-full h-full overflow-hidden select-none'>
          {/* Slide container shifting horizontally */}
          <div 
            className='flex w-full h-full transition-transform duration-300 ease-out'
            style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
          >
            {(mediaUrls.length > 0 ? mediaUrls : [post.mediaUrl]).map((url, idx) => (
              <div key={idx} className='w-full h-full flex-shrink-0 relative flex items-center justify-center bg-black'>
                <img
                  src={ensureHttps(url)}
                  alt={post.caption || `Post Image ${idx + 1}`}
                  className='w-full h-full object-cover md:object-contain'
                  draggable={false}
                />

                {/* Slide Text Overlay Caption */}
                {post.imageCaptions && post.imageCaptions[idx] && (
                  <div className='absolute inset-0 flex items-center justify-center p-4 pointer-events-none z-10 select-none'>
                    <span 
                      className='text-white font-extrabold text-2xl md:text-3xl text-center break-words drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] font-sans max-w-[90%]'
                      style={{ textShadow: '0px 0px 4px rgba(0,0,0,1), -1px -1px 0px rgba(0,0,0,1), 1px -1px 0px rgba(0,0,0,1), -1px 1px 0px rgba(0,0,0,1), 1px 1px 0px rgba(0,0,0,1)' }}
                    >
                      {post.imageCaptions[idx]}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {mediaUrls.length > 1 && (
            <div className='hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 items-center gap-3.5 z-20 bg-black/45 px-3 py-1.5 rounded-full backdrop-blur-xs shadow-md border border-white/10'>
              {/* Left Chevron Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeImageIndex > 0) {
                    setActiveImageIndex((prev) => prev - 1);
                  }
                }}
                disabled={activeImageIndex === 0}
                className='text-white/80 hover:text-white disabled:opacity-20 cursor-pointer border-none bg-transparent flex items-center justify-center p-0.5 transition-all outline-none disabled:cursor-not-allowed'
                aria-label='Previous slide'
              >
                <ChevronLeft size={16} />
              </button>

              {/* Dots */}
              <div className='flex gap-1.5 items-center select-none'>
                {mediaUrls.map((_: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex(idx);
                    }}
                    className={cn(
                      'w-1.5 h-1.5 rounded-full border-none p-0 cursor-pointer transition-all',
                      idx === activeImageIndex ? 'bg-[#FFC727] scale-110' : 'bg-white/50 hover:bg-white/80'
                    )}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Right Chevron Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeImageIndex < mediaUrls.length - 1) {
                    setActiveImageIndex((prev) => prev + 1);
                  }
                }}
                disabled={activeImageIndex === mediaUrls.length - 1}
                className='text-white/80 hover:text-white disabled:opacity-20 cursor-pointer border-none bg-transparent flex items-center justify-center p-0.5 transition-all outline-none disabled:cursor-not-allowed'
                aria-label='Next slide'
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* TikTok-style Play/Pause Icon Overlay */}
      {isVideo && showPlayPauseIcon && (
        <div
          className='absolute inset-0 flex items-center justify-center z-20 pointer-events-none'
          style={{
            animation: 'playPauseFade 0.8s ease-out forwards',
          }}>
          <div className='w-20 h-20 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm'>
            {lastAction === 'pause' ? (
              <Pause size={40} className='text-white' fill='white' />
            ) : (
              <Play size={40} className='text-white ml-1' fill='white' />
            )}
          </div>
        </div>
      )}

      {/* Paused state — persistent subtle icon */}
      {isVideo && !isPlaying && !showPlayPauseIcon && (
        <div className='absolute inset-0 flex items-center justify-center z-20 pointer-events-none'>
          <div className='w-20 h-20 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-sm opacity-70'>
            <Play size={40} className='text-white ml-1' fill='white' />
          </div>
        </div>
      )}

      {/* Top Controls */}
      <div className='absolute top-3 left-3 right-3 flex justify-between items-start z-10'>
        {isVideo ? (
          <button
            className='mt-16 md:mt-0 ml-4 md:ml-0 flex items-center justify-center w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full text-white cursor-pointer transition-colors border-none'
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        ) : (
          <div />
        )}
      </div>

      {/* Video Overlay */}
      <VideoOverlay 
        post={post} 
        showTimestamp={showTimestamp} 
        activeImageIndex={activeImageIndex}
        setActiveImageIndex={setActiveImageIndex}
      />

      {/* Scrubber / Progress Bar */}
      {isVideo && (
        <div
          className='absolute bottom-0 left-0 right-0 h-1 md:h-1.5 bg-white/30 cursor-pointer group hover:h-2 md:hover:h-3 transition-all duration-200 z-30'
          onClick={(e) => e.stopPropagation()}>
          <div
            className='absolute top-0 left-0 h-full bg-primary rounded-r-full pointer-events-none'
            style={{ width: `${progress}%` }}
          />
          <input
            type='range'
            min='0'
            max='100'
            step='0.1'
            value={progress}
            onChange={handleSeek}
            onMouseDown={handleSeekStart}
            onMouseUp={handleSeekEnd}
            onTouchStart={handleSeekStart}
            onTouchEnd={handleSeekEnd}
            className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
          />
        </div>
      )}
    </div>
  );
}
