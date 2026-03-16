"use client";

import { useState, useCallback } from "react";
import BaseModal from "./BaseModal";
import UserRow from "./UserRow";
import { SocialUser } from "./types";

interface Props {
  open: boolean;
  onClose: () => void;
}

type TabType = "following" | "followers" | "suggested";

export default function SocialModal({ open, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("following");

  // Track which users the current user is following (by user id)
  // Initialize with users that are already followed (i.e. those in "following" tab)
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(() => {
    // All users in the "following" tab are already followed
    return new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
  });

  // Toggle follow/unfollow for a user
  const handleToggleFollow = useCallback((userId: string) => {
    setFollowedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  }, []);

  // Base user data (shared identity across tabs)
  const allUsers: SocialUser[] = [
    { id: "1", name: "Anika Press", username: "anikapress", avatar: "/avatars/Anika Press.jpg", actionLabel: "Follow" },
    { id: "2", name: "Tatiana Stanton", username: "tati", avatar: "/avatars/Tatiana Stanton.png", actionLabel: "Follow" },
    { id: "3", name: "Gustavo Mango", username: "gustavo", avatar: "/avatars/Gustavo Mango.png", actionLabel: "Follow" },
    { id: "4", name: "Haylie Carder", username: "haylie", avatar: "/avatars/Haylie Carder.png", actionLabel: "Follow" },
    { id: "5", name: "Rayna Carder", username: "rayna", avatar: "/avatars/Rayna Carder.png", actionLabel: "Follow" },
    { id: "6", name: "Tiana Baptista", username: "tiana", avatar: "/avatars/Tiana Baptista.png", actionLabel: "Follow" },
    { id: "7", name: "Charlie Schleifer", username: "charlie", avatar: "/avatars/Charlie Schleifer.png", actionLabel: "Follow" },
    { id: "8", name: "Paityn Levin", username: "paityn", avatar: "/avatars/Paityn Levin.png", actionLabel: "Follow" },
    { id: "9", name: "Maren Baptista", username: "maren", avatar: "/avatars/Maren Baptista.png", actionLabel: "Follow" },
  ];

  // Followers: people who follow the current user (some you follow back, some you don't)
  const followersData: SocialUser[] = [
    { id: "1", name: "Anika Press", username: "anikapress", avatar: "/avatars/Anika Press.jpg", actionLabel: "Follow back" },
    { id: "2", name: "Tatiana Stanton", username: "tati", avatar: "/avatars/Tatiana Stanton.png", actionLabel: "Follow back" },
    { id: "3", name: "Gustavo Mango", username: "gustavo", avatar: "/avatars/Gustavo Mango.png", actionLabel: "Follow back" },
    { id: "4", name: "Haylie Carder", username: "haylie", avatar: "/avatars/Haylie Carder.png", actionLabel: "Follow back" },
    { id: "5", name: "Rayna Carder", username: "rayna", avatar: "/avatars/Rayna Carder.png", actionLabel: "Follow back" },
    { id: "6", name: "Tiana Baptista", username: "tiana", avatar: "/avatars/Tiana Baptista.png", actionLabel: "Follow back" },
    { id: "7", name: "Charlie Schleifer", username: "charlie", avatar: "/avatars/Charlie Schleifer.png", actionLabel: "Follow back" },
    { id: "8", name: "Paityn Levin", username: "paityn", avatar: "/avatars/Paityn Levin.png", actionLabel: "Follow back" },
    { id: "9", name: "Maren Baptista", username: "maren", avatar: "/avatars/Maren Baptista.png", actionLabel: "Follow back" },
  ];

  // Suggested: people you might want to follow
  const suggestedData: SocialUser[] = [
    { id: "s1", name: "Okafor Emeka", username: "emeka", avatar: "/avatars/Okafor Emeka.jpg", actionLabel: "Follow" },
    { id: "s2", name: "Tatiana Stanton", username: "tati", avatar: "/avatars/Tatiana Stanton.png", actionLabel: "Follow" },
    { id: "s3", name: "Gustavo Mango", username: "gustavo", avatar: "/avatars/Gustavo Mango.png", actionLabel: "Follow" },
    { id: "s4", name: "Haylie Carder", username: "haylie", avatar: "/avatars/Haylie Carder.png", actionLabel: "Follow" },
    { id: "s5", name: "Rayna Carder", username: "rayna", avatar: "/avatars/Rayna Carder.png", actionLabel: "Follow" },
    { id: "s6", name: "Tiana Baptista", username: "tiana", avatar: "/avatars/Tiana Baptista.png", actionLabel: "Follow" },
    { id: "s7", name: "Charlie Schleifer", username: "charlie", avatar: "/avatars/Charlie Schleifer.png", actionLabel: "Follow" },
    { id: "s8", name: "Paityn Levin", username: "paityn", avatar: "/avatars/Paityn Levin.png", actionLabel: "Follow" },
    { id: "s9", name: "Maren Baptista", username: "maren", avatar: "/avatars/Maren Baptista.png", actionLabel: "Follow" },
  ];

  // Derive the correct action label based on follow state and active tab
  const deriveActionLabel = (user: SocialUser): SocialUser["actionLabel"] => {
    const isFollowed = followedUsers.has(user.id);

    if (activeTab === "followers") {
      // Followers tab: if you already follow them → "Unfollow", otherwise → "Follow back"
      return isFollowed ? "Unfollow" : "Follow back";
    }
    if (activeTab === "following") {
      // Following tab: you follow them, so "Unfollow". If you unfollowed → "Follow"
      return isFollowed ? "Unfollow" : "Follow";
    }
    // Suggested tab: "Follow" or "Unfollow" if you already followed
    return isFollowed ? "Unfollow" : "Follow";
  };

  const currentBaseData =
    activeTab === "following" ? allUsers :
    activeTab === "followers" ? followersData : suggestedData;

  // Apply derived labels
  const currentData = currentBaseData.map((u) => ({
    ...u,
    actionLabel: deriveActionLabel(u),
  }));

  const tabStyle = (tab: TabType) =>
    `flex-1 text-center pb-3 text-[12px] font-bold cursor-pointer transition-all border-b-2
    ${activeTab === tab ? "text-white border-[#FFC107]" : "text-[#71717A] border-transparent"}`;

return (
    <BaseModal open={open} onClose={onClose} title="Jane Cooper">
      <div className="flex flex-col -mx-5">
        
        {/* Top Section - Tabs */}
        <div className=" bg-[#121212] px-4 pt-2">
          <div className="flex border-b border-[#333333]">
            <div className={tabStyle("following")} onClick={() => setActiveTab("following")}>Following (2k)</div>
            <div className={tabStyle("followers")} onClick={() => setActiveTab("followers")}>Followers (341)</div>
            <div className={tabStyle("suggested")} onClick={() => setActiveTab("suggested")}>Suggested</div>
          </div>
        </div>

        {/* Bottom Section - List */}
        <div className="bg-[#1F1F1F] overflow-y-auto h-[480px] px-4 py-3 custom-scrollbar rounded-b-2xl">
          <div className="flex flex-col gap-2">
            {currentData.map((u) => (
              <UserRow
                key={`${activeTab}-${u.id}`}
                user={u}
                // activeTab={activeTab}
                onToggleFollow={handleToggleFollow}
              />
            ))}
          </div>
        </div>
      </div>
    </BaseModal>
  );
  
}