"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video } from "@/types/video";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { ActionBar } from "@/components/video/ActionBar";
import { VideoNavigation } from "@/components/video/VideoNavigation";
import Comments from "@/components/video/comments";
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface Comment {
  id: string;
  user: string;
  avatar: string;
  time: string;
  text: string;
}

interface VideoFeedProps {
  videos: Video[];
  initialIndex?: number;
  initialMuted?: boolean;
}

export function VideoFeed({ videos, initialIndex = 0, initialMuted = true }: VideoFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isGlobalMuted, setIsGlobalMuted] = useState(initialMuted);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- COMMENTS STATE ---
  const [videoComments, setVideoComments] = useState<{ [videoId: string]: Comment[] }>(() => {
    const initial: { [videoId: string]: Comment[] } = {};
    videos.forEach((v) => {
      initial[v.id] = Array.isArray(v.comments) ? (v.comments as Comment[]) : [];
    });
    return initial;
  });

  const { requireAuth } = useRequireAuth();

  // --- ADD COMMENT HANDLER ---
  const handleAddComment = (text: string) => {
    requireAuth(() => {
      const videoId = videos[currentIndex].id;
      const newComment: Comment = {
        id: Date.now().toString(),
        user: "You",
        time: "Just now",
        text,
        avatar: "",
      };

      setVideoComments((prev) => ({
        ...prev,
        [videoId]: [...(prev[videoId] || []), newComment],
      }));
    });
  };

  // --- COMMENTS DRAWER STATE ---
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

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
    if (currentIndex < videos.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(() => setIsTransitioning(false), 400);
    }
  }, [currentIndex, videos.length, isTransitioning]);

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

  if (!videos || videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500 text-base">
        <p>No videos available</p>
      </div>
    );
  }

  const currentVideo = videos[currentIndex];

  const fadeVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="flex items-center justify-center w-full h-full md:gap-4 md:h-[calc(100vh-3rem)] md:max-h-[850px]">
      <div className="flex gap-3 items-end h-full w-full md:w-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVideo.id}
            variants={fadeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full w-full flex items-center justify-center md:rounded-2xl overflow-hidden bg-black"
          >
            <VideoPlayer
              video={currentVideo}
              isActive={true}
              onSwipeUp={handleNext}
              onSwipeDown={handlePrevious}
              isMuted={isGlobalMuted}
              onMuteChange={handleMuteChange}
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute right-2 bottom-20 md:static md:right-auto md:bottom-auto z-10">
          <ActionBar
            likes={currentVideo.likes}
            comments={videoComments[currentVideo.id]?.length || 0}
            saves={currentVideo.saves}
            shares={currentVideo.shares}
            reposts={currentVideo.reposts || 0}
            onCommentClick={() => setIsCommentsOpen(true)} // opens drawer
          />
        </div>

        {/* --- COMMENTS DRAWER --- */}
        <Comments
          comments={videoComments[currentVideo.id] || []}
          onSend={handleAddComment}
          open={isCommentsOpen} // controlled by ActionBar button
          onClose={() => setIsCommentsOpen(false)} // closes drawer
        />
      </div>

      <div className="hidden md:block">
        <VideoNavigation
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoPrevious={currentIndex > 0}
          canGoNext={currentIndex < videos.length - 1}
        />
      </div>
    </div>
  );
}
