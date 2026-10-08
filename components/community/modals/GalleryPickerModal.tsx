"use client";

import { useRef } from "react";
import Image from "next/image";
import { X, Upload, Check } from "lucide-react";

interface GalleryPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedImage: string;
  onSelectImage: (url: string) => void;
}

const GALLERY_PRESETS = [
  {
    title: "Smoky Nigerian Jollof",
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Suya & Peppered Meat",
    url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Herb Grilled Chicken",
    url: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Egusi Soup & Pounded Yam",
    url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Gourmet Burger & Fries",
    url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Fresh Seafood Stew",
    url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
  },
];

export function GalleryPickerModal({
  isOpen,
  onClose,
  selectedImage,
  onSelectImage,
}: GalleryPickerModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      onSelectImage(objectUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#171717] p-6 shadow-2xl text-white">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-semibold">Choose Community Cover Photo</h2>
            <p className="text-xs text-white/50">Pick from culinary presets or upload your own</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {/* Custom upload trigger */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-2xl border border-dashed border-white/20 bg-[#212121] p-5 text-center hover:border-[#f5c94d] hover:bg-[#262626] transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/10 group-hover:bg-[#f5c94d] group-hover:text-black transition-colors">
              <Upload className="h-5 w-5" />
            </div>
            <p className="mt-2 text-xs font-semibold text-white">Upload from your device</p>
            <p className="text-[11px] text-white/50">Supports JPG, PNG, WEBP up to 10MB</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
              Curated Culinary Presets
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {GALLERY_PRESETS.map((preset, idx) => {
                const isSelected = selectedImage === preset.url;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      onSelectImage(preset.url);
                      onClose();
                    }}
                    className={`group relative h-28 cursor-pointer overflow-hidden rounded-2xl border transition-all ${
                      isSelected
                        ? "border-[#f5c94d] ring-2 ring-[#f5c94d]"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <Image
                      src={preset.url}
                      alt={preset.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {isSelected && (
                      <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#f5c94d] text-black">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                    <span className="absolute bottom-2 left-2 right-2 text-[11px] font-medium text-white truncate">
                      {preset.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
