"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { VideoFeed } from "@/components/video/VideoFeed";
import { mockVideos } from "@/constants/mockVideos";

function HomeContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("video");

  // Find the index of the selected video (from profile page click)
  const initialIndex = videoId
    ? Math.max(0, mockVideos.findIndex((v) => v.id === videoId))
    : 0;

  return (
    <MainLayout>
      <VideoFeed videos={mockVideos} initialIndex={initialIndex} initialMuted={!videoId} />
    </MainLayout>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
