'use client';

import {useRef, useState} from 'react';
import {
  Upload,
  Clock,
  FileText,
  Video as VideoIcon,
  Smartphone,
} from 'lucide-react';

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
}

export function UploadDropzone({onFileSelect}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center w-full max-w-5xl mx-auto'>
      <div className='bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 w-full shadow-lg min-h-[360px] md:min-h-[600px] flex flex-col items-center justify-center'>
        <input
          ref={inputRef}
          type='file'
          accept='video/mp4,video/*,image/*'
          className='hidden'
          onChange={handleFileChange}
        />

        <div
          className={`w-full max-w-3xl aspect-video min-h-[180px] border-2 border-dashed rounded-xl md:rounded-2xl flex flex-col items-center justify-center gap-3 md:gap-4 transition-colors ${
            isDragOver ? 'border-[#fbbe15] bg-yellow-50/50' : 'border-zinc-200'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}>
          <div className='w-10 h-10 md:w-12 md:h-12 bg-black rounded-lg flex items-center justify-center text-white mb-1 md:mb-2'>
            <Upload size={22} />
          </div>

          <div className='text-center'>
            <h3 className='text-base md:text-lg font-bold text-[#1a1a1a]'>
              Share your moments!
            </h3>
            <p className='text-zinc-500 text-sm'>Upload photos or videos</p>
          </div>

          <button
            onClick={() => inputRef.current?.click()}
            className='mt-1 md:mt-2 py-2.5 md:py-3 px-8 md:px-12 bg-[#fbbe15] text-[#1a1a1a] font-semibold rounded-lg hover:bg-[#e5ac10] transition-colors text-sm md:text-base'>
            Select File
          </button>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8 mt-8 md:mt-12 w-full max-w-5xl px-2 md:px-4'>
          <div className='flex flex-col gap-1.5 md:gap-2'>
            <div className='flex items-center gap-1.5 md:gap-2 text-[#1a1a1a] font-bold text-sm md:text-base'>
              <Clock size={18} />
              <span>Size and duration</span>
            </div>
            <p className='text-xs md:text-sm text-zinc-500'>
              Maximum size: 30 GB, video duration: 60 minutes.
            </p>
          </div>

          <div className='flex flex-col gap-1.5 md:gap-2'>
            <div className='flex items-center gap-1.5 md:gap-2 text-[#1a1a1a] font-bold text-sm md:text-base'>
              <FileText size={18} />
              <span>File formats</span>
            </div>
            <p className='text-xs md:text-sm text-zinc-500'>
              Recommended: ".mp4" for videos, ".jpg, .png" for images.
            </p>
          </div>

          <div className='flex flex-col gap-1.5 md:gap-2'>
            <div className='flex items-center gap-1.5 md:gap-2 text-[#1a1a1a] font-bold text-sm md:text-base'>
              <VideoIcon size={18} />
              <span>Video resolutions</span>
            </div>
            <p className='text-xs md:text-sm text-zinc-500'>
              High-resolution recommended: 1080p, 1440p, 4K.
            </p>
          </div>

          <div className='flex flex-col gap-1.5 md:gap-2'>
            <div className='flex items-center gap-1.5 md:gap-2 text-[#1a1a1a] font-bold text-sm md:text-base'>
              <Smartphone size={18} />
              <span>Aspect ratios</span>
            </div>
            <p className='text-xs md:text-sm text-zinc-500'>
              Recommended: 16:9 for landscape, 9:16 for vertical.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
