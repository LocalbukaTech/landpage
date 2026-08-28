'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import type { AdminTransactionItem } from '@/lib/api/services/admin-rewards.service';

interface AdminTrendAreaChartProps {
  transactions?: AdminTransactionItem[];
  onViewLedger?: () => void;
}

// 5 Core Transaction Curves (Expired retained in curves if present, but hidden from legend)
const ALL_TRANSACTION_TYPES = [
  { id: 'EARNED', label: 'Earned', color: '#06b6d4', glowId: 'cyanTypeGlow' },
  { id: 'REDEEMED', label: 'Redeemed', color: '#84cc16', glowId: 'limeTypeGlow' },
  { id: 'BONUS', label: 'Bonus', color: '#fbbe15', glowId: 'goldTypeGlow' },
  { id: 'PENALTY', label: 'Penalty', color: '#f43f5e', glowId: 'roseTypeGlow' },
  { id: 'EXPIRED', label: 'Expired', color: '#a855f7', glowId: 'purpleTypeGlow' },
] as const;

// Legend displays only active operational types (excluding Expired)
const LEGEND_TYPES = ALL_TRANSACTION_TYPES.filter((t) => t.id !== 'EXPIRED');

// Catmull-Rom to Cubic Bézier spline curve generator
function getCurvedSplinePath(pts: { x: number; y: number }[]) {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

  let path = `M ${pts[0].x} ${pts[0].y}`;

  for (let i = 0; i < pts.length - 1; i++) {
    const curr = pts[i];
    const next = pts[i + 1];
    const prev = pts[i - 1] || curr;
    const nextNext = pts[i + 2] || next;

    const cp1x = curr.x + (next.x - prev.x) / 3.8;
    const cp1y = curr.y + (next.y - prev.y) / 3.8;

    const cp2x = next.x - (nextNext.x - curr.x) / 3.8;
    const cp2y = next.y - (nextNext.y - curr.y) / 3.8;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }

  return path;
}

