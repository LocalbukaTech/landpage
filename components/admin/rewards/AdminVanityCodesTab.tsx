"use client";

import { useState, useEffect } from "react";
import {
  Tag,
  Search,
  ArrowUp,
  ArrowDown,
  UserCheck,
  Coins,
  Plus,
  Copy,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useAdminVanityCodes } from "@/lib/api/services/admin-rewards.hooks";
import type {
  VanityCodeSortBy,
  AdminVanityCodeItem,
} from "@/lib/api/services/admin-rewards.service";
import { useToast } from "@/hooks/use-toast";

interface AdminVanityCodesTabProps {
  onOpenAdjustModal: (userId: string, userName: string) => void;
  onOpenVanityModal: (userId: string, userName: string) => void;
}

const STORAGE_KEY = "admin_vanity_codes_filters_v1";

export function AdminVanityCodesTab({
  onOpenAdjustModal,
  onOpenVanityModal,
}: AdminVanityCodesTabProps) {
  const { toast } = useToast();

  const getSavedFilters = () => {
    if (typeof window === "undefined") return null;
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const initialFilters = getSavedFilters();

  const [page, setPage] = useState<number>(initialFilters?.page || 1);
  const [pageSize, setPageSize] = useState<number>(
    initialFilters?.pageSize || 20,
  );
  const [search, setSearch] = useState<string>(initialFilters?.search || "");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(
    initialFilters?.search || "",
  );
  const [sortBy, setSortBy] = useState<VanityCodeSortBy>(
    initialFilters?.sortBy || "vanityCodeChangedAt",
  );
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">(
    initialFilters?.sortOrder || "DESC",
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync filters to sessionStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          page,
          pageSize,
          search: debouncedSearch,
          sortBy,
          sortOrder,
        }),
      );
    } catch (e) {
      console.error("Failed to save vanity code filters", e);
    }
  }, [page, pageSize, debouncedSearch, sortBy, sortOrder]);

  const { data, isLoading, isFetching, refetch } = useAdminVanityCodes({
    page,
    pageSize,
    search: debouncedSearch.trim() || undefined,
    sortBy,
    sortOrder,
  });

  const vanityCodes: AdminVanityCodeItem[] = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Code Copied! 📋",
      description: `Copied "${code}" to clipboard.`,
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleSort = (field: VanityCodeSortBy) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(field);
      setSortOrder("DESC");
    }
    setPage(1);
  };

  // Metric aggregates from current data batch
  const totalCompletedInBatch = vanityCodes.reduce(
    (acc, curr) => acc + (curr.completedReferrals || 0),
    0,
  );
  const totalPointsInBatch = vanityCodes.reduce(
    (acc, curr) => acc + (curr.lifetimeEarned || 0),
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1: Total Active Vanity Codes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Active Vanity Codes
            </span>
            <span className="text-2xl font-black text-gray-900 dark:text-white mt-1">
              {total.toLocaleString()}
            </span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
              Custom influencer brands
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center shrink-0">
            <Tag size={22} />
          </div>
        </div>

        {/* Metric 2: Completed Referrals Driven */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Batch Completed Referrals
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {totalCompletedInBatch.toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-400 font-medium mt-0.5">
              Across shown creators
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center shrink-0">
            <UserCheck size={22} />
          </div>
        </div>

        {/* Metric 3: Creator Lifetime Points */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Batch Lifetime Points
            </span>
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
              {totalPointsInBatch.toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-400 font-medium mt-0.5">
              Points earned by creators
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-500 flex items-center justify-center shrink-0">
            <Coins size={22} />
          </div>
        </div>

        {/* Quick Action Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-900 dark:text-white">
              Creator Vanity Program
            </span>
            <Tag size={16} className="text-amber-500" />
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <button
              onClick={() => onOpenVanityModal("", "")}
              className="w-full py-2 px-3 rounded-xl bg-[#fbbe15] hover:bg-[#e5ac10] text-[#1a1a1a] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer border-none"
            >
              <Plus size={14} />
              Grant New Vanity Code
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by vanity code, user full name, email, or referral code..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/60 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:border-[#fbbe15] transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort & Pagination Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold whitespace-nowrap">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as VanityCodeSortBy);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-900 dark:text-white focus:outline-hidden"
            >
              <option value="vanityCodeChangedAt">Assigned Date</option>
              <option value="createdAt">Signup Date</option>
              <option value="completedReferrals">Completed Referrals</option>
              <option value="totalReferrals">Total Referrals</option>
            </select>
          </div>

          {/* Sort Order Button */}
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"))
            }
            title={`Sort ${sortOrder === "ASC" ? "Ascending" : "Descending"}`}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            {sortOrder === "ASC" ? (
              <ArrowUp size={14} />
            ) : (
              <ArrowDown size={14} />
            )}
            <span>{sortOrder}</span>
          </button>

          {/* Page Size Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold whitespace-nowrap">
              Size:
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-900 dark:text-white focus:outline-hidden"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh table"
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={isFetching ? "animate-spin text-amber-500" : ""}
            />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-5">Promoter / Creator</th>
                <th className="py-3.5 px-4">
                  <button
                    onClick={() => toggleSort("vanityCodeChangedAt")}
                    className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 font-bold uppercase tracking-wider text-[11px] text-gray-500"
                  >
                    Vanity Code
                    {sortBy === "vanityCodeChangedAt" &&
                      (sortOrder === "ASC" ? (
                        <ArrowUp size={12} />
                      ) : (
                        <ArrowDown size={12} />
                      ))}
                  </button>
                </th>
                <th className="py-3.5 px-4">Original Code</th>
                <th className="py-3.5 px-4">
                  <button
                    onClick={() => toggleSort("completedReferrals")}
                    className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 font-bold uppercase tracking-wider text-[11px] text-gray-500"
                  >
                    Referral Performance
                    {sortBy === "completedReferrals" &&
                      (sortOrder === "ASC" ? (
                        <ArrowUp size={12} />
                      ) : (
                        <ArrowDown size={12} />
                      ))}
                  </button>
                </th>
                <th className="py-3.5 px-4">Points Balance</th>
                <th className="py-3.5 px-4">
                  <button
                    onClick={() => toggleSort("vanityCodeChangedAt")}
                    className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 font-bold uppercase tracking-wider text-[11px] text-gray-500"
                  >
                    Assigned Date
                    {sortBy === "vanityCodeChangedAt" &&
                      (sortOrder === "ASC" ? (
                        <ArrowUp size={12} />
                      ) : (
                        <ArrowDown size={12} />
                      ))}
                  </button>
                </th>
                <th className="py-3.5 px-5 text-right">Admin Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-gray-500">
                    <Loader2 className="w-7 h-7 animate-spin text-[#fbbe15] mx-auto mb-3" />
                    Loading custom vanity codes and promoter analytics...
                  </td>
                </tr>
              ) : vanityCodes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto mb-3">
                      <Tag size={28} />
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white m-0">
                      No Vanity Codes Found
                    </p>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1 mb-4">
                      {search
                        ? `No vanity codes matching "${search}". Try adjusting your query.`
                        : "No creators or promoters have been assigned custom vanity codes yet."}
                    </p>
                    <button
                      onClick={() => onOpenVanityModal("", "")}
                      className="px-4 py-2 rounded-xl bg-[#fbbe15] hover:bg-[#e5ac10] text-[#1a1a1a] text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border-none"
                    >
                      <Plus size={14} />
                      Grant First Vanity Code
                    </button>
                  </td>
                </tr>
              ) : (
                vanityCodes.map((item) => (
                  <tr
                    key={item.userId}
                    className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    {/* Promoter / Creator */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-extrabold flex items-center justify-center shrink-0 text-xs">
                          {item.avatar ? (
                            <img
                              src={item.avatar}
                              alt={item.fullName}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            item.fullName?.charAt(0)?.toUpperCase() || "U"
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-gray-900 dark:text-white truncate">
                            {item.fullName || "Anonymous User"}
                          </span>
                          <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                            {item.email}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            ID: {item.userId.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Vanity Code Badge */}
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 font-mono font-bold text-xs tracking-wider">
                        <Tag
                          size={13}
                          className="text-gray-500 dark:text-gray-400 shrink-0"
                        />
                        <span>{item.vanityCode}</span>
                        <button
                          onClick={() => handleCopyCode(item.vanityCode)}
                          title="Copy Vanity Code"
                          className="ml-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors bg-transparent border-none p-0 cursor-pointer flex items-center"
                        >
                          {copiedCode === item.vanityCode ? (
                            <Check size={13} className="text-emerald-500" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Original Referral Code */}
                    <td className="py-4 px-4">
                      <span className="font-mono text-gray-600 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg text-xs">
                        {item.referralCode || "—"}
                      </span>
                    </td>

                    {/* Referral Metrics */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-emerald-600 dark:text-emerald-400 text-xs">
                            {item.completedReferrals} completed
                          </span>
                          <span className="text-gray-400 text-[11px]">
                            / {item.totalReferrals} total
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                          {item.pendingReferrals > 0 && (
                            <span className="text-amber-600 dark:text-amber-400 font-medium">
                              {item.pendingReferrals} pending
                            </span>
                          )}
                          {item.rejectedReferrals > 0 && (
                            <span className="text-red-500 font-medium">
                              {item.rejectedReferrals} flagged
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Points Balance */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white text-xs">
                          {item.currentPoints.toLocaleString()} pts
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {item.lifetimeEarned.toLocaleString()} lifetime
                        </span>
                      </div>
                    </td>

                    {/* Assigned Date */}
                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400 text-[11px] whitespace-nowrap">
                      {item.vanityCodeChangedAt ? (
                        <div className="flex flex-col">
                          <span>
                            {new Date(
                              item.vanityCodeChangedAt,
                            ).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(
                              item.vanityCodeChangedAt,
                            ).toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Initial setup</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            onOpenVanityModal(item.userId, item.fullName)
                          }
                          title="Update Vanity Code"
                          className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Tag size={12} className="text-amber-500" />
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            onOpenAdjustModal(item.userId, item.fullName)
                          }
                          title="Adjust Points"
                          className="px-2.5 py-1.5 rounded-lg bg-[#fbbe15]/15 hover:bg-[#fbbe15]/30 text-amber-900 dark:text-amber-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer border-none"
                        >
                          <Coins size={12} />
                          Points
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Showing{" "}
            <span className="font-bold text-gray-800 dark:text-gray-200">
              {total === 0 ? 0 : (page - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-gray-800 dark:text-gray-200">
              {Math.min(page * pageSize, total)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-800 dark:text-gray-200">
              {total}
            </span>{" "}
            vanity codes
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
              className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft size={14} />
              Previous
            </button>

            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 px-2">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isLoading}
              className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
