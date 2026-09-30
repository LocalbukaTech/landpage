'use client';

import {TrendingUp, Eye, Heart, Users} from 'lucide-react';

interface StatCard {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const STAT_CARDS: StatCard[] = [
  {
    label: 'Total Views',
    value: '24.5K',
    change: '+18.2%',
    isPositive: true,
    icon: <Eye size={16} className='text-[#FFC727]' />,
  },
  {
    label: 'Total Likes',
    value: '3,812',
    change: '+9.4%',
    isPositive: true,
    icon: <Heart size={16} className='text-[#FFC727]' />,
  },
  {
    label: 'Profile Visits',
    value: '1,093',
    change: '-2.1%',
    isPositive: false,
    icon: <Users size={16} className='text-[#FFC727]' />,
  },
  {
    label: 'Reach',
    value: '8,760',
    change: '+31.0%',
    isPositive: true,
    icon: <TrendingUp size={16} className='text-[#FFC727]' />,
  },
];

// Mini sparkline SVG paths (decorative, illustrative)
const SPARKLINES = [
  'M0,30 C10,28 20,15 30,18 C40,21 50,8 60,5 C70,2 80,10 90,6',
  'M0,25 C10,22 20,20 30,16 C40,12 50,14 60,8 C70,4 80,6 90,3',
  'M0,15 C10,18 20,22 30,20 C40,18 50,25 60,28 C70,30 80,26 90,29',
  'M0,20 C10,16 20,10 30,8 C40,6 50,4 60,2 C70,1 80,3 90,0',
];

export function OverviewTab() {
  return (
    <div className='space-y-6'>
      {/* Stat Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
        {STAT_CARDS.map((card, i) => (
          <div
            key={card.label}
            className='bg-[#242424] rounded-xl p-4 flex flex-col gap-3 border border-white/5 hover:border-white/10 transition-all duration-200'
          >
            <div className='flex items-center gap-2'>
              <div className='w-7 h-7 rounded-lg bg-[#FFC727]/10 flex items-center justify-center shrink-0'>
                {card.icon}
              </div>
              <span className='text-xs text-zinc-400 leading-tight'>{card.label}</span>
            </div>
            <div className='flex items-end justify-between'>
              <div>
                <p className='text-xl font-bold text-white'>{card.value}</p>
                <span
                  className={`text-xs font-medium ${
                    card.isPositive ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {card.change}
                </span>
              </div>
              {/* Decorative sparkline */}
              <svg
                width='90'
                height='32'
                viewBox='0 0 90 32'
                fill='none'
                className='opacity-60'
              >
                <path
                  d={SPARKLINES[i]}
                  stroke={card.isPositive ? '#FFC727' : '#f87171'}
                  strokeWidth='2'
                  strokeLinecap='round'
                  fill='none'
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Views over time chart */}
      <ViewsChart />
    </div>
  );
}

function ViewsChart() {
  const days = ['29 Aug', '30 Aug', '31 Aug', '1 Sep', '2 Sep', '3 Sep', '4 Sep'];
  // Illustrative data points (normalised 0–100)
  const values = [22, 35, 40, 55, 70, 88, 64];
  const max = 100;
  const w = 560;
  const h = 140;
  const pad = {top: 10, right: 10, bottom: 30, left: 30};
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const x = (i: number) => pad.left + (i / (values.length - 1)) * chartW;
  const y = (v: number) => pad.top + (1 - v / max) * chartH;

  // Build smooth polyline path
  const pointStr = values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const areaPath = [
    `M${x(0)},${y(values[0])}`,
    ...values.slice(1).map((v, i) => `L${x(i + 1)},${y(v)}`),
    `L${x(values.length - 1)},${h - pad.bottom}`,
    `L${x(0)},${h - pad.bottom}`,
    'Z',
  ].join(' ');
  const linePath = [`M${x(0)},${y(values[0])}`, ...values.slice(1).map((v, i) => `L${x(i + 1)},${y(v)}`)].join(' ');

  // Peak point index
  const peakIdx = values.indexOf(Math.max(...values));

  return (
    <div className='bg-[#242424] rounded-xl p-5 border border-white/5'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <p className='text-sm font-semibold text-white'>Views over time</p>
          <p className='text-xs text-zinc-500 mt-0.5'>Daily video views</p>
        </div>
        <span className='text-xs text-emerald-400 font-medium bg-emerald-400/10 px-2 py-1 rounded-full'>
          ↑ Trending up
        </span>
      </div>
      <div className='overflow-x-auto'>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className='w-full'
          style={{minWidth: '280px', height: `${h}px`}}
        >
          <defs>
            <linearGradient id='areaGrad' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#FFC727' stopOpacity='0.35' />
              <stop offset='100%' stopColor='#FFC727' stopOpacity='0' />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {[0, 25, 50, 75, 100].map((tick) => (
            <g key={tick}>
              <line
                x1={pad.left}
                x2={w - pad.right}
                y1={y(tick)}
                y2={y(tick)}
                stroke='#ffffff10'
                strokeDasharray='4 4'
              />
              <text x={pad.left - 4} y={y(tick) + 4} textAnchor='end' fontSize='8' fill='#6b7280'>
                {tick === 0 ? '0' : tick === 25 ? '500' : tick === 50 ? '1K' : tick === 75 ? '1.5K' : '2K'}
              </text>
            </g>
          ))}

          {/* Area fill */}
          <path d={areaPath} fill='url(#areaGrad)' />

          {/* Line */}
          <polyline points={pointStr} fill='none' stroke='#FFC727' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />

          {/* Data points */}
          {values.map((v, i) => (
            <circle
              key={i}
              cx={x(i)}
              cy={y(v)}
              r={i === peakIdx ? 5 : 3}
              fill={i === peakIdx ? '#FFC727' : '#1a1a1a'}
              stroke='#FFC727'
              strokeWidth='2'
            />
          ))}

          {/* Peak tooltip */}
          <g>
            <rect
              x={x(peakIdx) - 28}
              y={y(values[peakIdx]) - 26}
              width='56'
              height='20'
              rx='4'
              fill='#FFC727'
            />
            <text x={x(peakIdx)} y={y(values[peakIdx]) - 12} textAnchor='middle' fontSize='9' fill='#000' fontWeight='bold'>
              {days[peakIdx]}
            </text>
          </g>

          {/* X-axis labels */}
          {days.map((d, i) => (
            <text
              key={d}
              x={x(i)}
              y={h - 4}
              textAnchor='middle'
              fontSize='8'
              fill={i === peakIdx ? '#FFC727' : '#6b7280'}
              fontWeight={i === peakIdx ? 'bold' : 'normal'}
            >
              {d}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
