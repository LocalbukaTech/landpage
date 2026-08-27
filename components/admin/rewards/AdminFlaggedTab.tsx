'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Eye, 
  Loader2, 
  ChevronLeft, 
  ChevronRight,
  Monitor,
  Globe,
  AlertTriangle
} from 'lucide-react';
import { useAdminFlagged } from '@/lib/api/services/admin-rewards.hooks';

interface AdminFlaggedTabProps {
  onViewDetail: (id: string) => void;
  onOpenAdjustModal: (userId?: string, userName?: string) => void;
}

const STORAGE_KEY = 'admin_flagged_filters_v1';

export function AdminFlaggedTab({ onViewDetail, onOpenAdjustModal }: AdminFlaggedTabProps) {
  const getSavedPage = () => {
    if (typeof window === 'undefined') return 1;
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).page || 1 : 1;
    } catch {
      return 1;
    }
  };

  const [page, setPage] = useState<number>(getSavedPage);
  const [pageSize] = useState(20);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ page }));
    } catch (e) {
      console.error(e);
    }
  }, [page]);

  const { data, isLoading } = useAdminFlagged({ page, pageSize });

  const flaggedItems = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return '—';
    try {
      return new Date(isoString).toLocaleString('en-US', {
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

  return (
    <div className='flex flex-col gap-6'>
      {/* Alert Header Banner */}
      <div className='p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-start sm:items-center justify-between gap-4'>
        <div className='flex items-start sm:items-center gap-3.5'>
          <div className='w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0'>
            <ShieldAlert size={20} />
          </div>
          <div>
            <h4 className='text-sm font-bold text-rose-900 dark:text-rose-200 m-0'>
              Fraud Review &amp; Abuse Prevention Queue
            </h4>
            <p className='text-xs text-rose-700 dark:text-rose-300 mt-0.5 m-0'>
              Referrals automatically rejected or flagged due to self-referral, daily velocity limits, IP clustering, or device emulation.
            </p>
          </div>
        </div>

        <span className='px-3 py-1.5 rounded-xl bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300 shrink-0'>
          {total} Flagged Records
        </span>
      </div>

      {/* Flagged Records Table */}
      <div className='rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs border-collapse'>
            <thead>
              <tr className='bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-gray-500 font-bold uppercase tracking-wider text-[11px]'>
                <th className='py-3.5 px-5'>Timestamp</th>
                <th className='py-3.5 px-4'>Code</th>
                <th className='py-3.5 px-4'>Referrer</th>
                <th className='py-3.5 px-4'>Target Referee</th>
                <th className='py-3.5 px-4'>Security Signals</th>
                <th className='py-3.5 px-5'>Rejection Reason</th>
                <th className='py-3.5 px-5 text-right'>Action</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-100 dark:divide-gray-800/80'>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className='py-16 text-center text-gray-500'>
                    <Loader2 className='w-6 h-6 animate-spin text-[#fbbe15] mx-auto mb-2' />
                    Scanning fraud audit records...
                  </td>
                </tr>
              ) : flaggedItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className='py-16 text-center text-gray-400'>
                    <div className='flex flex-col items-center justify-center gap-1.5'>
                      <span className='text-sm font-bold text-gray-700 dark:text-gray-300'>All Clear</span>
                      <span>No flagged or fraudulent referral activity detected.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                flaggedItems.map((item) => (
                  <tr
                    key={item.id}
                    className='hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors'>
                    {/* Timestamp */}
                    <td className='py-3.5 px-5 text-gray-500 whitespace-nowrap font-mono text-[11px]'>
                      {formatDate(item.createdAt)}
                    </td>

                    {/* Code */}
                    <td className='py-3.5 px-4 font-mono font-bold text-rose-600 dark:text-rose-400'>
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

                    {/* Device / IP */}
                    <td className='py-3.5 px-4 font-mono text-[11px] text-gray-500'>
                      <div className='flex flex-col gap-0.5'>
                        {item.refereeDeviceId && (
                          <span className='flex items-center gap-1 text-gray-600 dark:text-gray-400 truncate max-w-[140px]' title={item.refereeDeviceId}>
                            <Monitor size={11} className='shrink-0' /> {item.refereeDeviceId.slice(0, 12)}...
                          </span>
                        )}
                        {item.refereeSignupIp && (
                          <span className='flex items-center gap-1 text-gray-500'>
                            <Globe size={11} className='shrink-0' /> {item.refereeSignupIp}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Rejection Reason */}
                    <td className='py-3.5 px-5'>
                      <div className='p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-medium max-w-sm'>
                        {item.rejectionReason || 'Violated security verification policy'}
                      </div>
                    </td>

                    {/* Action */}
                    <td className='py-3.5 px-5 text-right'>
                      <div className='flex items-center justify-end gap-1.5'>
                        <button
                          onClick={() => onViewDetail(item.id)}
                          className='p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer border-none'
                          title='View Audit Details'>
                          <Eye size={15} />
                        </button>
                      </div>
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
            Showing <strong>{flaggedItems.length}</strong> of <strong>{total}</strong> entries
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
