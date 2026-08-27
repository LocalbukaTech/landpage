'use client';

import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Gift, AlertTriangle, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useRewardsTransactions } from '@/lib/api/services/referral.hooks';
import type { TransactionItem } from '@/lib/api/services/referral.service';

interface TransactionHistoryTableProps {
  initialTransactions?: TransactionItem[];
}

export function TransactionHistoryTable({ initialTransactions }: TransactionHistoryTableProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading } = useRewardsTransactions({ page, pageSize });

  const transactions = data?.data || initialTransactions || [];
  const totalPages = data?.totalPages || 1;
  const totalCount = data?.total ?? transactions.length;

  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getTypeBadge = (type: string, amount: number) => {
    switch (type) {
      case 'EARNED':
        return (
          <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'>
            <ArrowDownLeft size={12} />
            Earned
          </span>
        );
      case 'REDEEMED':
        return (
          <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20'>
            <ArrowUpRight size={12} />
            Redeemed
          </span>
        );
      case 'BONUS':
        return (
          <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20'>
            <Gift size={12} />
            Bonus
          </span>
        );
      case 'PENALTY':
        return (
          <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20'>
            <AlertTriangle size={12} />
            Penalty
          </span>
        );
      default:
        return (
          <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-500/10 text-zinc-300 border border-white/10'>
            {amount > 0 ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
            {type}
          </span>
        );
    }
  };

  if (isLoading && !transactions.length) {
    return (
      <div className='w-full py-12 flex flex-col items-center justify-center gap-3 text-zinc-500'>
        <div className='w-6 h-6 border-2 border-[#FBBE15] border-t-transparent rounded-full animate-spin' />
        <span className='text-xs'>Loading ledger transactions...</span>
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className='w-full py-14 flex flex-col items-center justify-center text-center p-6 bg-white/[0.02] border border-white/10 rounded-2xl'>
        <div className='w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 mb-3'>
          <Clock size={24} />
        </div>
        <h4 className='text-base font-bold text-white mb-1'>No Point Transactions Yet</h4>
        <p className='text-xs text-zinc-400 max-w-sm m-0 leading-relaxed'>
          Share your referral link to earn 50 points every time a friend joins and verifies their account.
        </p>
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col gap-4' style={{ fontFamily: 'var(--font-nunito-sans), Nunito Sans, sans-serif' }}>
      <div className='w-full overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]'>
        <table className='w-full text-left border-collapse min-w-[580px]'>
          <thead>
            <tr className='border-b border-white/10 bg-white/[0.03] text-[11px] font-bold text-zinc-400 uppercase tracking-wider'>
              <th className='py-3.5 px-4'>Type</th>
              <th className='py-3.5 px-4'>Description</th>
              <th className='py-3.5 px-4'>Date</th>
              <th className='py-3.5 px-4 text-right'>Points</th>
              <th className='py-3.5 px-4 text-right'>Balance After</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-white/5 text-sm'>
            {transactions.map((tx) => {
              const isPositive = tx.amount > 0;
              return (
                <tr key={tx.id} className='hover:bg-white/[0.02] transition-colors'>
                  <td className='py-3.5 px-4 shrink-0'>
                    {getTypeBadge(tx.type, tx.amount)}
                  </td>
                  <td className='py-3.5 px-4 text-zinc-200 font-medium max-w-[240px] truncate' title={tx.description}>
                    {tx.description}
                  </td>
                  <td className='py-3.5 px-4 text-xs text-zinc-400 whitespace-nowrap'>
                    {formatDate(tx.createdAt)}
                  </td>
                  <td className={`py-3.5 px-4 text-right font-extrabold whitespace-nowrap ${
                    isPositive ? 'text-emerald-400' : 'text-zinc-300'
                  }`}>
                    {isPositive ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()} pts
                  </td>
                  <td className='py-3.5 px-4 text-right text-zinc-400 font-mono text-xs whitespace-nowrap'>
                    {tx.balanceAfter.toLocaleString()} pts
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar if more than 1 page */}
      {totalPages > 1 && (
        <div className='flex items-center justify-between px-2 text-xs text-zinc-400'>
          <span>Showing page {page} of {totalPages} ({totalCount} total events)</span>
          <div className='flex items-center gap-1.5'>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className='p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-white cursor-pointer'>
              <ChevronLeft size={16} />
            </button>
            <span className='px-2 font-bold text-white'>{page}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className='p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-white cursor-pointer'>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
