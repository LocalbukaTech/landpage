"use client";

import { Search, X, Filter, RefreshCw } from "lucide-react";
import type { ModerationStatus, ModerationPriority, ModerationReason } from "@/lib/api/services/moderation.service";

const REASONS: ModerationReason[] = [
  "Scam or fraud",
  "Harassment",
  "Fake account or bot",
  "Scam or dishonest selling",
  "Pretending to be someone else",
  "Inappropriate Profile Content",
  "Inappropriate content",
  "Spam",
  "Fake listing",
  "Other",
];

export interface ModerationFilterState {
  search: string;
  contentType: "all" | "post" | "profile";
  reason: string;
  status: ModerationStatus | "all";
  priority: ModerationPriority | "all";
}

export const DEFAULT_FILTERS: ModerationFilterState = {
  search: "",
  contentType: "all",
  reason: "",
  status: "all",
  priority: "all",
};

interface ModerationFiltersProps {
  filters: ModerationFilterState;
  onChange: (filters: ModerationFilterState) => void;
  onReset: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  totalResults?: number;
}

export function ModerationFilters({
  filters,
  onChange,
  onReset,
  onRefresh,
  isRefreshing,
  totalResults,
}: ModerationFiltersProps) {
  const activeCount = [
    filters.contentType !== "all",
    !!filters.reason,
    filters.status !== "all",
    filters.priority !== "all",
    !!filters.search.trim(),
  ].filter(Boolean).length;

  const updateField = <K extends keyof ModerationFilterState>(
    key: K,
    val: ModerationFilterState[K]
  ) => {
    onChange({
      ...filters,
      [key]: val,
    });
  };

  return (
    <div className="space-y-3 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateField("search", e.target.value)}
            placeholder="Search report # (e.g. MR-4821), username, post caption, or reason..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#fbbe15]/50 focus:border-[#fbbe15] transition-all"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => updateField("search", "")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Content Type Pill Selectors */}
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800/80 shrink-0">
          <button
            type="button"
            onClick={() => updateField("contentType", "all")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filters.contentType === "all"
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs font-semibold"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            All Content
          </button>
          <button
            type="button"
            onClick={() => updateField("contentType", "profile")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filters.contentType === "profile"
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs font-semibold"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Profiles
          </button>
          <button
            type="button"
            onClick={() => updateField("contentType", "post")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filters.contentType === "post"
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs font-semibold"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Posts
          </button>
        </div>

        {/* Refresh & Reset Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh queue"
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#fbbe15]" : ""}`} />
            </button>
          )}

          {activeCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-amber-500" />
              <span>Reset Filters</span>
              <span className="w-4 h-4 rounded-full bg-amber-500 text-gray-950 font-bold text-[10px] flex items-center justify-center">
                {activeCount}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Secondary Dropdown Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-gray-100 dark:border-gray-800/80">
        {/* Reason Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Report Reason
          </label>
          <select
            value={filters.reason}
            onChange={(e) => updateField("reason", e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-hidden focus:ring-1 focus:ring-[#fbbe15]"
          >
            <option value="">All Reasons</option>
            {REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Priority Level
          </label>
          <select
            value={filters.priority}
            onChange={(e) => updateField("priority", e.target.value as ModerationPriority | "all")}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-hidden focus:ring-1 focus:ring-[#fbbe15]"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent Priority (≥5 in 24h)</option>
            <option value="standard">Standard Priority</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => updateField("status", e.target.value as ModerationStatus | "all")}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-hidden focus:ring-1 focus:ring-[#fbbe15]"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open (Unresolved)</option>
            <option value="escalated">Escalated (Senior Review)</option>
            <option value="closed">Closed / Resolved</option>
          </select>
        </div>
      </div>

      {/* Optional Result Info */}
      {typeof totalResults === "number" && (
        <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-1">
          <span>
            Showing <strong className="text-gray-800 dark:text-gray-200">{totalResults}</strong> {totalResults === 1 ? "report" : "reports"}
          </span>
          {activeCount > 0 && (
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              Filtered by {activeCount} active {activeCount === 1 ? "criteria" : "criteria"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
