'use client';

import {useRef, useState, useEffect} from 'react';
import {Loader2, Move} from 'lucide-react';

interface ImageCropperProps {
  file: File;
  onCrop: (croppedFile: File) => void;
  onCancel: () => void;
}

export function ImageCropper({file, onCrop, onCancel}: ImageCropperProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [naturalSize, setNaturalSize] = useState({width: 0, height: 0});
  
  // Viewport dimensions (fixed 9:16 aspect ratio box)
  const viewportWidth = 324;
  const viewportHeight = 576;
  
  // Crop adjustments
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({x: 0, y: 0});
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({x: 0, y: 0});
  const imageRef = useRef<HTMLImageElement>(null);

  // Load selected file as data URL
  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImgSrc(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }, [file]);

  // Initial calculation when image is loaded
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalSize({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
    setLoading(false);
  };

  // Helper to calculate constrained offsets
  const getConstrainedOffset = (x: number, y: number, currentZoom: number) => {
    if (naturalSize.width === 0) return {x: 0, y: 0};
    
    const aspect = naturalSize.width / naturalSize.height;
    
    // Base dimensions of the image in the crop viewport at zoom = 1
    const renderedHeight = viewportHeight;
    const renderedWidth = viewportHeight * aspect;
    
    // Scaled dimensions at current zoom
    const scaledWidth = renderedWidth * currentZoom;
    const scaledHeight = renderedHeight * currentZoom;
    
    // Panning boundaries
    const maxOffsetX = Math.max(0, (scaledWidth - viewportWidth) / 2);
    const maxOffsetY = Math.max(0, (scaledHeight - viewportHeight) / 2);
    
    return {
      x: Math.min(maxOffsetX, Math.max(-maxOffsetX, x)),
      y: Math.min(maxOffsetY, Math.max(-maxOffsetY, y)),
    };
  };

  // Drag handlers (Mouse)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    setOffset(getConstrainedOffset(newX, newY, zoom));
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Drag handlers (Touch)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.touches[0].clientX - offset.x,
      y: e.touches[0].clientY - offset.y,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const newX = e.touches[0].clientX - dragStart.current.x;
    const newY = e.touches[0].clientY - dragStart.current.y;
    setOffset(getConstrainedOffset(newX, newY, zoom));
  };

  // Handle zoom changes and adjust offset to keep it within boundaries
  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextZoom = parseFloat(e.target.value);
    setZoom(nextZoom);
    setOffset((prev) => getConstrainedOffset(prev.x, prev.y, nextZoom));
  };

  // Crop drawing onto canvas and export
  const handleCropConfirm = () => {
    if (!imageRef.current || naturalSize.width === 0) return;
    
    const img = imageRef.current;
    
    // Set target crop size matching original image's vertical height for max quality
    const canvasHeight = naturalSize.height;
    const canvasWidth = Math.round(naturalSize.height * (9 / 16));
    
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Zoom/offset conversion scale factor (natural to viewport)
    // S = naturalHeight / (viewportHeight * zoom)
    const scaleFactor = naturalSize.height / (viewportHeight * zoom);
    
    // Calculate source rect dimensions on original image
    const sw = Math.round(canvasWidth / zoom);
    const sh = Math.round(canvasHeight / zoom);
    
    // Calculate source top-left coordinates on original image
    let sx = Math.round((naturalSize.width - sw) / 2 - offset.x * scaleFactor);
    let sy = Math.round((naturalSize.height - sh) / 2 - offset.y * scaleFactor);
    
    // Boundary safety checks
    sx = Math.max(0, Math.min(naturalSize.width - sw, sx));
    sy = Math.max(0, Math.min(naturalSize.height - sh, sy));
    
    // Draw
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvasWidth, canvasHeight);
    
    // Export to file
    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], file.name, {
          type: file.type || 'image/jpeg',
          lastModified: Date.now(),
        });
        onCrop(croppedFile);
      }
    }, file.type || 'image/jpeg', 0.95);
  };

  // Dynamic CSS styling for image transform
  const aspect = naturalSize.width ? naturalSize.width / naturalSize.height : 1;
  const imgWidthStyle = viewportHeight * aspect;

  return (
    <div className='flex flex-col items-center justify-center w-full max-w-xl mx-auto bg-white rounded-3xl p-6 shadow-xl border border-zinc-100'>
      <div className='text-center mb-6'>
        <h2 className='text-xl font-bold text-[#1a1a1a]'>Adjust Photo size</h2>
        <p className='text-zinc-500 text-sm mt-1'>
          Drag and zoom the photo to crop it to the standard feed size (9:16).
        </p>
      </div>

      {/* Viewport container */}
      <div 
        className='relative overflow-hidden rounded-2xl bg-[#121212] border-2 border-dashed border-[#fbbe15]/60 flex items-center justify-center cursor-move select-none shadow-inner'
        style={{width: viewportWidth, height: viewportHeight}}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUpOrLeave}
      >
        {loading && (
          <div className='absolute inset-0 flex items-center justify-center bg-zinc-950/80 z-10'>
            <Loader2 className='w-8 h-8 animate-spin text-[#fbbe15]' />
          </div>
        )}

        {imgSrc && (
          <img
            ref={imageRef}
            src={imgSrc}
            alt='To Crop'
            onLoad={handleImageLoad}
            className='max-w-none pointer-events-none'
            style={{
              height: viewportHeight,
              width: imgWidthStyle,
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          />
        )}

        {/* Framing Guides Overlay */}
        <div className='absolute inset-0 pointer-events-none border border-white/20 flex flex-col justify-between p-4'>
          <div className='flex justify-between items-center text-white/50 text-[10px] bg-black/40 px-2 py-1 rounded-full backdrop-blur-xs w-fit mx-auto'>
            <Move size={10} className='mr-1.5' />
            Drag to reposition
          </div>
          
          {/* Vertical and horizontal gridlines */}
          <div className='absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20'>
            <div className='border-r border-b border-white'></div>
            <div className='border-r border-b border-white'></div>
            <div className='border-b border-white'></div>
            <div className='border-r border-b border-white'></div>
            <div className='border-r border-b border-white'></div>
            <div className='border-b border-white'></div>
            <div className='border-r border-white'></div>
            <div className='border-r border-white'></div>
            <div></div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className='w-full mt-6 px-2 flex flex-col gap-2'>
        <div className='flex justify-between text-xs text-zinc-500 font-medium'>
          <span>Zoom</span>
          <span>{Math.round(zoom * 100)}%</span>
        </div>
        <input
          type='range'
          min='1'
          max='3'
          step='0.01'
          value={zoom}
          onChange={handleZoomChange}
          className='w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-[#fbbe15]'
        />
      </div>

      {/* Actions */}
      <div className='w-full mt-8 flex gap-4'>
        <button
          onClick={onCancel}
          className='flex-1 py-3 bg-[#e4e4e7] hover:bg-zinc-300 text-[#1a1a1a] font-bold rounded-xl transition-all cursor-pointer'
        >
          Cancel
        </button>
        <button
          onClick={handleCropConfirm}
          disabled={loading}
          className='flex-1 py-3 bg-[#fbbe15] hover:bg-[#e5ac10] text-[#1a1a1a] font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer'
        >
          Crop & Continue
        </button>
      </div>
    </div>
  );
}
