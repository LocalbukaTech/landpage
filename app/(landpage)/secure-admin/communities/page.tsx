'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Loader2,
  Users,
  Search,
  MessageSquare,
} from 'lucide-react';
import {
  useAdminCommunities,
  useAdminReviewCommunity,
} from '@/lib/api/services/community.hooks';

type ReviewStatusFilter =
  | undefined
  | 'pending'
  | 'approved'
  | 'changes_requested'
  | 'rejected';

const STATUS_BADGES: Record<string, { label: string; cls: string }> = {
  pending: {
    label: 'Pending Review',
    cls: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800',
  },
  in_review: {
    label: 'In Review',
    cls: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
  },
  approved: {
    label: 'Approved & Live',
    cls: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800',
  },
  changes_requested: {
    label: 'Changes Requested',
    cls: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800',
  },
  rejected: {
    label: 'Not Approved',
    cls: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800',
  },
};

export default function AdminCommunitiesApprovalPage() {
  const [statusFilter, setStatusFilter] =
    useState<ReviewStatusFilter>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackModal, setFeedbackModal] = useState<{
    id: string;
    name: string;
    decision: 'changes_requested' | 'rejected';
  } | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const { data: communities = [], isLoading } =
    useAdminCommunities(statusFilter);
  const reviewMutation = useAdminReviewCommunity();

  const filtered = communities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleApprove = (id: string, name: string) => {
    reviewMutation.mutate(
      { id, data: { status: 'approved' } },
      {
        onSuccess: () =>
          showToast(`"${name}" approved and is now live on Explore!`),
      }
    );
  };

  const handleSubmitDecision = () => {
    if (!feedbackModal) return;
    reviewMutation.mutate(
      {
        id: feedbackModal.id,
        data: {
          status: feedbackModal.decision,
          adminFeedback:
            feedbackText.trim() ||
            (feedbackModal.decision === 'changes_requested'
              ? 'Please update your community details and resubmit.'
              : 'Community did not meet LocalBuka guidelines.'),
        },
      },
      {
        onSuccess: () => {
          showToast(
            feedbackModal.decision === 'changes_requested'
              ? `Changes requested for "${feedbackModal.name}". Creator notified.`
              : `"${feedbackModal.name}" marked as Not Approved. Creator notified.`
          );
          setFeedbackModal(null);
          setFeedbackText('');
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-[#fbbe15] px-4 py-2.5 text-xs font-bold text-[#1a1a1a] shadow-xl">
          {toastMsg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
            Community Approvals
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Review creator community submissions — Approve to publish live, Request Changes, or Reject with feedback
          </p>
        </div>
        <div className="bg-[#fbbe15] text-[#1a1a1a] px-4 py-2.5 rounded-lg font-bold text-sm">
          {communities.length} Communities
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by community name, creator, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-foreground text-xs focus:ring-2 focus:ring-[#fbbe15] focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(
            [
              { label: 'All', value: undefined },
              { label: 'Pending', value: 'pending' },
              { label: 'Approved', value: 'approved' },
              { label: 'Changes Requested', value: 'changes_requested' },
              { label: 'Rejected', value: 'rejected' },
            ] as { label: string; value: ReviewStatusFilter }[]
          ).map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.value
                  ? 'bg-[#fbbe15] text-[#1a1a1a]'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[35vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#fbbe15]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center space-y-2">
          <Users className="w-10 h-10 text-muted-foreground mx-auto opacity-60" />
          <h3 className="text-base font-semibold text-foreground">
            No communities in this review queue
          </h3>
          <p className="text-xs text-muted-foreground">
            When creators submit new communities, they will appear here for Admin approval.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((comm) => {
            const badge =
              STATUS_BADGES[comm.status] || STATUS_BADGES.pending;
            return (
              <div
                key={comm.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0">
                    <Image
                      src={comm.coverImage || comm.image || '/images/community/cover-1.jpg'}
                      alt={comm.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground">
                        {comm.name}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-muted-foreground">
                        {comm.price}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {comm.description}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Creator: <strong className="text-foreground">{comm.creator}</strong>
                      {comm.creatorEmail ? ` (${comm.creatorEmail})` : ''} · Slug:{' '}
                      <code>{comm.slug}</code>
                    </p>
                    {comm.adminFeedback && (
                      <div className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 px-2.5 py-1 rounded-lg">
                        <MessageSquare className="w-3 h-3 shrink-0" />
                        <span>Feedback: {comm.adminFeedback}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Decision Controls */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={
                      reviewMutation.isPending || comm.status === 'approved'
                    }
                    onClick={() => handleApprove(comm.id, comm.name)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-xs transition-all cursor-pointer disabled:opacity-40"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    type="button"
                    disabled={reviewMutation.isPending}
                    onClick={() => {
                      setFeedbackModal({
                        id: comm.id,
                        name: comm.name,
                        decision: 'changes_requested',
                      });
                      setFeedbackText(comm.adminFeedback || '');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-all cursor-pointer disabled:opacity-40"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Request Changes</span>
                  </button>

                  <button
                    type="button"
                    disabled={reviewMutation.isPending}
                    onClick={() => {
                      setFeedbackModal({
                        id: comm.id,
                        name: comm.name,
                        decision: 'rejected',
                      });
                      setFeedbackText(comm.adminFeedback || '');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-all cursor-pointer disabled:opacity-40"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Feedback Modal for Request Changes / Reject */}
      {feedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              {feedbackModal.decision === 'rejected' ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : (
                <Clock className="w-5 h-5 text-orange-500" />
              )}
              <h2 className="text-base font-bold text-foreground">
                {feedbackModal.decision === 'rejected'
                  ? `Reject "${feedbackModal.name}"`
                  : `Request Changes on "${feedbackModal.name}"`}
              </h2>
            </div>

            <p className="text-xs text-muted-foreground">
              Write clear feedback for the creator. This message will appear directly on their community review screen and in their Notifications.
            </p>

            <textarea
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Explain what needs to be updated or why it was not approved..."
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-foreground focus:ring-2 focus:ring-[#fbbe15] focus:border-transparent"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFeedbackModal(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={reviewMutation.isPending}
                onClick={handleSubmitDecision}
                className={`px-4 py-2 rounded-lg text-xs font-bold text-white cursor-pointer disabled:opacity-50 ${
                  feedbackModal.decision === 'rejected'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                {reviewMutation.isPending ? 'Saving...' : 'Send Decision'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
