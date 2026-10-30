"use client";

import { useState } from "react";
import { Smartphone, ChevronRight } from "lucide-react";
import { MobileCommunityScreen } from "./types";
import { MobileCommunityFlow } from "./MobileCommunityFlow";
import { cn } from "@/lib/utils";

interface ScreenPreset {
  id: MobileCommunityScreen;
  title: string;
  badge: string;
  desc: string;
}

const SCREEN_PRESETS: ScreenPreset[] = [
  {
    id: "explore",
    title: "1. Explore / Recommended",
    badge: "Main",
    desc: "Discover communities, category filter pills, horizontal cards & trending list",
  },
  {
    id: "paid-details",
    title: "2. Paid Community Details",
    badge: "VIP",
    desc: "Chef Amaka's kitchen, what you get checklist, pricing & unlock CTA",
  },
  {
    id: "subscribe",
    title: "3. Subscribe Checkout",
    badge: "Payment",
    desc: "Monthly vs Yearly (Save 17%), card selection & recurring agreement",
  },
  {
    id: "success",
    title: "4. You're in! (Success)",
    badge: "Confirmed",
    desc: "Green checkmark success screen confirming membership",
  },
  {
    id: "failed",
    title: "5. Payment Failed",
    badge: "Error",
    desc: "Red X error modal with card retry button",
  },
  {
    id: "free-details",
    title: "6. Free Community Details",
    badge: "Free",
    desc: "Nigeria food and culture, + Join Community, shares & recent posts",
  },
  {
    id: "feed",
    title: "7. Community Feed & Chat",
    badge: "Social",
    desc: "Discussion post by @chef_tolu, likes, comments & active input bar",
  },
  {
    id: "empty",
    title: "8. Empty State",
    badge: "Zero State",
    desc: "No communities yet outline state with Create a Community CTA",
  },
  {
    id: "notifications",
    title: "9. Mobile Notifications",
    badge: "Activity",
    desc: "New & Yesterday activity, restaurant card recommendation & follow back",
  },
];

interface CommunityMobileShowcaseProps {
  onSwitchToCreator?: () => void;
}

export function CommunityMobileShowcase({
  onSwitchToCreator,
}: CommunityMobileShowcaseProps) {
  const [activeScreen, setActiveScreen] =
    useState<MobileCommunityScreen>("explore");

  return (
    <div className="w-full py-2 space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-white/10 bg-[#1e1e1e] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fbbe15]/15 px-2.5 py-0.5 text-xs font-bold text-[#fbbe15]">
            <Smartphone size={13} />
            <span>Mobile Community Suite</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Interactive Community Mobile Screens
          </h2>
          <p className="text-xs text-zinc-400">
            Preview, test, and interact with the complete mobile user flow
            designed for the LocalBuka community feature.
          </p>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          {onSwitchToCreator && (
            <button
              type="button"
              onClick={onSwitchToCreator}
              className="rounded-full bg-white/10 hover:bg-white/15 px-3.5 py-1.5 text-xs font-medium text-white transition-colors cursor-pointer"
            >
              Creator Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Screen Switcher on Left + Phone Frame on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Screen Selector Nav */}
        <div className="lg:col-span-5 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1 mb-2">
            Select Screen to Preview
          </p>

          <div className="space-y-2">
            {SCREEN_PRESETS.map((screen) => (
              <button
                key={screen.id}
                type="button"
                onClick={() => setActiveScreen(screen.id)}
                className={cn(
                  "w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3",
                  activeScreen === screen.id
                    ? "bg-[#252525] border-[#fbbe15] shadow-sm shadow-[#fbbe15]/10"
                    : "bg-[#1c1c1c] border-white/6 hover:bg-[#222222] hover:border-white/15"
                )}
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {screen.title}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.2 text-[9px] font-bold",
                        activeScreen === screen.id
                          ? "bg-[#fbbe15] text-black"
                          : "bg-white/10 text-zinc-300"
                      )}
                    >
                      {screen.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug line-clamp-2">
                    {screen.desc}
                  </p>
                </div>

                <ChevronRight
                  size={16}
                  className={cn(
                    "shrink-0 transition-transform",
                    activeScreen === screen.id
                      ? "text-[#fbbe15] translate-x-0.5"
                      : "text-zinc-500"
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: iPhone Frame Mockup */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          {/* Phone Shell */}
          <div className="relative w-[360px] sm:w-[380px] h-[760px] rounded-[48px] bg-[#141414] p-3 shadow-[0_25px_80px_rgba(0,0,0,0.85)] border-[8px] border-[#2c2c2e] ring-1 ring-white/10 overflow-hidden flex flex-col">
            {/* Dynamic Island / Speaker Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-black z-50 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#18181b] mr-3" />
              <div className="w-2 h-2 rounded-full bg-[#111] ring-1 ring-white/5" />
            </div>

            {/* Interactive Screen Display */}
            <div className="w-full h-full rounded-[38px] overflow-hidden bg-[#141414] relative flex flex-col">
              <MobileCommunityFlow
                key={activeScreen}
                initialScreen={activeScreen}
                onSwitchToCreator={onSwitchToCreator}
                showStatusBar={true}
              />
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-50 pointer-events-none" />
          </div>

          <p className="text-xs text-zinc-500 mt-4 text-center">
            📱 Fully interactive mockup — tap cards, buttons, tabs & inputs to test
            live flows!
          </p>
        </div>
      </div>
    </div>
  );
}
