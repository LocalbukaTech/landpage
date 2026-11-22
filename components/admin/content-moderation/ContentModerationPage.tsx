"use client";

import { useState, useTransition } from "react";
import {
  ShieldAlert,
  History,
  ShieldCheck,
  Sparkles,
  Inbox,
  AlertCircle,
  Clock,
} from "lucide-react";
import { getAdminUser } from "@/lib/auth";
import { useModerationQueue } from "@/lib/api/services/moderation.hooks";
import { ModerationStatsCards } from "./ModerationStatsCards";
import {
  ModerationFilters,
  DEFAULT_FILTERS,
  type ModerationFilterState,
} from "./ModerationFilters";
import { ModerationQueueTable } from "./ModerationQueueTable";
import { ModerationReviewModal } from "./ModerationReviewModal";
import { ModerationActionModal } from "./ModerationActionModal";
import { ModerationAuditLogsTab } from "./ModerationAuditLogsTab";
import { UserPagination } from "@/components/admin/user-management/UserPagination";
import type {
  ModerationQueueItem,
  ModerationStatus,
  ModerationPriority,
} from "@/lib/api/services/moderation.service";

type ActiveViewTab = "queue" | "audit";

const ITEMS_PER_PAGE = 10;

export function ContentModerationPage() {
  const [admin] = useState(() => getAdminUser());
  const isSuperAdmin = admin?.role === "super_admin";

  const [activeTab, setActiveTab] = useState<ActiveViewTab>("queue");
  const [filters, setFilters] = useState<ModerationFilterState>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [, startTransition] = useTransition();

  // Modal States
  const [reviewItem, setReviewItem] = useState<ModerationQueueItem | null>(null);
  const [actionItem, setActionItem] = useState<ModerationQueueItem | null>(null);

  // API Fetch for Moderation Queue
  const {
    data: queueResp,
    isLoading: isLoadingQueue,
    isFetching: isFetchingQueue,
    refetch: refetchQueue,
  } = useModerationQueue({
    search: filters.search.trim() || undefined,
    contentType: filters.contentType !== "all" ? filters.contentType : undefined,
    reason: filters.reason || undefined,
    status: filters.status !== "all" ? filters.status : undefined,
    priority: filters.priority !== "all" ? filters.priority : undefined,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const queueData = (queueResp as any)?.data || queueResp;
  const items: ModerationQueueItem[] = queueData?.items || [];
  const total = queueData?.total || 0;
  const totalPages = queueData?.totalPages || 1;
  const counts = queueData?.counts;

  const handleStatsFilter = (
    status: ModerationStatus | "all",
    priority: ModerationPriority | "all"
  ) => {
    startTransition(() => {
      setFilters((prev) => ({
        ...prev,
        status,
        priority,
      }));
      setCurrentPage(1);
      setActiveTab("queue");
    });
  };

  const handleFilterChange = (newFilters: ModerationFilterState) => {
    startTransition(() => {
      setFilters(newFilters);
      setCurrentPage(1);
    });
  };

  const handleResetFilters = () => {
    startTransition(() => {
      setFilters(DEFAULT_FILTERS);
      setCurrentPage(1);
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-[#9e7400] dark:text-[#fbbe15] flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Content Moderation
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Review user flags, investigate fraudulent activities, and maintain platform safety.
              </p>
            </div>
          </div>
        </div>

        {/* Role Badge Indicator */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">
              Role:{" "}
              <strong className="text-gray-900 dark:text-white capitalize">
                {admin?.role?.replace("_", " ") || "Moderator"}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* ── Sub-navigation Tabs (Queue vs Audit Log) ── */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("queue")}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "queue"
                ? "border-[#fbbe15] text-[#9e7400] dark:text-[#fbbe15]"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Moderation Queue</span>
            {typeof counts?.open === "number" && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-[#9e7400] dark:text-[#fbbe15] text-[10px] font-extrabold">
                {counts.open}
              </span>
            )}
          </button>

          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => setActiveTab("audit")}
              className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "audit"
                  ? "border-[#fbbe15] text-[#9e7400] dark:text-[#fbbe15]"
                  : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              <History className="w-4 h-4" />
              <span>Audit Log & History</span>
              <span className="px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-semibold">
                Super Admin
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "queue" ? (
        <div className="space-y-5">
          {/* Quick Metrics & Stats Cards */}
          <ModerationStatsCards
            counts={counts}
            currentStatus={filters.status}
            currentPriority={filters.priority}
            onSelectFilter={handleStatsFilter}
            isLoading={isLoadingQueue}
          />

          {/* Search & Filters */}
          <ModerationFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            onRefresh={() => refetchQueue()}
            isRefreshing={isFetchingQueue}
            totalResults={total}
          />

          {/* Table Container */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden min-h-[360px] flex flex-col justify-between">
            <ModerationQueueTable
              items={items}
              isLoading={isLoadingQueue}
              onReview={(item) => setReviewItem(item)}
              onQuickAction={(item) => setActionItem(item)}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-850/30">
                <UserPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(p) => setCurrentPage(p)}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Audit Log & History Tab */
        <ModerationAuditLogsTab />
      )}

      {/* ── Modals ── */}
      {/* 1. Review Modal */}
      {reviewItem && (
        <ModerationReviewModal
          reportId={reviewItem.id}
          isOpen={!!reviewItem}
          onClose={() => setReviewItem(null)}
          onActionSuccess={() => {
            refetchQueue();
            setReviewItem(null);
          }}
        />
      )}

      {/* 2. Quick Action Modal */}
      {actionItem && (
        <ModerationActionModal
          reportId={actionItem.id}
          reportNumber={actionItem.reportNumber}
          targetType={actionItem.targetType}
          targetTitle={actionItem.title}
          isOpen={!!actionItem}
          onClose={() => setActionItem(null)}
          onSuccess={() => {
            refetchQueue();
            setActionItem(null);
          }}
        />
      )}
    </div>
  );
}
