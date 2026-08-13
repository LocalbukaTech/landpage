"use client";

import { PartyPopper } from "lucide-react";

interface UploadSuccessProps {
  onBackHome: () => void;
}

export function UploadSuccess({ onBackHome }: UploadSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-2xl mx-auto bg-[#141414] border border-white/10 text-white rounded-3xl p-8 shadow-2xl">
      {/* Success Icon */}
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-amber-500/10 rounded-full flex items-center justify-center animate-pulse">
           <div className="w-24 h-24 bg-[#fbbe15]/20 rounded-full flex items-center justify-center border border-[#fbbe15]/40">
              <PartyPopper size={48} className="text-[#fbbe15] -rotate-12" />
           </div>
        </div>
      </div>

      <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Awesome! Post is Live 🎉</h2>
      <p className="text-zinc-400 mb-8 text-center max-w-md text-sm">
        Your content has been published to Localbuka. Check it out on your feed or profile!
      </p>

      <button
        onClick={onBackHome}
        className="py-3.5 px-12 bg-[#fbbe15] text-[#141414] font-bold rounded-xl hover:bg-amber-400 transition-all cursor-pointer shadow-md active:scale-95"
      >
        Back to Feed
      </button>
    </div>
  );
}
