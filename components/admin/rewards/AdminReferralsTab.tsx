'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Eye, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Loader2, 
  Filter,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useAdminReferrals } from '@/lib/api/services/admin-rewards.hooks';
import { adminRewardsService } from '@/lib/api/services/admin-rewards.service';
import { useToast } from '@/hooks/use-toast';

interface AdminReferralsTabProps {
  onViewDetail: (id: string) => void;
}

const STORAGE_KEY = 'admin_referrals_filters_v1';

export function AdminReferralsTab({ onViewDetail }: AdminReferralsTabProps) {
  const { toast } = useToast();

  const getSavedFilters = () => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const initialFilters = getSavedFilters();

  const [page, setPage] = useState<number>(initialFilters?.page || 1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState<string>(initialFilters?.search || '');
  const [status, setStatus] = useState<'ALL' | 'COMPLETED' | 'PENDING' | 'REJECTED'>(initialFilters?.status || 'ALL');
  const [dateFrom, setDateFrom] = useState<string>(initialFilters?.dateFrom || '');
  const [dateTo, setDateTo] = useState<string>(initialFilters?.dateTo || '');
  const [isExporting, setIsExporting] = useState(false);

  // Sync filters to sessionStorage on change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ page, search, status, dateFrom, dateTo })
      );
    } catch (e) {
      console.error('Failed to save referral filters', e);
    }
  }, [page, search, status, dateFrom, dateTo]);

  const { data, isLoading, isFetching, refetch } = useAdminReferrals({
    page,
    pageSize,
    status: status === 'ALL' ? undefined : status,
    search: search.trim() || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const referrals = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      await adminRewardsService.downloadReferralsCsv();
      toast({
        title: 'Export Complete',
        description: 'Referrals CSV downloaded successfully.',
      });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: err?.message || 'Could not download referrals CSV.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusBadge = (referralStatus: string) => {
    switch (referralStatus) {
      case 'COMPLETED':
        return (
          <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'>
            <CheckCircle2 size={11} />
            Completed
          </span>
        );
      case 'PENDING':
        return (
          <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'>
            <Clock size={11} />
            Pending
          </span>
        );
      case 'REJECTED':
        return (
          <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'>
            <XCircle size={11} />
            Flagged
          </span>
        );
      default:
        return (
          <span className='inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'>
            {referralStatus}
          </span>
        );
    }
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return '—';
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      {/* Search, Filter & Export Controls */}
      <div className='p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 max-w-full overflow-hidden'>
        {/* Search Bar */}
        <div className='relative flex-1 min-w-[200px]'>
          <Search size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' />
          <input
            type='text'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder='Search code, referrer or referee name / email...'
            className='w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:border-[#fbbe15]'
          />
        </div>

        {/* Filters and Date Row: horizontally scrollable without overlapping */}
        <div className='flex items-center gap-3 overflow-x-auto scrollbar-thin pb-1 xl:pb-0 max-w-full'>
          {/* Status Filter Buttons */}
          <div className='flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl shrink-0'>
            {(['ALL', 'COMPLETED', 'PENDING', 'REJECTED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatus(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border-none whitespace-nowrap shrink-0 ${
                  status === st
                    ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white bg-transparent'
                }`}>
                {st === 'ALL' ? 'All' : st === 'COMPLETED' ? 'Completed' : st === 'PENDING' ? 'Pending' : 'Flagged'}
              </button>
            ))}
          </div>

          {/* Date Filter */}
          <div className='flex items-center gap-2 shrink-0'>
            <input
              type='date'
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className='px-2.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 focus:outline-hidden shrink-0'
            />
            <span className='text-xs text-gray-400 shrink-0'>to</span>
            <input
              type='date'
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className='px-2.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 focus:outline-hidden shrink-0'
            />
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className='px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 border-none shrink-0'>
            {isExporting ? <Loader2 size={13} className='animate-spin' /> : <Download size={13} />}
            Export CSV
          </button>
        </div>
      </div>

      {/* Referrals Table Container */}
      <div className='rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs border-collapse'>
            <thead>
              <tr className='bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-gray-500 font-bold uppercase tracking-wider text-[11px]'>
                <th className='py-3.5 px-5'>Code</th>
                <th className='py-3.5 px-4'>Referrer</th>
                <th className='py-3.5 px-4'>Referee</th>
                <th className='py-3.5 px-4'>Status</th>
                <th className='py-3.5 px-4'>Reward Points</th>
                <th className='py-3.5 px-4'>Device / IP</th>
                <th className='py-3.5 px-4'>Date</th>
                <th className='py-3.5 px-5 text-right'>Action</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-100 dark:divide-gray-800/80'>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className='py-16 text-center text-gray-500'>
                    <Loader2 className='w-6 h-6 animate-spin text-[#fbbe15] mx-auto mb-2' />
                    Loading referrals records...
                  </td>
                </tr>
              ) : referrals.length === 0 ? (
                <tr>
                  <td colSpan={8} className='py-16 text-center text-gray-400'>
                    No referral entries matched your criteria.
                  </td>
                </tr>
              ) : (
                referrals.map((item) => (
                  <tr
                    key={item.id}
                    className='hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors'>
                    {/* Referral Code */}
                    <td className='py-3.5 px-5 font-mono font-bold text-[#b8860b] dark:text-[#fbbe15]'>
                      {item.code}
                    </td>

                    {/* Referrer */}
                    <td className='py-3.5 px-4'>
                      <div className='flex flex-col'>
                        <span className='font-bold text-gray-900 dark:text-white'>
                          {item.referrer?.fullName || item.referrerId?.slice(0, 8) || '—'}
                        </span>
                        <span className='text-[11px] text-gray-400 font-mono'>
                          {item.referrer?.email || ''}
                        </span>
                      </div>
                    </td>

                    {/* Referee */}
                    <td className='py-3.5 px-4'>
                      <div className='flex flex-col'>
                        <span className='font-bold text-gray-900 dark:text-white'>
                          {item.referee?.fullName || item.refereeId?.slice(0, 8) || '—'}
                        </span>
                        <span className='text-[11px] text-gray-400 font-mono'>
                          {item.referee?.email || ''}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className='py-3.5 px-4'>
                      {getStatusBadge(item.status)}
                    </td>

                    {/* Reward Points */}
                    <td className='py-3.5 px-4'>
                      <span className='font-bold text-emerald-600 dark:text-emerald-400'>
                        +{item.referrerRewardPoints || 50} pts
                      </span>
                      <span className='text-gray-400 text-[10px] ml-1'>
                        / +{item.refereeRewardPoints || 20} pts
                      </span>
                    </td>

                    {/* Device / IP */}
                    <td className='py-3.5 px-4 font-mono text-[11px] text-gray-500'>
                      <div className='truncate max-w-[130px]' title={item.refereeDeviceId || ''}>
                        {item.refereeDeviceId ? 'Dev: ' + item.refereeDeviceId.slice(0, 10) + '...' : item.refereeSignupIp || '—'}
                      </div>
                    </td>

                    {/* Date */}
                    <td className='py-3.5 px-4 text-gray-500 whitespace-nowrap'>
                      {formatDate(item.createdAt)}
                    </td>

                    {/* Action */}
                    <td className='py-3.5 px-5 text-right'>
                      <button
                        onClick={() => onViewDetail(item.id)}
                        className='p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer border-none'
                        title='View Audit Details'>
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Bar */}
        <div className='px-5 py-3.5 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500'>
          <span>
            Showing <strong>{referrals.length}</strong> of <strong>{total}</strong> entries
          </span>

          <div className='flex items-center gap-2'>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
              className='p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed'>
              <ChevronLeft size={15} />
            </button>

            <span className='font-semibold px-2'>
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isLoading}
              className='p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed'>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
