'use client';

import React from 'react';
import type {Post} from '@/types/post';
import type {UploadStep} from './types';
import {Prohibition} from '@/components/upload/Prohibition';
import {UploadDropzone} from '@/components/upload/UploadDropzone';
import {ImageCropper} from '@/components/upload/ImageCropper';
import {UploadDetails} from '@/components/upload/UploadDetails';
import {UploadSuccess} from '@/components/upload/UploadSuccess';

interface StudioEditorTabProps {
  step: UploadStep;
  editPostId: string | null;
  existingPost: Post | null;
  selectedFiles: File[];
  cropIndices: number[];
  currentCropPointer: number;
  isUploading: boolean;
  onAcceptTerms: () => void;
  onRefuseTerms: () => void;
  onFileSelect: (files: File[]) => void;
  onCropSuccess: (croppedFile: File) => void;
  onPost: (data: {
    description: string;
    imageCaptions?: string[];
    tags: string[];
    location: string;
    restaurantId?: string;
  }) => void;
  onAddFiles: (newFiles: File[]) => void;
  onRemoveFile: (index: number) => void;
  onDiscard: () => void;
  onSuccessDone: () => void;
}

export function StudioEditorTab({
  step,
  editPostId,
  existingPost,
  selectedFiles,
  cropIndices,
  currentCropPointer,
  isUploading,
  onAcceptTerms,
  onRefuseTerms,
  onFileSelect,
  onCropSuccess,
  onPost,
  onAddFiles,
  onRemoveFile,
  onDiscard,
  onSuccessDone,
}: StudioEditorTabProps) {
  return (
    <div className='w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200'>
      {step === 'PROHIBITION' && (
        <Prohibition onAccept={onAcceptTerms} onRefuse={onRefuseTerms} />
      )}

      {step === 'SELECT' && (
        <UploadDropzone onFileSelect={onFileSelect} />
      )}

      {step === 'CROP' && selectedFiles.length > 0 && cropIndices.length > 0 && (
        <div className='flex flex-col gap-4 w-full max-w-5xl mx-auto'>
          {cropIndices.length > 1 && (
            <div className='bg-[#181820] border border-white/10 text-white rounded-xl p-4 flex items-center justify-between shadow-md'>
              <span className='text-xs font-bold text-zinc-300'>
                ✂️ Cropping image composition...
              </span>
              <span className='text-xs font-bold bg-[#FBBE15] text-[#141414] px-3.5 py-1.5 rounded-full'>
                Image {currentCropPointer + 1} of {cropIndices.length}
              </span>
            </div>
          )}
          <ImageCropper
            file={selectedFiles[cropIndices[currentCropPointer]]}
            onCrop={onCropSuccess}
            onCancel={onDiscard}
          />
        </div>
      )}

      {step === 'DETAILS' && (selectedFiles.length > 0 || Boolean(editPostId)) && (
        <UploadDetails
          files={selectedFiles}
          existingMediaUrls={
            editPostId && existingPost
              ? existingPost.mediaUrls || (existingPost.mediaUrl ? [existingPost.mediaUrl] : [])
              : []
          }
          initialCaption={existingPost?.caption || ''}
          initialImageCaptions={
            existingPost?.mediaType === 'image'
              ? existingPost?.imageCaptions || []
              : []
          }
          initialLocation={existingPost?.location || ''}
          initialRestaurant={
            existingPost?.restaurant
              ? {id: existingPost.restaurant.id, name: existingPost.restaurant.name}
              : null
          }
          isEditing={Boolean(editPostId)}
          submitText={editPostId ? 'Save Changes' : 'Publish Post'}
          onPost={onPost}
          onDiscard={onDiscard}
          isUploading={isUploading}
          onAddFiles={onAddFiles}
          onRemoveFile={onRemoveFile}
        />
      )}

      {step === 'SUCCESS' && (
        <UploadSuccess onBackHome={onSuccessDone} />
      )}
    </div>
  );
}
