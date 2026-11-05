"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn, ZoomOut, Download, ExternalLink, RotateCcw } from "lucide-react";

interface ModerationProofLightboxProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

export function ModerationProofLightbox({
  src,
  alt = "Attached Proof of Violation",
  onClose,
}: ModerationProofLightboxProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setScale((s) => Math.min(3, s + 0.25));
  const handleZoomOut = () => setScale((s) => Math.max(0.5, s - 0.25));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-between p-4 select-none animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between text-white/90 py-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#fbbe15]">
            Evidence / Proof Attachment
          </span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRotate}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Rotate 90°"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-colors cursor-pointer"
            title="Reset View"
          >
            Reset
          </button>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Open original / Download"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 ml-2 transition-colors cursor-pointer"
            title="Close viewer (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div
        className="flex-1 w-full max-w-5xl flex items-center justify-center overflow-auto p-4 cursor-grab active:cursor-grabbing"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="relative max-w-full max-h-full transition-transform duration-150 ease-out"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
          }}
        >
          {/* Next.js Image with unoptimized flag for dynamic user/uploaded evidence URLs */}
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={900}
            unoptimized
            className="max-h-[75vh] w-auto h-auto object-contain rounded-lg shadow-2xl border border-white/10"
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-5xl flex items-center justify-between text-[11px] text-white/60 py-2 border-t border-white/10">
        <span>Click outside or press Close to dismiss</span>
        <span>Zoom: {Math.round(scale * 100)}%</span>
      </div>
    </div>
  );
}
