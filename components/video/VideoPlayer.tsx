'use client';

import {useEffect, useRef, useState} from 'react';
import {Volume2, VolumeX} from 'lucide-react';
import Image from 'next/image';
import type {Post} from '@/types/post';
import {VideoOverlay} from '@/components/video/VideoOverlay';
import {getVideoThumbnailUrl} from '@/lib/utils';

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
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const isScrolling = useRef(false);
  const touchHandledRef = useRef(false);
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const isVideo = post.mediaType === 'video';

  const attemptPlay = (
    video: HTMLVideoElement,
    allowMutedFallback: boolean = true,
  ) => {
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setAutoplayBlocked(false);
        })
        .catch((error: unknown) => {
          if (
            error instanceof DOMException &&
            error.name === 'NotAllowedError'
          ) {
            if (allowMutedFallback && !video.muted) {
              video.muted = true;
              video.defaultMuted = true;
              onMuteChange(true);
              attemptPlay(video, false);
              return;
            }

            setAutoplayBlocked(true);
          }
        });
    }
  };

  const unmuteAndPlay = () => {
    if (!isVideo) return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.defaultMuted = false;
    onMuteChange(false);
    attemptPlay(video);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
    video.defaultMuted = isMuted;
    video.playsInline = true;
  }, [isMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;

    if (isActive) {
      video.muted = isMuted;
      video.defaultMuted = isMuted;
      video.playsInline = true;

      const frame = window.requestAnimationFrame(() => {
        if (video.readyState === 0) {
          video.load();
        }

        if (video.paused) {
          attemptPlay(video);
        }
      });

      return () => window.cancelAnimationFrame(frame);
    }

    video.pause();
    video.currentTime = 0;
    setAutoplayBlocked(false);
  }, [isActive, isMuted, isVideo, post.id]);

  const togglePlay = () => {
    if (!isVideo) return;

    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      attemptPlay(video);
      return;
    }

    video.pause();
    setAutoplayBlocked(false);
  };

  const handleUserPlayIntent = () => {
    const video = videoRef.current;
    if (!video || !isVideo) return;

    if (autoplayBlocked && video.paused && isMuted) {
      unmuteAndPlay();
      return;
    }

    togglePlay();
  };

  const toggleMute = () => {
    if (!isVideo) return;

    const video = videoRef.current;
    if (!video) return;

    const newMuted = !isMuted;
    video.muted = newMuted;
    video.defaultMuted = newMuted;
    onMuteChange(newMuted);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchEndY.current = null;
    isScrolling.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (touchStartY.current === null) {
      touchStartY.current = null;
      touchEndY.current = null;
      return;
    }

    const diffY =
      touchEndY.current !== null ? touchStartY.current - touchEndY.current : 0;

    touchStartY.current = null;
    touchEndY.current = null;

    const minSwipeDistance = 50;

    if (Math.abs(diffY) > minSwipeDistance) {
      isScrolling.current = true;
      if (diffY > 0 && onSwipeUp) onSwipeUp();
      else if (diffY < 0 && onSwipeDown) onSwipeDown();
      return;
    }

    isScrolling.current = false;
    touchHandledRef.current = true;
    setTimeout(() => {
      touchHandledRef.current = false;
    }, 600);
    handleUserPlayIntent();
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    if (wheelTimeout.current) return;

    const minDelta = 50;

    if (Math.abs(e.deltaY) > minDelta) {
      if (e.deltaY > 0 && onSwipeUp) {
        onSwipeUp();
      } else if (e.deltaY < 0 && onSwipeDown) {
        onSwipeDown();
      }

      wheelTimeout.current = setTimeout(() => {
        wheelTimeout.current = null;
      }, 500);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || isDragging) return;

    const current = video.currentTime;
    const total = video.duration;

    if (total > 0) {
      setProgress((current / total) * 100);
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
      className={`relative w-full md:w-[420px] h-full bg-black md:rounded-2xl overflow-hidden ${isVideo ? 'cursor-pointer' : ''}`}
      onClick={() => {
        if (touchHandledRef.current) return;
        handleUserPlayIntent();
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}>
      {isVideo ? (
        <video
          ref={(el) => {
            videoRef.current = el;
            if (el) {
              el.muted = isMuted;
              el.defaultMuted = isMuted;
              el.playsInline = true;
            }
          }}
          src={post.mediaUrl}
          poster={getVideoThumbnailUrl(post)}
          className='w-full h-full object-cover'
          loop
          autoPlay
          muted={isMuted}
          playsInline
          preload='auto'
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onLoadedData={(e) => {
            const video = e.currentTarget;
            if (isActive && video.paused) {
              video.muted = isMuted;
              video.defaultMuted = isMuted;
              attemptPlay(video);
            }
          }}
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

      <div className='absolute top-3 left-3 right-3 flex justify-between items-center z-10'>
        {isVideo ? (
          <button
            className='flex items-center justify-center w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full text-white cursor-pointer transition-colors border-none'
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            aria-label={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        ) : (
          <div />
        )}
      </div>

      <VideoOverlay post={post} showTimestamp={showTimestamp} />

      {isVideo && autoplayBlocked && (
        <button
          className='absolute inset-0 z-20 flex items-center justify-center bg-black/20 text-white text-sm font-medium border-none cursor-pointer'
          onClick={(e) => {
            e.stopPropagation();
            if (touchHandledRef.current) return;
            unmuteAndPlay();
          }}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => {
            e.stopPropagation();
            touchHandledRef.current = true;
            setTimeout(() => {
              touchHandledRef.current = false;
            }, 600);
            unmuteAndPlay();
          }}
          aria-label='Tap to play video'>
          Tap to play with sound
        </button>
      )}

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
