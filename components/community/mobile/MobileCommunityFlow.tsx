"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MobileCommunityScreen, MobileCommunityItem } from "./types";
import { MOCK_COMMUNITIES } from "./mockData";
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

export function MobileCommunityFlow({
  initialScreen = "explore",
  initialCommunityId = "chef-amaka",
  onSwitchToCreator,
  showStatusBar = true,
  className = "",
}: MobileCommunityFlowProps) {
  const router = useRouter();

  const [currentScreen, setCurrentScreen] =
    useState<MobileCommunityScreen>(initialScreen);

  const [selectedCommunity, setSelectedCommunity] =
    useState<MobileCommunityItem>(
      MOCK_COMMUNITIES.find((c) => c.id === initialCommunityId) ||
        MOCK_COMMUNITIES[1], // Chef Amaka
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
            communities={MOCK_COMMUNITIES}
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
