"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Settings, Loader2 } from "lucide-react";
import SocialModal from "../social/SocialModal";
import { IoMdShareAlt } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useMe } from "@/lib/api/services/auth.hooks";

interface ProfileHeaderProps {
  /** For other-profile pages, pass the other user's data */
  otherName?: string;
  otherAvatarSrc?: string;
  otherLocation?: string;
  otherBio?: string;
  otherPosts?: number;
  otherFollowers?: string;
  otherFollowing?: number;
}

export function ProfileHeader({
  otherName = "Okafor Emeka",
  otherAvatarSrc = "/images/otherName.png",
  otherLocation,
  otherBio,
  otherPosts = 24,
  otherFollowers = "2K",
  otherFollowing = 341,
}: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const route = usePathname();
  const router = useRouter();

  // Fetch real user data
  const { user: authUser } = useAuth();
  const { data: meResponse, isLoading } = useMe();
  const meData = (meResponse as any)?.data?.data || (meResponse as any)?.data || null;
  const apiUser = meData || authUser;

  const isOtherProfile = route === "/other-profile";

  // Determine display values
  const displayName = isOtherProfile
    ? otherName
    : apiUser?.fullName || apiUser?.first_name
      ? `${apiUser?.first_name || ""} ${apiUser?.last_name || ""}`.trim() || apiUser?.fullName
      : "";

  const displayAvatar = isOtherProfile
    ? otherAvatarSrc
    : apiUser?.image_url || apiUser?.avatar || "/images/profile-pic.png";

  const displayLocation = isOtherProfile
    ? (otherLocation || "Lagos, Nigeria")
    : "Lagos, Nigeria";

  const displayBio = isOtherProfile
    ? (otherBio || "No bio yet.")
    : "No bio yet.";

  const displayPosts = isOtherProfile ? otherPosts : 0;
  const displayFollowers = isOtherProfile ? otherFollowers : "0";
  const displayFollowing = isOtherProfile ? otherFollowing : 0;

  // Show loading for own profile
  if (!isOtherProfile && isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-[#fbbe15]" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <SocialModal
        open={isFollowersModalOpen}
        onClose={() => setIsFollowersModalOpen(false)}
      />
      <SocialModal
        open={isFollowingModalOpen}
        onClose={() => setIsFollowingModalOpen(false)}
      />
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-[#FBBE15] overflow-hidden bg-[#FBBE15] ${isOtherProfile ? "border-none" : ""}`}>
            <Image
              src={displayAvatar}
              alt={displayName}
              width={128}
              height={128}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold text-white capitalize">{displayName}</h2>
              <IoMdShareAlt size={18} className="text-white" />
            </div>
            <Link
              href="/settings"
              className="flex items-center gap-2 text-white hover:text-[#FBBE15] transition-colors"
            >
              {!isOtherProfile &&
                <>
                <Settings size={20} />
                <span className="text-sm font-medium hidden sm:inline">Settings</span>
                </>
              }
            </Link>
          </div>

          <p className="text-sm text-zinc-400 mt-0.5">{displayLocation}</p>

          {/* Follow Back Button */}
          {isOtherProfile ? (
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`mt-2 px-4 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer border-none ${
              isFollowing
                ? "bg-transparent border border-[#FBBE15] text-[#FBBE15] hover:bg-[#FBBE15]/10"
                : "bg-[#FBBE15] text-[#1a1a1a] hover:bg-[#e5ab13]"
            }`}
            style={isFollowing ? { border: '1px solid #FBBE15' } : {}}
          >
            {isFollowing ? "Following" : "Follow back"}
          </button>
          ) : (
            <button
              onClick={() => { router.push('/settings')}}
              className={`mt-2 px-4 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer border-none bg-[#FBBE15] text-[#1a1a1a] hover:bg-[#e5ab13]`}
            >
              Edit
            </button>
          )}

          {/* Stats */}
          <div className="flex items-center gap-5 mt-3">
            <div className="text-center">
              <span className="text-white font-bold text-base">{displayPosts}</span>
              <p className="text-zinc-400 text-xs">Posts</p>
            </div>
            <button className="text-center cursor-pointer" onClick={() => setIsFollowersModalOpen(true)}>
              <span className="text-white font-bold text-base">{displayFollowers}</span>
              <p className="text-zinc-400 text-xs">Followers</p>
            </button>
            <button className="text-center cursor-pointer" onClick={() => setIsFollowingModalOpen(true)}>
              <span className="text-white font-bold text-base">{displayFollowing}</span>
              <p className="text-zinc-400 text-xs">Following</p>
            </button>
          </div>

          {/* Bio */}
          <p className="text-sm text-zinc-400 mt-2">{displayBio}</p>
        </div>
      </div>
    </div>
  );
}
