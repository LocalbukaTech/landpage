"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";

interface EditCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityName: string;
  communityBio: string;
  onSave: (name: string, bio: string) => void;
}

export function EditCommunityModal({
  isOpen,
  onClose,
  communityName,
  communityBio,
  onSave,
}: EditCommunityModalProps) {
  const [name, setName] = useState(communityName);
  const [bio, setBio] = useState(communityBio);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name, bio);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#171717] p-6 shadow-2xl text-white">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5c94d]/15 text-[#f5c94d]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Edit Community Name & Bio</h2>
              <p className="text-xs text-white/50">Update how your community appears to food lovers</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Community Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chef Tolu's kitchen"
              className="w-full rounded-2xl border border-white/10 bg-[#212121] px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#f5c94d] focus:outline-none focus:ring-1 focus:ring-[#f5c94d]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Community Bio & Description
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe what members get: secret recipes, behind the scenes, private tastings..."
              className="w-full rounded-2xl border border-white/10 bg-[#212121] px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#f5c94d] focus:outline-none focus:ring-1 focus:ring-[#f5c94d] resize-none"
            />
            <p className="mt-1 text-right text-[11px] text-white/40">
              {bio.length}/300 characters
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#f5c94d] px-6 py-2.5 text-sm font-semibold text-black hover:bg-[#eab308] active:scale-95 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
