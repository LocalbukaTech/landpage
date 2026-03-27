"use client";

import { useEffect } from "react";
import { X, Heart, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "like" | "follow" | "system" | "restaurant";
  user?: {
    name: string;
    avatar: string;
    description?: string; // e.g. "Anika Press, Mckenna James"
  };
  time: string;
  postImage?: string;
  content?: {
    title?: string;
    rating?: number;
    reviews?: number;
    description?: string;
    address?: string;
  };
  isFollowing?: boolean;
}

interface NotificationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock Data matching the screenshot
const NEW_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "like",
    user: {
      name: "Anika Press, Mckenna James",
      avatar: "/images/notification_avatar.png",
      description: "likes your post",
    },
    time: "5 mins ago",
    postImage: "/images/food.png",
  },
  {
    id: "2",
    type: "follow",
    user: {
      name: "Anika Press",
      avatar: "/images/notification_avatar.png",
      description: "started following you",
    },
    time: "10 mins ago",
    isFollowing: false,
  },
];

const YESTERDAY_NOTIFICATIONS: Notification[] = [
  {
    id: "3",
    type: "system",
    user: {
      name: "Hey James, check out this restaurant",
      avatar: "/images/localBuka_logo.png",
    },
    time: "22h ago",
    content: {
      title: "Commint Buka",
      rating: 4.5,
      reviews: 20,
      description: "15/17 Majekodunmi Street, Omotayo Street, Ikeja.",
    },
  },
  {
    id: "4",
    type: "like",
    user: {
      name: "Anika Press, Mckenna James",
      avatar: "/images/notification_avatar.png",
      description: "likes your post",
    },
    time: "5 mins ago",
    postImage: "/images/food.png",
  },
];

export function NotificationOverlay({ isOpen, onClose }: NotificationOverlayProps) {
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-[80px] w-[350px] bottom-0 bg-[#1a1a1a] z-100 p-6 flex flex-col border-r border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.4)] animate-[slideInDrawer_0.3s_ease-out]">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-white text-lg font-medium">Notifications</h2>
          <button
            className="flex items-center justify-center w-8 h-8 bg-[#3a3a3a] rounded-md text-[#a0a0a0] transition-all duration-200 hover:bg-[#4a4a4a] hover:text-white border-none cursor-pointer"
            onClick={onClose}
            aria-label="Close notifications"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-8 overflow-y-auto h-[calc(100vh-100px)] scrollbar-hide">
          {/* New Section */}
          <div>
            <h3 className="text-white text-[15px] font-medium mb-4">New</h3>
            <div className="flex flex-col gap-4">
              {NEW_NOTIFICATIONS.map((notif) => (
                <NotificationItem key={notif.id} notification={notif} />
              ))}
            </div>
          </div>

          {/* Yesterday Section */}
          <div>
            <h3 className="text-white text-[15px] font-medium mb-4">Yesterday</h3>
            <div className="flex flex-col gap-4">
              {YESTERDAY_NOTIFICATIONS.map((notif) => (
                <NotificationItem key={notif.id} notification={notif} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationItem({ notification }: { notification: Notification }) {
  if (notification.type === "system" && notification.content) {
    return (
      <div className="flex flex-col gap-3">
        {/* Header part */}
        <div className="flex gap-3">
           <div className="w-10 h-10 rounded-full bg-[#fbbe15] flex items-center justify-center shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-700 shrink-0 relative border border-white/10">
          <Image
            src={notification.user?.avatar || "/images/profile.png"}
            alt={notification.user?.name || "User"}
            fill
            className="object-cover"
          />
        </div>
           </div>
           <div className="flex flex-col">
             <span className="text-white text-sm font-medium leading-tight">
               {notification.user?.name}
             </span>
             <span className="text-zinc-500 text-xs mt-0.5">{notification.time}</span>
           </div>
        </div>
        
        {/* Restaurant Card */}
        <div className="bg-[#2a2a2a] rounded-xl p-3 flex gap-3">
           <div className="w-16 h-16 bg-zinc-700 rounded-lg overflow-hidden shrink-0">
             {/* Placeholder for restaurant image */}
             <Image 
               src="/images/commit_buka.png" 
               alt="Restaurant" 
               width={64} 
               height={64}
               className="w-full h-full object-cover"
             />
           </div>
           <div className="flex flex-col justify-center gap-1">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-bold">{notification.content.title}</span>
                <div className="flex items-center gap-1">
                   <span className="text-green-500 text-[10px] flex items-center gap-0.5">
                     ★ {notification.content.rating}
                   </span>
                   <span className="text-zinc-500 text-[10px]">({notification.content.reviews} Reviews)</span>
                </div>
              </div>
              <p className="text-zinc-400 text-xs line-clamp-2">
                {notification.content.description}
              </p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex gap-3 items-center flex-1">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-700 shrink-0 relative border border-white/10">
          <Image
            src={notification.user?.avatar || "/images/profile.png"}
            alt={notification.user?.name || "User"}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-white text-sm leading-tight">
            <span className="font-bold">{notification.user?.name?.split(",")[0]}</span>
            {notification.user?.name?.includes(",") ? ", " + notification.user?.name?.split(",")[1].trim() + " " : " "} 
            <span className="text-zinc-300 font-normal">{notification.user?.description?.replace("likes your post", "likes your post")}</span>
          </p>
          <span className="text-zinc-500 text-xs mt-0.5">{notification.time}</span>
        </div>
      </div>

      {notification.type === "like" && notification.postImage && (
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-white/10 relative">
          <Image
            src={notification.postImage}
            alt="Post"
            fill
            className="object-cover"
          />
        </div>
      )}

      {notification.type === "follow" && (
        <button className="bg-[#fbbe15] text-[#1a1a1a] text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#e5ac10] transition-colors shrink-0">
          Follow back
        </button>
      )}
    </div>
  );
}
