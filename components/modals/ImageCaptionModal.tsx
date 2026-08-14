'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image as ImageIcon, Sparkles } from 'lucide-react';

interface ImageCaptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  onSubmit: (caption: string) => void;
}

export const ImageCaptionModal: React.FC<ImageCaptionModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  onSubmit,
}) => {
  const [caption, setCaption] = useState('');

  // Reset caption when modal opens with new image
  useEffect(() => {
    if (isOpen) {
      setCaption('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(caption);
  };

  const handleSkip = () => {
    onSubmit('');
  };

  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl p-6 overflow-hidden">
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <span>Image Uploaded Successfully</span>
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Add Image Caption / Credit
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            Provide an optional figure caption or photographer credit to accompany this image in your article.
          </DialogDescription>
        </DialogHeader>

        {/* Image Preview Box */}
        <div className="relative my-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 max-h-60 flex items-center justify-center p-2">
          <img
            src={imageUrl}
            alt="Uploaded preview"
            className="max-h-52 w-auto object-contain rounded-lg shadow-sm"
          />
        </div>

        {/* Caption Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="image-caption-input"
              className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 flex items-center gap-1.5"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Caption / Credit Text
            </label>
            <Input
              id="image-caption-input"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Photo by John Doe on Unsplash"
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"
              autoFocus
            />
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              className="text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Skip Caption
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white font-medium shadow-md transition-transform active:scale-95"
            >
              Insert Image
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
