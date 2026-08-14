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
  onFileSelect: (files: File[]) => void;
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
      onFileSelect(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(Array.from(e.target.files));
    }
  };

  return (
    <div className='flex flex-col items-center justify-center w-full max-w-5xl mx-auto'>
      <div className='bg-[#141414] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-8 w-full shadow-2xl min-h-[360px] md:min-h-[600px] flex flex-col items-center justify-center text-white'>
        <input
          ref={inputRef}
          type='file'
          accept='video/mp4,video/*,image/*'
          multiple
          className='hidden'
          onChange={handleFileChange}
        />

        <div
          className={`w-full max-w-3xl aspect-video min-h-[180px] border-2 border-dashed rounded-xl md:rounded-2xl flex flex-col items-center justify-center gap-3 md:gap-4 transition-colors cursor-pointer ${
            isDragOver ? 'border-[#fbbe15] bg-[#fbbe15]/10' : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/50'
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}>
          <div className='w-12 h-12 md:w-14 md:h-14 bg-[#fbbe15] rounded-2xl flex items-center justify-center text-[#141414] mb-1 md:mb-2 shadow-lg'>
            <Upload size={26} className='stroke-[2.5]' />
          </div>

          <div className='text-center'>
            <h3 className='text-lg md:text-xl font-bold text-white tracking-tight'>
              Share your culinary moments!
            </h3>
            <p className='text-zinc-400 text-sm mt-1'>Drag & drop photos or videos here, or browse files</p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            className='mt-1 md:mt-2 py-3 px-8 md:px-12 bg-[#fbbe15] text-[#141414] font-bold rounded-xl hover:bg-amber-400 transition-all text-sm md:text-base cursor-pointer shadow-md active:scale-95'>
            Select Files
          </button>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8 mt-8 md:mt-12 w-full max-w-5xl px-2 md:px-4'>
          <div className='flex flex-col gap-1.5 md:gap-2 p-3 rounded-xl bg-white/5 border border-white/5'>
            <div className='flex items-center gap-2 text-white font-bold text-sm md:text-base'>
              <Clock size={18} className='text-[#fbbe15]' />
              <span>Size and duration</span>
            </div>
            <p className='text-xs md:text-sm text-zinc-400'>
              Maximum size: 30 GB, video duration: 60 minutes.
            </p>
          </div>

          <div className='flex flex-col gap-1.5 md:gap-2 p-3 rounded-xl bg-white/5 border border-white/5'>
            <div className='flex items-center gap-2 text-white font-bold text-sm md:text-base'>
              <FileText size={18} className='text-[#fbbe15]' />
              <span>File formats</span>
            </div>
            <p className='text-xs md:text-sm text-zinc-400'>
              Recommended: &quot;.mp4&quot; for videos, &quot;.jpg, .png&quot; for images.
            </p>
          </div>

          <div className='flex flex-col gap-1.5 md:gap-2 p-3 rounded-xl bg-white/5 border border-white/5'>
            <div className='flex items-center gap-2 text-white font-bold text-sm md:text-base'>
              <VideoIcon size={18} className='text-[#fbbe15]' />
              <span>Video resolutions</span>
            </div>
            <p className='text-xs md:text-sm text-zinc-400'>
              High-resolution recommended: 1080p, 1440p, 4K.
            </p>
          </div>

          <div className='flex flex-col gap-1.5 md:gap-2 p-3 rounded-xl bg-white/5 border border-white/5'>
            <div className='flex items-center gap-2 text-white font-bold text-sm md:text-base'>
              <Smartphone size={18} className='text-[#fbbe15]' />
              <span>Aspect ratios</span>
            </div>
            <p className='text-xs md:text-sm text-zinc-400'>
              Recommended: 16:9 for landscape, 9:16 for vertical.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
