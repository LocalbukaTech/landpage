"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { mockVideos } from "@/constants/mockVideos";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuth();
  
  const tabParam = searchParams.get("tab") || "videos";
  const displayVideos = mockVideos;

  useEffect(() => {
    // If we've determined the user is not authenticated, redirect
    // We check against the literal false to ensure we don't redirect during initial load if possible
    if (isAuthenticated === false) {
      router.push("/feeds");
      openAuthModal();
    }
  }, [isAuthenticated, router, openAuthModal]);

  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="w-full h-[80vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#fbbe15]" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 overflow-y-auto h-[calc(100vh-3.5rem)] md:h-auto">
        <ProfileHeader />
        <ProfileTabs videos={displayVideos} initialTab={tabParam} />
      </div>
    </MainLayout>
  );
}

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfileContent />
    </Suspense>
  );
}
