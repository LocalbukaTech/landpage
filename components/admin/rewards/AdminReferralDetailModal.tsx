'use client';

import { X, Loader2, User, CheckCircle2, Clock, XCircle, ShieldCheck, ShieldAlert, Monitor, Globe } from 'lucide-react';
import { useAdminReferralDetail } from '@/lib/api/services/admin-rewards.hooks';

interface AdminReferralDetailModalProps {
  referralId: string | null;
  onClose: () => void;
}

export function AdminReferralDetailModal({
  referralId,
  onClose,
}: AdminReferralDetailModalProps) {
  const { data: referral, isLoading } = useAdminReferralDetail(referralId || '');

  if (!referralId) return null;

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return '—';
    try {
      return new Date(isoString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'>
            <CheckCircle2 size={13} />
            Completed &amp; Rewarded
          </span>
        );
      case 'PENDING':
        return (
          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'>
            <Clock size={13} />
            Pending Verification
          </span>
        );
      case 'REJECTED':
        return (
          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'>
            <XCircle size={13} />
            Rejected / Flagged
          </span>
        );
      default:
        return (
          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'>
            {status}
          </span>
        );
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs'>
      <div className='relative w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 shrink-0'>
          <div className='flex items-center gap-3'>
            <div>
              <h3 className='text-lg font-bold text-gray-900 dark:text-white m-0'>
                Referral Audit Details
              </h3>
              <p className='text-xs font-mono text-gray-500 mt-0.5 m-0'>
                ID: {referralId}
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-none bg-transparent cursor-pointer'>
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className='p-6 overflow-y-auto flex flex-col gap-6'>
          {isLoading || !referral ? (
            <div className='py-16 flex flex-col items-center justify-center text-center'>
              <Loader2 className='w-8 h-8 animate-spin text-[#fbbe15] mb-2' />
              <span className='text-xs text-gray-500'>Loading referral record...</span>
            </div>
          ) : (
            <>
              {/* Status and Summary Cards */}
              <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'>
                <div className='flex flex-col gap-1'>
                  <span className='text-xs text-gray-500 font-semibold uppercase tracking-wider'>
                    Referral Status
                  </span>
                  <div>{getStatusBadge(referral.status)}</div>
                </div>

                <div className='flex items-center gap-6'>
                  <div className='flex flex-col'>
                    <span className='text-xs text-gray-500'>Referrer Reward</span>
                    <span className='text-sm font-extrabold text-emerald-600 dark:text-emerald-400'>
                      +{referral.referrerRewardPoints || 50} pts (₦{(referral.referrerRewardPoints || 50) / 2})
                    </span>
                  </div>

                  <div className='flex flex-col'>
                    <span className='text-xs text-gray-500'>Referee Reward</span>
                    <span className='text-sm font-extrabold text-[#b8860b] dark:text-[#fbbe15]'>
                      +{referral.refereeRewardPoints || 20} pts (₦{(referral.refereeRewardPoints || 20) / 2})
                    </span>
                  </div>
                </div>
              </div>

              {/* Rejection notice if flagged */}
              {referral.rejectionReason && (
                <div className='p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-3'>
                  <ShieldAlert size={18} className='text-rose-600 dark:text-rose-400 shrink-0 mt-0.5' />
                  <div className='flex flex-col'>
                    <span className='text-xs font-bold text-rose-700 dark:text-rose-300'>
                      Fraud Review Flag Triggered
                    </span>
                    <span className='text-xs text-rose-600 dark:text-rose-400 mt-0.5'>
                      {referral.rejectionReason}
                    </span>
                  </div>
                </div>
              )}

              {/* Referrer & Referee Grid */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Referrer Box */}
                <div className='p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col gap-3'>
                  <div className='flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100 dark:border-gray-700'>
                    <User size={14} />
                    Referrer (Invited By)
                  </div>
                  <div className='flex flex-col gap-1'>
                    <span className='text-sm font-bold text-gray-900 dark:text-white'>
                      {referral.referrer?.fullName || 'User ' + (referral.referrerId?.slice(0, 8) || '')}
                    </span>
                    <span className='text-xs text-gray-500 font-mono'>
                      {referral.referrer?.email || referral.referrerId || '—'}
                    </span>
                    {referral.referrer?.referralCode && (
                      <span className='text-xs text-[#b8860b] dark:text-[#fbbe15] font-mono mt-1'>
                        Code: <strong>{referral.referrer.referralCode}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Referee Box */}
                <div className='p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col gap-3'>
                  <div className='flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100 dark:border-gray-700'>
                    <User size={14} />
                    Referee (New Member)
                  </div>
                  <div className='flex flex-col gap-1'>
                    <span className='text-sm font-bold text-gray-900 dark:text-white'>
                      {referral.referee?.fullName || 'User ' + (referral.refereeId?.slice(0, 8) || '')}
                    </span>
                    <span className='text-xs text-gray-500 font-mono'>
                      {referral.referee?.email || referral.refereeId || '—'}
                    </span>
                    {referral.referee?.isEmailVerified !== undefined && (
                      <span className='text-xs text-gray-500 mt-1 flex items-center gap-1'>
                        {referral.referee.isEmailVerified ? (
                          <span className='text-emerald-600 dark:text-emerald-400 font-bold'>✓ Email Verified</span>
                        ) : (
                          <span className='text-amber-500 font-bold'>⏳ Unverified Email</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Security & Audit Fingerprints */}
              <div className='flex flex-col gap-2.5 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs'>
                <div className='text-xs font-bold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100 dark:border-gray-700'>
                  Security &amp; Device Signatures
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1'>
                  <div className='flex items-center gap-2'>
                    <Globe size={15} className='text-gray-400 shrink-0' />
                    <span className='text-gray-500'>Signup IP:</span>
                    <span className='font-mono text-gray-900 dark:text-white font-semibold'>
                      {referral.refereeSignupIp || 'Not recorded'}
                    </span>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Monitor size={15} className='text-gray-400 shrink-0' />
                    <span className='text-gray-500'>Device ID:</span>
                    <span className='font-mono text-gray-900 dark:text-white font-semibold truncate max-w-[180px]' title={referral.refereeDeviceId || ''}>
                      {referral.refereeDeviceId || 'Not recorded'}
                    </span>
                  </div>

                  <div className='flex items-center gap-2'>
                    <ShieldCheck size={15} className='text-gray-400 shrink-0' />
                    <span className='text-gray-500'>Qualifying Action:</span>
                    <span className='font-semibold text-gray-900 dark:text-white'>
                      {referral.qualifyingAction || '—'}
                    </span>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Clock size={15} className='text-gray-400 shrink-0' />
                    <span className='text-gray-500'>Completed:</span>
                    <span className='text-gray-900 dark:text-white font-semibold'>
                      {formatDate(referral.completedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timestamp Audit */}
              <div className='flex items-center justify-between text-xs text-gray-400 pt-2'>
                <span>Created: {formatDate(referral.createdAt)}</span>
                {referral.updatedAt && <span>Last Updated: {formatDate(referral.updatedAt)}</span>}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end px-6 py-4 border-t border-gray-100 dark:border-gray-800 shrink-0'>
          <button
            type='button'
            onClick={onClose}
            className='px-5 py-2.5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white transition-colors cursor-pointer border-none'>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
