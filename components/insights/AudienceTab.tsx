'use client';

import {Users} from 'lucide-react';

interface Location {
  city: string;
  percent: number;
}

const LOCATIONS: Location[] = [
  {city: 'Lagos', percent: 40},
  {city: 'Akure', percent: 35},
  {city: 'Abuja', percent: 22},
  {city: 'Others', percent: 3},
];

export function AudienceTab() {
  // Followers growth data (illustrative)
  const days = ['29 Aug', '30 Aug', '31 Aug', '1 Sep', '2 Sep', '3 Sep'];
  const followers = [320, 480, 620, 790, 1050, 1240];
  const max = 1500;

  const w = 500;
  const h = 140;
  const pad = {top: 12, right: 12, bottom: 28, left: 36};
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const x = (i: number) => pad.left + (i / (followers.length - 1)) * chartW;
  const y = (v: number) => pad.top + (1 - v / max) * chartH;

  const linePath = [`M${x(0)},${y(followers[0])}`]
    .concat(followers.slice(1).map((v, i) => `L${x(i + 1)},${y(v)}`))
    .join(' ');

  const areaPath = [
    linePath,
    `L${x(followers.length - 1)},${h - pad.bottom}`,
    `L${x(0)},${h - pad.bottom}`,
    'Z',
  ].join(' ');

  const peakIdx = followers.length - 2; // peak on 2 Sep

  return (
    <div className='space-y-4'>
      {/* Total followers hero */}
      <div className='bg-[#242424] rounded-xl p-5 border border-white/5 flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 rounded-xl bg-[#FFC727]/10 flex items-center justify-center shrink-0'>
            <Users size={22} className='text-[#FFC727]' />
          </div>
          <div>
            <p className='text-[11px] text-zinc-400 uppercase tracking-widest font-medium mb-0.5'>
              Total Followers
            </p>
            <div className='flex items-baseline gap-2'>
              <span className='text-3xl font-bold text-white'>1,240</span>
              <span className='text-sm font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full'>
                ↑ 12.5%
              </span>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-1.5'>
          <span className='w-2 h-2 rounded-full bg-[#FFC727] animate-pulse' />
          <span className='text-xs text-zinc-400'>Audience pacing ahead of last cycle</span>
        </div>
      </div>

      {/* Charts row */}
      <div className='grid md:grid-cols-2 gap-4'>
        {/* Followers growth chart */}
        <div className='bg-[#242424] rounded-xl p-5 border border-white/5'>
          <div className='flex items-center justify-between mb-3'>
            <p className='text-sm font-semibold text-white'>Followers growth over time</p>
            <span className='text-[10px] text-zinc-500'>ⓘ</span>
          </div>
          <div className='overflow-x-auto'>
            <svg
              viewBox={`0 0 ${w} ${h}`}
              style={{width: '100%', minWidth: '260px', height: `${h}px`}}
            >
              <defs>
                <linearGradient id='followerGrad' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='#FFC727' stopOpacity='0.4' />
                  <stop offset='100%' stopColor='#FFC727' stopOpacity='0' />
                </linearGradient>
              </defs>

              {/* Grid */}
              {[0, 500, 1000, 1500].map((tick) => (
                <g key={tick}>
                  <line
                    x1={pad.left} x2={w - pad.right}
                    y1={y(tick)} y2={y(tick)}
                    stroke='#ffffff08' strokeDasharray='4 4'
                  />
                  <text x={pad.left - 4} y={y(tick) + 4} textAnchor='end' fontSize='8' fill='#4b5563'>
                    {tick === 0 ? '0' : `${tick / 1000}K`}
                  </text>
                </g>
              ))}

              {/* Area */}
              <path d={areaPath} fill='url(#followerGrad)' />

              {/* Line */}
              <path d={linePath} fill='none' stroke='#FFC727' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />

              {/* Dots */}
              {followers.map((v, i) => (
                <circle
                  key={i}
                  cx={x(i)} cy={y(v)}
                  r={i === peakIdx ? 5 : 3}
                  fill={i === peakIdx ? '#FFC727' : '#1a1a1a'}
                  stroke='#FFC727'
                  strokeWidth='2'
                />
              ))}

              {/* Peak callout */}
              <g>
                <rect x={x(peakIdx) - 22} y={y(followers[peakIdx]) - 26} width='44' height='18' rx='4' fill='#FFC727' />
                <text x={x(peakIdx)} y={y(followers[peakIdx]) - 13} textAnchor='middle' fontSize='8' fill='#000' fontWeight='bold'>
                  1.3K {days[peakIdx]}
                </text>
              </g>

              {/* X labels */}
              {days.map((d, i) => (
                <text
                  key={d}
                  x={x(i)} y={h - 4}
                  textAnchor='middle' fontSize='8'
                  fill={i === peakIdx ? '#FFC727' : '#4b5563'}
                  fontWeight={i === peakIdx ? 'bold' : 'normal'}
                >
                  {d}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Top Locations */}
        <div className='bg-[#242424] rounded-xl p-5 border border-white/5'>
          <p className='text-sm font-semibold text-white mb-4'>Top Locations</p>
          <div className='space-y-3'>
            {LOCATIONS.map((loc) => (
              <div key={loc.city} className='space-y-1'>
                <div className='flex items-center justify-between text-xs'>
                  <span className='text-zinc-300'>{loc.city}</span>
                  <span className='text-zinc-400 font-medium'>{loc.percent}%</span>
                </div>
                <div className='h-1.5 bg-[#333] rounded-full overflow-hidden'>
                  <div
                    className='h-full rounded-full bg-[#FFC727] transition-all duration-700'
                    style={{width: `${loc.percent}%`}}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className='text-[10px] text-zinc-600 mt-4 leading-relaxed'>
            Note: Location data is based on available follower information.
          </p>
        </div>
      </div>
    </div>
  );
}
