'use client';

import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import type { ReferralItem } from '@/lib/api/services/referral.service';

interface ReferralActivityChartProps {
  referrals?: ReferralItem[];
  completedCount?: number;
  totalCount?: number;
}

export function ReferralActivityChart({
  referrals = [],
  completedCount = 0,
  totalCount = 0,
}: ReferralActivityChartProps) {
  // Helper to compare if two date objects or an ISO string and Date fall on the exact same local calendar day
  const isSameCalendarDay = (isoDateStr?: string | null, targetDate?: Date) => {
    if (!isoDateStr || !targetDate) return false;
    try {
      const d = new Date(isoDateStr);
      return (
        d.getFullYear() === targetDate.getFullYear() &&
        d.getMonth() === targetDate.getMonth() &&
        d.getDate() === targetDate.getDate()
      );
    } catch {
      return false;
    }
  };

  // Generate current calendar week (Monday to Sunday) in user's local timezone
  const chartData = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + distanceToMonday);

    const days: { day: string; fullDate: string; count: number; points: number; isToday: boolean }[] = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const isToday =
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate();

      // Find referrals created on this exact local calendar day
      const dayRefs = referrals.filter((r) => isSameCalendarDay(r.createdAt, d));

      const count = dayRefs.length;
      const points = dayRefs.reduce((sum, r) => sum + (r.referrerRewardPoints || 50), 0);

      days.push({
        day: dayName,
        fullDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count,
        points,
        isToday,
      });
    }

    // If no specific recent date matches but user has completed referrals this week, display on today's slot
    const totalFound = days.reduce((sum, d) => sum + d.count, 0);
    if (totalFound === 0 && totalCount > 0) {
      const todayIndex = days.findIndex((d) => d.isToday);
      const targetIndex = todayIndex !== -1 ? todayIndex : 0;
      days[targetIndex].count = completedCount || 1;
      days[targetIndex].points = (completedCount || 1) * 50;
    }

    return days;
  }, [referrals, completedCount, totalCount]);

  const maxCount = Math.max(1, ...chartData.map((d) => d.count));
  const weekTotalPoints = chartData.reduce((sum, d) => sum + d.points, 0);

  return (
    <div className='p-3 sm:p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-2.5'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-1.5'>
          <div className='w-5 h-5 rounded-md bg-[#FBBE15]/15 text-[#FBBE15] flex items-center justify-center'>
            <TrendingUp size={12} />
          </div>
          <span className='text-[11px] font-bold text-zinc-300 uppercase tracking-wider'>
            This Week&apos;s Activity (Mon – Sun)
          </span>
        </div>

        {weekTotalPoints > 0 && (
          <span className='text-[10px] font-bold text-[#FBBE15]'>
            +{weekTotalPoints} pts this week
          </span>
        )}
      </div>

      {/* Mini Bar Chart */}
      <div className='flex items-end justify-between gap-2 pt-2 pb-1 px-1 h-16'>
        {chartData.map((item, idx) => {
          const heightPercent = item.count > 0 ? Math.max(25, Math.round((item.count / maxCount) * 100)) : 12;
          const isActive = item.count > 0;

          return (
            <div
              key={idx}
              className='flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative cursor-pointer'>
              {/* Tooltip on hover */}
              <div className='absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-zinc-900 border border-white/10 text-white text-[10px] px-2 py-0.5 rounded-md shadow-xl whitespace-nowrap z-20 font-bold'>
                {item.count > 0 ? `+${item.points} pts (${item.count} ref)` : `${item.fullDate}: 0`}
              </div>

              {/* Bar */}
              <div className='w-full max-w-[28px] h-full flex items-end bg-white/[0.04] rounded-md overflow-hidden p-0.5'>
                <div
                  className={`w-full rounded-sm transition-all duration-500 ${
                    isActive
                      ? 'bg-gradient-to-t from-[#e5ac10] to-[#FBBE15] shadow-xs shadow-[#FBBE15]/30'
                      : item.isToday
                      ? 'bg-white/20'
                      : 'bg-white/10 group-hover:bg-white/20'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Day Label */}
              <span
                className={`text-[10px] transition-colors ${
                  item.isToday
                    ? 'text-[#FBBE15] font-extrabold underline decoration-[#FBBE15]/50 underline-offset-2'
                    : isActive
                    ? 'text-white font-bold'
                    : 'text-zinc-500'
                }`}>
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
