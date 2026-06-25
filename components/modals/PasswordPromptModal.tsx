'use client';

import {useState} from 'react';
import {X, Eye, EyeOff, Loader2, KeyRound} from 'lucide-react';
import {usePasswordStatus, useCreatePassword} from '@/lib/api/services/auth.hooks';
import {useAuth} from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export function PasswordPromptModal() {
  const {isAuthenticated} = useAuth();
  const {data: statusData, isLoading: isLoadingStatus} = usePasswordStatus(isAuthenticated);
  const createPasswordMutation = useCreatePassword();

  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('dismissedPasswordPrompt') === 'true';
  });
  
  const [isExpanding, setIsExpanding] = useState(false); // whether to show form inputs
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');

  const hasPassword = statusData?.hasPassword;
  const canCreate = statusData?.canCreatePassword;

  // Show banner if they don't have a password, can create one, and haven't dismissed it
  const visible = isAuthenticated && !isLoadingStatus && !hasPassword && canCreate && !isDismissed;

  const handleClose = () => {
    sessionStorage.setItem('dismissedPasswordPrompt', 'true');
    setIsDismissed(true);
  };

  const handleCreatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please enter a password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    createPasswordMutation.mutate(
      {password},
      {
        onSuccess: () => {
          setShowSuccessModal(true);
          setIsDismissed(true);
        },
        onError: (err: any) => {
          setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
        },
      }
    );
  };

  if (!visible && !showSuccessModal) return null;

  return (
    <>
      {visible && (
        <div className='fixed top-20 right-4 left-4 md:left-auto md:w-96 z-50 bg-[#1e1e1e]/95 border border-white/10 text-white rounded-2xl shadow-2xl p-5 backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4'>
          {/* Close Header Button */}
          <button
            onClick={handleClose}
            className='absolute right-3 top-3 rounded-full p-1 text-zinc-400 hover:text-white hover:bg-white/5 transition-all focus:outline-none'
          >
            <X className='h-4 w-4' />
            <span className='sr-only'>Close</span>
          </button>

          {!isExpanding ? (
            <div className='flex items-start gap-3 pr-6'>
              <div className='w-10 h-10 rounded-full bg-[#fbbe15]/10 border border-[#fbbe15]/20 flex items-center justify-center text-[#fbbe15] shrink-0'>
                <KeyRound size={20} />
              </div>
              <div className='flex-1'>
                <h4 className='font-bold text-sm text-white mb-1'>Secure Your Account</h4>
                <p className='text-zinc-400 text-xs mb-3 leading-relaxed'>
                  You signed in via Google. Set a password to enable direct login.
                </p>
                <div className='flex gap-2'>
                  <button
                    onClick={() => setIsExpanding(true)}
                    className='px-3 py-1.5 bg-[#fbbe15] hover:bg-[#e5ac10] text-[#1a1a1a] text-xs font-bold rounded-lg transition-colors cursor-pointer border-none'
                  >
                    Set Password
                  </button>
                  <button
                    onClick={handleClose}
                    className='px-3 py-1.5 bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer border-none'
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreatePassword} className='flex flex-col gap-3 pr-2 pt-2'>
              <h4 className='font-bold text-sm text-white mb-1'>Create Password</h4>
              
              {error && (
                <div className='bg-red-950/40 border border-red-800 text-red-400 p-2 rounded-lg text-xs'>
                  {error}
                </div>
              )}

              {/* Password Input */}
              <div className='relative'>
                <label className='absolute top-1.5 left-3 text-[9px] text-zinc-500 font-semibold uppercase tracking-wider z-10'>
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder='Enter password'
                  className='w-full pt-5 pb-1.5 px-3 pr-10 bg-[#2a2a2a] border border-white/10 focus:border-[#FBBE15]/80 rounded-xl text-white text-xs focus:outline-none transition-colors placeholder:text-zinc-600'
                  disabled={createPasswordMutation.isPending}
                  required
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 cursor-pointer bg-transparent border-0'
                  type='button'
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Confirm Password Input */}
              <div className='relative'>
                <label className='absolute top-1.5 left-3 text-[9px] text-zinc-500 font-semibold uppercase tracking-wider z-10'>
                  Confirm Password
                </label>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder='Re-enter password'
                  className='w-full pt-5 pb-1.5 px-3 pr-10 bg-[#2a2a2a] border border-white/10 focus:border-[#FBBE15]/80 rounded-xl text-white text-xs focus:outline-none transition-colors placeholder:text-zinc-600'
                  disabled={createPasswordMutation.isPending}
                  required
                />
                <button
                  onClick={() => setShowConfirm(!showConfirm)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 cursor-pointer bg-transparent border-0'
                  type='button'
                >
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-2 mt-2'>
                <button
                  type='submit'
                  disabled={createPasswordMutation.isPending}
                  className='flex-1 py-2 bg-[#fbbe15] hover:bg-[#e5ac10] text-[#1a1a1a] text-xs font-bold rounded-lg transition-colors cursor-pointer border-none flex items-center justify-center gap-1.5'
                >
                  {createPasswordMutation.isPending && (
                    <Loader2 size={12} className='animate-spin' />
                  )}
                  {createPasswordMutation.isPending ? 'Saving...' : 'Save'}
                </button>
                <button
                  type='button'
                  onClick={() => setIsExpanding(false)}
                  disabled={createPasswordMutation.isPending}
                  className='py-2 px-3 bg-[#2a2a2a] hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer border-none'
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className='bg-white dark:bg-zinc-950 text-foreground border-gray-200 dark:border-zinc-800 rounded-3xl p-8 max-w-sm mx-auto z-[10000]'>
          <DialogHeader className='flex flex-col items-center text-center'>
            <div className='w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4'>
              <svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={3}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
              </svg>
            </div>
            <DialogTitle className='text-xl font-bold text-gray-900 dark:text-white'>
              Password Created
            </DialogTitle>
            <DialogDescription className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
              Your password has been successfully created. You can now use it to sign in directly.
            </DialogDescription>
          </DialogHeader>
          <div className='mt-6'>
            <button
              onClick={() => setShowSuccessModal(false)}
              className='w-full py-3 bg-primary hover:bg-primary/90 text-[#0A1F44] font-bold rounded-xl transition-all cursor-pointer border-none'>
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
