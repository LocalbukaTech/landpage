"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MobileCommunityScreen, MobileCommunityItem } from "./types";
import { MOCK_COMMUNITIES } from "./mockData";
import { useExploreCommunities } from "@/lib/api/services/community.hooks";
import { toMobileCommunityItem } from "@/lib/api/services/community.service";
import { MobileBottomNav } from "./MobileBottomNav";
import { MobileCommunityExplore } from "./MobileCommunityExplore";
import { MobilePaidCommunityDetails } from "./MobilePaidCommunityDetails";
import { MobileSubscribeCheckout } from "./MobileSubscribeCheckout";
import { MobilePaymentSuccess } from "./MobilePaymentSuccess";
import { MobilePaymentFailed } from "./MobilePaymentFailed";
import { MobileFreeCommunityDetails } from "./MobileFreeCommunityDetails";
import { MobileCommunityFeed } from "./MobileCommunityFeed";
import { MobileCommunityEmptyState } from "./MobileCommunityEmptyState";
import { MobileNotificationsView } from "./MobileNotificationsView";

interface MobileCommunityFlowProps {
  initialScreen?: MobileCommunityScreen;
  initialCommunityId?: string;
  onSwitchToCreator?: () => void;
  showStatusBar?: boolean;
  className?: string;
}

const SEED_PLACEHOLDER_SLUGS = new Set([
  "nigeria-food",
  "chef-amaka",
  "street-food",
  "baking-desserts",
  "suya-grill",
]);

export function MobileCommunityFlow({
  initialScreen = "explore",
  initialCommunityId = "",
  onSwitchToCreator,
  showStatusBar = true,
  className = "",
}: MobileCommunityFlowProps) {
  const router = useRouter();

  // Live API data (filtering out the 5 initial seed placeholder communities)
  const { data: communityData } = useExploreCommunities();
  const communities: MobileCommunityItem[] = (communityData?.items ?? [])
    .filter((c) => !SEED_PLACEHOLDER_SLUGS.has(c.slug))
    .map(toMobileCommunityItem);

  const [currentScreen, setCurrentScreen] =
    useState<MobileCommunityScreen>(initialScreen);

  const [selectedCommunity, setSelectedCommunity] =
    useState<MobileCommunityItem>(
      communities.find((c) => c.id === initialCommunityId) ||
        communities[0] ||
        MOCK_COMMUNITIES[0],
    );

  const handleSelectCommunityFromExplore = (community: MobileCommunityItem) => {
    setSelectedCommunity(community);
    if (community.isFree) {
      setCurrentScreen("free-details");
    } else {
      setCurrentScreen("paid-details");
    }
  };

  const handleBottomNavClick = (tab: string) => {
    if (tab === "inbox") {
      setCurrentScreen("notifications");
    } else if (tab === "home") {
      router.push("/");
    } else if (tab === "buka") {
      router.push("/buka");
    } else if (tab === "upload") {
      if (onSwitchToCreator) {
        onSwitchToCreator();
      } else {
        router.push("/studio");
      }
    } else if (tab === "profile") {
      router.push("/profile");
    }
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col bg-[#141414] text-white overflow-hidden ${className}`}
    >
      {/* iOS Status Bar */}
      {/* {showStatusBar && <MobileStatusBar />} */}

      {/* Screen Container */}
      <div className="flex-1 w-full min-h-0 overflow-hidden relative">
        {currentScreen === "explore" && (
          <MobileCommunityExplore
            communities={communities}
            onSelectCommunity={handleSelectCommunityFromExplore}
            onOpenMenu={() => router.push("/")}
            onOpenSearch={() => router.push("/search")}
            onNavigateTab={(tab) => {
              if (tab === "foryou") router.push("/?type=foryou");
              if (tab === "following") router.push("/?type=following");
            }}
            onViewEmptyState={() => setCurrentScreen("empty")}
          />
        )}

        {currentScreen === "paid-details" && (
          <MobilePaidCommunityDetails
            community={selectedCommunity}
            onBack={() => setCurrentScreen("explore")}
            onSubscribe={() => setCurrentScreen("subscribe")}
          />
        )}

        {currentScreen === "subscribe" && (
          <MobileSubscribeCheckout
            community={selectedCommunity}
            onBack={() => setCurrentScreen("paid-details")}
            onPaymentSuccess={() => setCurrentScreen("success")}
            onPaymentFailed={() => setCurrentScreen("failed")}
          />
        )}

        {currentScreen === "success" && (
          <MobilePaymentSuccess
            community={selectedCommunity}
            onGoToCommunity={() => setCurrentScreen("feed")}
          />
        )}

        {currentScreen === "failed" && (
          <MobilePaymentFailed
            onTryAgain={() => setCurrentScreen("subscribe")}
          />
        )}

        {currentScreen === "free-details" && (
          <MobileFreeCommunityDetails
            community={selectedCommunity}
            onBack={() => setCurrentScreen("explore")}
            onJoin={() => setCurrentScreen("feed")}
            onSelectPost={() => setCurrentScreen("feed")}
          />
        )}

        {currentScreen === "feed" && (
          <MobileCommunityFeed
            community={selectedCommunity}
            onBack={() => {
              if (selectedCommunity.isFree) {
                setCurrentScreen("free-details");
              } else {
                setCurrentScreen("explore");
              }
            }}
          />
        )}

        {currentScreen === "empty" && (
          <MobileCommunityEmptyState
            onCreateCommunity={() => {
              if (onSwitchToCreator) {
                onSwitchToCreator();
              } else {
                router.push("/community?tab=overview");
              }
            }}
            onBackToExplore={() => setCurrentScreen("explore")}
            onOpenMenu={() => router.push("/")}
            onOpenSearch={() => router.push("/search")}
          />
        )}

        {currentScreen === "notifications" && (
          <MobileNotificationsView onBack={() => setCurrentScreen("explore")} />
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={currentScreen === "notifications" ? "inbox" : "community"}
        onTabClick={handleBottomNavClick}
      />
    </div>
  );
}
