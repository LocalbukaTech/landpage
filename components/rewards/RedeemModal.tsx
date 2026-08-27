'use client';

import { useState } from 'react';
import { X, Coins, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRedeemPoints } from '@/lib/api/services/referral.hooks';
import type { WalletSummary } from '@/lib/api/services/referral.service';

interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet?: WalletSummary;
}

export function RedeemModal({ isOpen, onClose, wallet }: RedeemModalProps) {
  const redeemMutation = useRedeemPoints();
  const currentPoints = wallet?.currentPoints ?? 0;
  const minPoints = wallet?.minRedeemablePoints ?? 1000;
  const pointsPerNaira = wallet?.pointsPerNaira ?? 2;

  const [pointsToRedeem, setPointsToRedeem] = useState<number>(minPoints);
  const [successData, setSuccessData] = useState<{
    pointsRedeemed: number;
    nairaValue: number;
    remainingBalance: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const calculatedNaira = Math.floor(pointsToRedeem / pointsPerNaira);
  const isBelowMin = pointsToRedeem < minPoints;
  const isAboveBalance = pointsToRedeem > currentPoints;
  const isValid = !isBelowMin && !isAboveBalance && pointsToRedeem > 0;

  const handleQuickSelect = (amount: number) => {
    setPointsToRedeem(amount);
    setErrorMessage('');
  };

  const handleMax = () => {
    setPointsToRedeem(currentPoints);
    setErrorMessage('');
  };

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!isValid) return;

    redeemMutation.mutate(
      { points: pointsToRedeem },
      {
        onSuccess: (res: any) => {
          const data = res?.data !== undefined ? res.data : res;
          setSuccessData({
            pointsRedeemed: data?.pointsRedeemed || pointsToRedeem,
            nairaValue: data?.nairaValue || calculatedNaira,
            remainingBalance: data?.remainingBalance || (currentPoints - pointsToRedeem),
          });
        },
        onError: (err: any) => {
          setErrorMessage(
            err?.response?.data?.message ||
              'Failed to redeem points. Please ensure you meet the minimum threshold.'
          );
        },
      }
    );
  };

  const handleModalClose = () => {
    setSuccessData(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/75 backdrop-blur-sm'
        onClick={handleModalClose}
      />

      {/* Modal Card */}
      <div
        className='relative w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200'
        style={{ fontFamily: 'var(--font-nunito-sans), Nunito Sans, sans-serif' }}>
        {/* Close button */}
        <button
          onClick={handleModalClose}
          className='absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors z-10 cursor-pointer'>
          <X size={16} />
        </button>

        {successData ? (
          /* Success Screen */
          <div className='p-8 flex flex-col items-center text-center'>
            <div className='w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 ring-8 ring-emerald-500/10'>
              <CheckCircle2 size={36} />
            </div>
            <h3 className='text-2xl font-bold text-white mb-1'>Redemption Successful!</h3>
            <p className='text-sm text-zinc-400 mb-6'>
              Your points have been converted into wallet cash balance.
            </p>

            <div className='w-full bg-[#111] border border-white/10 rounded-xl p-4 mb-6 space-y-3'>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-zinc-400'>Points Redeemed:</span>
                <span className='font-bold text-white'>{successData.pointsRedeemed.toLocaleString()} pts</span>
              </div>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-zinc-400'>Cash Value Credited:</span>
                <span className='font-bold text-[#FBBE15] text-base'>₦{successData.nairaValue.toLocaleString()}</span>
              </div>
              <div className='h-px bg-white/10' />
              <div className='flex justify-between items-center text-xs'>
                <span className='text-zinc-400'>Remaining Balance:</span>
                <span className='text-zinc-300 font-semibold'>{successData.remainingBalance.toLocaleString()} pts</span>
              </div>
            </div>

            <button
              type='button'
              onClick={handleModalClose}
              className='w-full py-3.5 bg-[#FBBE15] hover:bg-[#e5ac10] text-[#1a1a1a] font-bold rounded-xl transition-colors cursor-pointer text-sm'>
              Done
            </button>
          </div>
        ) : (
          /* Redeem Form */
          <form onSubmit={handleRedeem} className='p-6 sm:p-8 flex flex-col gap-5'>
            <div>
              <div className='flex items-center gap-2 mb-1'>
                <div className='w-7 h-7 rounded-lg bg-[#FBBE15]/20 text-[#FBBE15] flex items-center justify-center'>
                  <Coins size={16} />
                </div>
                <h3 className='text-xl font-bold text-white m-0'>Redeem Points</h3>
              </div>
              <p className='text-xs text-zinc-400 mt-1 mb-0'>
                Convert your loyalty points into Naira cash value (Rate: 2 Points = ₦1.00).
              </p>
            </div>

            {/* Current Balance Banner */}
            <div className='flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10'>
              <span className='text-xs text-zinc-400'>Available Points:</span>
              <span className='text-base font-extrabold text-white'>
                {currentPoints.toLocaleString()} <span className='text-xs font-normal text-zinc-400'>pts</span>
              </span>
            </div>

            {errorMessage && (
              <div className='flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs'>
                <AlertCircle size={16} className='shrink-0 mt-0.5' />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Input & Conversion Box */}
            <div className='flex flex-col gap-2'>
              <label className='text-xs font-semibold text-zinc-300'>Points to Convert</label>
              <div className='relative'>
                <input
                  type='number'
                  min={minPoints}
                  step={100}
                  max={currentPoints}
                  value={pointsToRedeem || ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setPointsToRedeem(isNaN(val) ? 0 : val);
                    setErrorMessage('');
                  }}
                  className='w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-white font-bold text-base placeholder-zinc-600 focus:outline-none focus:border-[#FBBE15] transition-colors'
                  placeholder={`Min ${minPoints} pts`}
                />
                <button
                  type='button'
                  onClick={handleMax}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#FBBE15] bg-[#FBBE15]/10 hover:bg-[#FBBE15]/20 px-2 py-1 rounded-md transition-colors cursor-pointer border-none'>
                  MAX
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className='flex items-center gap-2 mt-1'>
                {[1000, 2000, 5000].map((preset) => (
                  <button
                    key={preset}
                    type='button'
                    onClick={() => handleQuickSelect(preset)}
                    disabled={preset > currentPoints}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                      pointsToRedeem === preset
                        ? 'border-[#FBBE15] bg-[#FBBE15]/10 text-[#FBBE15]'
                        : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed'
                    }`}>
                    {preset.toLocaleString()} pts
                  </button>
                ))}
              </div>
            </div>

            {/* Naira Conversion Preview */}
            <div className='flex items-center justify-between p-4 rounded-xl bg-[#111] border border-[#FBBE15]/30'>
              <div className='flex flex-col'>
                <span className='text-[11px] text-zinc-400'>You will receive</span>
                <span className='text-2xl font-extrabold text-[#FBBE15]'>
                  ₦{calculatedNaira.toLocaleString()}
                </span>
              </div>
              <ArrowRight size={20} className='text-zinc-500' />
            </div>

            {/* Minimum rule reminder */}
            <p className='text-[11px] text-zinc-500 m-0'>
              * Minimum redemption amount is {minPoints.toLocaleString()} points (₦{(minPoints / pointsPerNaira).toLocaleString()}).
            </p>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={redeemMutation.isPending || !isValid}
              className='w-full py-3.5 bg-[#FBBE15] hover:bg-[#e5ac10] text-[#1a1a1a] font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm'>
              {redeemMutation.isPending ? (
                <>
                  <Loader2 size={18} className='animate-spin' />
                  Converting Points...
                </>
              ) : (
                `Redeem for ₦${calculatedNaira.toLocaleString()}`
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
