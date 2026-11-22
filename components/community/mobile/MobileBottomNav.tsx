"use client";

import { Home, UtensilsCrossed, Plus, Bell } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  activeTab?: "home" | "buka" | "upload" | "inbox" | "profile" | "community";
  onTabClick?: (tab: string) => void;
  className?: string;
}

export function MobileBottomNav({
  activeTab = "community",
  onTabClick,
  className = "",
}: MobileBottomNavProps) {
  return (
    <div
      className={cn(
        "w-full h-16 bg-[#161616] border-t border-white/8 flex items-center justify-around px-2 z-40 select-none",
        className
      )}
    >
      {/* Home */}
      <button
        type="button"
        onClick={() => onTabClick?.("home")}
        className={cn(
          "flex flex-col items-center justify-center gap-1 w-14 transition-colors cursor-pointer",
          activeTab === "home" ? "text-[#fbbe15]" : "text-zinc-400 hover:text-white"
        )}
      >
        <Home size={20} strokeWidth={activeTab === "home" ? 2.4 : 1.8} />
        <span className="text-[11px] font-medium leading-none">Home</span>
      </button>

      {/* Buka */}
      <button
        type="button"
        onClick={() => onTabClick?.("buka")}
        className={cn(
          "flex flex-col items-center justify-center gap-1 w-14 transition-colors cursor-pointer",
          activeTab === "buka" ? "text-[#fbbe15]" : "text-zinc-400 hover:text-white"
        )}
      >
        <UtensilsCrossed
          size={20}
          strokeWidth={activeTab === "buka" ? 2.4 : 1.8}
        />
        <span className="text-[11px] font-medium leading-none">Buka</span>
      </button>

      {/* Center + Action Button */}
      <button
        type="button"
        onClick={() => onTabClick?.("upload")}
        className="relative -top-2 flex items-center justify-center w-12 h-12 rounded-full bg-[#fbbe15] text-[#141414] shadow-lg shadow-[#fbbe15]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer border-none"
      >
        <Plus size={24} strokeWidth={2.8} />
      </button>

      {/* Inbox */}
      <button
        type="button"
        onClick={() => onTabClick?.("inbox")}
        className={cn(
          "flex flex-col items-center justify-center gap-1 w-14 transition-colors cursor-pointer relative",
          activeTab === "inbox" ? "text-[#fbbe15]" : "text-zinc-400 hover:text-white"
        )}
      >
        <div className="relative">
          <Bell size={20} strokeWidth={activeTab === "inbox" ? 2.4 : 1.8} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#fbbe15]" />
        </div>
        <span className="text-[11px] font-medium leading-none">Inbox</span>
      </button>

      {/* Profile */}
      <button
        type="button"
        onClick={() => onTabClick?.("profile")}
        className={cn(
          "flex flex-col items-center justify-center gap-1 w-14 transition-colors cursor-pointer",
          activeTab === "profile" ? "text-[#fbbe15]" : "text-zinc-400 hover:text-white"
        )}
      >
        <div
          className={cn(
            "w-6 h-6 rounded-full overflow-hidden border transition-all",
            activeTab === "profile" ? "border-[#fbbe15] ring-2 ring-[#fbbe15]/30" : "border-white/20"
          )}
        >
          <Image
            src="/images/avatar-meghan.png"
            alt="Profile"
            width={24}
            height={24}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-[11px] font-medium leading-none">Profile</span>
      </button>
    </div>
  );
}
