"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { mockVideos } from "@/constants/mockVideos";

function OtherProfileContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || "videos";
  const displayVideos = mockVideos;

  return (
    <MainLayout>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 overflow-y-auto h-[calc(100vh-3.5rem)] md:h-auto">
        <ProfileHeader />
        <ProfileTabs videos={displayVideos} initialTab={tabParam} />
      </div>
    </MainLayout>
  );
}

export default function OtherProfilePage() {
  return (
    <Suspense>
      <OtherProfileContent />
    </Suspense>
  );
}
