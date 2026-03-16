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
      <h1 className="text-2xl font-semibold text-zinc-400 self-start mb-6">Prohibition</h1>
      
      <div className="bg-white rounded-3xl p-8 w-full shadow-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <span 
            className="text-3xl text-[#1a1a1a] font-normal"
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

        <h2 className="text-lg font-bold text-[#1a1a1a] mb-2">
          The following three contents are strictly prohibited:
        </h2>
        <p className="text-zinc-500 mb-8">
          Accounts that violate the following terms will be suspended.
        </p>

        <div className="space-y-4 mb-8">
          {/* Item 1 */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-red-50 border border-red-200">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-orange-100 rounded-full text-orange-600">
              <MessageSquareX size={24} />
            </div>
            <p className="text-[#1a1a1a] font-medium">
              Abusive language, profanity, violence or violent behaviour of any kind.
            </p>
          </div>

          {/* Item 2 */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-red-50 border border-red-200">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full text-purple-600">
              <EyeOff size={24} />
            </div>
            <p className="text-[#1a1a1a] font-medium">
              Images or video containing nudity or sexual content.
            </p>
          </div>

          {/* Item 3 */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-red-50 border border-red-200">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-red-100 rounded-full text-red-600">
              <Ban size={24} />
            </div>
            <p className="text-[#1a1a1a] font-medium">
              Tobacco, alcohol, drugs or similar substances.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onAccept}
            className="flex-1 py-3 px-6 bg-[#fbbe15] text-[#1a1a1a] font-semibold rounded-lg hover:bg-[#e5ac10] transition-colors"
          >
            I Accept
          </button>
          <button
            onClick={onRefuse}
            className="flex-1 py-3 px-6 border border-[#1a1a1a] text-[#1a1a1a] font-semibold rounded-lg hover:bg-zinc-50 transition-colors"
          >
            I Refuse
          </button>
        </div>
      </div>
    </div>
  );
}
