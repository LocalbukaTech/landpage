"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Post } from "@/types/post";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { ActionBar } from "@/components/video/ActionBar";
import { VideoNavigation } from "@/components/video/VideoNavigation";
import Comments from "@/components/video/comments";
import { useToggleLike, useToggleSave } from "@/lib/api/services/posts.hooks";

interface VideoFeedProps {
  posts: Post[];
  initialIndex?: number;
  initialMuted?: boolean;
  hideFollowButton?: boolean;
  showTimestamp?: boolean;
}

export function VideoFeed({ 
  posts, 
  initialIndex = 0, 
  initialMuted = true, 
  hideFollowButton,
  showTimestamp 
}: VideoFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isGlobalMuted, setIsGlobalMuted] = useState(initialMuted);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleLikeMutation = useToggleLike();
  const toggleSaveMutation = useToggleSave();

  // --- COMMENTS DRAWER STATE ---
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  // Sync index if posts change and index is out of bounds
  useEffect(() => {
    if (currentIndex >= posts.length && posts.length > 0) {
      setCurrentIndex(posts.length - 1);
    }
  }, [posts.length, currentIndex]);

  const handleMuteChange = useCallback((muted: boolean) => {
    setIsGlobalMuted(muted);
  }, []);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(() => setIsTransitioning(false), 400);
    }
  }, [currentIndex, isTransitioning]);

  const handleNext = useCallback(() => {
    if (currentIndex < posts.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(() => setIsTransitioning(false), 400);
    }
  }, [currentIndex, posts.length, isTransitioning]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrevious]);

  if (!posts || posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full text-zinc-500 text-base">
        <p>No posts available</p>
      </div>
    );
  }

  const currentPost = posts[currentIndex];

  const fadeVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="flex items-center justify-center w-full h-full md:gap-4 md:h-[calc(100vh-3rem)] md:max-h-[850px]">
      <div className="flex gap-3 items-end h-full w-full md:w-auto relative">
        <AnimatePresence mode="wait">
          {currentPost && (
            <motion.div
              key={currentPost.id}
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full w-full flex items-center justify-center md:rounded-2xl overflow-hidden bg-black"
            >
              <VideoPlayer
                post={currentPost}
                isActive={true}
                onSwipeUp={handleNext}
                onSwipeDown={handlePrevious}
                isMuted={isGlobalMuted}
                onMuteChange={handleMuteChange}
                showTimestamp={showTimestamp}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {currentPost && (
          <div className="absolute right-2 bottom-20 md:static md:right-auto md:bottom-auto z-10">
            <ActionBar
              post={currentPost}
              onCommentClick={() => setIsCommentsOpen(true)}
              onLikeToggle={() => toggleLikeMutation.mutate(currentPost.id)}
              onSaveToggle={() => toggleSaveMutation.mutate(currentPost.id)}
              hideFollowButton={hideFollowButton}
            />
          </div>
        )}

        {/* --- COMMENTS DRAWER --- */}
        <Comments
          postId={currentPost?.id || null}
          open={isCommentsOpen} // controlled by ActionBar button
          onClose={() => setIsCommentsOpen(false)} // closes drawer
        />
      </div>

      <div className="hidden md:block">
        <VideoNavigation
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoPrevious={currentIndex > 0}
          canGoNext={currentIndex < posts.length - 1}
        />
      </div>
    </div>
  );
}
