"use client";

import Image from "next/image";
import { Ban, MessageSquareX, EyeOff } from "lucide-react";

interface ProhibitionProps {
  onAccept: () => void;
  onRefuse: () => void;
}

export function Prohibition({ onAccept, onRefuse }: ProhibitionProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-zinc-400 self-start mb-6">Content Guidelines & Prohibition</h1>
      
      <div className="bg-[#141414] border border-white/10 rounded-3xl p-8 w-full shadow-2xl text-white">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <span 
            className="text-3xl text-white font-normal"
            style={{ fontFamily: 'var(--font-hakuna), sans-serif' }}
          >
            Localbuka
          </span>
          <Image
            src="/images/localBuka_logo.png"
            alt="LocalBuka"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full"
          />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">
          The following three contents are strictly prohibited:
        </h2>
        <p className="text-zinc-400 mb-8 text-sm">
          Accounts that violate the following terms will be suspended immediately.
        </p>

        <div className="space-y-4 mb-8">
          {/* Item 1 */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-orange-500/20 rounded-full text-orange-400">
              <MessageSquareX size={24} />
            </div>
            <p className="text-zinc-200 font-medium text-sm">
              Abusive language, profanity, violence or violent behaviour of any kind.
            </p>
          </div>

          {/* Item 2 */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-purple-500/20 rounded-full text-purple-400">
              <EyeOff size={24} />
            </div>
            <p className="text-zinc-200 font-medium text-sm">
              Images or video containing nudity or sexual content.
            </p>
          </div>

          {/* Item 3 */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-red-500/20 rounded-full text-red-400">
              <Ban size={24} />
            </div>
            <p className="text-zinc-200 font-medium text-sm">
              Tobacco, alcohol, drugs or similar substances.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onAccept}
            className="flex-1 py-3.5 px-6 bg-[#fbbe15] text-[#141414] font-bold rounded-xl hover:bg-amber-400 transition-colors cursor-pointer shadow-md"
          >
            I Accept
          </button>
          <button
            onClick={onRefuse}
            className="flex-1 py-3.5 px-6 border border-white/15 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            I Refuse
          </button>
        </div>
      </div>
    </div>
  );
}
