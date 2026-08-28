'use client';

import { Users, CheckCircle2, Clock, XCircle, Gift } from 'lucide-react';
import type { ReferralItem } from '@/lib/api/services/referral.service';

interface ReferralsListTableProps {
  referrals?: ReferralItem[];
}

export function ReferralsListTable({ referrals = [] }: ReferralsListTableProps) {
  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const getStatusBadge = (status: string, rejectionReason?: string | null) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'>
            <CheckCircle2 size={12} />
            Verified &amp; Rewarded
          </span>
        );
      case 'PENDING':
        return (
          <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20' title='Awaiting email verification from referee'>
            <Clock size={12} />
            Pending Verification
          </span>
        );
      case 'REJECTED':
        return (
          <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20' title={rejectionReason || 'Duplicate or flagged'}>
            <XCircle size={12} />
            Flagged / Invalid
          </span>
        );
      default:
        return (
          <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-500/10 text-zinc-300 border border-white/10'>
            {status}
          </span>
        );
    }
  };

  if (!referrals.length) {
    return (
      <div className='w-full py-14 flex flex-col items-center justify-center text-center p-6 bg-white/[0.02] border border-white/10 rounded-2xl'>
        <div className='w-12 h-12 rounded-xl bg-[#FBBE15]/10 flex items-center justify-center text-[#FBBE15] mb-3'>
          <Users size={24} />
        </div>
        <h4 className='text-base font-bold text-white mb-1'>No Referrals Yet</h4>
        <p className='text-xs text-zinc-400 max-w-sm m-0 leading-relaxed'>
          Share your referral link with friends. When they sign up and verify their account, you&apos;ll see them listed here and earn 50 points!
        </p>
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col gap-4' style={{ fontFamily: 'var(--font-nunito-sans), Nunito Sans, sans-serif' }}>
      <div className='w-full overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]'>
        <table className='w-full text-left border-collapse min-w-[500px]'>
          <thead>
            <tr className='border-b border-white/10 bg-white/[0.03] text-[11px] font-bold text-zinc-400 uppercase tracking-wider'>
              <th className='py-3.5 px-4'>Referral Code</th>
              <th className='py-3.5 px-4'>Status</th>
              <th className='py-3.5 px-4'>Invited Date</th>
              <th className='py-3.5 px-4 text-right'>Your Reward</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-white/5 text-sm'>
            {referrals.map((item) => (
              <tr key={item.id} className='hover:bg-white/[0.02] transition-colors'>
                <td className='py-3.5 px-4 font-mono font-bold text-white tracking-wider text-xs'>
                  {item.code}
                </td>
                <td className='py-3.5 px-4'>
                  {getStatusBadge(item.status, item.rejectionReason)}
                </td>
                <td className='py-3.5 px-4 text-xs text-zinc-400 whitespace-nowrap'>
                  {formatDate(item.createdAt)}
                </td>
                <td className='py-3.5 px-4 text-right font-extrabold whitespace-nowrap'>
                  {item.status === 'COMPLETED' ? (
                    <span className='text-emerald-400 flex items-center justify-end gap-1'>
                      <Gift size={14} />
                      +{item.referrerRewardPoints || 50} pts
                    </span>
                  ) : item.status === 'PENDING' ? (
                    <span className='text-amber-400 text-xs font-semibold'>
                      +50 pts upon verify
                    </span>
                  ) : (
                    <span className='text-zinc-500 text-xs font-normal'>0 pts</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
