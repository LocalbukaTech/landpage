'use client';

import React, { useState } from 'react';
import { Users, ArrowUpRight, Info, AlertCircle, MapPin } from 'lucide-react';
import type {
  InsightsAudienceData,
  InsightsChartPoint,
} from '@/lib/api/services/insights.service';

interface AudienceTabProps {
  isLoading?: boolean;
  isError?: boolean;
  data: InsightsAudienceData | null;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function AudienceSkeleton() {
  return (
    <div className='flex flex-col gap-5 animate-pulse'>
      <div className='bg-[#161616] border border-white/10 rounded-2xl p-6 h-28' />
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-5'>
        <div className='lg:col-span-7 bg-[#161616] border border-white/10 rounded-2xl h-80' />
        <div className='lg:col-span-5 bg-[#161616] border border-white/10 rounded-2xl h-80' />
      </div>
    </div>
  );
}

// ── Growth chart ──────────────────────────────────────────────────────────────
function GrowthChart({
  points,
  yAxisMax,
  peakLabel,
  peakValue,
}: {
  points: InsightsChartPoint[];
  yAxisMax: number;
  peakLabel: string;
  peakValue: string;
}) {
  const [activeIdx, setActiveIdx] = useState<number>(() => {
    const hi = points.findIndex((p) => p.isHighlight);
    return hi >= 0 ? hi : points.length - 1;
  });

  if (!points.length) return null;

  const W = 620;
  const H = 190;
  const PT = 20; // padding top
  const chartH = H - PT;
  const max = yAxisMax || Math.max(...points.map((p) => p.value), 1);
  const step = points.length > 1 ? (W) / (points.length - 1) : W;

  const toX = (i: number) => i * step;
  const toY = (v: number) => PT + chartH - (v / max) * chartH;

  const pathD = points
    .map((pt, i) => {
      const x = toX(i);
      const y = toY(pt.value);
      if (i === 0) return `M ${x} ${y}`;
      const px = toX(i - 1);
      const py = toY(points[i - 1].value);
      const cpx = (px + x) / 2;
      return `C ${cpx} ${py}, ${cpx} ${y}, ${x} ${y}`;
    })
    .join(' ');

  const areaD =
    pathD +
    ` L ${toX(points.length - 1)} ${H} L ${toX(0)} ${H} Z`;

  const activePt = points[activeIdx];
  const tipLeft = `${(toX(activeIdx) / W) * 100}%`;
  const tipTop = `${(toY(activePt.value) / (H + 24)) * 100}%`; // rough SVG-to-div mapping

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-1.5'>
          <h3 className='text-sm sm:text-base font-bold text-white m-0'>
            Followers growth over time
          </h3>
          <div
            className='text-zinc-400 hover:text-white cursor-pointer'
            title='Follower acquisition pacing over the selected timeframe'
          >
            <Info size={14} />
          </div>
        </div>
        {peakLabel && peakLabel !== 'No activity' && (
          <span className='text-[10px] text-zinc-500 font-mono'>
            Peak: <span className='text-[#FBBE15] font-bold'>{peakValue}</span>{' '}
            on {peakLabel}
          </span>
        )}
      </div>

      <div className='relative w-full'>
        {/* Y-axis labels */}
        <div className='absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] font-mono text-zinc-500 pointer-events-none select-none pr-2 z-10'>
          <span>{max}</span>
          <span>{Math.round(max * 0.66)}</span>
          <span>{Math.round(max * 0.33)}</span>
          <span>0</span>
        </div>

        <div className='pl-8 relative' style={{ height: 240 }}>
          <svg
            className='w-full h-full overflow-visible'
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio='none'
          >
            <defs>
              <linearGradient id='audGrad' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#FBBE15' stopOpacity='0.40' />
                <stop offset='100%' stopColor='#FBBE15' stopOpacity='0.0' />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0.25, 0.5, 0.75, 1].map((f) => (
              <line
                key={f}
                x1={0}
                y1={PT + chartH * (1 - f)}
                x2={W}
                y2={PT + chartH * (1 - f)}
                stroke='rgba(255,255,255,0.05)'
                strokeDasharray='3 3'
              />
            ))}

            {/* Active marker line */}
            <line
              x1={toX(activeIdx)}
              y1={PT}
              x2={toX(activeIdx)}
              y2={H}
              stroke='rgba(251,190,21,0.35)'
              strokeDasharray='3 3'
            />

            {/* Area */}
            <path d={areaD} fill='url(#audGrad)' />

            {/* Curve */}
            <path
              d={pathD}
              fill='none'
              stroke='#FBBE15'
              strokeWidth='3'
              strokeLinecap='round'
              strokeLinejoin='round'
            />

            {/* Points */}
            {points.map((pt, i) => {
              const isActive = i === activeIdx;
              return (
                <circle
                  key={pt.date}
                  cx={toX(i)}
                  cy={toY(pt.value)}
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

          {/* Tooltip */}
          <div
            className='absolute pointer-events-none z-20'
            style={{ left: tipLeft, top: tipTop, transform: 'translate(-50%, -130%)' }}
          >
            <div className='bg-[#202026] border border-white/15 rounded-lg px-2.5 py-1.5 text-center shadow-xl whitespace-nowrap'>
              <span className='block text-xs font-black text-white font-mono'>
                {activePt.tooltipValue}
              </span>
              <span className='block text-[9px] text-[#FBBE15] font-bold uppercase mt-0.5'>
                {activePt.label}
              </span>
            </div>
          </div>
        </div>

        {/* X-axis labels */}
        <div className='flex justify-between pl-8 text-[10px] font-semibold border-t border-white/5 pt-2'>
          {points.map((pt, i) => (
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
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function AudienceTab({
  isLoading = false,
  isError = false,
  data,
}: AudienceTabProps) {
  if (isLoading) return <AudienceSkeleton />;

  if (isError) {
    return (
      <div className='bg-[#141416] border border-white/8 rounded-2xl p-10 flex flex-col items-center justify-center text-center min-h-[260px] gap-3'>
        <AlertCircle size={28} className='text-zinc-500' />
        <p className='text-sm text-zinc-400'>Could not load audience data. Try again later.</p>
      </div>
    );
  }

  const followers = data?.totalFollowers;
  const growth = data?.followersGrowthOverTime;
  const locations = data?.topLocations;

  return (
    <div className='flex flex-col gap-5 animate-in fade-in duration-200'>
      {/* Total Followers card */}
      <div className='bg-[#161616] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl'>
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 rounded-xl bg-[#262115] border border-[#FBBE15]/20 flex items-center justify-center shrink-0'>
            <Users size={22} className='text-[#FBBE15]' />
          </div>
          <div className='flex flex-col'>
            <span className='text-[11px] font-bold text-zinc-400 uppercase tracking-wider'>
              Total Followers
            </span>
            <div className='flex items-baseline gap-2.5 mt-0.5'>
              <span className='text-3xl sm:text-4xl font-black text-white leading-none tracking-tight'>
                {followers?.formattedCount ?? '0'}
              </span>
              {(followers?.growthPercentage ?? 0) > 0 && (
                <span className='inline-flex items-center gap-0.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20'>
                  <ArrowUpRight size={12} />
                  +{followers!.growthPercentage}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status pill */}
        <div className='flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 self-start sm:self-center'>
          <span
            className={`w-2 h-2 rounded-full ${
              (followers?.growthPercentage ?? 0) > 0
                ? 'bg-[#FBBE15] animate-pulse'
                : 'bg-zinc-500'
            }`}
          />
          <span className='text-xs font-semibold text-zinc-300'>
            {followers?.statusNote ?? 'No follower activity yet'}
          </span>
        </div>
      </div>

      {/* Chart + Locations */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-5'>
        {/* Growth chart */}
        <div className='lg:col-span-7 bg-[#161616] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl'>
          {growth && growth.data.length > 0 ? (
            <GrowthChart
              points={growth.data}
              yAxisMax={growth.yAxisMax}
              peakLabel={growth.peakPoint.label}
              peakValue={growth.peakPoint.displayValue}
            />
          ) : (
            <div className='flex flex-col items-center justify-center text-center h-full min-h-[200px] gap-2'>
              <Users size={28} strokeWidth={1.5} className='text-zinc-600' />
              <p className='text-sm font-bold text-zinc-300'>No growth data yet</p>
              <p className='text-xs text-zinc-500 max-w-xs leading-relaxed'>
                Follow counts over time will appear here once you start gaining followers.
              </p>
            </div>
          )}
        </div>

        {/* Top Locations */}
        <div className='lg:col-span-5 bg-[#161616] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl'>
          <div>
            <div className='flex items-center gap-2 mb-6'>
              <MapPin size={16} className='text-[#FBBE15]' />
              <h3 className='text-sm sm:text-base font-bold text-white m-0'>
                {locations?.title ?? 'Top Locations'}
              </h3>
            </div>

            {(locations?.data?.length ?? 0) === 0 ? (
              <div className='flex flex-col items-center justify-center text-center py-8 gap-2'>
                <MapPin size={24} strokeWidth={1.5} className='text-zinc-600' />
                <p className='text-xs text-zinc-500 leading-relaxed'>
                  {locations?.note ?? 'No location data available yet.'}
                </p>
              </div>
            ) : (
              <div className='space-y-4'>
                {locations!.data.map((loc) => (
                  <div key={loc.location} className='flex flex-col gap-1.5'>
                    <div className='flex items-center justify-between text-xs'>
                      <span className='font-bold text-zinc-300'>{loc.location}</span>
                      <span className='font-mono font-bold text-zinc-400'>
                        {loc.percentage}%
                      </span>
                    </div>
                    <div className='w-full h-2 bg-white/5 rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-[#FBBE15] rounded-full transition-all duration-700'
                        style={{ width: `${loc.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className='text-[10px] text-zinc-500 mt-6 pt-4 border-t border-white/5 m-0 leading-normal'>
            {locations?.note ?? 'Note: Location data is based on available follower information.'}
          </p>
        </div>
      </div>
    </div>
  );
}
