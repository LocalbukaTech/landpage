'use client';

import {useRef, useState, useEffect, useCallback} from 'react';
import {Volume2, VolumeX, MoreHorizontal, Play, Pause} from 'lucide-react';
import Image from 'next/image';
import type {Post} from '@/types/post';
import {VideoOverlay} from '@/components/video/VideoOverlay';

interface VideoPlayerProps {
  post: Post;
  isActive: boolean;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  isMuted: boolean;
  onMuteChange: (muted: boolean) => void;
  showTimestamp?: boolean;
}

export function VideoPlayer({
  post,
  isActive,
  onSwipeUp,
  onSwipeDown,
  isMuted,
  onMuteChange,
  showTimestamp,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const isScrolling = useRef(false);

  // Scrubber state
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Play/pause icon overlay state
  const [showPlayPauseIcon, setShowPlayPauseIcon] = useState(false);
  const [lastAction, setLastAction] = useState<'play' | 'pause'>('pause');
  const iconTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isVideo = post.mediaType === 'video';

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

    // Don't toggle play if we were swiping
    if (isScrolling.current) {
      isScrolling.current = false;
      return;
    }

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
    touchEndY.current = null;
    isScrolling.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    // Only process if we have valid start and end positions
    if (touchStartY.current === null || touchEndY.current === null) {
      touchStartY.current = null;
      touchEndY.current = null;
      return;
    }

    const diffY = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 50;

    if (Math.abs(diffY) > minSwipeDistance) {
      isScrolling.current = true;

      if (diffY > 0 && onSwipeUp) {
        // Swiped up - go to next video
        onSwipeUp();
      } else if (diffY < 0 && onSwipeDown) {
        // Swiped down - go to previous video
        onSwipeDown();
      }
    }

    // Reset touch positions
    touchStartY.current = null;
    touchEndY.current = null;
  };

  // Mouse wheel handler for desktop scrolling (with debounce)
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    // Debounce wheel events
    if (wheelTimeout.current) return;

    const minDelta = 50;

    if (Math.abs(e.deltaY) > minDelta) {
      if (e.deltaY > 0 && onSwipeUp) {
        // Scrolled down - go to next video
        onSwipeUp();
      } else if (e.deltaY < 0 && onSwipeDown) {
        // Scrolled up - go to previous video
        onSwipeDown();
      }

      // Set debounce timeout
      wheelTimeout.current = setTimeout(() => {
        wheelTimeout.current = null;
      }, 500);
    }
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
      onClick={togglePlay}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}>
      {isVideo ? (
        <video
          ref={videoRef}
          src={post.mediaUrl}
          poster={post.thumbnailUrl || undefined}
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
        <Image
          src={post.mediaUrl}
          alt={post.caption || 'Post Image'}
          fill
          className='object-cover'
          draggable={false}
          unoptimized
        />
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
      <div className='absolute top-3 left-3 right-3 flex justify-between items-center z-10'>
        {isVideo ? (
          <button
            className='flex items-center justify-center w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full text-white cursor-pointer transition-colors border-none'
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        ) : (
          <div />
        )}
        <button
          className='flex items-center justify-center w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full text-white cursor-pointer transition-colors border-none'
          onClick={(e) => e.stopPropagation()}
          aria-label='More options'>
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Video Overlay */}
      <VideoOverlay post={post} showTimestamp={showTimestamp} />

      {/* Scrubber / Progress Bar */}
      {isVideo && (
        <div
          className='absolute bottom-0 left-0 right-0 h-1 md:h-1.5 bg-white/30 cursor-pointer group hover:h-2 md:hover:h-3 transition-all duration-200 z-30'
          onClick={(e) => e.stopPropagation()}>
          <div
            className='absolute top-0 left-0 h-full bg-primary rounded-r-full pointer-events-none'
            style={{width: `${progress}%`}}
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
