'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, CheckCircle2, Clock, XCircle, ShieldAlert } from 'lucide-react';

interface AdminStatusDonutChartProps {
  completed?: number;
  pending?: number;
  rejected?: number;
  total?: number;
  conversionRate?: string;
  onViewFlagged?: () => void;
}

export function AdminStatusDonutChart({
  completed = 0,
  pending = 0,
  rejected = 0,
  total = 0,
  conversionRate: _conversionRate,
  onViewFlagged,
}: AdminStatusDonutChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const safeTotal = Math.max(1, total || (completed + pending + rejected));
  
  const segments = [
    {
      id: 'completed',
      label: 'Completed',
      count: completed,
      color: '#10b981', // Emerald
      icon: CheckCircle2,
      percent: Math.round((completed / safeTotal) * 100),
    },
    {
      id: 'pending',
      label: 'Pending',
      count: pending,
      color: '#f59e0b', // Amber
      icon: Clock,
      percent: Math.round((pending / safeTotal) * 100),
    },
    {
      id: 'rejected',
      label: 'Flagged/Rejected',
      count: rejected,
      color: '#f43f5e', // Rose
      icon: XCircle,
      percent: Math.round((rejected / safeTotal) * 100),
    },
  ];

  // SVG Donut calculation
  const radius = 58;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;

  // Compute strokeDasharray & strokeDashoffset for each segment
  let accumulatedPercent = 0;
  const segmentsWithAngles = segments.map((seg) => {
    const strokeDasharray = `${(seg.count / safeTotal) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += (seg.count / safeTotal) * 100;
    return {
      ...seg,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className='p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between h-full'>
      {/* Header */}
      <div className='flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800'>
        <div className='flex items-center gap-2.5'>
          <div className='w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center'>
            <PieChart size={16} />
          </div>
          <div>
            <h4 className='text-sm font-bold text-gray-900 dark:text-white m-0'>
              Referral Distribution
            </h4>
            <p className='text-xs text-gray-500 mt-0.5 m-0'>
              Pipeline health &amp; conversion breakdown
            </p>
          </div>
        </div>
      </div>

      {/* Donut Chart Visual & Legend */}
      <div className='flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6 my-2 flex-1'>
        {/* SVG Animated Donut */}
        <div className='relative w-[130px] h-[130px] sm:w-[140px] sm:h-[140px] flex items-center justify-center shrink-0'>
          <svg viewBox='0 0 160 160' className='w-full h-full -rotate-90'>
            {/* Background circle track */}
            <circle
              cx='80'
              cy='80'
              r={radius}
              fill='transparent'
              stroke='currentColor'
              strokeWidth={strokeWidth}
              className='text-gray-100 dark:text-gray-800'
            />

            {/* Segments */}
            {segmentsWithAngles.map((seg) => (
              <motion.circle
                key={seg.id}
                cx='80'
                cy='80'
                r={radius}
                fill='transparent'
                stroke={seg.color}
                strokeWidth={hoveredSegment === seg.id ? strokeWidth + 3 : strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap='round'
                className='transition-all duration-300 cursor-pointer'
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: seg.strokeDashoffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                onMouseEnter={() => setHoveredSegment(seg.id)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            ))}
          </svg>

          {/* Center Info Display */}
          <div className='absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none'>
            <span className='text-lg sm:text-xl font-black text-gray-900 dark:text-white leading-none'>
              {total.toLocaleString()}
            </span>
            <span className='text-[9px] uppercase tracking-wider font-bold text-gray-400 mt-1'>
              Invites
            </span>
          </div>
        </div>

        {/* Legend / Breakdown List */}
        <div className='flex flex-col gap-2 w-full sm:w-auto flex-1 min-w-0'>
          {segments.map((seg) => {
            const isHovered = hoveredSegment === seg.id;

            return (
              <div
                key={seg.id}
                onMouseEnter={() => setHoveredSegment(seg.id)}
                onMouseLeave={() => setHoveredSegment(null)}
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                  isHovered
                    ? 'bg-gray-100 dark:bg-gray-800 scale-102'
                    : 'bg-gray-50/70 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800/80'
                }`}>
                <div className='flex items-center gap-2 min-w-0'>
                  <div
                    className='w-2 h-2 rounded-full shrink-0'
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className='text-xs font-semibold text-gray-700 dark:text-gray-300 truncate'>
                    {seg.label}
                  </span>
                </div>

                <div className='flex items-baseline gap-1 shrink-0'>
                  <span className='text-xs font-extrabold text-gray-900 dark:text-white'>
                    {seg.count.toLocaleString()}
                  </span>
                  <span className='text-[10px] text-gray-400 font-mono'>
                    ({seg.percent}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sub-Action if Flagged exists */}
      {rejected > 0 && onViewFlagged && (
        <div className='pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs'>
          <span className='text-rose-500 font-medium flex items-center gap-1.5'>
            <ShieldAlert size={13} /> {rejected} suspicious referral attempts
          </span>
          <button
            onClick={onViewFlagged}
            className='text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer border-none bg-transparent p-0'>
            Review →
          </button>
        </div>
      )}
    </div>
  );
}
