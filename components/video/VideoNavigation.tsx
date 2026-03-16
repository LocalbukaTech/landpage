"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export function VideoNavigation({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: VideoNavigationProps) {
  return (
    <div className="flex flex-col gap-2 ml-6 self-center">
      <button
        className={cn(
          "flex items-center justify-center w-9 h-9 bg-transparent border-[2px] border-[#454545] rounded-full text-[#a0a0a0] cursor-pointer transition-all duration-200",
          !canGoPrevious 
            ? "opacity-30 cursor-not-allowed" 
            : "hover:bg-white/5 hover:border-[#666666] hover:text-white"
        )}
        onClick={onPrevious}
        disabled={!canGoPrevious}
        aria-label="Previous video"
      >
        <ChevronUp size={24} />
      </button>
      <button
        className={cn(
          "flex items-center justify-center w-9 h-9 bg-transparent border-[2px] border-[#454545] rounded-full text-[#a0a0a0] cursor-pointer transition-all duration-200",
          !canGoNext 
            ? "opacity-30 cursor-not-allowed" 
            : "hover:bg-white/5 hover:border-[#666666] hover:text-white"
        )}
        onClick={onNext}
        disabled={!canGoNext}
        aria-label="Next video"
      >
        <ChevronDown size={24} />
      </button>
    </div>
  );
}
