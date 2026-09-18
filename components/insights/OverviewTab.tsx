'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Plus,
  Eye,
  Radio,
  Zap,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
} from 'lucide-react';
import type {
  InsightsOverviewData,
  InsightsChartPoint,
} from '@/lib/api/services/insights.service';

interface OverviewTabProps {
  isLoading?: boolean;
  isError?: boolean;
  data: InsightsOverviewData | null;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function OverviewSkeleton() {
  return (
    <div className='flex flex-col gap-6 animate-pulse'>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className='bg-[#161616] border border-white/10 rounded-2xl p-5 h-28 flex flex-col justify-between'
          >
            <div className='w-24 h-4 bg-white/5 rounded-md' />
            <div className='w-16 h-8 bg-white/10 rounded-md' />
          </div>
        ))}
      </div>
      <div className='bg-[#161616] border border-white/10 rounded-2xl p-6 h-72 flex flex-col gap-4'>
        <div className='w-48 h-4 bg-white/5 rounded-md' />
        <div className='flex-1 bg-white/5 rounded-xl' />
      </div>
    </div>
  );
}

// ── Empty / zero-state ────────────────────────────────────────────────────────
function OverviewEmpty() {
  return (
    <div className='bg-[#141416] border border-white/8 rounded-2xl sm:rounded-3xl p-8 sm:p-16 flex flex-col items-center justify-center text-center shadow-2xl min-h-[380px] sm:min-h-[440px]'>
      <div className='w-14 h-14 rounded-2xl bg-white/5 text-zinc-400 flex items-center justify-center mb-4 border border-white/5'>
        <BarChart3 size={28} strokeWidth={1.8} className='text-zinc-300' />
      </div>
      <h3 className='text-lg sm:text-xl font-bold text-white mb-2'>
        Not enough activity yet
      </h3>
      <p className='text-xs sm:text-sm text-zinc-400 max-w-sm mb-6 leading-relaxed'>
        Post something and check back once people start viewing it.
      </p>
      <Link
        href='/studio'
        className='inline-flex items-center gap-2 px-6 py-3 bg-[#FBBE15] hover:bg-[#e5ac10] text-[#141414] text-sm font-extrabold rounded-full transition-all duration-200 shadow-lg shadow-[#FBBE15]/10 hover:scale-[1.02] active:scale-[0.98]'
      >
        <Plus size={16} strokeWidth={3} />
        <span>Create Post</span>
      </Link>
    </div>
  );
}

