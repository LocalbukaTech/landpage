"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import BaseModal from "./BaseModal";
import UserRow from "./UserRow";
import { SocialUser as UISocialUser } from "./types";
import { useFollowers, useFollowing, useFollowMutation, useUnfollowMutation } from "@/lib/api/services/social.hooks";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMe } from "@/lib/api/services/auth.hooks";

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  title: string;
  initialTab?: TabType;
}

export type TabType = "following" | "followers" | "suggested";

export default function SocialModal({ open, onClose, userId, title, initialTab = "following" }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  // Sync initial tab when modal opens
  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

  // Fetch Logged-in User Data
  const { user: authUser } = useAuth();
  const { data: meResponse } = useMe();
  const meData = (meResponse as any)?.data?.data || (meResponse as any)?.data || null;
  const loggedInUserId = meData?.id || authUser?.id;

  // Fetch the logged-in user's following list to determine "Unfollow" state on other lists
  const { data: myFollowingData } = useFollowing(loggedInUserId || "", 1, 100);
  const myFollowingItems = myFollowingData?.data?.data || [];
  
  const followedUsers = useMemo(() => {
    return new Set(myFollowingItems.map(user => user.id));
  }, [myFollowingItems]);

  // Data for the current profile being viewed
  const { data: followersResponse, isLoading: isLoadingFollowers } = useFollowers(userId, 1, 50);
  const { data: followingResponse, isLoading: isLoadingFollowing } = useFollowing(userId, 1, 50);

  const followersList = followersResponse?.data?.data || [];
  const followingList = followingResponse?.data?.data || [];
  
  const followMutation = useFollowMutation();
  const unfollowMutation = useUnfollowMutation();

  const handleToggleFollow = useCallback((targetUserId: string) => {
    if (!loggedInUserId) return;

    if (followedUsers.has(targetUserId)) {
      unfollowMutation.mutate(targetUserId);
    } else {
      followMutation.mutate(targetUserId);
    }
  }, [loggedInUserId, followedUsers, followMutation, unfollowMutation]);

  // Mock suggested data
  const suggestedData: UISocialUser[] = [
    { id: "s1", name: "Okafor Emeka", username: "emeka", avatar: "/avatars/Okafor Emeka.jpg", actionLabel: "Follow" },
    { id: "s2", name: "Tatiana Stanton", username: "tati", avatar: "/avatars/Tatiana Stanton.png", actionLabel: "Follow" },
    { id: "s3", name: "Gustavo Mango", username: "gustavo", avatar: "/avatars/Gustavo Mango.png", actionLabel: "Follow" },
    { id: "s4", name: "Haylie Carder", username: "haylie", avatar: "/avatars/Haylie Carder.png", actionLabel: "Follow" },
  ];

  const deriveActionLabel = (targetId: string): UISocialUser["actionLabel"] => {
    if (targetId === loggedInUserId) return "Unfollow"; // Should ideally be hidden or "You"
    const isFollowedByMe = followedUsers.has(targetId);
    return isFollowedByMe ? "Unfollow" : (activeTab === "followers" ? "Follow back" : "Follow");
  };

  const currentData: UISocialUser[] = useMemo(() => {
    if (activeTab === "suggested") {
      return suggestedData.map(u => ({ ...u, actionLabel: deriveActionLabel(u.id) }));
    }

    const apiList = activeTab === "following" ? followingList : followersList;

    return apiList.map((user) => ({
      id: user.id,
      name: user.fullName || "User",
      username: user.username || "user",
      avatar: user.avatar || "",
      actionLabel: deriveActionLabel(user.id),
    }));
  }, [activeTab, followersList, followingList, followedUsers, loggedInUserId]);

  const isLoading = (activeTab === "following" && isLoadingFollowing) || 
                    (activeTab === "followers" && isLoadingFollowers);

  const tabStyle = (tab: TabType) =>
    `flex-1 text-center pb-3 text-[12px] font-bold cursor-pointer transition-all border-b-2
    ${activeTab === tab ? "text-white border-[#FFC107]" : "text-[#71717A] border-transparent"}`;

  return (
    <BaseModal open={open} onClose={onClose} title={title}>
      <div className="flex flex-col -mx-5 h-[480px]">
        
        <div className="bg-[#121212] px-4 pt-2">
          <div className="flex border-b border-[#333333]">
            <div className={tabStyle("followers")} onClick={() => setActiveTab("followers")}>
              Followers
            </div>
            <div className={tabStyle("following")} onClick={() => setActiveTab("following")}>
              Following
            </div>
            <div className={tabStyle("suggested")} onClick={() => setActiveTab("suggested")}>
              Suggested
            </div>
          </div>
        </div>

        <div className="bg-[#1F1F1F] flex-1 overflow-y-auto px-4 py-3 custom-scrollbar rounded-b-2xl relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#fbbe15]" />
            </div>
          ) : currentData.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm">
              No users found.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {currentData.map((u) => (
                <UserRow
                  key={`${activeTab}-${u.id}`}
                  user={u}
                  onToggleFollow={handleToggleFollow}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
}