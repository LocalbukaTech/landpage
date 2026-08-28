'use client';

import { useState } from 'react';
import { X, Loader2, Tag, AlertCircle } from 'lucide-react';
import { useAdminApproveVanityCode } from '@/lib/api/services/admin-rewards.hooks';
import { useToast } from '@/hooks/use-toast';

interface AdminApproveVanityModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUserId?: string;
  defaultUserName?: string;
}

export function AdminApproveVanityModal({
  isOpen,
  onClose,
  defaultUserId = '',
  defaultUserName = '',
}: AdminApproveVanityModalProps) {
  const { toast } = useToast();
  const approveMutation = useAdminApproveVanityCode();

  const [userId, setUserId] = useState(defaultUserId);
  const [vanityCode, setVanityCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanCode = vanityCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');

    if (!userId.trim()) {
      setErrorMessage('Please enter a target User ID.');
      return;
    }
    if (cleanCode.length < 3 || cleanCode.length > 20) {
      setErrorMessage('Vanity code must be between 3 and 20 alphanumeric characters.');
      return;
    }

    approveMutation.mutate(
      {
        userId: userId.trim(),
        code: cleanCode,
      },
      {
        onSuccess: (res: any) => {
          toast({
            title: 'Vanity Code Approved! 🏷️',
            description: res?.message || `Assigned ${cleanCode} to user successfully.`,
          });
          onClose();
          setVanityCode('');
          setUserId('');
        },
        onError: (err: any) => {
          setErrorMessage(
            err?.response?.data?.message || err?.message || 'Failed to assign vanity code. Check if code is already taken.'
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
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center'>
              <Tag size={18} />
            </div>
            <div>
              <h3 className='text-lg font-bold text-gray-900 dark:text-white m-0'>
                Approve Influencer Vanity Code
              </h3>
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5 m-0'>
                Grant a custom branded vanity code directly to a creator or partner
              </p>
            </div>
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

          {/* Vanity Code Input */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-xs font-bold text-gray-700 dark:text-gray-300'>
              Custom Vanity Code
            </label>
            <div className='relative'>
              <input
                type='text'
                value={vanityCode}
                onChange={(e) => setVanityCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))}
                placeholder='e.g. CHEFAMY'
                maxLength={20}
                className='w-full pl-4 pr-12 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white font-mono font-bold uppercase focus:outline-hidden focus:border-[#fbbe15]'
                required
              />
              <span className='absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono'>
                {vanityCode.length}/20
              </span>
            </div>
            <p className='text-[11px] text-gray-500 m-0'>
              The user&apos;s share link will become: <code className='text-amber-600 dark:text-amber-400 font-mono'>localbuka.com/signup?ref={vanityCode || 'CODE'}</code>
            </p>
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
              disabled={approveMutation.isPending}
              className='px-6 py-2.5 rounded-xl text-xs font-bold bg-[#fbbe15] hover:bg-[#e5ac10] text-[#1a1a1a] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 border-none'>
              {approveMutation.isPending && <Loader2 size={14} className='animate-spin' />}
              Approve Vanity Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
