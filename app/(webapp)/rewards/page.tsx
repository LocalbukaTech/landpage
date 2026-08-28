"use client";

import { useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Gift,
  Copy,
  Share2,
  Coins,
  Tag,
  Users,
  CheckCircle2,
  Clock,
  HelpCircle,
  Award,
  LogIn,
  TrendingUp,
  ArrowDownToLine,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRewardsDashboard } from "@/lib/api/services/referral.hooks";
import { RedeemModal } from "@/components/rewards/RedeemModal";
import { VanityCodeModal } from "@/components/rewards/VanityCodeModal";
import { TopEarnersCarousel } from "@/components/rewards/TopEarnersCarousel";
import { TransactionHistoryTable } from "@/components/rewards/TransactionHistoryTable";
import { ReferralsListTable } from "@/components/rewards/ReferralsListTable";
import { ReferralActivityChart } from "@/components/rewards/ReferralActivityChart";
import HowItWorks from "@/components/rewards/HowItWorks";
import { ShareDrawer } from "@/components/video/ShareDrawer";

export default function RewardsPage() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { data: dashboard, isLoading } = useRewardsDashboard();

  const [copiedType, setCopiedType] = useState<"code" | "link" | null>(null);
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [isVanityOpen, setIsVanityOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "transactions" | "referrals" | "how-it-works"
  >("transactions");

  const wallet = dashboard?.wallet;
  const referral = dashboard?.referral;
  const referralsList = referral?.referrals || dashboard?.referrals || [];
  const recentTransactions = dashboard?.recentTransactions || [];

  const currentPoints = wallet?.currentPoints ?? 0;
  const nairaEquivalent =
    wallet?.nairaBalance ??
    wallet?.nairaEquivalent ??
    Math.floor(currentPoints / 2);
  const minPoints = wallet?.minRedeemablePoints ?? 1000;
  const canRedeem = wallet?.canRedeem ?? currentPoints >= minPoints;
  const pointsNeeded =
    wallet?.pointsNeededToRedeem ?? Math.max(0, minPoints - currentPoints);
  const lifetimeEarned = wallet?.lifetimeEarned ?? currentPoints;
  const lifetimeEarnedNaira =
    wallet?.lifetimeEarnedNaira ?? Math.floor(lifetimeEarned / 2);
  const lifetimeRedeemed = wallet?.lifetimeRedeemed ?? 0;
  const lifetimeRedeemedNaira =
    wallet?.lifetimeRedeemedNaira ?? Math.floor(lifetimeRedeemed / 2);

  const displayCode =
    referral?.vanityCode || referral?.referralCode || "MYCODE";
  const shareUrl =
    referral?.shareLink ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/?ref=${displayCode}`
      : `https://localbuka.com/?ref=${displayCode}`);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(displayCode);
    setCopiedType("code");
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedType("link");
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleShare = () => {
    setIsShareOpen(true);
  };

  return (
    <MainLayout>
      <div
        className="w-full max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8 pb-28 md:pb-12 flex flex-col gap-8"
        style={{
          fontFamily: "var(--font-nunito-sans), Nunito Sans, sans-serif",
        }}
        id="rewards-page-root"
      >
        {/* ── Top Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FBBE15]/20 text-[#FBBE15] flex items-center justify-center">
                <Gift size={20} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight m-0">
                Refer &amp; Earn
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 m-0">
              Invite food lovers to LocalBuka. Earn 50 Points (₦25) for every
              verified friend who signs up!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              {wallet?.pointsToNairaRate || "2 Points = ₦1.00"}
            </span>
            <Link
              href="/rewards/leaderboard"
              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Award size={14} className="text-[#FBBE15]" />
              Leaderboard
            </Link>
          </div>
        </div>

        {/* ── Unauthenticated State Notice ── */}
        {!isAuthenticated && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#161616] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FBBE15]">
                Unlock Rewards &amp; Cash Payouts
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white m-0">
                Start Earning Points Today
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-lg m-0">
                Sign in to get your personalized referral link, earn 50 points
                per friend, track your conversions, and cash out directly in
                Naira.
              </p>
            </div>
            <button
              onClick={() => openAuthModal()}
              className="px-6 py-3.5 bg-[#FBBE15] hover:bg-[#e5ac10] text-[#1a1a1a] font-extrabold rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-lg shadow-[#FBBE15]/10 text-sm"
            >
              <LogIn size={18} />
              Sign In / Sign Up
            </button>
          </div>
        )}

        {/* ── Main Dashboard Content ── */}
        {isAuthenticated && (
          <div className="flex flex-col gap-8">
            {/* ── Top Row: Referral Link Card & Wallet Card & Stats ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Referral Link & Code Box (7 Cols) */}
              <div className="lg:col-span-7 bg-[#161616] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5 relative overflow-hidden shadow-lg">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        Your Referral Code
                      </span>
                      {referral?.vanityCode && (
                        <span className="px-2 py-0.5 rounded-md bg-[#FBBE15]/15 text-[#FBBE15] text-[10px] font-extrabold tracking-wide border border-[#FBBE15]/30">
                          CUSTOM BRANDED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Big Code Display */}
                  <div className="flex items-center justify-between bg-black/50 border border-white/10 rounded-xl p-3.5 px-4">
                    <span className="font-mono text-xl sm:text-2xl font-black text-[#FBBE15] tracking-widest">
                      {isLoading ? "..." : displayCode}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border-none"
                    >
                      <Copy size={13} />
                      {copiedType === "code" ? "Copied!" : "Copy Code"}
                    </button>
                  </div>

                  {/* Share URL Pill & Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="flex-1 text-xs text-zinc-400 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 overflow-hidden text-ellipsis whitespace-nowrap font-mono">
                      {isLoading ? "Loading share link..." : shareUrl}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleCopyLink}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 text-xs font-bold border border-white/20 rounded-xl px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white cursor-pointer transition-colors"
                      >
                        <Copy size={14} />
                        <span>
                          {copiedType === "link" ? "Copied!" : "Copy Link"}
                        </span>
                      </button>

                      <button
                        onClick={handleShare}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 text-xs font-extrabold rounded-xl px-4 py-2.5 bg-[#FBBE15] text-[#1a1a1a] hover:bg-[#e5ac10] cursor-pointer transition-colors border-none"
                      >
                        <Share2 size={14} strokeWidth={2.5} />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>

                  {/* 7-Day Referral Activity Graph */}
                  <ReferralActivityChart
                    referrals={referralsList}
                    completedCount={referral?.completedReferrals ?? 0}
                    totalCount={referral?.totalReferrals ?? 0}
                  />
                </div>

                {/* Vanity Code Action / Progress */}
                {!referral?.vanityCode && (
                  <div className="pt-3.5 border-t border-white/10 flex flex-col gap-2 text-xs">
                    {referral?.isEligibleForVanityCode ||
                    referral?.canRequestVanityCode ||
                    (referral?.completedReferrals ?? 0) >=
                      (referral?.vanityCodeThreshold ?? 5) ? (
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center justify-between w-full">
                          <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                            <Tag size={14} className="text-[#FBBE15]" />
                            {referral?.vanityCode ? (
                              <span>
                                Active Vanity Code:{" "}
                                <strong className="text-[#FBBE15] font-mono">
                                  {referral.vanityCode}
                                </strong>
                              </span>
                            ) : (
                              <span>
                                Unlocked! You are eligible for a custom vanity
                                code
                              </span>
                            )}
                          </span>
                          <button
                            onClick={() => setIsVanityOpen(true)}
                            className="text-xs font-bold text-[#FBBE15] hover:underline cursor-pointer bg-transparent border-none p-0"
                          >
                            {referral?.vanityCode
                              ? "Edit Custom Code"
                              : "Set Vanity Code →"}
                          </button>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-[#FBBE15] w-full rounded-full" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center justify-between w-full text-zinc-400">
                          <span className="flex items-center gap-1.5 text-xs">
                            <Tag size={13} className="text-[#FBBE15]" />
                            Unlock custom vanity code:{" "}
                            <strong className="text-white font-bold">
                              {referral?.completedReferrals ?? 0}/
                              {referral?.vanityCodeThreshold ?? 5}
                            </strong>{" "}
                            completed referrals
                          </span>
                          <button
                            onClick={() => setIsVanityOpen(true)}
                            className="text-xs text-zinc-400 hover:text-white font-medium cursor-pointer bg-transparent border-none p-0"
                          >
                            Learn more
                          </button>
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#e5ac10] to-[#FBBE15] rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  Math.round(
                                    ((referral?.completedReferrals ?? 0) /
                                      (referral?.vanityCodeThreshold ?? 5)) *
                                      100,
                                  ),
                                ),
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Wallet & Points Balance Box (5 Cols) */}
              <div className="lg:col-span-5 bg-[#161616] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-lg relative overflow-hidden">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Coins size={14} className="text-[#FBBE15]" />
                      Rewards Wallet
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10 font-semibold">
                      Min: {minPoints.toLocaleString()} pts (₦
                      {(minPoints / 2).toLocaleString()})
                    </span>
                  </div>

                  {/* Points Counter */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-white leading-none tracking-tight">
                      {isLoading ? "..." : currentPoints.toLocaleString()}
                    </span>
                    <span className="text-sm text-zinc-400 font-semibold">
                      pts
                    </span>
                  </div>

                  {/* Naira Value Conversion */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#FBBE15]">
                      ≈ ₦
                      {nairaEquivalent.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-xs text-zinc-500">
                      current available cash
                    </span>
                  </div>
                </div>

                {/* Prominent Lifetime History Box */}
                <div className="grid grid-cols-2 gap-2.5 p-3 sm:p-3.5 rounded-xl bg-black/50 border border-white/10">
                  {/* Lifetime Earned */}
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      <TrendingUp size={12} className="text-[#FBBE15]" />
                      <span>Total Earned</span>
                    </div>
                    <span className="text-sm sm:text-base font-black text-white">
                      {lifetimeEarned.toLocaleString()}{" "}
                      <span className="text-[11px] font-normal text-zinc-400">
                        pts
                      </span>
                    </span>
                    <span className="text-[11px] font-bold text-[#FBBE15]">
                      ≈ ₦
                      {lifetimeEarnedNaira.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  {/* Lifetime Redeemed */}
                  <div className="flex flex-col gap-0.5 border-l border-white/10 pl-3">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      <ArrowDownToLine size={12} className="text-emerald-400" />
                      <span>Total Redeemed</span>
                    </div>
                    <span className="text-sm sm:text-base font-black text-emerald-400">
                      ₦
                      {lifetimeRedeemedNaira.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-400/80">
                      {lifetimeRedeemed.toLocaleString()} pts cashed out
                    </span>
                  </div>
                </div>

                {/* Redeem CTA Button */}
                <div>
                  <button
                    onClick={() => setIsRedeemOpen(true)}
                    disabled={!canRedeem}
                    className={`w-full py-3.5 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${
                      canRedeem
                        ? "bg-[#166534] hover:bg-[#14532d] text-white cursor-pointer shadow-lg shadow-green-900/20"
                        : "bg-white/5 border border-white/10 text-zinc-500 cursor-not-allowed"
                    }`}
                  >
                    <Coins size={16} />
                    {canRedeem
                      ? "Convert to Cash (₦)"
                      : `Earn ${pointsNeeded} more pts to redeem`}
                  </button>
                  {!canRedeem && (
                    <p className="text-[10px] text-zinc-500 text-center mt-1.5 mb-0">
                      Progress: {currentPoints} / {minPoints} pts (₦
                      {(minPoints / 2).toLocaleString()})
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Referral Stats Overview Strip ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#161616] border border-white/10 rounded-xl p-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={22} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-2xl font-black text-white truncate">
                    {referral?.completedReferrals ?? 0}
                  </span>
                  <span className="text-xs text-zinc-400 truncate">
                    Completed &amp; Rewarded
                  </span>
                </div>
              </div>

              <div className="bg-[#161616] border border-white/10 rounded-xl p-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock size={22} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-2xl font-black text-white truncate">
                    {referral?.pendingReferrals ?? 0}
                  </span>
                  <span className="text-xs text-zinc-400 truncate">
                    Pending Verification
                  </span>
                </div>
              </div>

              <div className="bg-[#161616] border border-white/10 rounded-xl p-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#FBBE15]/10 text-[#FBBE15] flex items-center justify-center shrink-0">
                  <Users size={22} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-2xl font-black text-white truncate">
                    {referral?.totalReferrals ?? 0}
                  </span>
                  <span className="text-xs text-zinc-400 truncate">
                    Total Friends Invited
                  </span>
                </div>
              </div>

              <div className="bg-[#161616] border border-white/10 rounded-xl p-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <Gift size={22} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-2xl font-black text-white truncate">
                    {(
                      referral?.totalReferralEarnings ??
                      (referral?.completedReferrals ?? 0) * 50
                    ).toLocaleString()}{" "}
                    <span className="text-xs font-normal text-zinc-400">
                      pts
                    </span>
                  </span>
                  <span className="text-xs text-zinc-400 truncate">
                    ≈ ₦
                    {(
                      referral?.totalReferralEarningsNaira ??
                      Math.floor(
                        (referral?.totalReferralEarnings ??
                          (referral?.completedReferrals ?? 0) * 50) / 2,
                      )
                    ).toLocaleString()}{" "}
                    Referral Earnings
                  </span>
                </div>
              </div>
            </div>

            {/* ── Bottom Section: Activity Tabs ── */}
            <div className="flex flex-col gap-4">
              {/* Tab Navigation */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setActiveTab("transactions")}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer border-none ${
                    activeTab === "transactions"
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:text-white bg-transparent"
                  }`}
                >
                  Points History
                </button>

                <button
                  onClick={() => setActiveTab("referrals")}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer border-none flex items-center gap-1.5 ${
                    activeTab === "referrals"
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:text-white bg-transparent"
                  }`}
                >
                  My Referrals
                  {referralsList.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#FBBE15] text-[#1a1a1a] font-extrabold">
                      {referralsList.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("how-it-works")}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer border-none flex items-center gap-1.5 ${
                    activeTab === "how-it-works"
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:text-white bg-transparent"
                  }`}
                >
                  <HelpCircle size={15} className="hidden md:block" />
                  How It Works
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "transactions" && (
                <TransactionHistoryTable
                  initialTransactions={recentTransactions}
                />
              )}

              {activeTab === "referrals" && (
                <ReferralsListTable referrals={referralsList} />
              )}

              {activeTab === "how-it-works" && <HowItWorks />}
            </div>
            {/* ── Top Earners Carousel (Connected to Live API) ── */}
            <div className="bg-[#161616] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-md">
              <TopEarnersCarousel />
            </div>
          </div>
        )}

        {/* ── Modals ── */}
        <RedeemModal
          isOpen={isRedeemOpen}
          onClose={() => setIsRedeemOpen(false)}
          wallet={wallet}
        />

        <VanityCodeModal
          isOpen={isVanityOpen}
          onClose={() => setIsVanityOpen(false)}
          currentCode={referral?.vanityCode || referral?.referralCode}
          completedReferrals={referral?.completedReferrals ?? 0}
          minReferralsRequired={referral?.minReferralsForVanity ?? 5}
        />

        <ShareDrawer
          open={isShareOpen}
          onOpenChange={setIsShareOpen}
          shareUrl={shareUrl}
          shareText={`Join me on LocalBuka and use my referral code ${displayCode} to earn bonus reward points!`}
        />

        {/* Toast Notification */}
        {copiedType && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-2.5 bg-[#48bb78] text-white rounded-full shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
            <span className="text-xs font-bold tracking-wide">
              Referral {copiedType === "code" ? "code" : "link"} copied to
              clipboard!
            </span>
            <div className="w-4.5 h-4.5 rounded-full border-1.5 border-white flex items-center justify-center shrink-0">
              <CheckCircle2 size={14} className="text-white" />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
