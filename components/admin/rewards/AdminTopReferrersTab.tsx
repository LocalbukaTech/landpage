'use client';

import { useState } from 'react';
import { 
  Trophy, 
  Tag, 
  Plus, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  Coins, 
  ArrowUpRight 
} from 'lucide-react';
import { useAdminTopReferrers } from '@/lib/api/services/admin-rewards.hooks';

interface AdminTopReferrersTabProps {
  onOpenAdjustModal: (userId: string, userName: string) => void;
  onOpenVanityModal: (userId: string, userName: string) => void;
}

export function AdminTopReferrersTab({
  onOpenAdjustModal,
  onOpenVanityModal,
}: AdminTopReferrersTabProps) {
  const [limit, setLimit] = useState(50);
  const { data: promoters, isLoading } = useAdminTopReferrers(limit);

  return (
    <div className='flex flex-col gap-6'>
      {/* Header Banner */}
      <div className='p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='flex items-center gap-3.5'>
          <div className='w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0'>
            <Trophy size={22} />
          </div>
          <div>
            <h3 className='text-base font-bold text-gray-900 dark:text-white m-0'>
              Promoter Rankings &amp; Creator Intelligence
            </h3>
            <p className='text-xs text-gray-500 mt-0.5 m-0'>
              Top platform promoters ranked by successful member acquisitions, conversion performance, and rewards
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2 shrink-0'>
          <span className='text-xs text-gray-500 font-semibold'>Display:</span>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className='px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-900 dark:text-white focus:outline-hidden'>
            <option value={20}>Top 20</option>
            <option value={50}>Top 50</option>
            <option value={100}>Top 100</option>
          </select>
        </div>
      </div>

      {/* Promoters Table */}
      <div className='rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs border-collapse'>
            <thead>
              <tr className='bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-gray-500 font-bold uppercase tracking-wider text-[11px]'>
                <th className='py-3.5 px-5'>Rank</th>
                <th className='py-3.5 px-4'>Promoter</th>
                <th className='py-3.5 px-4'>Referral Code</th>
                <th className='py-3.5 px-4'>Vanity Code</th>
                <th className='py-3.5 px-4'>Total / Completed</th>
                <th className='py-3.5 px-4'>Lifetime Earned</th>
                <th className='py-3.5 px-4'>Current Points</th>
                <th className='py-3.5 px-5 text-right'>Admin Actions</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-100 dark:divide-gray-800/80'>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className='py-16 text-center text-gray-500'>
                    <Loader2 className='w-6 h-6 animate-spin text-[#fbbe15] mx-auto mb-2' />
                    Loading promoter performance metrics...
                  </td>
                </tr>
              ) : !promoters || promoters.length === 0 ? (
                <tr>
                  <td colSpan={8} className='py-16 text-center text-gray-400'>
                    No promoter ranking data available.
                  </td>
                </tr>
              ) : (
                promoters.map((promoter, index) => (
                  <tr
                    key={promoter.userId}
                    className='hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors'>
                    {/* Rank */}
                    <td className='py-3.5 px-5'>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs ${
                          index === 0
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : index === 1
                            ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            : index === 2
                            ? 'bg-amber-900/10 text-amber-900 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'text-gray-500'
                        }`}>
                        #{index + 1}
                      </div>
                    </td>

                    {/* Promoter */}
                    <td className='py-3.5 px-4'>
                      <div className='flex flex-col'>
                        <span className='font-bold text-gray-900 dark:text-white'>
                          {promoter.fullName}
                        </span>
                        <span className='text-[11px] text-gray-400 font-mono'>
                          {promoter.email}
                        </span>
                      </div>
                    </td>

                    {/* Code */}
                    <td className='py-3.5 px-4 font-mono font-bold text-gray-900 dark:text-white'>
                      {promoter.referralCode || '—'}
                    </td>

                    {/* Vanity Code */}
                    <td className='py-3.5 px-4'>
                      {promoter.vanityCode ? (
                        <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-mono'>
                          <Tag size={10} /> {promoter.vanityCode}
                        </span>
                      ) : (
                        <span className='text-gray-400'>None</span>
                      )}
                    </td>

                    {/* Referrals Count */}
                    <td className='py-3.5 px-4'>
                      <div className='flex items-center gap-2'>
                        <span className='font-extrabold text-emerald-600 dark:text-emerald-400'>
                          {promoter.completedReferrals}
                        </span>
                        <span className='text-gray-400 text-[11px]'>
                          / {promoter.totalReferrals || promoter.completedReferrals} total
                        </span>
                      </div>
                    </td>

                    {/* Lifetime Earned */}
                    <td className='py-3.5 px-4 font-bold text-gray-900 dark:text-white'>
                      {(promoter.lifetimeEarned || promoter.completedReferrals * 50).toLocaleString()} pts
                    </td>

                    {/* Current Points */}
                    <td className='py-3.5 px-4 font-bold text-[#b8860b] dark:text-[#fbbe15]'>
                      {(promoter.currentPoints ?? 0).toLocaleString()} pts
                    </td>

                    {/* Actions */}
                    <td className='py-3.5 px-5 text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <button
                          onClick={() => onOpenVanityModal(promoter.userId, promoter.fullName)}
                          className='px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-semibold text-[11px] flex items-center gap-1 border-none cursor-pointer'>
                          <Tag size={12} /> Vanity
                        </button>

                        <button
                          onClick={() => onOpenAdjustModal(promoter.userId, promoter.fullName)}
                          className='px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold text-[11px] flex items-center gap-1 border-none cursor-pointer'>
                          <Plus size={12} /> Adjust
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
