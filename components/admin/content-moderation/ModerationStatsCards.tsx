"use client";

import { ShieldAlert, AlertTriangle, ArrowUpRight, CheckCircle2, Inbox } from "lucide-react";
import type { ModerationQueueCounts, ModerationStatus, ModerationPriority } from "@/lib/api/services/moderation.service";

interface ModerationStatsCardsProps {
  counts?: ModerationQueueCounts;
  currentStatus?: ModerationStatus | "all";
  currentPriority?: ModerationPriority | "all";
  onSelectFilter: (status: ModerationStatus | "all", priority: ModerationPriority | "all") => void;
  isLoading?: boolean;
}

export function ModerationStatsCards({
  counts,
  currentStatus = "all",
  currentPriority = "all",
  onSelectFilter,
  isLoading,
}: ModerationStatsCardsProps) {
  const openCount = counts?.open ?? 0;
  const urgentCount = counts?.urgent ?? 0;
  const escalatedCount = counts?.escalated ?? 0;
  const closedCount = counts?.closed ?? 0;
  const totalCount = openCount + escalatedCount + closedCount;

  const isUrgentActive = currentPriority === "urgent";
  const isOpenActive = currentStatus === "open" && currentPriority !== "urgent";
  const isEscalatedActive = currentStatus === "escalated";
  const isClosedActive = currentStatus === "closed";
  const isAllActive = currentStatus === "all" && currentPriority === "all";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {/* Total Reports */}
      <button
        type="button"
        onClick={() => onSelectFilter("all", "all")}
        className={`text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
          isAllActive
            ? "bg-amber-500/10 border-amber-500/40 ring-2 ring-amber-500/20 dark:bg-amber-500/15"
            : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-xs"
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Total Queue</span>
          <div className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300">
            <Inbox className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl font-bold text-gray-900 dark:text-white">
          {isLoading ? <span className="inline-block w-8 h-6 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" /> : totalCount}
        </div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">All moderation cases</p>
      </button>

      {/* Urgent Flagged */}
      <button
        type="button"
        onClick={() => onSelectFilter("all", "urgent")}
        className={`text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer relative overflow-hidden ${
          isUrgentActive
            ? "bg-rose-500/10 border-rose-500/50 ring-2 ring-rose-500/20 dark:bg-rose-500/15"
            : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-rose-300 dark:hover:border-rose-900/50 hover:shadow-xs"
        }`}
      >
        {urgentCount > 0 && (
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
        )}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400 font-semibold">Urgent Priority</span>
          <div className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl font-bold text-rose-600 dark:text-rose-400">
          {isLoading ? <span className="inline-block w-8 h-6 bg-rose-100 dark:bg-rose-900/40 animate-pulse rounded" /> : urgentCount}
        </div>
        <p className="text-[10px] text-rose-600/80 dark:text-rose-400/80 mt-0.5 font-medium">≥5 reports in 24h</p>
      </button>

      {/* Open Reports */}
      <button
        type="button"
        onClick={() => onSelectFilter("open", "all")}
        className={`text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
          isOpenActive
            ? "bg-blue-500/10 border-blue-500/40 ring-2 ring-blue-500/20 dark:bg-blue-500/15"
            : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-900/50 hover:shadow-xs"
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">Open Reports</span>
          <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
          {isLoading ? <span className="inline-block w-8 h-6 bg-blue-100 dark:bg-blue-900/40 animate-pulse rounded" /> : openCount}
        </div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Awaiting moderator review</p>
      </button>

      {/* Escalated */}
      <button
        type="button"
        onClick={() => onSelectFilter("escalated", "all")}
        className={`text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
          isEscalatedActive
            ? "bg-purple-500/10 border-purple-500/40 ring-2 ring-purple-500/20 dark:bg-purple-500/15"
            : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-900/50 hover:shadow-xs"
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400">Escalated</span>
          <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
          {isLoading ? <span className="inline-block w-8 h-6 bg-purple-100 dark:bg-purple-900/40 animate-pulse rounded" /> : escalatedCount}
        </div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Needs senior review</p>
      </button>

      {/* Closed / Resolved */}
      <button
        type="button"
        onClick={() => onSelectFilter("closed", "all")}
        className={`text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
          isClosedActive
            ? "bg-emerald-500/10 border-emerald-500/40 ring-2 ring-emerald-500/20 dark:bg-emerald-500/15"
            : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-900/50 hover:shadow-xs"
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Closed / Resolved</span>
          <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
          {isLoading ? <span className="inline-block w-8 h-6 bg-emerald-100 dark:bg-emerald-900/40 animate-pulse rounded" /> : closedCount}
        </div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Actioned & finalized</p>
      </button>
    </div>
  );
}
