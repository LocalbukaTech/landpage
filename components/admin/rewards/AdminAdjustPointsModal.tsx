'use client';

import { useState } from 'react';
import { X, Loader2, Plus, Minus, AlertCircle } from 'lucide-react';
import { useAdminAdjustPoints } from '@/lib/api/services/admin-rewards.hooks';
import { useToast } from '@/hooks/use-toast';

interface AdminAdjustPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUserId?: string;
  defaultUserName?: string;
}

export function AdminAdjustPointsModal({
  isOpen,
  onClose,
  defaultUserId = '',
  defaultUserName = '',
}: AdminAdjustPointsModalProps) {
  const { toast } = useToast();
  const adjustMutation = useAdminAdjustPoints();

  const [userId, setUserId] = useState(defaultUserId);
  const [points, setPoints] = useState<number | ''>(50);
  const [type, setType] = useState<'BONUS' | 'PENALTY'>('BONUS');
  const [reason, setReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const pointsValue = typeof points === 'number' ? points : 0;
  const calculatedNaira = Math.floor(pointsValue / 2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!userId.trim()) {
      setErrorMessage('Please enter a target User ID.');
      return;
    }
    if (!points || points <= 0) {
      setErrorMessage('Points amount must be greater than 0.');
      return;
    }
    if (!reason.trim() || reason.trim().length < 5) {
      setErrorMessage('Please provide a descriptive audit reason (at least 5 characters).');
      return;
    }

    adjustMutation.mutate(
      {
        userId: userId.trim(),
        points: Number(points),
        type,
        reason: reason.trim(),
      },
      {
        onSuccess: (res: any) => {
          toast({
            title: type === 'BONUS' ? 'Points Credited' : 'Points Deducted',
            description: res?.message || `Successfully adjusted points for user.`,
          });
          onClose();
          setReason('');
          setUserId('');
        },
        onError: (err: any) => {
          setErrorMessage(
            err?.response?.data?.message || err?.message || 'Failed to adjust points. Please verify user ID.'
          );
        },
      }
    );
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs'>
      <div className='relative w-full max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800'>
          <div>
            <h3 className='text-lg font-bold text-gray-900 dark:text-white m-0'>
              Manual Point Adjustment
            </h3>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5 m-0'>
              Credit bonus points or penalize points with mandatory audit logging
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-none bg-transparent cursor-pointer'>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className='p-6 flex flex-col gap-5'>
          {/* Adjustment Type Switcher */}
          <div className='grid grid-cols-2 gap-3'>
            <button
              type='button'
              onClick={() => setType('BONUS')}
              className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all cursor-pointer ${
                type === 'BONUS'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
              <Plus size={16} />
              Credit Bonus (+)
            </button>

            <button
              type='button'
              onClick={() => setType('PENALTY')}
              className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all cursor-pointer ${
                type === 'PENALTY'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-600 dark:text-rose-400'
                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
              <Minus size={16} />
              Debit Penalty (−)
            </button>
          </div>

          {/* User ID Input */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-xs font-bold text-gray-700 dark:text-gray-300'>
              User ID (UUID)
            </label>
            <input
              type='text'
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder='e.g. 58850ede-7854-468d-afd0-74e7ea353eaf'
              className='w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white font-mono focus:outline-hidden focus:border-[#fbbe15]'
              required
            />
            {defaultUserName && (
              <span className='text-xs text-gray-500'>Target user: {defaultUserName}</span>
            )}
          </div>

          {/* Points Amount & Equivalent */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-bold text-gray-700 dark:text-gray-300'>
                Points Amount
              </label>
              <input
                type='number'
                min='1'
                step='1'
                value={points}
                onChange={(e) => setPoints(e.target.value ? parseInt(e.target.value, 10) : '')}
                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white font-bold focus:outline-hidden focus:border-[#fbbe15]'
                required
              />
            </div>

            <div className='flex flex-col gap-1.5 justify-center'>
              <span className='text-xs text-gray-500 dark:text-gray-400 font-medium'>
                Naira Value Equivalent
              </span>
              <div className='px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-900 dark:text-white'>
                ≈ ₦{calculatedNaira.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Audit Reason */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-xs font-bold text-gray-700 dark:text-gray-300'>
              Audit Reason (Mandatory)
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder='e.g. Top community contributor for August 2026 or Referral fraud reversal'
              className='w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-hidden focus:border-[#fbbe15] resize-none'
              required
            />
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className='p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300'>
              <AlertCircle size={16} className='shrink-0 mt-0.5' />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className='flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800'>
            <button
              type='button'
              onClick={onClose}
              className='px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent transition-colors cursor-pointer'>
              Cancel
            </button>

            <button
              type='submit'
              disabled={adjustMutation.isPending}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 border-none ${
                type === 'BONUS'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}>
              {adjustMutation.isPending && <Loader2 size={14} className='animate-spin' />}
              {type === 'BONUS' ? 'Grant Bonus Points' : 'Apply Point Penalty'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
