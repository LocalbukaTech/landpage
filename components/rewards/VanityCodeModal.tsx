'use client';

import { useState } from 'react';
import { X, Tag, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRequestVanityCode } from '@/lib/api/services/referral.hooks';

interface VanityCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCode?: string | null;
  completedReferrals?: number;
  minReferralsRequired?: number;
}

export function VanityCodeModal({
  isOpen,
  onClose,
  currentCode,
  completedReferrals = 0,
  minReferralsRequired = 5,
}: VanityCodeModalProps) {
  const vanityMutation = useRequestVanityCode();
  const [vanityInput, setVanityInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successResult, setSuccessResult] = useState<{
    vanityCode: string;
    shareLink: string;
  } | null>(null);

  if (!isOpen) return null;

  const isEligible = completedReferrals >= minReferralsRequired;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanCode = vanityInput.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');

    if (cleanCode.length < 3 || cleanCode.length > 20) {
      setErrorMessage('Vanity code must be between 3 and 20 alphanumeric characters.');
      return;
    }

    vanityMutation.mutate(
      { code: cleanCode },
      {
        onSuccess: (res: any) => {
          const data = res?.data !== undefined ? res.data : res;
          setSuccessResult({
            vanityCode: data?.vanityCode || cleanCode,
            shareLink: data?.shareLink || `https://localbuka.com/signup?ref=${cleanCode}`,
          });
        },
        onError: (err: any) => {
          setErrorMessage(
            err?.response?.data?.message ||
              'Failed to set custom code. The code might already be taken or you may not be eligible.'
          );
        },
      }
    );
  };

  const handleModalClose = () => {
    setSuccessResult(null);
    setErrorMessage('');
    setVanityInput('');
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

        {successResult ? (
          /* Success Screen */
          <div className='p-8 flex flex-col items-center text-center'>
            <div className='w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 ring-8 ring-emerald-500/10'>
              <CheckCircle2 size={36} />
            </div>
            <h3 className='text-2xl font-bold text-white mb-1'>Custom Code Activated! 🎉</h3>
            <p className='text-sm text-zinc-400 mb-6'>
              Your unique vanity code is live. Anyone using it will be credited to your account.
            </p>

            <div className='w-full bg-[#111] border border-white/10 rounded-xl p-4 mb-6 space-y-3'>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-zinc-400'>Your Vanity Code:</span>
                <span className='font-extrabold text-[#FBBE15] text-lg tracking-wider'>
                  {successResult.vanityCode}
                </span>
              </div>
              <div className='h-px bg-white/10' />
              <div className='flex flex-col gap-1 text-left text-xs'>
                <span className='text-zinc-400'>Updated Share Link:</span>
                <span className='text-zinc-300 font-mono break-all'>{successResult.shareLink}</span>
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
          /* Form Screen */
          <form onSubmit={handleSubmit} className='p-6 sm:p-8 flex flex-col gap-5'>
            <div>
              <div className='flex items-center gap-2 mb-1'>
                <div className='w-7 h-7 rounded-lg bg-[#FBBE15]/20 text-[#FBBE15] flex items-center justify-center'>
                  <Tag size={16} />
                </div>
                <h3 className='text-xl font-bold text-white m-0'>Custom Vanity Code</h3>
              </div>
              <p className='text-xs text-zinc-400 mt-1 mb-0'>
                Brand your referral link with your personalized handle or influencer nickname (e.g. CHEFAMY, FOODBYTOLA).
              </p>
            </div>

            {/* Eligibility Progress / Status */}
            {!isEligible ? (
              <div className='p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex flex-col gap-2'>
                <div className='flex items-center justify-between text-xs font-semibold'>
                  <span>Requirement: 5 completed referrals</span>
                  <span>{completedReferrals} / {minReferralsRequired} completed</span>
                </div>
                <div className='w-full h-2 bg-amber-950/40 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-[#FBBE15] rounded-full transition-all duration-500'
                    style={{ width: `${Math.min(100, (completedReferrals / minReferralsRequired) * 100)}%` }}
                  />
                </div>
                <p className='text-[11px] text-amber-400/80 m-0'>
                  You need {minReferralsRequired - completedReferrals} more verified referral{minReferralsRequired - completedReferrals === 1 ? '' : 's'} to unlock custom vanity codes.
                </p>
              </div>
            ) : (
              <div className='p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2'>
                <CheckCircle2 size={16} className='shrink-0' />
                <span>You are eligible to set your custom referral vanity code!</span>
              </div>
            )}

            {errorMessage && (
              <div className='flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs'>
                <AlertCircle size={16} className='shrink-0 mt-0.5' />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Input Box */}
            <div className='flex flex-col gap-2'>
              <label className='text-xs font-semibold text-zinc-300'>Enter Custom Code</label>
              <div className='relative'>
                <input
                  type='text'
                  value={vanityInput}
                  disabled={!isEligible}
                  onChange={(e) => {
                    setVanityInput(e.target.value.toUpperCase());
                    setErrorMessage('');
                  }}
                  placeholder={currentCode || 'e.g. CHEFAMY'}
                  className='w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-white font-bold text-base uppercase tracking-wider placeholder-zinc-600 focus:outline-none focus:border-[#FBBE15] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                />
              </div>
              <p className='text-[11px] text-zinc-500 m-0'>
                Letters, numbers, underscores and hyphens only (3–20 characters).
              </p>
            </div>

            {/* Submit CTA */}
            <button
              type='submit'
              disabled={vanityMutation.isPending || !isEligible || !vanityInput.trim()}
              className='w-full py-3.5 bg-[#FBBE15] hover:bg-[#e5ac10] text-[#1a1a1a] font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm'>
              {vanityMutation.isPending ? (
                <>
                  <Loader2 size={18} className='animate-spin' />
                  Setting Code...
                </>
              ) : (
                'Save Custom Code'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
