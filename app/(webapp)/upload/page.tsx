"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Prohibition } from "@/components/upload/Prohibition";
import { UploadDropzone } from "@/components/upload/UploadDropzone";
import { UploadDetails } from "@/components/upload/UploadDetails";
import { UploadSuccess } from "@/components/upload/UploadSuccess";
import { useCreatePost } from "@/lib/api/services/posts.hooks";
import { Loader2 } from "lucide-react";

type UploadStep = "PROHIBITION" | "SELECT" | "DETAILS" | "SUCCESS";

export default function UploadPage() {
  const router = useRouter();
  const [step, setStep] = useState<UploadStep>("PROHIBITION");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  const createPostMutation = useCreatePost();

  useEffect(() => {
    // Check if user has already accepted terms
    const hasAccepted = localStorage.getItem("localbuka_upload_terms_accepted");
    if (hasAccepted === "true") {
      setStep("SELECT");
    }
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <MainLayout>
        <div className="w-full max-w-5xl flex items-center justify-center h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFC727]" />
        </div>
      </MainLayout>
    );
  }

  const handleAcceptTerms = () => {
    localStorage.setItem("localbuka_upload_terms_accepted", "true");
    setStep("SELECT");
  };

  const handleRefuseTerms = () => {
    router.push("/feeds");
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setStep("DETAILS");
  };

  const handlePost = (data: { description: string; tags: string[]; location: string }) => {
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
      data.tags.forEach(tag => formData.append("tags", tag));
    }
    
    // Auto-detect and send mediaType (required)
    const isVideo = selectedFile.type.startsWith("video/");
    formData.append("mediaType", isVideo ? "video" : "image");

    // Location (restaurantId) and hashtags omitted as requested (tags are appended above)
    // You mentioned "If location is not present, use Ikeja", but there is no specific UUID for Ikeja right now.
    // If you need a fallback UUID, we can provide it, but for now we omit it as per the second part of your sentence.
    
    createPostMutation.mutate(formData, {
      onSuccess: () => {
        setStep("SUCCESS");
      },
      onError: (error) => {
        console.error("Upload failed", error);
        alert("Failed to upload. Please try again.");
      }
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
          <Prohibition onAccept={handleAcceptTerms} onRefuse={handleRefuseTerms} />
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
