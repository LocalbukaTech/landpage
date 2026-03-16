"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Prohibition } from "@/components/upload/Prohibition";
import { UploadDropzone } from "@/components/upload/UploadDropzone";
import { UploadDetails } from "@/components/upload/UploadDetails";
import { UploadSuccess } from "@/components/upload/UploadSuccess";

type UploadStep = "PROHIBITION" | "SELECT" | "DETAILS" | "SUCCESS";

export default function UploadPage() {
  const router = useRouter();
  const [step, setStep] = useState<UploadStep>("PROHIBITION");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    // Check if user has already accepted terms
    const hasAccepted = localStorage.getItem("localbuka_upload_terms_accepted");
    if (hasAccepted === "true") {
      setStep("SELECT");
    }
  }, []);

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

  const handlePost = () => {
    // Logic to actually upload would go here
    setStep("SUCCESS");
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
          />
        )}

        {step === "SUCCESS" && (
          <UploadSuccess onBackHome={() => router.push("/feeds")} />
        )}
      </div>
    </MainLayout>
  );
}
