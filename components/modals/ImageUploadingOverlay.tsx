'use client';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImageUploadingOverlayProps {
  isUploading: boolean;
  message?: string;
}

export const ImageUploadingOverlay: React.FC<ImageUploadingOverlayProps> = ({
  isUploading,
  message = 'Please wait while your image is being uploaded to Cloudinary...',
}) => {
  if (!isUploading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center max-w-sm text-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <ImageIcon className="w-6 h-6 text-primary absolute" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Uploading Image...
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
