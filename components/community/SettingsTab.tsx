"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight, Image as ImageIcon } from "lucide-react";
import { EditCommunityModal } from "./modals/EditCommunityModal";
import { PricingBenefitsModal } from "./modals/PricingBenefitsModal";
import { GalleryPickerModal } from "./modals/GalleryPickerModal";

interface SettingsTabProps {
  communityName?: string;
  communityBio?: string;
}

const PRESET_COVERS = [
  {
    id: "cover-1",
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
    label: "Jollof Rice",
  },
  {
    id: "cover-2",
    url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80",
    label: "Grilled Platter",
  },
  {
    id: "cover-3",
    url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    label: "Street Delights",
  },
  {
    id: "cover-4",
    url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=400&q=80",
    label: "Fine Dining",
  },
];

export function SettingsTab({
  communityName: initialName = "Chef Tolu's kitchen",
  communityBio: initialBio = "Cooked some good food tonight, tap the link on my bio for the recepies",
}: SettingsTabProps) {
  const [communityName, setCommunityName] = useState(initialName);
  const [communityBio, setCommunityBio] = useState(initialBio);
  const [pricePerMonth, setPricePerMonth] = useState(2500);
  const [benefits, setBenefits] = useState<string[]>([
    "Recipes and cook-alongs from Chef Tolu",
    "Private food spot recommendations in Lagos",
    "Exclusive live Q&A cooking sessions",
  ]);
  const [selectedCover, setSelectedCover] = useState(PRESET_COVERS[0].url);
  const [isVisible, setIsVisible] = useState(true);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  return (
    <div className="w-full max-w-[640px] text-white space-y-7 pt-2">
      {/* Settings Navigation Card */}
      <div className="rounded-[24px] bg-[#1a1a1a] border border-white/5 overflow-hidden shadow-lg">
        {/* Edit Community Name and bio */}
        <button
          type="button"
          onClick={() => setIsEditModalOpen(true)}
          className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/[0.03] transition-colors group"
        >
          <span className="text-base md:text-[17px] font-medium text-white/95">
            Edit Community Name and bio
          </span>
          <ChevronRight className="h-5 w-5 text-white/60 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Divider */}
        <div className="border-t border-white/10 mx-6" />

        {/* Pricing and benefits */}
        <button
          type="button"
          onClick={() => setIsPricingModalOpen(true)}
          className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/[0.03] transition-colors group"
        >
          <span className="text-base md:text-[17px] font-medium text-white/95">
            Pricing and benefits
          </span>
          <ChevronRight className="h-5 w-5 text-white/60 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Cover Image Section */}
      <div className="space-y-3.5">
        <h3 className="text-sm md:text-[15px] font-medium text-white/90">
          Choose your community cover image
        </h3>

        {/* 4 Circle Image Thumbnails */}
        <div className="flex items-center gap-3">
          {PRESET_COVERS.map((preset) => {
            const isSelected = selectedCover === preset.url;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedCover(preset.url)}
                className={`relative h-11 w-11 sm:h-12 sm:w-12 rounded-full overflow-hidden transition-all duration-200 ${
                  isSelected
                    ? "ring-2 ring-[#f5c94d] ring-offset-2 ring-offset-[#141414] scale-105"
                    : "opacity-80 hover:opacity-100 hover:scale-105"
                }`}
              >
                <Image
                  src={preset.url}
                  alt={preset.label}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </button>
            );
          })}
        </div>

        {/* Choose photo from gallery button */}
        <button
          type="button"
          onClick={() => setIsGalleryModalOpen(true)}
          className="w-full flex items-center justify-between px-5 py-4 rounded-[18px] bg-[#1a1a1a] border border-white/5 hover:border-white/20 transition-all text-left group shadow-sm"
        >
          <span className="text-sm md:text-[15px] font-medium text-white/80 group-hover:text-white">
            Choose your photo from gallery
          </span>
          <ImageIcon className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* Community Visibility Section */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-sm md:text-[15px] font-medium text-white/90">
          Community visibility
        </span>

        {/* Blue iOS-Style Toggle Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={isVisible}
          onClick={() => setIsVisible(!isVisible)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
            isVisible ? "bg-[#2563eb]" : "bg-[#333333]"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
              isVisible ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Active Community Summary Banner */}
      <div className="rounded-2xl border border-white/5 bg-[#141414] p-4 text-xs text-white/60 space-y-1">
        <p className="font-semibold text-white/90">
          Current Community: <span className="text-[#f5c94d]">{communityName}</span>
        </p>
        <p>
          Status: {isVisible ? "Publicly Discoverable" : "Hidden (Private)"} · Fee:{" "}
          {pricePerMonth > 0 ? `₦${pricePerMonth.toLocaleString()}/month` : "Free"}
        </p>
      </div>

      {/* Modals */}
      <EditCommunityModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        communityName={communityName}
        communityBio={communityBio}
        onSave={(name, bio) => {
          setCommunityName(name);
          setCommunityBio(bio);
        }}
      />

      <PricingBenefitsModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        pricePerMonth={pricePerMonth}
        benefits={benefits}
        onSave={(price, newBenefits) => {
          setPricePerMonth(price);
          setBenefits(newBenefits);
        }}
      />

      <GalleryPickerModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        selectedImage={selectedCover}
        onSelectImage={(url) => setSelectedCover(url)}
      />
    </div>
  );
}