// ── Interactive chart ─────────────────────────────────────────────────────────
function PerformanceChart({
  data,
  yAxisMax,
  peakLabel,
  peakValue,
}: {
  data: InsightsChartPoint[];
  yAxisMax: number;
  peakLabel: string;
  peakValue: string;
}) {
  const [activeIdx, setActiveIdx] = useState<number>(() => {
    const hi = data.findIndex((p) => p.isHighlight);
    return hi >= 0 ? hi : data.length - 1;
  });

  if (!data.length) return null;

  const W = 700;
  const H = 200;
  const PADDING = { l: 0, r: 0, t: 20, b: 0 };
  const chartH = H - PADDING.t - PADDING.b;
  const step = data.length > 1 ? (W - PADDING.l - PADDING.r) / (data.length - 1) : W;
  const max = yAxisMax || Math.max(...data.map((d) => d.value), 1);

  const toX = (i: number) => PADDING.l + i * step;
  const toY = (v: number) => PADDING.t + chartH - (v / max) * chartH;

  // Smooth cubic bezier path
  const pathD = data
    .map((pt, i) => {
      const x = toX(i);
      const y = toY(pt.value);
      if (i === 0) return `M ${x} ${y}`;
      const px = toX(i - 1);
      const py = toY(data[i - 1].value);
      const cpx = (px + x) / 2;
      return `C ${cpx} ${py}, ${cpx} ${y}, ${x} ${y}`;
    })
    .join(' ');

  const areaD =
    pathD +
    ` L ${toX(data.length - 1)} ${H} L ${toX(0)} ${H} Z`;

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
        <div>
          <h3 className='text-base sm:text-lg font-bold text-white m-0'>
            Performance over time
          </h3>
          <p className='text-xs text-zinc-400 mt-1 m-0'>
            Peak: <span className='text-[#FBBE15] font-bold'>{peakValue}</span>{' '}
            on {peakLabel}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <span className='w-2 h-2 rounded-full bg-[#FBBE15] animate-pulse' />
          <span className='text-xs font-semibold text-zinc-300'>Live</span>
        </div>
      </div>

      <div className='relative w-full'>
        <svg
          className='w-full overflow-visible'
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio='none'
          style={{ height: 220 }}
        >
          <defs>
            <linearGradient id='ovGrad' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#FBBE15' stopOpacity='0.30' />
              <stop offset='100%' stopColor='#FBBE15' stopOpacity='0.0' />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line
              key={f}
              x1={0}
              y1={PADDING.t + chartH * (1 - f)}
              x2={W}
              y2={PADDING.t + chartH * (1 - f)}
              stroke='rgba(255,255,255,0.05)'
              strokeDasharray='4 4'
            />
          ))}

          {/* Active point vertical line */}
          <line
            x1={toX(activeIdx)}
            y1={PADDING.t}
            x2={toX(activeIdx)}
            y2={H}
            stroke='rgba(251,190,21,0.35)'
            strokeDasharray='3 3'
          />

          {/* Area fill */}
          <path d={areaD} fill='url(#ovGrad)' />

          {/* Curve */}
          <path
            d={pathD}
            fill='none'
            stroke='#FBBE15'
            strokeWidth='3'
            strokeLinecap='round'
            strokeLinejoin='round'
          />

          {/* Data point circles */}
          {data.map((pt, i) => {
            const cx = toX(i);
            const cy = toY(pt.value);
            const isActive = i === activeIdx;
            return (
              <circle
                key={pt.date}
                cx={cx}
                cy={cy}
                r={isActive ? 6 : 4}
                fill='#FBBE15'
                stroke={isActive ? '#ffffff' : '#161616'}
                strokeWidth={isActive ? 2.5 : 1.5}
                className='cursor-pointer'
                onClick={() => setActiveIdx(i)}
              />
            );
          })}
        </svg>

        {/* Tooltip bubble */}
        {(() => {
          const pt = data[activeIdx];
          const pct = toX(activeIdx) / W;
          return (
            <div
              className='absolute -top-2 pointer-events-none transform -translate-x-1/2'
              style={{
                left: `${pct * 100}%`,
                top: `${(toY(pt.value) / 220) * 100}%`,
                transform: 'translate(-50%, -120%)',
              }}
            >
              <div className='bg-[#202026] border border-white/15 rounded-lg px-2.5 py-1.5 text-center shadow-xl whitespace-nowrap'>
                <span className='block text-xs font-black text-white font-mono leading-none'>
                  {pt.tooltipValue}
                </span>
                <span className='block text-[9px] text-[#FBBE15] font-bold uppercase mt-0.5'>
                  {pt.label}
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* X-axis date labels */}
      <div className='flex justify-between text-[10px] font-semibold border-t border-white/5 pt-2'>
        {data.map((pt, i) => (
          <button
            key={pt.date}
            type='button'
            onClick={() => setActiveIdx(i)}
            className={`bg-transparent border-none p-0 cursor-pointer text-[10px] transition-colors ${
              i === activeIdx
                ? 'text-[#FBBE15] font-bold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {pt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function OverviewTab({
  isLoading = false,
  isError = false,
  data,
}: OverviewTabProps) {
  if (isLoading) return <OverviewSkeleton />;

  if (isError) {
    return (
      <div className='bg-[#141416] border border-white/8 rounded-2xl p-10 flex flex-col items-center justify-center text-center min-h-[260px] gap-3'>
        <AlertCircle size={28} className='text-zinc-500' />
        <p className='text-sm text-zinc-400'>Could not load overview data. Try again later.</p>
      </div>
    );
  }

  const allZero =
    !data ||
    (data.metrics.views.value === 0 &&
      data.metrics.reach.value === 0 &&
      data.metrics.engagement.value === 0 &&
      data.metrics.newFollowers.value === 0);

  if (allZero) return <OverviewEmpty />;

  const m = data!.metrics;
  const pot = data!.performanceOverTime;

  const metricCards = [
    {
      label: m.views.label,
      value: m.views.formattedValue,
      change: m.views.formattedChange,
      isPositive: m.views.isPositive,
      icon: <Eye size={18} className='text-[#FBBE15]' />,
    },
    {
      label: m.reach.label,
      value: m.reach.formattedValue,
      change: m.reach.formattedChange,
      isPositive: m.reach.isPositive,
      icon: <Radio size={18} className='text-sky-400' />,
    },
    {
      label: m.engagement.label,
      value: m.engagement.formattedValue,
      change: m.engagement.formattedChange,
      isPositive: m.engagement.isPositive,
      icon: <Zap size={18} className='text-violet-400' />,
    },
    {
      label: m.newFollowers.label,
      value: m.newFollowers.formattedValue,
      change: m.newFollowers.formattedChange,
      isPositive: m.newFollowers.isPositive,
      icon: <UserPlus size={18} className='text-emerald-400' />,
    },
  ];

  return (
    <div className='flex flex-col gap-6 animate-in fade-in duration-200'>
      {/* Metric cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        {metricCards.map((card) => (
          <div
            key={card.label}
            className='bg-[#161616] border border-white/10 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-lg hover:border-white/20 transition-colors'
          >
            <div className='flex items-center justify-between'>
              <span className='text-xs font-bold text-zinc-400 uppercase tracking-wider'>
                {card.label}
              </span>
              <div className='w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center'>
                {card.icon}
              </div>
            </div>
            <div className='flex items-baseline justify-between gap-2'>
              <span className='text-2xl sm:text-3xl font-black text-white tracking-tight'>
                {card.value}
              </span>
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full border ${
                  card.isPositive
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                }`}
              >
                {card.isPositive ? (
                  <ArrowUpRight size={12} />
                ) : (
                  <ArrowDownRight size={12} />
                )}
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Performance chart */}
      <div className='bg-[#161616] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl'>
        <PerformanceChart
          data={pot.data}
          yAxisMax={pot.yAxisMax}
          peakLabel={pot.peakPoint.label}
          peakValue={pot.peakPoint.displayValue}
        />
      </div>
    </div>
  );
}
