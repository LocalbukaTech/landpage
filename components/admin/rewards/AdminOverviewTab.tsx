'use client';

import { 
  Users, 
  Coins, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowUpRight,
  Wallet,
  Loader2,
  Tag,
  Plus,
  Award
} from 'lucide-react';
import { 
  useAdminRewardsOverview, 
  useAdminTransactions 
} from '@/lib/api/services/admin-rewards.hooks';
import { 
  AdminTrendAreaChart, 
  AdminStatusDonutChart, 
  AdminPointsFlowBarChart 
} from './charts';

interface AdminOverviewTabProps {
  onOpenAdjustModal: (userId?: string, userName?: string) => void;
  onOpenVanityModal: (userId?: string, userName?: string) => void;
  onViewAllReferrals: () => void;
  onViewFlagged: () => void;
  onViewLedger?: () => void;
}

export function AdminOverviewTab({
  onOpenAdjustModal,
  onOpenVanityModal,
  onViewAllReferrals,
  onViewFlagged,
  onViewLedger,
}: AdminOverviewTabProps) {
  const { data: overview, isLoading, error, refetch } = useAdminRewardsOverview();
  const { data: txData } = useAdminTransactions({ pageSize: 12 });

  if (isLoading) {
    return (
      <div className='py-24 flex flex-col items-center justify-center text-center'>
        <Loader2 className='w-8 h-8 animate-spin text-[#fbbe15] mb-3' />
        <p className='text-sm text-gray-500'>Loading Rewards System metrics...</p>
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className='p-8 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-center flex flex-col items-center'>
        <ShieldAlert size={32} className='text-rose-500 mb-2' />
        <h4 className='text-base font-bold text-gray-900 dark:text-white m-0'>
          Failed to load rewards overview
        </h4>
        <p className='text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4'>
          Could not fetch administrative metrics from server.
        </p>
        <button
          onClick={() => refetch()}
          className='px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer border-none'>
          Retry
        </button>
      </div>
    );
  }

  const nairaCirculation = Math.floor((overview.totalPointsInCirculation || 0) / 2);
  const totalPointsEverEarnedNaira = Math.floor((overview.totalPointsEverEarned || 0) / 2);

  return (
    <div className='flex flex-col gap-6'>
      {/* ── 1. Top Level Metric Cards ── */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
        {/* Card 1: Total Referrals */}
        <div className='p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-bold uppercase tracking-wider text-gray-500'>
              Total Referrals
            </span>
            <div className='w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center'>
              <Users size={18} />
            </div>
          </div>

          <div className='mt-4'>
            <span className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white'>
              {(overview.totalReferrals || 0).toLocaleString()}
            </span>
            <div className='flex items-center gap-2.5 mt-2 text-[11px]'>
              <span className='text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1'>
                <CheckCircle2 size={11} /> {overview.completedReferrals || 0}
              </span>
              <span className='text-amber-500 font-semibold flex items-center gap-1'>
                <Clock size={11} /> {overview.pendingReferrals || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Points Ever Earned */}
        <div className='p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-bold uppercase tracking-wider text-gray-500'>
              Ever Earned
            </span>
            <div className='w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center'>
              <Award size={18} />
            </div>
          </div>

          <div className='mt-4'>
            <span className='text-2xl sm:text-3xl font-extrabold text-[#b8860b] dark:text-[#fbbe15]'>
              {(overview.totalPointsEverEarned || 0).toLocaleString()}
              <span className='text-xs font-medium text-gray-500 ml-1'>pts</span>
            </span>
            <p className='text-[11px] text-gray-500 mt-2 m-0 truncate'>
              Value: <strong className='text-gray-900 dark:text-white'>≈ ₦{totalPointsEverEarnedNaira.toLocaleString()}</strong>
            </p>
          </div>
        </div>

        {/* Card 3: Points in Circulation */}
        <div className='p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-bold uppercase tracking-wider text-gray-500'>
              In Circulation
            </span>
            <div className='w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center'>
              <Coins size={18} />
            </div>
          </div>

          <div className='mt-4'>
            <span className='text-2xl sm:text-3xl font-extrabold text-[#b8860b] dark:text-[#fbbe15]'>
              {(overview.totalPointsInCirculation || 0).toLocaleString()}
              <span className='text-xs font-medium text-gray-500 ml-1'>pts</span>
            </span>
            <p className='text-[11px] text-gray-500 mt-2 m-0 truncate'>
              Liability: <strong className='text-gray-900 dark:text-white'>₦{nairaCirculation.toLocaleString()}</strong>
            </p>
          </div>
        </div>

        {/* Card 4: Total Points Redeemed */}
        <div className='p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-bold uppercase tracking-wider text-gray-500'>
              Cash Redeemed
            </span>
            <div className='w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center'>
              <Wallet size={18} />
            </div>
          </div>

          <div className='mt-4'>
            <span className='text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400'>
              ₦{(overview.totalNairaEquivalentRedeemed || 0).toLocaleString()}
            </span>
            <p className='text-[11px] text-gray-500 mt-2 m-0 truncate'>
              {(overview.totalPointsRedeemed || 0).toLocaleString()} pts converted
            </p>
          </div>
        </div>

        {/* Card 5: Conversion Rate & Fraud */}
        <div className='p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-bold uppercase tracking-wider text-gray-500'>
              Conversion
            </span>
            <div className='w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center'>
              <TrendingUp size={18} />
            </div>
          </div>

          <div className='mt-4'>
            <span className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white'>
              {overview.conversionRate || '0%'}
            </span>
            <div className='flex items-center justify-between mt-2 text-[11px]'>
              <span className='text-gray-500 truncate'>
                Avg {overview.averageReferralsPerUser || 0}/user
              </span>
              {(overview.fraudFlaggedCount || 0) > 0 && (
                <button
                  onClick={onViewFlagged}
                  className='text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-1 border-none bg-transparent p-0 cursor-pointer shrink-0'>
                  <ShieldAlert size={11} /> {overview.fraudFlaggedCount}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Primary Charts Row: Area Trend (7 cols) & Status Donut (5 cols) ── */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        {/* Left: Transaction Trend Line Chart */}
        <div className='lg:col-span-7'>
          <AdminTrendAreaChart
            transactions={txData?.data || []}
            onViewLedger={onViewLedger}
          />
        </div>

        {/* Right: Status Distribution Donut Chart */}
        <div className='lg:col-span-5'>
          <AdminStatusDonutChart
            completed={overview.completedReferrals}
            pending={overview.pendingReferrals}
            rejected={overview.fraudFlaggedCount || overview.rejectedReferrals}
            total={overview.totalReferrals}
            conversionRate={overview.conversionRate}
            onViewFlagged={onViewFlagged}
          />
        </div>
      </div>

      {/* ── 3. Secondary Analytics Row: Points Flow Bar Chart & Top Promoters ── */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        {/* Left (5 cols): Points Flow Comparative Bars */}
        <div className='lg:col-span-5'>
          <AdminPointsFlowBarChart
            totalEverEarned={overview.totalPointsEverEarned}
            inCirculation={overview.totalPointsInCirculation}
            totalRedeemed={overview.totalPointsRedeemed}
            onOpenAdjustModal={() => onOpenAdjustModal()}
          />
        </div>

        {/* Right (7 cols): Top Promoters Leaderboard */}
        <div className='lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex flex-col justify-between'>
          <div>
            <div className='flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800'>
              <div>
                <h4 className='text-sm font-bold text-gray-900 dark:text-white m-0'>
                  Top Promoters &amp; Referrers
                </h4>
                <p className='text-xs text-gray-500 mt-0.5 m-0'>
                  Leading community drivers with quick admin action tools
                </p>
              </div>
              <button
                onClick={onViewAllReferrals}
                className='text-xs font-bold text-[#b8860b] dark:text-[#fbbe15] hover:underline flex items-center gap-1 border-none bg-transparent cursor-pointer'>
                Full List <ArrowUpRight size={13} />
              </button>
            </div>

            <div className='flex flex-col divide-y divide-gray-100 dark:divide-gray-800 mt-2 max-h-[220px] overflow-y-auto'>
              {overview.topReferrers && overview.topReferrers.length > 0 ? (
                overview.topReferrers.slice(0, 6).map((promoter, index) => (
                  <div
                    key={promoter.userId}
                    className='py-3 flex items-center justify-between gap-3 group'>
                    <div className='flex items-center gap-3 min-w-0'>
                      <div className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                        index === 0
                          ? 'bg-[#fbbe15]/20 text-[#b8860b] dark:text-[#fbbe15]'
                          : index === 1
                          ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                          : index === 2
                          ? 'bg-amber-700/20 text-amber-700 dark:text-amber-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                      }`}>
                        #{index + 1}
                      </div>
                      <div className='flex flex-col min-w-0'>
                        <span className='text-xs font-bold text-gray-900 dark:text-white truncate'>
                          {promoter.fullName}
                        </span>
                        <span className='text-[11px] text-gray-500 truncate'>
                          {promoter.email}
                        </span>
                      </div>
                    </div>

                    <div className='flex items-center gap-2.5 shrink-0'>
                      <span className='text-xs font-extrabold text-emerald-600 dark:text-emerald-400'>
                        {promoter.completedReferrals} refs
                      </span>

                      {/* Fast Action Buttons */}
                      <div className='flex items-center gap-1 opacity-80 group-hover:opacity-100'>
                        <button
                          title='Grant Vanity Code'
                          onClick={() => onOpenVanityModal(promoter.userId, promoter.fullName)}
                          className='p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-600 dark:text-amber-400 border-none cursor-pointer'>
                          <Tag size={13} />
                        </button>

                        <button
                          title='Adjust Points'
                          onClick={() => onOpenAdjustModal(promoter.userId, promoter.fullName)}
                          className='p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 border-none cursor-pointer'>
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='py-8 text-center text-xs text-gray-400'>
                  No promoter rankings yet.
                </div>
              )}
            </div>
          </div>

          {/* Quick Summary Strip */}
          <div className='mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-500'>
            <span>Registered Platform Users: <strong>{(overview.totalRegisteredUsers || 0).toLocaleString()}</strong></span>
            <span>Reward Rule: <strong>50 pts / referral</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
