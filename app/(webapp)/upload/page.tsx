'use client';

import {useState, useMemo} from 'react';
import {useRouter} from 'next/navigation';
import {MainLayout} from '@/components/layout/MainLayout';
import {Prohibition} from '@/components/upload/Prohibition';
import {UploadDropzone} from '@/components/upload/UploadDropzone';
import {UploadDetails} from '@/components/upload/UploadDetails';
import {UploadSuccess} from '@/components/upload/UploadSuccess';
import {ImageCropper} from '@/components/upload/ImageCropper';
import {useCreatePost} from '@/lib/api/services/posts.hooks';
import {useMe, useAcceptContentPolicy} from '@/lib/api/services/auth.hooks';
import {Loader2} from 'lucide-react';

type UploadStep = 'PROHIBITION' | 'SELECT' | 'CROP' | 'DETAILS' | 'SUCCESS';

export default function UploadPage() {
  const router = useRouter();
  const [manualStep, setManualStep] = useState<UploadStep | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [cropIndices, setCropIndices] = useState<number[]>([]);
  const [currentCropPointer, setCurrentCropPointer] = useState<number>(0);

  const createPostMutation = useCreatePost();
  const {data: meResponse, isLoading: isLoadingMe} = useMe();
  const acceptPolicyMutation = useAcceptContentPolicy();

  // Derive initial step from loaded user data without using an effect
  const initialStep = useMemo<UploadStep | null>(() => {
    if (isLoadingMe) return null;
    const userData =
      (meResponse as any)?.data?.data || (meResponse as any)?.data;
    const hasAccepted = userData?.hasAcceptedContentPolicy === true;
    return hasAccepted ? 'SELECT' : 'PROHIBITION';
  }, [meResponse, isLoadingMe]);

  const step = manualStep ?? initialStep;
  const setStep = (s: UploadStep) => setManualStep(s);

  // Show loading while fetching user data
  if (isLoadingMe || step === null) {
    return (
      <MainLayout>
        <div className='w-full max-w-5xl flex items-center justify-center h-[50vh]'>
          <Loader2 className='w-8 h-8 animate-spin text-[#FFC727]' />
        </div>
      </MainLayout>
    );
  }

  const handleAcceptTerms = () => {
    // Call the API to persist the content policy acceptance
    acceptPolicyMutation.mutate(undefined, {
      onSuccess: () => {
        setStep('SELECT');
      },
      onError: (error) => {
        console.error('Failed to accept content policy', error);
        // Still proceed to allow upload even if API call fails
        setStep('SELECT');
      },
    });
  };

  const handleRefuseTerms = () => {
    router.push('/feeds');
  };

  const handleFileSelect = (files: File[]) => {
    if (files.length === 0) return;

    const hasVideo = files.some((file) => file.type.startsWith('video/'));

    if (hasVideo) {
      const videoFile = files.find((file) => file.type.startsWith('video/'))!;
      setSelectedFiles([videoFile]);
      setStep('DETAILS');
    } else {
      // By default, crop ALL selected images to ensure composition consistency
      const indicesToCrop = files.map((_, i) => i);
      setSelectedFiles(files);
      setCropIndices(indicesToCrop);
      setCurrentCropPointer(0);
      setStep('CROP');
    }
  };

  const handlePost = (data: {
    description: string;
    imageCaptions?: string[];
    tags: string[];
    location: string;
    restaurantId?: string;
  }) => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();

    // Auto-detect and send mediaType (required)
    const isVideo = selectedFiles[0].type.startsWith('video/');
    formData.append('mediaType', isVideo ? 'video' : 'image');

    if (isVideo) {
      formData.append('media', selectedFiles[0]);
      if (data.description) {
        formData.append('caption', data.description);
      }
    } else {
      // Append all selected image files to 'media' key
      selectedFiles.forEach((file) => {
        formData.append('media', file);
      });

      // Send the general caption to our normal caption payload
      if (data.description) {
        formData.append('caption', data.description);
      }

      // Send the imageCaptions list
      if (data.imageCaptions && data.imageCaptions.length > 0) {
        data.imageCaptions.forEach((cap) => {
          formData.append('imageCaptions', cap);
        });
      }
    }

    // Append location
    if (data.location) {
      formData.append('location', data.location);
    }
    // Append tags
    if (data.tags && data.tags.length > 0) {
      data.tags.forEach((tag) => formData.append('tags', tag));
    }
    // Append restaurantId if selected
    if (data.restaurantId) {
      formData.append('restaurantId', data.restaurantId);
    }

    createPostMutation.mutate(formData, {
      onSuccess: () => {
        setStep('SUCCESS');
      },
      onError: (error) => {
        console.error('Upload failed', error);
        alert('Failed to upload. Please try again.');
      },
    });
  };

  const handleAddFiles = (newFiles: File[]) => {
    const newImages = newFiles.filter((file) => file.type.startsWith('image/'));
    if (newImages.length === 0) return;

    const startIndex = selectedFiles.length;
    const updatedFiles = [...selectedFiles, ...newImages];
    const newCropIndices = newImages.map((_, i) => startIndex + i);

    setSelectedFiles(updatedFiles);
    setCropIndices(newCropIndices);
    setCurrentCropPointer(0);
    setStep('CROP');
  };

  const handleRemoveFile = (index: number) => {
    if (selectedFiles.length <= 1) {
      handleDiscard();
      return;
    }
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  const handleDiscard = () => {
    setSelectedFiles([]);
    setCropIndices([]);
    setCurrentCropPointer(0);
    setStep('SELECT');
  };

  return (
    <MainLayout>
      <div className='w-full max-w-5xl px-2 md:px-0'>
        {step === 'PROHIBITION' && (
          <Prohibition
            onAccept={handleAcceptTerms}
            onRefuse={handleRefuseTerms}
          />
        )}

        {step === 'SELECT' && (
          <UploadDropzone onFileSelect={handleFileSelect} />
        )}

        {step === 'CROP' && selectedFiles.length > 0 && cropIndices.length > 0 && (
          <div className='flex flex-col gap-4 w-full max-w-5xl mx-auto'>
            {cropIndices.length > 1 && (
              <div className='bg-zinc-900 text-white rounded-xl p-4 flex items-center justify-between shadow-md'>
                <span className='text-xs font-bold'>
                  ✂️ Cropping images...
                </span>
                <span className='text-xs font-bold bg-[#fbbe15] text-[#1a1a1a] px-3.5 py-1.5 rounded-full'>
                  Image {currentCropPointer + 1} of {cropIndices.length}
                </span>
              </div>
            )}
            <ImageCropper
              file={selectedFiles[cropIndices[currentCropPointer]]}
              onCrop={(croppedFile) => {
                const updatedFiles = [...selectedFiles];
                updatedFiles[cropIndices[currentCropPointer]] = croppedFile;
                setSelectedFiles(updatedFiles);

                if (currentCropPointer < cropIndices.length - 1) {
                  setCurrentCropPointer((prev) => prev + 1);
                } else {
                  setStep('DETAILS');
                }
              }}
              onCancel={handleDiscard}
            />
          </div>
        )}

        {step === 'DETAILS' && selectedFiles.length > 0 && (
          <UploadDetails
            files={selectedFiles}
            onPost={handlePost}
            onDiscard={handleDiscard}
            isUploading={createPostMutation.isPending}
            onAddFiles={handleAddFiles}
            onRemoveFile={handleRemoveFile}
          />
        )}

        {step === 'SUCCESS' && (
          <UploadSuccess onBackHome={() => router.push('/feeds')} />
        )}
      </div>
    </MainLayout>
  );
}
