'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {X, ZoomIn, ZoomOut, Check} from 'lucide-react';

interface AvatarCropModalProps {
  imageSrc: string;
  onConfirm: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

/** Output canvas size in px (the final avatar resolution) */
const OUTPUT_SIZE = 300;
/** Visible circular viewport diameter in px */
const VIEWPORT = 280;

export function AvatarCropModal({
  imageSrc,
  onConfirm,
  onCancel,
}: AvatarCropModalProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [naturalSize, setNaturalSize] = useState({w: 1, h: 1});
  const [baseScale, setBaseScale] = useState(1);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({x: 0, y: 0});
  const [ready, setReady] = useState(false);

  const isDragging = useRef(false);
  const dragStart = useRef({x: 0, y: 0, ox: 0, oy: 0});

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const sw = VIEWPORT / img.naturalWidth;
      const sh = VIEWPORT / img.naturalHeight;
      const s = Math.max(sw, sh);
      setNaturalSize({w: img.naturalWidth, h: img.naturalHeight});
      setBaseScale(s);
      setScale(s);
      setOffset({x: 0, y: 0});
      imgRef.current = img;
      setReady(true);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const clampOffset = useCallback(
    (ox: number, oy: number, s: number) => {
      const hw = (naturalSize.w * s) / 2;
      const hh = (naturalSize.h * s) / 2;
      const r = VIEWPORT / 2;
      return {
        x: Math.max(-hw + r, Math.min(hw - r, ox)),
        y: Math.max(-hh + r, Math.min(hh - r, oy)),
      };
    },
    [naturalSize],
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffset(
      clampOffset(dragStart.current.ox + dx, dragStart.current.oy + dy, scale),
    );
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.05 : 0.95;
    const next = Math.max(baseScale, Math.min(baseScale * 6, scale * factor));
    setScale(next);
    setOffset((prev) => clampOffset(prev.x, prev.y, next));
  };

  const handleZoomStep = (dir: 1 | -1) => {
    const next = Math.max(
      baseScale,
      Math.min(baseScale * 6, scale * (1 + dir * 0.1)),
    );
    setScale(next);
    setOffset((prev) => clampOffset(prev.x, prev.y, next));
  };

  const handleConfirm = () => {
    const img = imgRef.current;
    if (!img) return;
    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d')!;
    ctx.beginPath();
    ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
    ctx.clip();
    const ratio = OUTPUT_SIZE / VIEWPORT;
    const dw = naturalSize.w * scale * ratio;
    const dh = naturalSize.h * scale * ratio;
    const dx = OUTPUT_SIZE / 2 + offset.x * ratio - dw / 2;
    const dy = OUTPUT_SIZE / 2 + offset.y * ratio - dh / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
    canvas.toBlob((blob) => {
      if (blob) onConfirm(blob);
    }, 'image/png');
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  const zoomPercent =
    baseScale > 0
      ? Math.round(((scale - baseScale) / (baseScale * 5)) * 100)
      : 0;

  return (
    <div className='fixed inset-0 z-200 flex items-center justify-center bg-black/80 backdrop-blur-sm'>
      <div className='bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl flex flex-col items-center gap-5'>
        {/* Header */}
        <div className='flex items-center justify-between w-full'>
          <h3 className='text-white font-semibold text-base'>Crop Photo</h3>
          <button
            onClick={onCancel}
            className='w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors'
            aria-label='Close'>
            <X size={16} />
          </button>
        </div>

        <p className='text-zinc-500 text-xs self-start -mt-1'>
          Drag to reposition · scroll or pinch to zoom
        </p>

        {/* Crop viewport */}
        <div
          className='relative overflow-hidden cursor-grab active:cursor-grabbing select-none'
          style={{
            width: VIEWPORT,
            height: VIEWPORT,
            borderRadius: '50%',
            background: '#111',
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.65)',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onWheel={handleWheel}>
          {ready && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt='crop preview'
              draggable={false}
              style={{
                position: 'absolute',
                width: naturalSize.w * scale,
                height: naturalSize.h * scale,
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
          )}
          <div className='absolute inset-0 rounded-full border-2 border-[#fbbe15]/50 pointer-events-none' />
        </div>

        {/* Zoom slider */}
        <div className='flex items-center gap-3 w-full'>
          <button
            onClick={() => handleZoomStep(-1)}
            className='w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors shrink-0'
            aria-label='Zoom out'>
            <ZoomOut size={16} />
          </button>
          <div
            className='flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer'
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              const next = Math.max(
                baseScale,
                Math.min(baseScale * 6, baseScale + pct * baseScale * 5),
              );
              setScale(next);
              setOffset((prev) => clampOffset(prev.x, prev.y, next));
            }}>
            <div
              className='h-full bg-[#fbbe15] rounded-full transition-all'
              style={{width: `${Math.min(100, zoomPercent)}%`}}
            />
          </div>
          <button
            onClick={() => handleZoomStep(1)}
            className='w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors shrink-0'
            aria-label='Zoom in'>
            <ZoomIn size={16} />
          </button>
        </div>

        {/* Actions */}
        <div className='flex gap-3 w-full'>
          <button
            onClick={onCancel}
            className='flex-1 py-3 rounded-xl border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-colors'>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!ready}
            className='flex-1 py-3 rounded-xl bg-[#fbbe15] text-[#1a1a1a] text-sm font-semibold hover:bg-[#e5ab13] transition-colors flex items-center justify-center gap-2 disabled:opacity-50'>
            <Check size={16} />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
