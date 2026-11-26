"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  Lock,
  LayoutDashboard,
  Compass,
  ArrowLeft,
  Plus,
  Clock,
  Loader2,
  LogIn,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { CreatorDashboard } from "@/components/community/CreatorDashboard";
import {
  CreatorCommunityForm,
  CreatorCommunityFormData,
} from "@/components/community/CreatorCommunityForm";
import { CreatorCommunityCarousel } from "@/components/community/CreatorCommunityCarousel";
import { CreatorPaymentPortal } from "@/components/community/CreatorPaymentPortal";
import { CreatorCommunityApprovedCard } from "@/components/community/CreatorCommunityApprovedCard";
import { CreatorCommunityChangesRequestedCard } from "@/components/community/CreatorCommunityChangesRequestedCard";
import { CreatorCommunityRejectedCard } from "@/components/community/CreatorCommunityRejectedCard";
import { CommunityMembershipsList } from "@/components/community/CommunityMembershipsList";
import { PaymentCheckoutCard } from "@/components/community/PaymentCheckoutCard";
import { DashboardTab } from "@/components/community/types";
import { MobileCommunityFlow } from "@/components/community/mobile/MobileCommunityFlow";
import { cn } from "@/lib/utils";
import { CommunityItem } from "@/lib/api/services/community.service";
import {
  useExploreCommunities,
  useCreateCommunity,
  useMyCreatedCommunities,
} from "@/lib/api/services/community.hooks";
import { useToast } from "@/hooks/use-toast";

type CommunityTab = "Recommended" | "Trending" | "Free" | "Paid";
type CreatorStep =
  | "form"
  | "payment"
  | "pending"
  | "approved"
  | "changes-requested"
  | "rejected"
  | "dashboard";

const CREATOR_COMMUNITY_STORAGE_KEY = "localbuka_creator_community_v1";

const SEED_PLACEHOLDER_SLUGS = new Set([
  "nigeria-food",
  "chef-amaka",
  "street-food",
  "baking-desserts",
  "suya-grill",
]);

const DEFAULT_CREATOR_DATA: CreatorCommunityFormData = {
  name: "",
  bio: "",
  category: "free",
  avatar: "/images/community/cover-1.jpg",
  coverImage: "/images/community/cover-1.jpg",
  costBracket: "base_2k",
  pricePerMonth: 2000,
  yearlyPrice: 20000,
  billingSchedule: "monthly",
  payoutSchedule: "7_day_hold",
  scheduledLaunchDate: new Date().toISOString().split("T")[0],
  primaryPaymentMethod: "paystack",
  paymentPlatforms: ["paystack", "card", "bank_transfer"],
  payoutAccount: {
    bankCode: "zenith",
    bankName: "Zenith Bank PLC",
    accountNumber: "",
    accountName: "",
  },
  paymentLinks: {
    paystack: "",
    flutterwave: "",
    stripe: "",
    custom: "",
  },
  benefits: [
    "Exclusive recipes and weekly cook-along sessions",
    "Private food spot recommendations & tasting invites",
    "Direct Q&A and priority community badge",
  ],
};

const tabs: CommunityTab[] = [
  "Recommended",
  "Trending",
  "Free",
  "Paid",
];

const COMMUNITY_COPY = {
  plus: [
    "Exclusive recipes, tutorials, and cook-alongs from the creator.",
    "Private food spot recommendations.",
  ],
};

function CommunityPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { isAuthenticated, openAuthModal } = useAuth();
  const createCommunityMutation = useCreateCommunity();

  const initialMode = (() => {
    const fromUrl = searchParams.get("view");
    if (fromUrl === "creator" || fromUrl === "memberships" || fromUrl === "explore") {
      return fromUrl;
    }
    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem("localbuka_community_last_view");
        if (stored === "creator" || stored === "memberships") return stored as "creator" | "memberships";
      } catch {}
    }
    return "explore";
  })();
  const [viewMode, setViewMode] = useState<"creator" | "explore" | "memberships">(
    initialMode
  );

  const stepParam = searchParams.get("step") || searchParams.get("status");
  const [creatorStep, setCreatorStep] = useState<CreatorStep>(() => {
    if (stepParam === "payment") return "payment";
    if (stepParam === "approved") return "approved";
    if (stepParam === "changes-requested") return "changes-requested";
    if (stepParam === "rejected") return "rejected";
    if (stepParam === "dashboard" || searchParams.get("tab")) return "dashboard";
    if (typeof window !== "undefined") {
      try {
        const storedStep = window.localStorage.getItem("localbuka_community_last_step");
        if (storedStep === "dashboard") return "dashboard";
      } catch {}
    }
    return "form";
  });

  // Sync viewMode and creatorStep with URL query string and localStorage so reload always stays on the current view
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("localbuka_community_last_view", viewMode);
      window.localStorage.setItem("localbuka_community_last_step", creatorStep);
      const params = new URLSearchParams(window.location.search);
      if (viewMode !== "explore") {
        params.set("view", viewMode);
      } else {
        params.delete("view");
      }
      if (viewMode === "creator" && creatorStep) {
        params.set("step", creatorStep);
      } else {
        params.delete("step");
      }
      const qs = params.toString();
      const nextUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      window.history.replaceState(null, "", nextUrl);
    } catch {}
  }, [viewMode, creatorStep]);

  const [creatorData, setCreatorData] = useState<CreatorCommunityFormData>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = window.localStorage.getItem(CREATOR_COMMUNITY_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Scrub legacy dummy "Chef Tolu's VIP Kitchen" defaults if stored in older sessions
          const isLegacyDummy =
            parsed?.name === "Chef Tolu's VIP Kitchen" ||
            parsed?.paymentLinks?.paystack?.includes("chef-tolu-s-vip-kitchen");
          if (isLegacyDummy) {
            window.localStorage.removeItem(CREATOR_COMMUNITY_STORAGE_KEY);
            return DEFAULT_CREATOR_DATA;
          }
          if (parsed?.name === "Nigma's Kitc" || parsed?.name === "Nigma's Kitche") {
            parsed.name = "Nigma's Kitchen";
            window.localStorage.setItem(CREATOR_COMMUNITY_STORAGE_KEY, JSON.stringify(parsed));
          }
          if (parsed?.payoutAccount?.accountNumber === "2083948192") {
            parsed.payoutAccount.accountNumber = "";
          }
          if (parsed?.payoutAccount?.accountName === "Tolu Olawale") {
            parsed.payoutAccount.accountName = "";
          }
          return { ...DEFAULT_CREATOR_DATA, ...parsed };
        }
      } catch {
        // ignore storage errors
      }
    }
    return DEFAULT_CREATOR_DATA;
  });

  const [selectedManagedSlug, setSelectedManagedSlug] = useState<string | null>(null);

  const saveCreatorData = (next: CreatorCommunityFormData) => {
    setCreatorData(next);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          CREATOR_COMMUNITY_STORAGE_KEY,
          JSON.stringify(next)
        );
      } catch {
        // ignore storage quota errors
      }
    }
  };

  // Tab from URL if specified
  const tabParam = searchParams.get("tab");
  const initialDashboardTab: DashboardTab =
    tabParam === "content"
      ? "Content and feed management"
      : tabParam === "members"
      ? "Members"
      : tabParam === "monetization"
      ? "Monetization"
      : tabParam === "overview"
      ? "Overview"
      : "Overview";

  // Explore view state
  const [activeTab, setActiveTab] = useState<CommunityTab>("Recommended");
  const [showModal, setShowModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityItem | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(
    searchParams.get("checkout") === "true"
  );

  // Live API data (filtering out the 5 initial seed placeholder communities and stale test duplicates)
  const { data, isLoading } = useExploreCommunities({ tab: activeTab });
  const {
    data: myCreatedCommunities,
    isLoading: isLoadingMyCommunities,
  } = useMyCreatedCommunities(isAuthenticated);
  const validMyCreatedCommunities = isAuthenticated
    ? (myCreatedCommunities ?? []).filter(
        (c) =>
          c.slug !== "nigma-s-kitche" &&
          c.name !== "Nigma's Kitche" &&
          c.id !== "e66d6895-d9a1-4be5-88d5-ae7bef7df176"
      )
    : [];
  const latestCreatedCommunity =
    (selectedManagedSlug
      ? validMyCreatedCommunities.find((c) => c.slug === selectedManagedSlug)
      : null) ||
    validMyCreatedCommunities.find((c) => c.status === "approved") ||
    validMyCreatedCommunities[0] ||
    null;

  // Persist authoritative backend community details to localStorage (no synchronous setState inside effect)
  useEffect(() => {
    if (!latestCreatedCommunity || typeof window === "undefined") return;
    try {
      const next: CreatorCommunityFormData = {
        ...creatorData,
        name: latestCreatedCommunity.name || creatorData.name,
        bio: latestCreatedCommunity.description || creatorData.bio,
        category: latestCreatedCommunity.isFree ? "free" : "paid",
        avatar:
          latestCreatedCommunity.avatar ||
          latestCreatedCommunity.coverImage ||
          creatorData.avatar,
        coverImage:
          latestCreatedCommunity.coverImage ||
          latestCreatedCommunity.avatar ||
          creatorData.coverImage,
        pricePerMonth: latestCreatedCommunity.isFree
          ? 0
          : latestCreatedCommunity.priceAmount || creatorData.pricePerMonth,
        yearlyPrice: latestCreatedCommunity.isFree
          ? 0
          : latestCreatedCommunity.yearlyPriceAmount || creatorData.yearlyPrice,
        benefits:
          latestCreatedCommunity.benefits && latestCreatedCommunity.benefits.length > 0
            ? latestCreatedCommunity.benefits
            : creatorData.benefits,
      };
      window.localStorage.setItem(CREATOR_COMMUNITY_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, [latestCreatedCommunity, creatorData]);
  const communities: CommunityItem[] = (data?.items ?? []).filter(
    (c) =>
      !SEED_PLACEHOLDER_SLUGS.has(c.slug) &&
      c.slug !== "nigma-s-kitche" &&
      c.name !== "Nigma's Kitche" &&
      c.id !== "e66d6895-d9a1-4be5-88d5-ae7bef7df176"
  );

  // Determine the real admin-driven review status from backend (if creator has submitted a community)
  const backendStatus = latestCreatedCommunity?.status;
  const effectiveCreatorStep: CreatorStep = (() => {
    // Allow explicit form editing or active dashboard if approved
    if (creatorStep === "form" || creatorStep === "payment") {
      return creatorStep;
    }
    if (creatorStep === "dashboard") {
      if (backendStatus === "rejected") return "rejected";
      if (backendStatus === "changes_requested") return "changes-requested";
      return "dashboard";
    }
    if (backendStatus === "pending" || backendStatus === "in_review") {
      return "pending";
    }
    if (backendStatus === "changes_requested") return "changes-requested";
    if (backendStatus === "rejected") return "rejected";
    if (backendStatus === "approved") return "approved";
    return creatorStep;
  })();

  const handleSelectFreePlan = (formData: CreatorCommunityFormData) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to create and manage your community.",
      });
      openAuthModal();
      return;
    }
    saveCreatorData(formData);
    createCommunityMutation.mutate(
      {
        name: formData.name,
        description: formData.bio,
        category: "free",
        pricePerMonth: 0,
        pricePerYear: 0,
        coverImage: formData.coverImage || formData.avatar,
        avatar: formData.avatar,
        benefits: formData.benefits,
      },
      {
        onSuccess: (res: any) => {
          const created = res?.data ?? res;
          if (created?.slug) {
            setSelectedManagedSlug(created.slug);
          }
          const status = created?.status;
          const feedback = created?.adminFeedback;
          if (status === "approved") {
            toast({
              title: "Community Auto-Approved & Live! 🎉",
              description: `${formData.name} passed automated quality checks and is now live.`,
            });
            setCreatorStep("approved");
          } else if (status === "changes_requested") {
            toast({
              title: "Quick Updates Needed",
              description:
                feedback ||
                "Please refine your community details and resubmit.",
              variant: "destructive",
            });
            setCreatorStep("changes-requested");
          } else if (status === "rejected") {
            toast({
              title: "Community Not Approved",
              description:
                feedback ||
                "This submission did not meet LocalBuka community guidelines.",
              variant: "destructive",
            });
            setCreatorStep("rejected");
          } else {
            toast({
              title: "Community Submitted for Review",
              description: `${formData.name} has been submitted for review.`,
            });
            setCreatorStep("pending");
          }
        },
        onError: (err: any) => {
          toast({
            title: "Unable to create community",
            description:
              err?.response?.data?.message ||
              err?.message ||
              "Please check your details and try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleSelectPaidPlan = (formData: CreatorCommunityFormData) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to create and manage your community.",
      });
      openAuthModal();
      return;
    }
    saveCreatorData(formData);
    setCreatorStep("payment");
  };

  const handlePaymentSuccess = () => {
    createCommunityMutation.mutate({
      name: creatorData.name,
      description: creatorData.bio,
      category: "paid",
      costBracket: creatorData.costBracket,
      pricePerMonth: Math.max(2000, creatorData.pricePerMonth || 2000),
      pricePerYear: Math.max(2000, creatorData.pricePerMonth || 2000) * 10,
      billingSchedule: creatorData.billingSchedule,
      payoutSchedule: creatorData.payoutSchedule,
      primaryPaymentMethod: creatorData.primaryPaymentMethod,
      paymentPlatforms: creatorData.paymentPlatforms,
      payoutAccount: creatorData.payoutAccount,
      paymentLinks: creatorData.paymentLinks,
      coverImage: creatorData.coverImage || creatorData.avatar,
      avatar: creatorData.avatar,
      benefits: creatorData.benefits,
    });
    toast({
      title: "Paid Community Submitted & Approved! 🎉",
      description: `${creatorData.name} (₦${Math.max(
        2000,
        creatorData.pricePerMonth || 2000
      ).toLocaleString("en-NG")}/mo) is now configured with ${
        creatorData.payoutAccount.bankName
      }.`,
    });
    setCreatorStep("approved");
  };

  const handleCardClick = (community: CommunityItem) => {
    setSelectedCommunity(community);
    if (!community.isFree) {
      // Option to show preview modal or navigate to detail
      setShowModal(true);
    } else {
      router.push(`/community/${community.slug || community.id}`);
    }
  };

  const handleStartCheckout = () => {
    setShowModal(false);
    if (selectedCommunity) {
      router.push(`/community/${selectedCommunity.slug || selectedCommunity.id}/subscribe`);
    } else {
      setIsCheckingOut(true);
    }
  };

  return (
    <MainLayout>
      {/* ── MOBILE VIEW (< md): Full Qudus mobile community flow ── */}
      <div className="block md:hidden min-h-screen bg-[#1a1a1a]">
        <MobileCommunityFlow
          initialScreen="explore"
          onSwitchToCreator={() => setViewMode("creator")}
          showStatusBar={false}
          className="w-full"
        />
      </div>

      {/* ── DESKTOP VIEW (≥ md): Original desktop layout ── */}
      <div className="hidden md:block w-full max-w-[1240px] mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 text-white min-h-[calc(100vh-120px)]">
        {/* ── Top Header with Responsive View Mode Switcher ── */}
        <div className="mb-5 sm:mb-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-white/8 pb-4 sm:pb-5">
          <div className="space-y-0.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Community
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Discover food communities, connect with creators, and share authentic dishes
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="inline-flex items-center gap-1 rounded-full bg-[#202020] p-1 border border-white/5">
              <button
                type="button"
                onClick={() => {
                  setViewMode("explore");
                  setIsCheckingOut(false);
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 sm:px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                  viewMode === "explore"
                    ? "bg-[#f5c94d] text-black shadow-sm font-bold"
                    : "text-white/60 hover:text-white"
                )}
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Explore</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode("creator");
                  setCreatorStep("form");
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 sm:px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                  viewMode === "creator" && creatorStep !== "dashboard"
                    ? "bg-[#f5c94d] text-black shadow-sm font-bold"
                    : "text-white/60 hover:text-white"
                )}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Creator Community</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode("creator");
                  setCreatorStep("dashboard");
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 sm:px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                  viewMode === "creator" && creatorStep === "dashboard"
                    ? "bg-[#f5c94d] text-black shadow-sm font-bold"
                    : "text-white/60 hover:text-white"
                )}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Creator Dashboard</span>
              </button>
            </div>

            {viewMode === "explore" && (
              <button
                type="button"
                onClick={() => {
                  setViewMode("creator");
                  setCreatorStep("form");
                }}
                className="inline-flex sm:hidden items-center gap-1 rounded-full bg-[#f5c94d] px-3 py-1.5 text-xs font-bold text-black active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 stroke-[3]" />
                <span>Create</span>
              </button>
            )}
          </div>
        </div>

        {/* ── View 0: My Memberships ── */}
        {viewMode === "memberships" && (
          <CommunityMembershipsList onBack={() => setViewMode("explore")} />
        )}

        {/* ── View 1: Creator Community Creation, Payment, Review & Management Dashboard ── */}
        {viewMode === "creator" && (
          <div className="space-y-6">
            {/* Read-Only Process Progress Bar only during pre-dashboard onboarding */}
            {effectiveCreatorStep !== "dashboard" && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#202020] border border-white/8 px-4 py-3">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-white/40 font-medium mr-1">
                    Process:
                  </span>
                  {[
                    {
                      label: "1. Setup Community",
                      active: effectiveCreatorStep === "form",
                      done: effectiveCreatorStep !== "form",
                    },
                    {
                      label: "2. Admin Review",
                      active:
                        effectiveCreatorStep === "pending" ||
                        effectiveCreatorStep === "changes-requested" ||
                        effectiveCreatorStep === "rejected",
                      done: effectiveCreatorStep === "approved",
                    },
                    {
                      label: "3. Approved & Live",
                      active: effectiveCreatorStep === "approved",
                      done: false,
                    },
                  ].map((step) => (
                    <span
                      key={step.label}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold select-none inline-flex items-center gap-1.5",
                        step.active
                          ? "bg-[#f5c94d] text-black font-bold"
                          : step.done
                          ? "bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/30"
                          : "bg-white/5 text-white/45"
                      )}
                    >
                      {step.done && <Check className="h-3 w-3 stroke-[3]" />}
                      <span>{step.label}</span>
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setViewMode("explore")}
                  className="text-xs text-white/60 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Explore</span>
                </button>
              </div>
            )}

            {/* Step 1: Create Community Form */}
            {effectiveCreatorStep === "form" && (
              <div className="flex flex-col lg:flex-row w-full max-w-[1080px] mx-auto bg-[#1a1a1a] rounded-[25px] overflow-hidden shadow-2xl border border-white/8">
                <div className="w-full lg:w-[440px] lg:flex-shrink-0 min-h-[420px]">
                  <CreatorCommunityCarousel />
                </div>
                <div className="flex-1">
                  <CreatorCommunityForm
                    initialData={
                      backendStatus === "changes_requested" ? creatorData : undefined
                    }
                    onSelectPaidPlan={handleSelectPaidPlan}
                    onSelectFreePlan={handleSelectFreePlan}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Payment Method & Gateway Portal (Paid Tier) */}
            {effectiveCreatorStep === "payment" && (
              <div className="py-2">
                <CreatorPaymentPortal
                  creatorDetails={creatorData}
                  onBack={() => setCreatorStep("form")}
                  onSuccess={handlePaymentSuccess}
                  onGoToDashboard={() => {
                    handlePaymentSuccess();
                    setCreatorStep("pending");
                  }}
                />
              </div>
            )}

            {/* Step 2B: Pending Admin Review Screen */}
            {effectiveCreatorStep === "pending" && (
              <div className="w-full max-w-[780px] mx-auto rounded-[28px] border border-[#f5c94d]/30 bg-[#1a1a1a] p-8 sm:p-10 text-center space-y-6 shadow-2xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5c94d]/15 text-[#f5c94d] border border-[#f5c94d]/30">
                  <Clock className="h-8 w-8" />
                </div>
                <div className="space-y-2 max-w-lg mx-auto">
                  <h2 className="text-2xl font-bold text-white">
                    Submitted &amp; Pending Admin Review
                  </h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    <strong className="text-white">
                      {latestCreatedCommunity?.name || creatorData.name}
                    </strong>{" "}
                    has been sent to the LocalBuka Admin team. Once an administrator reviews and approves your community, you&apos;ll receive a notification and your community will go live on Explore.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setViewMode("explore")}
                    className="rounded-full bg-[#f5c94d] px-6 py-2.5 text-sm font-bold text-black hover:bg-[#eab308] transition-all cursor-pointer"
                  >
                    Back to Explore
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreatorStep("form")}
                    className="rounded-full bg-white/10 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/15 transition-all cursor-pointer"
                  >
                    Edit Submission
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Approved & Live Status Card (Only shown when Admin approves) */}
            {effectiveCreatorStep === "approved" && (
              <CreatorCommunityApprovedCard
                communityName={
                  latestCreatedCommunity?.name || creatorData.name || "Your Community"
                }
                liveSince="Today"
                price={
                  (latestCreatedCommunity ? latestCreatedCommunity.isFree : creatorData.category === "free")
                    ? "Free"
                    : `₦${Math.max(
                        2000,
                        latestCreatedCommunity?.priceAmount || creatorData.pricePerMonth || 2000
                      ).toLocaleString("en-NG")}/${
                        creatorData.billingSchedule === "yearly"
                          ? "yr"
                          : creatorData.billingSchedule === "quarterly"
                          ? "qtr"
                          : "mo"
                      }`
                }
                payoutAccountSummary={
                  (latestCreatedCommunity ? latestCreatedCommunity.isFree : creatorData.category === "free")
                    ? "Free Community (No Payout Fee)"
                    : creatorData.payoutAccount.accountNumber
                    ? `${creatorData.payoutAccount.bankName} · ${creatorData.payoutAccount.accountNumber}`
                    : "Not configured yet"
                }
                paymentLink={
                  latestCreatedCommunity?.slug && typeof window !== "undefined"
                    ? `${window.location.origin}/community/${latestCreatedCommunity.slug}`
                    : creatorData.paymentLinks.paystack ||
                      creatorData.paymentLinks.custom
                }
                onGoToCommunity={() => setCreatorStep("dashboard")}
                onCreateNew={() => setCreatorStep("form")}
              />
            )}

            {/* Step 4: Changes Requested Status Card (Admin-driven) */}
            {effectiveCreatorStep === "changes-requested" && (
              <CreatorCommunityChangesRequestedCard
                reviewDate="Recently reviewed"
                caseId={latestCreatedCommunity?.slug?.toUpperCase() || "REVIEW"}
                summaryMessage="An administrator reviewed your community submission. Update the requested items below and resubmit."
                feedbackMessage={
                  (latestCreatedCommunity as any)?.adminFeedback ||
                  "Please review your community description, cover image, and guidelines before resubmitting."
                }
                changeItems={[
                  { label: "Address admin feedback above", status: "pending" },
                  { label: "Name, bio and category", status: "updated" },
                ]}
                onEditAndResubmit={() => setCreatorStep("form")}
              />
            )}

            {/* Step 5: Not Approved / Rejected Status Card (Admin-driven) */}
            {effectiveCreatorStep === "rejected" && (
              <CreatorCommunityRejectedCard
                reviewDate="Recently reviewed"
                caseId={latestCreatedCommunity?.slug?.toUpperCase() || "REVIEW"}
                rejectionReason="This community didn't meet our requirements and can't be published."
                feedbackMessage={
                  (latestCreatedCommunity as any)?.adminFeedback ||
                  "Your community submission did not meet LocalBuka's community guidelines."
                }
                actionMessage="You can create a new community that complies with LocalBuka's community guidelines or reach out to Support for clarification."
                onCreateNewCommunity={() => setCreatorStep("form")}
                onContactSupport={() => router.push("/contact")}
              />
            )}

            {/* Step 6: Creator Management Dashboard */}
            {effectiveCreatorStep === "dashboard" && (
              !isAuthenticated ? (
                <div className="w-full max-w-[680px] mx-auto rounded-[28px] border border-white/10 bg-[#1a1a1a] p-8 sm:p-10 text-center space-y-5 shadow-2xl">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5c94d]/15 text-[#f5c94d] border border-[#f5c94d]/30">
                    <LogIn className="h-7 w-7" />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Sign in to manage your community
                    </h2>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Sign in with the LocalBuka account you used to create your community to view members, send invites, and publish posts.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => openAuthModal()}
                      className="rounded-full bg-[#f5c94d] px-6 py-2.5 text-sm font-bold text-black hover:bg-[#eab308] transition-all cursor-pointer"
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("explore")}
                      className="rounded-full bg-white/10 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/15 transition-all cursor-pointer"
                    >
                      Back to Explore
                    </button>
                  </div>
                </div>
              ) : isLoadingMyCommunities ? (
                <div className="w-full max-w-[680px] mx-auto rounded-[28px] border border-white/10 bg-[#1a1a1a] p-12 text-center space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin text-[#f5c94d] mx-auto" />
                  <p className="text-sm text-zinc-400">
                    Loading your community dashboard...
                  </p>
                </div>
              ) : !latestCreatedCommunity ? (
                <div className="w-full max-w-[680px] mx-auto rounded-[28px] border border-white/10 bg-[#1a1a1a] p-8 sm:p-10 text-center space-y-5 shadow-2xl">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5c94d]/15 text-[#f5c94d] border border-[#f5c94d]/30">
                    <LayoutDashboard className="h-7 w-7" />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      You haven&apos;t created a community yet
                    </h2>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Launch your own food community first to unlock your Creator Dashboard, share dishes, and invite LocalBuka members.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setCreatorStep("form")}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#f5c94d] px-6 py-2.5 text-sm font-bold text-black hover:bg-[#eab308] transition-all cursor-pointer"
                    >
                      <Plus className="h-4 w-4 stroke-[2.5]" />
                      <span>Create Community</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("explore")}
                      className="rounded-full bg-white/10 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/15 transition-all cursor-pointer"
                    >
                      Explore Communities
                    </button>
                  </div>
                </div>
              ) : (
                <CreatorDashboard
                  initialTab={initialDashboardTab}
                  community={{
                    ...creatorData,
                    name: latestCreatedCommunity.name,
                    bio: latestCreatedCommunity.description || "",
                    category: latestCreatedCommunity.isFree ? "free" : "paid",
                    avatar:
                      latestCreatedCommunity.avatar ||
                      latestCreatedCommunity.coverImage ||
                      creatorData.avatar,
                    coverImage:
                      latestCreatedCommunity.coverImage ||
                      latestCreatedCommunity.avatar ||
                      creatorData.coverImage,
                    pricePerMonth: latestCreatedCommunity.isFree
                      ? 0
                      : latestCreatedCommunity.priceAmount || 2000,
                    yearlyPrice: latestCreatedCommunity.isFree
                      ? 0
                      : latestCreatedCommunity.yearlyPriceAmount || 20000,
                    benefits:
                      latestCreatedCommunity.benefits &&
                      latestCreatedCommunity.benefits.length > 0
                        ? latestCreatedCommunity.benefits
                        : creatorData.benefits,
                  }}
                  communitySlug={latestCreatedCommunity.slug}
                  managedCommunities={validMyCreatedCommunities.map((c) => ({
                    id: c.id,
                    slug: c.slug,
                    name: c.name,
                    isFree: c.isFree,
                  }))}
                  onSelectCommunity={(slug) => setSelectedManagedSlug(slug)}
                  onCreateNewCommunity={() => setCreatorStep("form")}
                  onUpdateCommunity={(updates) =>
                    saveCreatorData({ ...creatorData, ...updates })
                  }
                  onDeleteCommunity={() => {
                    try {
                      window.localStorage.removeItem("localbuka_creator_community_v1");
                    } catch {
                      // ignore
                    }
                    setSelectedManagedSlug(null);
                    setCreatorStep("form");
                    setViewMode("explore");
                  }}
                />
              )
            )}
          </div>
        )}

        {/* ── View 2: Explore Member Feed & Checkout ── */}
        {viewMode === "explore" && (
          <div className="space-y-6">
            {/* Filter Tabs Bar + Desktop "Create community" Yellow Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-white/8 pb-4">
              {/* Category Pills (horizontally scrollable on mobile) */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 -mx-3 px-3 sm:mx-0 sm:px-0">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab);
                      setIsCheckingOut(false);
                    }}
                    className={cn(
                      "rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 inline-flex items-center gap-1.5",
                      !isCheckingOut && activeTab === tab
                        ? "bg-[#f5c94d] text-[#111111] font-bold shadow-[0_0_0_1px_rgba(245,201,77,0.4)]"
                        : "bg-[#252525] text-white/70 hover:bg-[#2f2f2f] hover:text-white"
                    )}
                  >
                    <span>{tab}</span>
                    {tab === "Paid" && (
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                          !isCheckingOut && activeTab === "Paid"
                            ? "bg-black/15 text-black"
                            : "bg-[#f5c94d]/15 text-[#f5c94d]"
                        )}
                      >
                        Coming Soon
                      </span>
                    )}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("creator");
                    setCreatorStep("form");
                  }}
                  className="rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 bg-[#252525] text-white/70 hover:bg-[#2f2f2f] hover:text-white"
                >
                  Creator community
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("memberships")}
                  className="rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 bg-[#252525] text-white/70 hover:bg-[#2f2f2f] hover:text-white"
                >
                  My memberships
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setViewMode("creator");
                  setCreatorStep("form");
                }}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#f5c94d] px-5 py-2 text-xs sm:text-sm font-bold text-black hover:bg-[#eab308] active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>Create community</span>
              </button>
            </div>

            {/* Inline Payment Checkout View */}
            {isCheckingOut ? (
              <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to all communities</span>
                  </button>
                </div>

                <PaymentCheckoutCard
                  communityName={selectedCommunity?.name || "Community"}
                  amount={selectedCommunity?.priceAmount || 2500}
                  onCancel={() => setIsCheckingOut(false)}
                  onSuccess={() => {
                    setTimeout(() => {
                      setIsCheckingOut(false);
                      setViewMode("creator");
                    }, 1200);
                  }}
                />
              </div>
            ) : activeTab === "Recommended" ? (
              /* ── Standard Explore Flow: Recommended + Trending ── */
              <div className="space-y-8 pt-1">
                {/* Loading skeleton */}
                {isLoading && (
                  <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="animate-pulse bg-[#252525] rounded-2xl h-48" />
                    ))}
                  </div>
                )}

                {/* 1. Recommended Section + Trending Section */}
                {!isLoading && communities.length === 0 && (
                  <div className="rounded-3xl border border-white/10 bg-[#1c1c1d] p-12 text-center space-y-4">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5c94d]/15 text-[#f5c94d]">
                      <Compass className="h-7 w-7" />
                    </div>
                    <div className="space-y-1.5 max-w-md mx-auto">
                      <h3 className="text-xl font-bold text-white">
                        No communities published yet
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400">
                        Be the first creator to launch a food community on LocalBuka and connect with food lovers.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode("creator");
                        setCreatorStep("form");
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-[#f5c94d] px-6 py-2.5 text-sm font-bold text-black hover:bg-[#eab308] transition-all cursor-pointer"
                    >
                      <Plus className="h-4 w-4 stroke-[2.5]" />
                      <span>Create First Community</span>
                    </button>
                  </div>
                )}

                {!isLoading && communities.length > 0 && (<>
                <section className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Recommended for you
                    </h2>
                  </div>

                  {/* Mobile View (< md): Horizontal Touch Snap Slider */}
                  <div className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-none -mx-3 px-3 snap-x md:hidden">
                    {communities.slice(0, 4).map((community) => (
                      <div
                        key={community.slug || community.id}
                        onClick={() => handleCardClick(community)}
                        className="group snap-start shrink-0 w-[180px] rounded-2xl bg-[#1c1c1d] border border-white/8 overflow-hidden cursor-pointer hover:border-white/20 active:scale-[0.98] transition-all flex flex-col justify-between shadow-lg"
                      >
                        <div className="relative h-28 w-full bg-zinc-800">
                          <Image
                            src={community.coverImage || community.image}
                            alt={community.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="200px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                          <div className="absolute top-2 left-2 rounded-full bg-black/50 backdrop-blur-md px-2 py-0.5 text-[9.5px] font-medium text-white/90 border border-white/10">
                            {community.creator}
                          </div>
                        </div>

                        <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                          <div className="space-y-1">
                            <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                              {community.name}
                            </h3>
                            <p className="text-[11px] text-zinc-400">
                              {community.members} · {community.posts}
                            </p>
                          </div>

                          <div>
                            <span
                              className={cn(
                                "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-tight",
                                community.isFree
                                  ? "bg-[#22c55e]/15 text-[#74e3a4] ring-1 ring-[#22c55e]/30"
                                  : "bg-[#f5c94d]/15 text-[#f5c94d] ring-1 ring-[#f5c94d]/30"
                              )}
                            >
                              {community.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop View (≥ md): Responsive Multi-Column Grid */}
                  <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                    {communities.slice(0, 4).map((community) => (
                      <article
                        key={community.slug || community.id}
                        onClick={() => handleCardClick(community)}
                        className="group relative cursor-pointer overflow-hidden rounded-[20px] border border-white/8 bg-[#1c1c1d] shadow-[0_10px_35px_rgba(0,0,0,0.18)] hover:border-white/20 transition-all flex flex-col justify-between"
                      >
                        <div className="relative h-56 w-full overflow-hidden bg-zinc-800">
                          <Image
                            src={community.coverImage || community.image}
                            alt={community.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#111214]/90 via-[#111214]/15 to-transparent" />
                          <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                            {community.creator}
                          </div>
                        </div>

                        <div className="space-y-3 p-4 pb-5 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <h3 className="text-lg font-bold leading-snug text-white line-clamp-1 group-hover:text-[#f5c94d] transition-colors">
                              {community.name}
                            </h3>
                            <div className="flex items-center justify-between gap-2 text-xs text-white/60">
                              <span>{community.members}</span>
                              <span>{community.posts}</span>
                            </div>
                          </div>

                          <div className="pt-2">
                            <span
                              className={cn(
                                "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                                community.isFree
                                  ? "bg-[#22c55e]/15 text-[#74e3a4] ring-1 ring-[#22c55e]/30"
                                  : "bg-[#f5c94d]/15 text-[#f5c94d] ring-1 ring-[#f5c94d]/30"
                              )}
                            >
                              {community.price}
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                {/* 2. Trending Section */}
                {communities.length > 4 && (
                <section className="space-y-3 sm:space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Trending this week
                    </h2>
                  </div>

                  {/* Mobile View (< md): Stacked Tap-able Rows */}
                  <div className="space-y-2.5 md:hidden">
                    {communities.slice(4).map((community) => (
                      <div
                        key={community.slug || community.id}
                        onClick={() => handleCardClick(community)}
                        className="group flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#1c1c1d] border border-white/6 hover:border-white/15 cursor-pointer active:scale-[0.99] transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-zinc-800">
                            <Image
                              src={community.coverImage || community.image}
                              alt={community.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>

                          <div className="min-w-0 space-y-0.5">
                            <span className="text-[10px] text-zinc-400 font-medium truncate block">
                              {community.creator}
                            </span>
                            <h3 className="text-sm font-bold text-white truncate leading-snug">
                              {community.name}
                            </h3>
                            <p className="text-[11px] text-zinc-400">
                              {community.members} · {community.posts}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-tight",
                              community.isFree
                                ? "bg-[#22c55e]/15 text-[#74e3a4] ring-1 ring-[#22c55e]/30"
                                : "bg-[#f5c94d]/15 text-[#f5c94d] ring-1 ring-[#f5c94d]/30"
                            )}
                          >
                            {community.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop View (≥ md): Multi-Column Grid */}
                  <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                    {communities.slice(4).map((community) => (
                      <article
                        key={community.slug || community.id}
                        onClick={() => handleCardClick(community)}
                        className="group relative cursor-pointer overflow-hidden rounded-[20px] border border-white/8 bg-[#1c1c1d] shadow-[0_10px_35px_rgba(0,0,0,0.18)] hover:border-white/20 transition-all flex flex-col justify-between"
                      >
                        <div className="relative h-56 w-full overflow-hidden bg-zinc-800">
                          <Image
                            src={community.coverImage || community.image}
                            alt={community.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#111214]/90 via-[#111214]/15 to-transparent" />
                          <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                            {community.creator}
                          </div>
                        </div>

                        <div className="space-y-3 p-4 pb-5 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <h3 className="text-lg font-bold leading-snug text-white line-clamp-1 group-hover:text-[#f5c94d] transition-colors">
                              {community.name}
                            </h3>
                            <div className="flex items-center justify-between gap-2 text-xs text-white/60">
                              <span>{community.members}</span>
                              <span>{community.posts}</span>
                            </div>
                          </div>

                          <div className="pt-2">
                            <span
                              className={cn(
                                "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                                community.isFree
                                  ? "bg-[#22c55e]/15 text-[#74e3a4] ring-1 ring-[#22c55e]/30"
                                  : "bg-[#f5c94d]/15 text-[#f5c94d] ring-1 ring-[#f5c94d]/30"
                              )}
                            >
                              {community.price}
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
                )}
                </>)}
              </div>
            ) : (
              /* ── Filtered Communities Grid (Trending / Free / Paid) ── */
              <div className="mt-4 space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {activeTab === "Trending"
                    ? "Trending this week"
                    : activeTab === "Paid"
                    ? "Exclusive Creator Communities"
                    : "Free Communities"}
                </h2>

                {/* Loading skeleton */}
                {isLoading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="animate-pulse bg-[#252525] rounded-2xl h-48" />
                    ))}
                  </div>
                )}

                {!isLoading && communities.length === 0 && (
                  <div className="rounded-3xl border border-white/10 bg-[#1c1c1d] p-12 text-center space-y-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f5c94d]/15 text-[#f5c94d]">
                      {activeTab === "Paid" ? (
                        <Lock className="h-6 w-6" />
                      ) : (
                        <Compass className="h-6 w-6" />
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {activeTab === "Paid"
                        ? "Paid Creator Communities · Coming Soon"
                        : `No ${activeTab.toLowerCase()} communities created yet`}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                      {activeTab === "Paid"
                        ? "Paid subscriptions (92% creator revenue share with Paystack & Korapay) are launching soon. You can create and join Free Communities right now!"
                        : "Only real communities created by LocalBuka creators appear here. Be the first to create one!"}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode("creator");
                        setCreatorStep("form");
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-[#f5c94d] px-6 py-2.5 text-sm font-bold text-black hover:bg-[#eab308] transition-all cursor-pointer"
                    >
                      <Plus className="h-4 w-4 stroke-[2.5]" />
                      <span>Create Free Community</span>
                    </button>
                  </div>
                )}

                {!isLoading && communities.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                  {communities.map((community) => (
                    <article
                      key={community.slug || community.id}
                      onClick={() => handleCardClick(community)}
                      className="group relative cursor-pointer overflow-hidden rounded-[20px] border border-white/8 bg-[#1c1c1d] shadow-[0_10px_35px_rgba(0,0,0,0.18)] hover:border-white/20 transition-all flex flex-col justify-between"
                    >
                      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-zinc-800">
                        <Image
                          src={community.coverImage || community.image}
                          alt={community.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111214]/90 via-[#111214]/15 to-transparent" />
                        <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                          {community.creator}
                        </div>
                      </div>

                      <div className="space-y-3 p-4 pb-5 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <h3 className="text-base sm:text-lg font-bold leading-snug text-white line-clamp-1 group-hover:text-[#f5c94d] transition-colors">
                            {community.name}
                          </h3>
                          <div className="flex items-center justify-between gap-2 text-xs text-white/60">
                            <span>{community.members}</span>
                            <span>{community.posts}</span>
                          </div>
                        </div>

                        <div className="pt-2">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                              community.isFree
                                ? "bg-[#22c55e]/15 text-[#74e3a4] ring-1 ring-[#22c55e]/30"
                                : "bg-[#f5c94d]/15 text-[#f5c94d] ring-1 ring-[#f5c94d]/30"
                            )}
                          >
                            {community.price}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                )}
              </div>
            )}

            {/* Explore Unlock Modal for Paid Community Selection */}
            {showModal && selectedCommunity && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
                <div className="relative w-full max-w-[500px] rounded-[24px] border border-white/10 bg-[#1c1c1f] p-5 sm:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.65)] animate-in fade-in zoom-in-95 duration-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white/50 transition-colors hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    ✕
                  </button>

                  <div className="mx-auto mb-5 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border border-[#f5c94d]/50 bg-[#f5c94d] text-[#111111] shadow-[0_0_0_8px_rgba(245,201,77,0.12)]">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/10">
                      <Lock className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                  </div>

                  <div className="space-y-5 text-center">
                    <div>
                      <p className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                        {selectedCommunity.name}
                      </p>
                    </div>

                    <div className="space-y-2 rounded-2xl border border-white/8 bg-[#252528] px-4 py-4 text-left text-white">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-[#f5c94d]" />
                        <p className="text-base font-semibold">
                          Members-only content
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-400">
                        Subscribe to see exclusive dishes, tutorials, recipes and direct Q&amp;A.
                      </p>
                    </div>

                    <div className="space-y-2.5 text-left">
                      <p className="text-xs sm:text-sm font-medium text-white/90">
                        Unlock everything in this community:
                      </p>
                      <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                        {(selectedCommunity.benefits && selectedCommunity.benefits.length > 0
                          ? selectedCommunity.benefits
                          : COMMUNITY_COPY.plus
                        ).map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#f5c94d] text-[10px] text-[#111111]">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        type="button"
                        onClick={handleStartCheckout}
                        className="w-full rounded-xl bg-[#f5c94d] px-5 py-3 text-sm sm:text-base font-bold text-[#111111] transition-all hover:bg-[#efbe29] cursor-pointer shadow-lg active:scale-95"
                      >
                        Subscribe to unlock N{selectedCommunity.priceAmount.toLocaleString("en-NG")}/mo
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          router.push(`/community/${selectedCommunity.slug || selectedCommunity.id}`);
                        }}
                        className="w-full py-2 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        View community details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default function CommunityPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
          Loading Community...
        </div>
      }
    >
      <CommunityPageContent />
    </Suspense>
  );
}
