"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  ShieldAlert,
  AlertTriangle,
  User,
  Film,
  ExternalLink,
  Clock,
  History,
  ShieldCheck,
  Eye,
  FileText,
  MapPin,
  Calendar,
  Layers,
  ArrowUpRight,
  EyeOff,
  Ban,
  Trash2,
  Loader2,
} from "lucide-react";
import { useReportReview } from "@/lib/api/services/moderation.hooks";
import { ModerationActionModal } from "./ModerationActionModal";
import { ModerationProofLightbox } from "./ModerationProofLightbox";
import type { ModerationAction } from "@/lib/api/services/moderation.service";

interface ModerationReviewModalProps {
  reportId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onActionSuccess?: () => void;
}

export function ModerationReviewModal({
  reportId,
  isOpen,
  onClose,
  onActionSuccess,
}: ModerationReviewModalProps) {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [initialAction, setInitialAction] = useState<ModerationAction>("warn");
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const { data: reportResp, isLoading, isError, refetch } = useReportReview(
    reportId || ""
  );

  if (!isOpen || !reportId) return null;

  const data = (reportResp as any)?.data || reportResp;
  const report = data?.report;
  const profile = data?.reportedProfile;
  const post = data?.reportedPost;
  const details = data?.reportDetails;
  const previousReports = data?.previousReports || [];
  const auditTrail = data?.auditTrail || [];

  const handleOpenAction = (action: ModerationAction) => {
    setInitialAction(action);
    setIsActionModalOpen(true);
  };

  const handleActionSuccess = () => {
    refetch();
    onActionSuccess?.();
  };

  return (
    <>
      <div className="fixed inset-0 z-45 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/70 dark:bg-gray-850/60">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-900 dark:text-amber-300 font-bold text-xs font-mono">
                {report?.reportNumber || "Report"}
              </span>

              {/* Status Badge */}
              {report?.status === "urgent" || report?.priority === "urgent" ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-900">
                  <ShieldAlert className="w-3.5 h-3.5 animate-pulse text-rose-600" />
                  Urgent ({report?.urgentReason || "High Priority"})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  Standard Priority
                </span>
              )}

              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                  report?.status === "closed"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : report?.status === "escalated"
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                }`}
              >
                {report?.status || "Open"}
              </span>

              {report?.timeAgo && (
                <span className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {report.timeAgo}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Body */}
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#fbbe15] mb-3" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Fetching report review details & recording audit entry...
              </p>
            </div>
          ) : isError ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <AlertTriangle className="w-10 h-10 text-rose-500 mb-3" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                Failed to load report
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mb-4">
                Unable to retrieve detailed information for this moderation case.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="px-4 py-1.5 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-xs font-medium"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Two Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Target & Report details */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Reported Target Card */}
                  <div className="bg-gray-50/70 dark:bg-gray-800/40 rounded-xl p-4 border border-gray-200/80 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        {profile ? (
                          <>
                            <User className="w-3.5 h-3.5 text-amber-500" />
                            Reported User Profile
                          </>
                        ) : (
                          <>
                            <Film className="w-3.5 h-3.5 text-amber-500" />
                            Reported Post
                          </>
                        )}
                      </h3>
                      {profile?.id && (
                        <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400">
                          {profile.id}
                        </span>
                      )}
                    </div>

                    {profile ? (
                      <div className="flex items-start gap-3.5">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0 border border-gray-300 dark:border-gray-700">
                          {profile.avatar ? (
                            <Image
                              src={profile.avatar}
                              alt={profile.fullName || profile.username}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-gray-500 text-sm">
                              {profile.fullName?.[0] || "U"}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                              {profile.fullName}
                            </h4>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                                profile.status === "Banned"
                                  ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400"
                                  : profile.status === "Paused"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                              }`}
                            >
                              {profile.status}
                            </span>
                          </div>

                          <p className="text-xs text-[#9e7400] dark:text-[#fbbe15] font-medium">
                            {profile.username}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                            {profile.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                {profile.location}
                              </span>
                            )}
                            {profile.joinedDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                Joined {profile.joinedDate}
                              </span>
                            )}
                            {typeof profile.totalPosts === "number" && (
                              <span className="flex items-center gap-1">
                                <Layers className="w-3 h-3 text-gray-400" />
                                {profile.totalPosts} {profile.totalPosts === 1 ? "post" : "posts"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : post ? (
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          {post.imageUrl && (
                            <div
                              onClick={() => setLightboxSrc(post.imageUrl)}
                              className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 border border-gray-200 dark:border-gray-700 cursor-zoom-in group"
                            >
                              <Image
                                src={post.imageUrl}
                                alt="Post media"
                                fill
                                unoptimized
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                <Eye className="w-4 h-4" />
                              </div>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 dark:text-white italic bg-white dark:bg-gray-850 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700">
                              &ldquo;{post.caption}&rdquo;
                            </p>
                            {post.createdAt && (
                              <p className="text-[10px] text-gray-400 mt-1">
                                Posted on {new Date(post.createdAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Complaint & Report Details */}
                  <div className="bg-white dark:bg-gray-850 rounded-xl p-4 border border-gray-200 dark:border-gray-800 space-y-3.5">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          Violation Category:
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-semibold text-xs border border-rose-200 dark:border-rose-900">
                          {details?.reason}
                        </span>
                      </div>

                      {details?.tags && details.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {details.tags.map((tag: string, i: number) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded-sm bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-600 dark:text-gray-400 font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Reported by anonymity info */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 bg-amber-50/60 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200/50 dark:border-amber-900/40 flex items-center gap-2">
                      <EyeOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{details?.reportedBy || "Reported by Anonymous — hidden from target"}</span>
                    </div>

                    {/* Reporter Notes */}
                    {details?.notes && (
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                          Reporter&#39;s Statement / Complaint:
                        </label>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800/80 rounded-lg text-xs text-gray-800 dark:text-gray-200 leading-relaxed border border-gray-200/70 dark:border-gray-700/70">
                          {details.notes}
                        </div>
                      </div>
                    )}

                    {/* Attached Evidence & Link */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {details?.attachedProof && (
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                            Attached Evidence Image:
                          </label>
                          <div
                            onClick={() => setLightboxSrc(details.attachedProof)}
                            className="relative h-28 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-zoom-in group bg-gray-100 dark:bg-gray-800"
                          >
                            <Image
                              src={details.attachedProof}
                              alt="Proof attachment"
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold gap-1.5 transition-opacity">
                              <Eye className="w-4 h-4" />
                              View Full Proof
                            </div>
                          </div>
                        </div>
                      )}

                      {details?.link && (
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                            Evidence Link:
                          </label>
                          <a
                            href={details.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <span className="truncate">{details.link}</span>
                            <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-1.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Previous Reports History on Target */}
                  {previousReports.length > 0 && (
                    <div className="bg-white dark:bg-gray-850 rounded-xl p-4 border border-gray-200 dark:border-gray-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                          <History className="w-3.5 h-3.5 text-amber-500" />
                          Previous Reports on this Target ({previousReports.length})
                        </h4>
                      </div>

                      <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {previousReports.map((prev: any) => (
                          <div
                            key={prev.id || prev.reportNumber}
                            className="py-2 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-mono font-bold text-[#9e7400] dark:text-[#fbbe15] mr-2">
                                {prev.reportNumber}
                              </span>
                              <span className="text-gray-700 dark:text-gray-300 font-medium">
                                {prev.reason}
                              </span>
                            </div>
                            <span className="text-[11px] text-gray-400">
                              {prev.timeAgo || "past report"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Audit Trail & Action Center */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Action Center Card */}
                  <div className="bg-linear-to-br from-amber-500/10 via-white to-amber-500/5 dark:from-gray-850 dark:via-gray-900 dark:to-gray-850 rounded-xl p-4 border border-amber-500/30 dark:border-gray-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                        Moderator Actions
                      </h3>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
                        Take immediate action
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenAction("warn")}
                      className="w-full py-2.5 px-4 rounded-xl bg-gray-950 hover:bg-black text-white dark:bg-[#fbbe15] dark:text-gray-950 dark:hover:bg-[#f5b300] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      Take Disciplinary Action...
                    </button>

                    {/* Quick Action Buttons Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenAction("ignore")}
                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        Ignore / Close
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenAction("warn")}
                        className="p-2 rounded-lg border border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        Warn User
                      </button>

                      {post && (
                        <button
                          type="button"
                          onClick={() => handleOpenAction("remove_post")}
                          className="p-2 rounded-lg border border-orange-300 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-xs font-semibold text-orange-800 dark:text-orange-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-orange-600" />
                          Remove Post
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenAction("pause_account")}
                        className="p-2 rounded-lg border border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5 text-rose-600" />
                        Pause Account
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenAction("escalate")}
                        className="p-2 rounded-lg border border-purple-300 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-xs font-semibold text-purple-800 dark:text-purple-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 text-purple-600" />
                        Escalate
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenAction("ban_account")}
                        className="p-2 rounded-lg border border-red-400 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold text-red-700 dark:text-red-400 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Ban className="w-3.5 h-3.5 text-red-600" />
                        Ban Account
                      </button>
                    </div>
                  </div>

                  {/* Audit Trail Timeline */}
                  <div className="bg-white dark:bg-gray-850 rounded-xl p-4 border border-gray-200 dark:border-gray-800 space-y-3">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-500" />
                      Live Audit Trail & History
                    </h4>

                    {auditTrail.length === 0 ? (
                      <p className="text-xs text-gray-400 italic py-2">
                        No activity recorded yet.
                      </p>
                    ) : (
                      <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
                        {auditTrail.map((log: any) => (
                          <div key={log.id} className="relative text-xs">
                            {/* Dot */}
                            <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-[#fbbe15] border-2 border-white dark:border-gray-900" />

                            <div className="font-semibold text-gray-900 dark:text-white">
                              {log.title}
                            </div>
                            {log.details && (
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                                {log.details}
                              </p>
                            )}
                            <div className="text-[10px] text-gray-400 mt-0.5">
                              {log.timeAgo || new Date(log.createdAt).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Close */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end bg-gray-50/50 dark:bg-gray-850/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Done / Close View
            </button>
          </div>
        </div>
      </div>

      {/* Action Execution Modal */}
      {isActionModalOpen && report && (
        <ModerationActionModal
          reportId={report.id || reportId}
          reportNumber={report.reportNumber}
          targetType={post ? "post" : "profile"}
          targetTitle={profile ? profile.fullName || profile.username : post?.caption}
          isOpen={isActionModalOpen}
          initialAction={initialAction}
          onClose={() => setIsActionModalOpen(false)}
          onSuccess={handleActionSuccess}
        />
      )}

      {/* Lightbox Modal */}
      {lightboxSrc && (
        <ModerationProofLightbox
          src={lightboxSrc}
          onClose={() => setLightboxSrc(null)}
        />
      )}
    </>
  );
}
