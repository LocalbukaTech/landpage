"use client";

import Image from "next/image";
import {
  ShieldAlert,
  User,
  Film,
  MapPin,
  Clock,
  Eye,
  MoreVertical,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import type { ModerationQueueItem } from "@/lib/api/services/moderation.service";

interface ModerationQueueTableProps {
  items: ModerationQueueItem[];
  isLoading?: boolean;
  onReview: (item: ModerationQueueItem) => void;
  onQuickAction: (item: ModerationQueueItem) => void;
}

export function ModerationQueueTable({
  items,
  isLoading,
  onReview,
  onQuickAction,
}: ModerationQueueTableProps) {
  if (isLoading) {
    return (
      <div className="divide-y divide-gray-100 dark:divide-gray-800 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0" />
              <div className="space-y-1.5">
                <div className="w-32 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="w-24 h-3 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
            </div>
            <div className="w-28 h-6 bg-gray-200 dark:bg-gray-800 rounded-full" />
            <div className="w-20 h-6 bg-gray-200 dark:bg-gray-800 rounded-full" />
            <div className="w-16 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
          No reports match your filters
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">
          Everything is clean! All reports in this category have either been resolved or no matching reports exist.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-gray-50/80 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <tr>
            <th scope="col" className="py-3 px-4">
              Report #
            </th>
            <th scope="col" className="py-3 px-4">
              Reported Target
            </th>
            <th scope="col" className="py-3 px-4">
              Type
            </th>
            <th scope="col" className="py-3 px-4">
              Reason & Category
            </th>
            <th scope="col" className="py-3 px-4">
              Priority
            </th>
            <th scope="col" className="py-3 px-4">
              Status
            </th>
            <th scope="col" className="py-3 px-4">
              Submitted
            </th>
            <th scope="col" className="py-3 px-4 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
          {items.map((item) => {
            const isUrgent = item.priority === "urgent";
            const isProfile = item.targetType === "profile";

            return (
              <tr
                key={item.id}
                onClick={() => onReview(item)}
                className="hover:bg-amber-500/5 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
              >
                {/* Report Number */}
                <td className="py-3.5 px-4 font-mono font-bold text-[#9e7400] dark:text-[#fbbe15] whitespace-nowrap">
                  {item.reportNumber}
                </td>

                {/* Target Information */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 border border-gray-200 dark:border-gray-700">
                      {item.avatar ? (
                        <Image
                          src={item.avatar}
                          alt={item.title || "Avatar"}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-gray-500 text-xs">
                          {item.title?.[0] || (isProfile ? "U" : "P")}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white truncate max-w-[180px]">
                        {item.title || (isProfile ? "User Profile" : "User Post")}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                        {item.targetHandle && (
                          <span className="font-medium text-amber-600 dark:text-amber-400 truncate">
                            {item.targetHandle}
                          </span>
                        )}
                        {item.targetLocation && (
                          <span className="flex items-center gap-0.5 text-gray-400 truncate">
                            <MapPin className="w-2.5 h-2.5" />
                            {item.targetLocation}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Target Type */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${
                      isProfile
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-900/40"
                        : "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-900/40"
                    }`}
                  >
                    {isProfile ? <User className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                    {isProfile ? "Profile" : "Post"}
                  </span>
                </td>

                {/* Reason & Tags */}
                <td className="py-3.5 px-4">
                  <div className="space-y-1 max-w-[200px]">
                    <div className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                      {item.reason}
                    </div>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.2 rounded-xs bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-600 dark:text-gray-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>

                {/* Priority */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {isUrgent ? (
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-900 shadow-2xs"
                      title={item.urgentReason || "5 reports in 24h"}
                    >
                      <ShieldAlert className="w-3 h-3 text-rose-600 animate-pulse" />
                      Urgent
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      Standard
                    </span>
                  )}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                      item.status === "closed"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                        : item.status === "escalated"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
                    }`}
                  >
                    {item.status === "closed" && <CheckCircle2 className="w-3 h-3" />}
                    {item.status === "escalated" && <ArrowUpRight className="w-3 h-3" />}
                    {item.status === "open" && <AlertTriangle className="w-3 h-3" />}
                    {item.status}
                  </span>
                </td>

                {/* Time Ago */}
                <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-gray-400" />
                    {item.timeAgo || new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onReview(item)}
                      className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      Review
                    </button>

                    <button
                      type="button"
                      onClick={() => onQuickAction(item)}
                      className="px-2 py-1.5 rounded-lg bg-[#fbbe15]/20 hover:bg-[#fbbe15]/30 text-[#9e7400] dark:text-[#fbbe15] font-bold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                      title="Take action immediately"
                    >
                      <ShieldCheck className="w-3 h-3" />
                      Act
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
