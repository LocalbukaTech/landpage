"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Check,
  Share2,
  Utensils,
  MessageSquare,
  Image as ImageIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BackCircleButton } from "@/components/ui/BackCircleButton";
import { MembersOnlyModal } from "@/components/community/MembersOnlyModal";

export interface CommunityDetailProps {
  id?: string;
  name?: string;
  description?: string;
  coverImage?: string;
  avatarImage?: string;
  isFree?: boolean;
  price?: string;
  yearlyPrice?: string;
  owner?: string;
  membersCount?: string;
  recentPosts?: Array<{
    id: string;
    image: string;
    title: string;
  }>;
  onBack?: () => void;
}

export function CommunityDetailView({
  id = "chef-amaka",
  name = "Chef Amaka's kitchen",
  description = "Weekly private recipes, live cook-alongs, and direct feedback from Chef Amaka for members serious about leveling up their cooking.",
  coverImage = "/images/community/chef-amaka-hero.jpg",
  avatarImage = "/images/community/amaka-avatar.jpg",
  isFree = false,
  price = "₦2,500",
  yearlyPrice = "or ₦25,000 billed yearly",
  owner = "Amaka Obi",
  membersCount = "2.1k members . 58 posts",
  recentPosts = [
    {
      id: "post-1",
      image: "/images/community/recent-post-burger.jpg",
      title: "Loaded Burgers & Fries Spread",
    },
    {
      id: "post-2",
      image: "/images/community/recent-post-bbq.jpg",
      title: "Outdoor BBQ & Suya Grill",
    },
    {
      id: "post-3",
      image: "/images/community/recent-post-feast.jpg",
      title: "Grand Banquet Table Feast",
    },
  ],
  onBack,
}: CommunityDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isJoined, setIsJoined] = useState(false);
  const [selectedPostImage, setSelectedPostImage] = useState<string | null>(
    null,
  );

  const shouldOpenInitially = searchParams
    ? searchParams.get("modal") === "members-only" ||
      searchParams.get("locked") === "true"
    : false;
  const [isMembersModalOpen, setIsMembersModalOpen] =
    useState(shouldOpenInitially);

  useEffect(() => {
    if (
      searchParams &&
      (searchParams.get("modal") === "members-only" ||
        searchParams.get("locked") === "true")
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMembersModalOpen(true);
    }
  }, [searchParams]);

  const handlePostClick = (image: string) => {
    if (!isFree) {
      setIsMembersModalOpen(true);
    } else {
      setSelectedPostImage(image);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== "undefined" && window.history.length > 2) {
      router.back();
    } else {
      router.push("/community");
    }
  };

  const handleToggleJoin = () => {
    setIsJoined(!isJoined);
    toast({
      title: isJoined ? "Left community" : "Joined community!",
      description: isJoined
        ? "You have left this community."
        : "Welcome! You now have access to all posts.",
    });
  };

  return (
    <div className="w-full max-w-[1117px] mx-auto text-white space-y-6 pb-12">
      {/* ── 1. Hero Cover Image Container ── */}
      <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-[420px] rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-900 border-b-[3px] border-white/10 shadow-2xl">
        <Image
          src={coverImage}
          alt={name}
          fill
          priority
          unoptimized
          className="object-cover"
        />

        {/* Top Floating Controls */}
        <div className="absolute top-3 sm:top-5 left-3 sm:left-5 z-10">
          <BackCircleButton onClick={handleBack} size={32} color="#FFFFFF" />
        </div>
      </div>

      {/* ── 2. Overlapping Circular Profile Avatar ── */}
      <div className="relative -mt-10 sm:-mt-16 md:-mt-20 ml-4 sm:ml-8 z-20 mb-2 inline-block">
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-[#1a1a1a] shadow-2xl bg-zinc-800">
          <Image
            src={avatarImage}
            alt={name}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      </div>

      {/* ── 3. Main Community Info & Subscription Card Grid ── */}
      <div className="px-2 sm:px-4">
        <div className="flex flex-col lg:flex-row justify-between items-start w-full gap-6 lg:gap-8">
          {/* Left Column - Details */}
          <div className="w-full lg:max-w-[489px] flex flex-col gap-3 justify-center">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-white leading-tight tracking-tight">
                {name}
              </h1>
              <p className="text-sm sm:text-[15px] leading-relaxed text-zinc-400 font-normal">
                {description}
              </p>
            </div>

            {/* Category Pill Badge */}
            <div className="pt-1">
              {isFree ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30">
                  Free
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFC533]/15 text-[#FFC533] border border-[#FFC533]/30">
                  <Lock className="w-3 h-3" /> Paid community
                </span>
              )}
            </div>

            {/* Meta statistics */}
            <p className="text-xs sm:text-sm text-zinc-400">
              Owned by <span className="text-white font-medium">{owner}</span> ·{" "}
              {membersCount}
            </p>
          </div>

          {/* Right Column - Subscription Card */}
          <div className="w-full sm:max-w-[320px] lg:w-[292px] shrink-0">
            {isFree ? (
              <div className="w-full rounded-2xl border-2 border-white/10 p-5 bg-[#242424] shadow-xl space-y-4">
                {/* Header */}
                <h3 className="text-lg font-bold text-white leading-snug">
                  What members share
                </h3>

                {/* Feature Items with Icons */}
                <div className="flex flex-col gap-3 text-sm text-zinc-300">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/images/community/vector-5.svg"
                      alt=""
                      className="w-4 h-4 shrink-0"
                    />
                    <span>Recipes and cooking tips</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/images/community/vector-6-new.svg"
                      alt=""
                      className="w-4 h-4 shrink-0"
                    />
                    <span>Food discussions</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/images/community/vector-15.svg"
                      alt=""
                      className="w-4 h-4 shrink-0"
                    />
                    <span>Photos and short videos</span>
                  </div>
                </div>

                {/* Join Button */}
                <button
                  type="button"
                  onClick={handleToggleJoin}
                  className="w-full py-2.5 rounded-xl bg-[#FFC533] hover:bg-[#e6b12d] text-black font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer text-center"
                >
                  {isJoined ? "Joined ✓" : "+ Join Community"}
                </button>
              </div>
            ) : (
              <div className="w-full rounded-2xl border-2 border-white/10 p-5 bg-[#242424] shadow-xl flex flex-col justify-between min-h-[260px] space-y-4">
                {/* Price heading */}
                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight">
                      {price}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-zinc-400">
                      /month
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-medium">
                    {yearlyPrice}
                  </p>
                </div>

                {/* Feature Checklist */}
                <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-zinc-300 py-1">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#22C55E] shrink-0 stroke-[3]" />
                    <span>Exclusive weekly recipes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#22C55E] shrink-0 stroke-[3]" />
                    <span>Monthly live cook-alongs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#22C55E] shrink-0 stroke-[3]" />
                    <span>Direct Q&amp;A with Chef Amaka</span>
                  </div>
                </div>

                {/* Subscribe Button */}
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/community/${id || "chef-amaka"}/subscribe`)
                  }
                  className="w-full py-3 rounded-xl bg-[#FFC533] hover:bg-[#e6b12d] text-black font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer text-center"
                >
                  Subscribe to unlock
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 4. Recent Posts Section ── */}
      <div className="px-2 sm:px-4 pt-6 space-y-4">
        <h2 className="text-xl font-bold text-white tracking-wide">
          Recent posts
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 max-w-[800px]">
          {recentPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => handlePostClick(post.image)}
              className="group relative h-[160px] rounded-2xl overflow-hidden bg-zinc-800 border border-white/10 cursor-pointer shadow-md"
            >
              <Image
                src={post.image}
                alt={post.title}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Members-only Content Paywall Modal */}
      <MembersOnlyModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        communityId={id}
        communityName={name}
        communityAvatar={avatarImage}
        ownerName={owner}
        price={price ? `${price}/mo` : "₦2,500/mo"}
      />

      {/* Lightbox / Fullscreen Image Preview modal for free community posts */}
      {selectedPostImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPostImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <Image
              src={selectedPostImage}
              alt="Enlarged post"
              fill
              unoptimized
              className="object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