export function AdminTrendAreaChart({ transactions = [], onViewLedger }: AdminTrendAreaChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Fallback demo sequence covering transaction types
  const rawList: (Partial<AdminTransactionItem> & { amount: number; balanceAfter: number; createdAt: string })[] =
    transactions && transactions.length > 0
      ? [...transactions].reverse()
      : [
          { id: '1', type: 'EARNED', amount: 50, balanceAfter: 50, description: 'Referral reward', createdAt: '2026-08-26T13:30:00Z' },
          { id: '2', type: 'BONUS', amount: 80, balanceAfter: 130, description: 'Community bonus', createdAt: '2026-08-26T14:10:00Z' },
          { id: '3', type: 'EARNED', amount: 70, balanceAfter: 200, description: 'Referee welcome', createdAt: '2026-08-26T14:45:00Z' },
          { id: '4', type: 'PENALTY', amount: 30, balanceAfter: 170, description: 'Duplicate referral penalty', createdAt: '2026-08-26T15:20:00Z' },
          { id: '5', type: 'REDEEMED', amount: 120, balanceAfter: 50, description: 'Bank payout cashout', createdAt: '2026-08-26T16:00:00Z' },
          { id: '6', type: 'EARNED', amount: 90, balanceAfter: 140, description: 'Influencer promo', createdAt: '2026-08-26T16:40:00Z' },
          { id: '7', type: 'BONUS', amount: 60, balanceAfter: 200, description: 'Milestone bonus', createdAt: '2026-08-26T17:15:00Z' },
        ];

  // Running cumulative volume for each type
  const runningTotals: Record<string, number> = {
    EARNED: 0,
    REDEEMED: 0,
    BONUS: 0,
    PENALTY: 0,
    EXPIRED: 0,
  };

  const steps = rawList.map((tx, idx) => {
    const rawType = (tx.type || 'EARNED').toUpperCase();
    const typeKey = ['EARNED', 'REDEEMED', 'BONUS', 'PENALTY', 'EXPIRED'].includes(rawType)
      ? rawType
      : 'EARNED';

    const amt = Math.abs(tx.amount || 50);
    runningTotals[typeKey] = (runningTotals[typeKey] || 0) + amt;

    // Format unique chronological timeline timestamp for the bottom bar
    let timeLabel = `T${idx + 1}`;
    if (tx.createdAt) {
      try {
        const d = new Date(tx.createdAt);
        timeLabel = d.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
      } catch {
        timeLabel = `T${idx + 1}`;
      }
    }

    return {
      idx,
      id: tx.id || String(idx),
      type: typeKey,
      timeLabel,
      amount: amt,
      description: tx.description || `${typeKey} transaction`,
      date: tx.createdAt,
      snapshots: {
        EARNED: runningTotals.EARNED,
        REDEEMED: runningTotals.REDEEMED,
        BONUS: runningTotals.BONUS,
        PENALTY: runningTotals.PENALTY,
        EXPIRED: runningTotals.EXPIRED,
      },
    };
  });

  const maxVal = Math.max(
    ...steps.flatMap((s) => Object.values(s.snapshots)),
    100
  );
  const minVal = 0;

  const paddingX = 35;
  const paddingY = 28;
  const width = 600;
  const height = 210;

  // Build 5 separate spline point coordinate sets
  const curvesData = ALL_TRANSACTION_TYPES.map((typeObj) => {
    const pts = steps.map((step, idx) => {
      const val = step.snapshots[typeObj.id] || 0;
      const x = paddingX + (idx / Math.max(1, steps.length - 1)) * (width - paddingX * 2);
      const y = height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - paddingY * 2);
      return { x, y, val, type: typeObj.id };
    });

    const path = getCurvedSplinePath(pts);
    return {
      ...typeObj,
      pts,
      path,
      total: runningTotals[typeObj.id] || 0,
    };
  });

  const totalPointsOverall = Object.values(runningTotals).reduce((a, b) => a + b, 0);

  return (
    <div className='p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between relative overflow-visible h-full z-10'>
      {/* ── 1. Clean Non-Overcrowded Header ── */}
      <div className='flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800'>
        <div className='flex items-center gap-2.5'>
          <div className='w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0'>
            <TrendingUp size={16} />
          </div>
          <div>
            <h4 className='text-sm font-bold text-gray-900 dark:text-white m-0'>
              Transaction Types Flow
            </h4>
            <p className='text-xs text-gray-500 mt-0.5 m-0'>
              Comparative velocity across transaction types
            </p>
          </div>
        </div>

        {onViewLedger && (
          <button
            onClick={onViewLedger}
            className='text-xs font-bold text-[#b8860b] dark:text-[#fbbe15] hover:underline flex items-center gap-1 border-none bg-transparent cursor-pointer shrink-0'>
            Ledger <ArrowUpRight size={13} />
          </button>
        )}
      </div>

      {/* ── 2. Compact Legend (Expired Removed) ── */}
      <div className='flex items-center flex-wrap gap-2 pt-3 pb-1'>
        {LEGEND_TYPES.map((type) => {
          const totalVal = runningTotals[type.id] || 0;
          return (
            <div
              key={type.id}
              className='flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60 text-[11px]'>
              <span
                className='w-2 h-2 rounded-full shrink-0 shadow-xs'
                style={{ backgroundColor: type.color }}
              />
              <span className='font-semibold text-gray-700 dark:text-gray-300'>
                {type.label}
              </span>
              <span className='font-mono font-bold text-gray-500 text-[10px]'>
                {totalVal.toLocaleString()}p
              </span>
            </div>
          );
        })}
      </div>

      {/* ── 3. SVG 5-Line Multi-Curve Spline Wave Chart ── */}
      <div className='relative w-full h-[200px] mt-2 overflow-visible'>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className='w-full h-full overflow-visible select-none'
          preserveAspectRatio='none'>
          <defs>
            {curvesData.map((curve) => (
              <filter
                key={curve.glowId}
                id={curve.glowId}
                x='-20%'
                y='-20%'
                width='140%'
                height='140%'>
                <feDropShadow
                  dx='0'
                  dy='2'
                  stdDeviation='3'
                  floodColor={curve.color}
                  floodOpacity='0.45'
                />
              </filter>
            ))}
          </defs>

          {/* Subtle horizontal dashed guide lines */}
          {[0.2, 0.5, 0.8].map((ratio, i) => {
            const y = height - paddingY - ratio * (height - paddingY * 2);
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke='currentColor'
                strokeDasharray='4 4'
                className='text-gray-100 dark:text-gray-800/80 opacity-60'
                strokeWidth='1'
              />
            );
          })}

          {/* 5 Distinct Animated Spline Curves */}
          {curvesData.map((curve, idx) => (
            <motion.path
              key={curve.id}
              d={curve.path}
              fill='none'
              stroke={curve.color}
              strokeWidth='3'
              strokeLinecap='round'
              strokeLinejoin='round'
              filter={`url(#${curve.glowId})`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: 'easeInOut', delay: idx * 0.08 }}
            />
          ))}

          {/* Interactive Step Nodes with Time Labels (No Repeated Types) */}
          {steps.map((step, idx) => {
            const isHovered = hoveredIdx === idx;
            const xPos =
              paddingX + (idx / Math.max(1, steps.length - 1)) * (width - paddingX * 2);

            return (
              <g key={idx}>
                {/* X Axis Timeline Timestamp Label (Non-repeating) */}
                <text
                  x={xPos}
                  y={height - 6}
                  textAnchor='middle'
                  fontSize='10'
                  className={`font-semibold transition-colors ${
                    isHovered
                      ? 'fill-cyan-500 font-bold'
                      : 'fill-gray-400 dark:fill-gray-500'
                  }`}>
                  {step.timeLabel}
                </text>

                {/* Vertical cursor guideline on hover */}
                {isHovered && (
                  <line
                    x1={xPos}
                    y1={paddingY - 5}
                    x2={xPos}
                    y2={height - paddingY}
                    stroke='#06b6d4'
                    strokeDasharray='3 3'
                    strokeWidth='1.5'
                    className='opacity-70'
                  />
                )}

                {/* 5 Curve Dots on Hover */}
                {isHovered &&
                  curvesData.map((curve) => (
                    <circle
                      key={curve.id}
                      cx={xPos}
                      cy={curve.pts[idx]?.y || height - paddingY}
                      r={4.5}
                      fill={curve.color}
                      stroke='#fff'
                      strokeWidth='1.5'
                    />
                  ))}

                {/* Invisible Hover trigger column */}
                <rect
                  x={xPos - 20}
                  y={0}
                  width={40}
                  height={height}
                  fill='transparent'
                  className='cursor-pointer'
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* ── 4. Floating Overall Types Breakdown Overlay (Bounded to Chart Card) ── */}
        {hoveredIdx !== null && steps[hoveredIdx] && (() => {
          const isFarLeft = hoveredIdx <= 1;
          const isFarRight = hoveredIdx >= steps.length - 2;
          const xPercent = ((paddingX + (hoveredIdx / Math.max(1, steps.length - 1)) * (width - paddingX * 2)) / width) * 100;

          const positionStyle = isFarLeft
            ? { left: '10px', top: '-15px', transform: 'none' }
            : isFarRight
            ? { right: '10px', left: 'auto', top: '-15px', transform: 'none' }
            : { left: `${xPercent}%`, top: '-15px', transform: 'translateX(-50%)' };

          return (
            <div
              className='absolute pointer-events-none z-[100] p-3.5 rounded-2xl bg-gray-950/98 border border-white/20 text-white shadow-2xl backdrop-blur-xl transition-all duration-150 min-w-[210px]'
              style={positionStyle}>
              {/* Header: Overall Types Breakdown */}
              <div className='border-b border-white/15 pb-2 mb-2 flex items-center justify-between gap-2'>
                <div>
                  <span className='text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider block'>
                    Overall Types Breakdown
                  </span>
                  <span className='text-xs text-white font-bold block mt-0.5'>
                    At {steps[hoveredIdx].timeLabel}
                  </span>
                </div>
                <span className='px-2 py-0.5 rounded-full text-[9px] font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'>
                  {steps[hoveredIdx].type}
                </span>
              </div>

              {/* Overall Breakdown List by Type */}
              <div className='flex flex-col gap-1.5 text-xs'>
                {LEGEND_TYPES.map((type) => {
                  const typeTotal = runningTotals[type.id] || 0;
                  const percent =
                    totalPointsOverall > 0
                      ? Math.round((typeTotal / totalPointsOverall) * 100)
                      : 0;

                  return (
                    <div key={type.id} className='flex items-center justify-between gap-3'>
                      <span className='font-semibold flex items-center gap-1.5' style={{ color: type.color }}>
                        <span className='w-2 h-2 rounded-full' style={{ backgroundColor: type.color }} />
                        {type.label}
                      </span>
                      <div className='flex items-baseline gap-1.5'>
                        <span className='font-mono font-black text-white'>
                          {typeTotal.toLocaleString()} pts
                        </span>
                        <span className='text-[10px] text-zinc-400 font-mono'>
                          ({percent}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Current Transaction Note */}
              <div className='mt-2.5 pt-2 border-t border-white/10 text-[10px] text-zinc-400 flex items-center justify-between'>
                <span>Event: <strong className='text-zinc-200'>+{steps[hoveredIdx].amount} pts</strong></span>
                <span className='text-zinc-400 truncate max-w-[120px]'>{steps[hoveredIdx].description}</span>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
