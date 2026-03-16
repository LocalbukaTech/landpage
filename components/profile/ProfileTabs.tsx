"use client";

import { useState, useEffect } from "react";
import { Video as VideoIcon, Repeat2, Bookmark, Tag } from "lucide-react";
import { Video } from "@/types/video";
import { ProfileVideoGrid } from "./ProfileVideoGrid";

const tabs = [
  { id: "videos", label: "Videos", icon: VideoIcon },
  { id: "repost", label: "Repost", icon: Repeat2 },
  { id: "saved", label: "Saved", icon: Bookmark },
  { id: "tagged", label: "Tagged", icon: Tag },
];

interface ProfileTabsProps {
  videos: Video[];
  initialTab?: string;
}

export function ProfileTabs({ videos, initialTab = "videos" }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="w-full mt-6">
      {/* Tab Headers */}
      <div className="flex border-b border-white/10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 md:px-6 py-3 text-sm font-medium transition-all border-b-2 cursor-pointer bg-transparent ${
                isActive
                  ? "border-[#FBBE15] text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        <ProfileVideoGrid videos={videos} />
      </div>
    </div>
  );
}
