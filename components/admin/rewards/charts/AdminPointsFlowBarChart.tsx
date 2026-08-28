'use client';

import { motion } from 'framer-motion';
import { Coins, Award, Wallet, Layers } from 'lucide-react';

interface AdminPointsFlowBarChartProps {
  totalEverEarned?: number;
  inCirculation?: number;
  totalRedeemed?: number;
  onOpenAdjustModal?: () => void;
}

export function AdminPointsFlowBarChart({
  totalEverEarned = 0,
  inCirculation = 0,
  totalRedeemed = 0,
  onOpenAdjustModal,
}: AdminPointsFlowBarChartProps) {
  const maxPoints = Math.max(1, totalEverEarned, inCirculation + totalRedeemed);

  const bars = [
    {
      id: 'earned',
      label: 'Ever Issued',
      points: totalEverEarned,
      naira: Math.floor(totalEverEarned / 2),
      color: '#fbbe15',
      bgGradient: 'from-[#e5ac10] to-[#fbbe15]',
      icon: Award,
      percent: Math.round((totalEverEarned / maxPoints) * 100),
    },
    {
      id: 'circulation',
      label: 'In Circulation',
      points: inCirculation,
      naira: Math.floor(inCirculation / 2),
      color: '#f59e0b',
      bgGradient: 'from-amber-600 to-amber-400',
      icon: Coins,
      percent: Math.round((inCirculation / maxPoints) * 100),
    },
    {
      id: 'redeemed',
      label: 'Cashed Out',
      points: totalRedeemed,
      naira: Math.floor(totalRedeemed / 2),
      color: '#10b981',
      bgGradient: 'from-emerald-600 to-emerald-400',
      icon: Wallet,
      percent: Math.round((totalRedeemed / maxPoints) * 100),
    },
  ];

  return (
    <div className='p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between h-full'>
      {/* Header */}
      <div className='flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800'>
        <div className='flex items-center gap-2.5'>
          <div className='w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center'>
            <Layers size={16} />
          </div>
          <div>
            <h4 className='text-sm font-bold text-gray-900 dark:text-white m-0'>
              Points Financial Flow &amp; Liquidity
            </h4>
            <p className='text-xs text-gray-500 mt-0.5 m-0'>
              Points issued vs circulating liability vs cashed out
            </p>
          </div>
        </div>

        {onOpenAdjustModal && (
          <button
            onClick={onOpenAdjustModal}
            className='text-xs font-bold text-[#b8860b] dark:text-[#fbbe15] hover:underline flex items-center gap-1 border-none bg-transparent cursor-pointer'>
            Manual Adjustment
          </button>
        )}
      </div>

      {/* 3 Comparative Animated Vertical Bars */}
      <div className='grid grid-cols-3 gap-4 my-4 h-[160px] items-end px-2'>
        {bars.map((bar) => {
          const Icon = bar.icon;

          return (
            <div key={bar.id} className='flex flex-col items-center gap-2 h-full justify-end group'>
              {/* Value display */}
              <div className='flex flex-col items-center text-center'>
                <span className='text-xs sm:text-sm font-black text-gray-900 dark:text-white'>
                  {bar.points.toLocaleString()}
                </span>
                <span className='text-[10px] text-gray-400 font-semibold'>
                  ≈ ₦{bar.naira.toLocaleString()}
                </span>
              </div>

              {/* Bar track and animated fill */}
              <div className='w-full max-w-[48px] h-[90px] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden p-1 flex items-end'>
                <motion.div
                  className={`w-full rounded-lg bg-gradient-to-t ${bar.bgGradient} shadow-md`}
                  initial={{ height: '0%' }}
                  animate={{ height: `${Math.max(15, bar.percent)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>

              {/* Label + Icon */}
              <div className='flex items-center gap-1 text-[11px] font-bold text-gray-600 dark:text-gray-400'>
                <Icon size={12} style={{ color: bar.color }} />
                <span>{bar.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Valuation Strip */}
      <div className='pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500'>
        <span>Fixed Standard: <strong>2 pts = ₦1.00</strong></span>
        <span className='font-mono text-emerald-600 dark:text-emerald-400 font-bold'>
          ₦{Math.floor(totalRedeemed / 2).toLocaleString()} Paid Out
        </span>
      </div>
    </div>
  );
}
