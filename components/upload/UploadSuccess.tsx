"use client";

import { PartyPopper } from "lucide-react";

interface UploadSuccessProps {
  onBackHome: () => void;
}

export function UploadSuccess({ onBackHome }: UploadSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-2xl mx-auto bg-white rounded-lg">
      {/* Success Icon */}
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
           <div className="w-24 h-24 bg-green-200 rounded-full flex items-center justify-center">
              <PartyPopper size={48} className="text-purple-600 -rotate-12" />
           </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">Awesome!</h2>
      <p className="text-zinc-500 mb-8 text-center">
        Your content is live, check it out on your feed!
      </p>

      <button
        onClick={onBackHome}
        className="py-3 px-12 bg-[#fbbe15] text-[#1a1a1a] font-semibold rounded-lg hover:bg-[#e5ac10] transition-colors"
      >
        Back Home
      </button>
    </div>
  );
}
