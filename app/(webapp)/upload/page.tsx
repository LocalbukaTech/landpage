"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Prohibition } from "@/components/upload/Prohibition";
import { UploadDropzone } from "@/components/upload/UploadDropzone";
import { UploadDetails } from "@/components/upload/UploadDetails";
import { UploadSuccess } from "@/components/upload/UploadSuccess";
import { useCreatePost } from "@/lib/api/services/posts.hooks";
import { useMe, useAcceptContentPolicy } from "@/lib/api/services/auth.hooks";
import { Loader2 } from "lucide-react";

type UploadStep = "PROHIBITION" | "SELECT" | "DETAILS" | "SUCCESS";

export default function UploadPage() {
  const router = useRouter();
  const [manualStep, setManualStep] = useState<UploadStep | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const createPostMutation = useCreatePost();
  const { data: meResponse, isLoading: isLoadingMe } = useMe();
  const acceptPolicyMutation = useAcceptContentPolicy();

  // Derive initial step from loaded user data without using an effect
  const initialStep = useMemo<UploadStep | null>(() => {
    if (isLoadingMe) return null;
    const userData =
      (meResponse as any)?.data?.data || (meResponse as any)?.data;
    const hasAccepted = userData?.hasAcceptedContentPolicy === true;
    return hasAccepted ? "SELECT" : "PROHIBITION";
  }, [meResponse, isLoadingMe]);

  const step = manualStep ?? initialStep;
  const setStep = (s: UploadStep) => setManualStep(s);

  // Show loading while fetching user data
  if (isLoadingMe || step === null) {
    return (
      <MainLayout>
        <div className="w-full max-w-5xl flex items-center justify-center h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFC727]" />
        </div>
      </MainLayout>
    );
  }

  const handleAcceptTerms = () => {
    // Call the API to persist the content policy acceptance
    acceptPolicyMutation.mutate(undefined, {
      onSuccess: () => {
        setStep("SELECT");
      },
      onError: (error) => {
        console.error("Failed to accept content policy", error);
        // Still proceed to allow upload even if API call fails
        setStep("SELECT");
      },
    });
  };

  const handleRefuseTerms = () => {
    router.push("/feeds");
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setStep("DETAILS");
  };

  const handlePost = (data: {
    description: string;
    tags: string[];
    location: string;
    restaurantId?: string;
  }) => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("media", selectedFile);

    // Append caption if available
    if (data.description) {
      formData.append("caption", data.description);
    }
    // Append location
    if (data.location) {
      formData.append("location", data.location);
    }
    // Append tags
    if (data.tags && data.tags.length > 0) {
      data.tags.forEach((tag) => formData.append("tags", tag));
    }

    // Auto-detect and send mediaType (required)
    const isVideo = selectedFile.type.startsWith("video/");
    formData.append("mediaType", isVideo ? "video" : "image");

    createPostMutation.mutate(formData, {
      onSuccess: () => {
        setStep("SUCCESS");
      },
      onError: (error) => {
        console.error("Upload failed", error);
        alert("Failed to upload. Please try again.");
      },
    });
  };

  const handleDiscard = () => {
    setSelectedFile(null);
    setStep("SELECT");
  };

  return (
    <MainLayout>
      <div className="w-full max-w-5xl">
        {step === "PROHIBITION" && (
          <Prohibition
            onAccept={handleAcceptTerms}
            onRefuse={handleRefuseTerms}
          />
        )}

        {step === "SELECT" && (
          <UploadDropzone onFileSelect={handleFileSelect} />
        )}

        {step === "DETAILS" && selectedFile && (
          <UploadDetails
            file={selectedFile}
            onPost={handlePost}
            onDiscard={handleDiscard}
            isUploading={createPostMutation.isPending}
          />
        )}

        {step === "SUCCESS" && (
          <UploadSuccess onBackHome={() => router.push("/feeds")} />
        )}
      </div>
    </MainLayout>
  );
}
