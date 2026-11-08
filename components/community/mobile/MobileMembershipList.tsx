"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MembershipItem {
  id: string;
  name: string;
  avatar: string;
  price: string;
  status: "active" | "paused";
  billingDate: string;
}

const initialMemberships: MembershipItem[] = [
  {
    id: "chef-amaka",
    name: "Chef Amaka's kitchen",
    avatar: "/images/community/chef-amaka-avatar.jpg",
    price: "₦2,500/month",
    status: "active",
    billingDate: "Oct 10, 2026",
  },
  {
    id: "grill-masters",
    name: "Grill masters NG",
    avatar: "/images/community/chef-amaka-avatar.jpg",
    price: "₦1,200/month",
    status: "paused",
    billingDate: "Oct 10, 2026",
  },
];

export function MobileMembershipList() {
  const router = useRouter();
  const { toast } = useToast();
  const [memberships, setMemberships] =
    useState<MembershipItem[]>(initialMemberships);
  const [cancellingItem, setCancellingItem] = useState<MembershipItem | null>(
    null
  );

  const handleConfirmCancel = () => {
    if (!cancellingItem) return;
    setMemberships((prev) =>
      prev.map((item) =>
        item.id === cancellingItem.id ? { ...item, status: "paused" } : item
      )
    );
    toast({
      title: "Membership Cancelled",
      description: `Your access to ${cancellingItem.name} will end on ${cancellingItem.billingDate}.`,
    });
    setCancellingItem(null);
  };

  const handleResume = (item: MembershipItem) => {
    setMemberships((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, status: "active" } : m))
    );
    toast({
      title: "Membership Resumed! 🎉",
      description: `Your subscription to ${item.name} is now active.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-[#141414]/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <button
            type="button"
            onClick={() => router.push("/community")}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <Crown className="w-4.5 h-4.5 text-[#FFC533]" />
            <h1 className="text-lg font-bold tracking-tight">
              Your Memberships
            </h1>
          </div>
        </div>
      </div>

      {/* Membership Cards */}
      <div className="px-4 py-4 space-y-3.5">
        {memberships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Crown className="w-12 h-12 text-zinc-600 mb-4" />
            <p className="text-zinc-400 text-sm">No active memberships</p>
            <button
              type="button"
              onClick={() => router.push("/community")}
              className="mt-4 px-6 py-2.5 rounded-full bg-[#FFC533] text-black text-sm font-bold active:scale-95 transition-transform"
            >
              Explore communities
            </button>
          </div>
        ) : (
          memberships.map((item) => {
            const isActive = item.status === "active";

            return (
              <div
                key={item.id}
                className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-4 space-y-4"
              >
                {/* Community Info */}
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/community/${item.id}/feed`)
                    }
                    className="flex items-center gap-3 text-left"
                  >
                    <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-white/10 shrink-0">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-[15px] leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {item.price}
                      </p>
                    </div>
                  </button>

                  {/* Status Badge */}
                  {isActive ? (
                    <span className="px-2.5 py-1 rounded-full bg-[#133827] text-[#22c55e] border border-[#22c55e]/30 text-[11px] font-semibold shrink-0">
                      Active
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-[#3d2c00] text-[#FFC533] border border-[#FFC533]/30 text-[11px] font-semibold shrink-0">
                      Paused
                    </span>
                  )}
                </div>

                {/* Billing Info */}
                <p className="text-xs text-zinc-500">
                  {isActive
                    ? `Next billing: ${item.billingDate}`
                    : `Access ends ${item.billingDate} · won't renew`}
                </p>

                {/* Action */}
                {isActive ? (
                  <button
                    type="button"
                    onClick={() => setCancellingItem(item)}
                    className="w-full py-2.5 rounded-xl border border-[#e53e3e]/40 text-[#e53e3e] text-sm font-medium active:scale-[0.98] transition-all text-center"
                  >
                    Cancel membership
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleResume(item)}
                    className="w-full py-2.5 rounded-xl border border-[#FFC533]/40 text-[#FFC533] text-sm font-medium active:scale-[0.98] transition-all text-center"
                  >
                    Resume membership
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Cancel Confirmation Bottom Sheet */}
      {cancellingItem && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="w-full bg-[#1e1e1e] rounded-t-2xl p-5 pb-8 space-y-5 animate-in slide-in-from-bottom duration-200"
            style={{ maxWidth: "100%" }}
          >
            <div className="w-10 h-1 rounded-full bg-zinc-600 mx-auto" />

            <div className="space-y-2">
              <h3 className="text-white font-bold text-base">
                Cancel {cancellingItem.name}?
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Cancelling stops future renewals only. You&apos;ll keep full
                access until your current period ends on{" "}
                {cancellingItem.billingDate}.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCancellingItem(null)}
                className="flex-1 h-12 rounded-xl bg-[#2c2d30] text-white font-semibold text-[15px] active:scale-95 transition-transform"
              >
                Keep
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 h-12 rounded-xl bg-[#FF0000] text-white font-bold text-[15px] active:scale-95 transition-transform"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
