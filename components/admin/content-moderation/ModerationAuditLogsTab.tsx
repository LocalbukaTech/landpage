"use client";

import { useState } from "react";
import {
  Search,
  X,
  Filter,
  User,
  Film,
  Clock,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  EyeOff,
  Ban,
  Trash2,
  Calendar,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import {
  useAuditLogs,
  useModerationStaff,
} from "@/lib/api/services/moderation.hooks";
import type {
  ModerationDecision,
  AuditDateRange,
  AuditLogItem,
} from "@/lib/api/services/moderation.service";
import { UserPagination } from "@/components/admin/user-management/UserPagination";

const DECISIONS: ModerationDecision[] = [
  "all",
  "Warned user",
  "Paused account",
  "Removed post",
  "Banned account",
  "Escalated",
  "Ignored",
];

const DATE_RANGES: Array<{ id: AuditDateRange; label: string }> = [
  { id: "all", label: "All Time" },
  { id: "today", label: "Today" },
  { id: "7d", label: "Last 7 Days" },
  { id: "30d", label: "Last 30 Days" },
];

export function ModerationAuditLogsTab() {
  const [search, setSearch] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [selectedDecision, setSelectedDecision] = useState<ModerationDecision>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<AuditDateRange>("all");
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const { data: staffListResp } = useModerationStaff();
  const staffList = (staffListResp as any)?.data || staffListResp || [];

  const {
    data: auditResp,
    isLoading,
    isFetching,
    refetch,
  } = useAuditLogs({
    search: search.trim() || undefined,
    staffId: selectedStaffId || undefined,
    decision: selectedDecision !== "all" ? selectedDecision : undefined,
    dateRange: selectedDateRange !== "all" ? selectedDateRange : undefined,
    page,
    limit: 10,
  });

  const auditData = (auditResp as any)?.data || auditResp;
  const items: AuditLogItem[] = auditData?.items || [];
  const total = auditData?.total || 0;
  const totalPages = auditData?.totalPages || 1;

  const handleResetFilters = () => {
    setSearch("");
    setSelectedStaffId("");
    setSelectedDecision("all");
    setSelectedDateRange("all");
    setPage(1);
  };

  const getDecisionBadge = (decision: string, duration?: string | null) => {
    switch (decision) {
      case "Banned account":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-900">
            <Ban className="w-3 h-3" />
            Banned Permanently
          </span>
        );
      case "Paused account":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-900">
            <Clock className="w-3 h-3" />
            Paused {duration ? `(${duration})` : ""}
          </span>
        );
      case "Warned user":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Warned User
          </span>
        );
      case "Removed post":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
            <Trash2 className="w-3 h-3 text-orange-600" />
            Removed Post
          </span>
        );
      case "Escalated":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
            <ArrowUpRight className="w-3 h-3 text-purple-600" />
            Escalated
          </span>
        );
      case "Ignored":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <EyeOff className="w-3 h-3" />
            Ignored / Closed
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by MR-xxxx, staff name, reason, or decision note..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#fbbe15]/50 focus:border-[#fbbe15]"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              title="Refresh audit logs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-[#fbbe15]" : ""}`} />
            </button>

            {(search || selectedStaffId || selectedDecision !== "all" || selectedDateRange !== "all") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium"
              >
                <Filter className="w-3.5 h-3.5 text-amber-500" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-gray-100 dark:border-gray-800">
          {/* Staff Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Handled By Staff
            </label>
            <select
              value={selectedStaffId}
              onChange={(e) => {
                setSelectedStaffId(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-[#fbbe15]"
            >
              <option value="">All Staff Members</option>
              {staffList.map((member: any) => (
                <option key={member.id} value={member.id}>
                  {member.name || member.email} ({member.role})
                </option>
              ))}
            </select>
          </div>

          {/* Decision Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Decision Taken
            </label>
            <select
              value={selectedDecision}
              onChange={(e) => {
                setSelectedDecision(e.target.value as ModerationDecision);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-[#fbbe15]"
            >
              <option value="all">All Decisions</option>
              <option value="Warned user">Warned user</option>
              <option value="Paused account">Paused account</option>
              <option value="Removed post">Removed post</option>
              <option value="Banned account">Banned account</option>
              <option value="Escalated">Escalated</option>
              <option value="Ignored">Ignored / Closed</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Date Period
            </label>
            <select
              value={selectedDateRange}
              onChange={(e) => {
                setSelectedDateRange(e.target.value as AuditDateRange);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-[#fbbe15]"
            >
              {DATE_RANGES.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-gray-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#fbbe15] mb-2" />
            Loading moderation audit logs...
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldCheck className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
              No audit log entries found
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No moderation decisions match your selected filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="py-3 px-4">
                    Report #
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Target Type
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Reason
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Decision Taken
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Note / Details
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Handled By
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Closed Date
                  </th>
                  <th scope="col" className="py-3 px-4 text-right">
                    Timeline
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedLog(item)}
                    className="hover:bg-amber-500/5 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    {/* Report Number */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#9e7400] dark:text-[#fbbe15] whitespace-nowrap">
                      {item.reportNumber}
                    </td>

                    {/* Target Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {item.type?.toLowerCase().includes("post") ? (
                          <Film className="w-3 h-3 text-purple-500" />
                        ) : (
                          <User className="w-3 h-3 text-blue-500" />
                        )}
                        {item.type || "Profile"}
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="py-3.5 px-4 font-medium text-gray-900 dark:text-white max-w-[160px] truncate">
                      {item.reason}
                    </td>

                    {/* Decision */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getDecisionBadge(item.decision, item.decisionDuration)}
                    </td>

                    {/* Decision Note */}
                    <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300 max-w-[200px] truncate">
                      {item.decisionNote || <span className="text-gray-400 italic">—</span>}
                    </td>

                    {/* Handled By */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium text-gray-900 dark:text-white">
                        <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold text-[10px] flex items-center justify-center">
                          {item.handledBy?.[0]?.toUpperCase() || "A"}
                        </div>
                        <span>{item.handledBy}</span>
                      </div>
                    </td>

                    {/* Closed */}
                    <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400 whitespace-nowrap text-[11px]">
                      {item.closed || (item.closedAt ? new Date(item.closedAt).toLocaleDateString() : "Recently")}
                    </td>

                    {/* Timeline button */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLog(item);
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        title="View decision timeline"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <UserPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* Timeline Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 max-w-lg w-full overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/80 dark:bg-gray-800/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#9e7400] dark:text-[#fbbe15]">
                    {selectedLog.reportNumber}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Audit Trail & Timeline
                  </h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Reason: {selectedLog.reason} &bull; Handled by {selectedLog.handledBy}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-[65vh] overflow-y-auto space-y-4">
              {/* Final Decision Box */}
              <div className="p-3.5 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                    Final Resolution
                  </div>
                  <div className="mt-1">
                    {getDecisionBadge(selectedLog.decision, selectedLog.decisionDuration)}
                  </div>
                </div>

                {selectedLog.closed && (
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                      Closed Time
                    </div>
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-1">
                      {selectedLog.closed}
                    </div>
                  </div>
                )}
              </div>

              {selectedLog.decisionNote && (
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    Decision Note / Reason:
                  </label>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-xs text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                    {selectedLog.decisionNote}
                  </div>
                </div>
              )}

              {/* Timeline Items */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Chronological Event History:
                </label>
                {selectedLog.timeline && selectedLog.timeline.length > 0 ? (
                  <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
                    {selectedLog.timeline.map((event: any, idx: number) => (
                      <div key={event.id || idx} className="relative text-xs">
                        <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-[#fbbe15] border-2 border-white dark:border-gray-900" />
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {event.title}
                        </div>
                        {event.details && (
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                            {event.details}
                          </p>
                        )}
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {event.timeAgo || new Date(event.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No additional timeline events recorded.</p>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end bg-gray-50/50 dark:bg-gray-800/40">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
