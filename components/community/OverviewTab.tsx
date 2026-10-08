"use client";

import {
  Users,
  TrendingUp,
  DollarSign,
  Heart,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export function OverviewTab() {
  const stats = [
    {
      label: "Total Community Members",
      value: "1,200",
      change: "+12.4% this month",
      isPositive: true,
      icon: Users,
    },
    {
      label: "Monthly Recurring Revenue",
      value: "₦2,100,000",
      change: "+18.2% vs last month",
      isPositive: true,
      icon: DollarSign,
    },
    {
      label: "Active Paying Subscribers",
      value: "840",
      change: "70% conversion rate",
      isPositive: true,
      icon: TrendingUp,
    },
    {
      label: "Community Engagement",
      value: "94.6%",
      change: "42k likes & comments",
      isPositive: true,
      icon: Heart,
    },
  ];

  return (
    <div className="w-full max-w-[700px] text-white space-y-7 pt-2">
      {/* Welcome Banner */}
      <div className="rounded-[24px] bg-gradient-to-r from-[#212121] via-[#1c1c1c] to-[#171717] border border-white/5 p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f5c94d]/15 px-3 py-1 text-xs font-semibold text-[#f5c94d]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Chef Tolu&apos;s Creator Studio</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Your community is thriving! 🍲
          </h2>
          <p className="text-sm text-white/60 max-w-md">
            You reached 1,200 food enthusiasts this week. Your recent Jollof
            Rice secret seasoning post has 24,000 impressions.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="rounded-[22px] bg-[#1a1a1a] border border-white/5 p-5 shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white/60">
                  {stat.label}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-[#f5c94d]">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-white">
                  {stat.value}
                </p>
                <div className="flex items-center gap-1 text-[11px] font-medium text-[#4ade80] mt-1">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Creator Checklist */}
      <div className="rounded-[24px] bg-[#1a1a1a] border border-white/5 p-6 shadow-xl space-y-4">
        <h3 className="text-sm md:text-base font-semibold text-white">
          Creator Growth Tips
        </h3>
        <div className="space-y-3 text-xs md:text-sm text-white/70">
          <div className="flex items-start gap-3 rounded-xl bg-white/[0.02] p-3 border border-white/5">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#f5c94d] text-[10px] font-bold text-black">
              1
            </span>
            <p>
              Post at least 2 food reels or secret recipes per week to maintain
              top 5% creator visibility on LocalBuka.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-white/[0.02] p-3 border border-white/5">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#f5c94d] text-[10px] font-bold text-black">
              2
            </span>
            <p>
              Engage with questions in the comments to boost membership renewal
              by 35%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
