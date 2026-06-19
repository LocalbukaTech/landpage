'use client';

import {useState, useEffect} from 'react';
import {X, Eye, EyeOff, Loader2, KeyRound} from 'lucide-react';
import {usePasswordStatus, useCreatePassword} from '@/lib/api/services/auth.hooks';
import {useToast} from '@/hooks/use-toast';
import {useAuth} from '@/context/AuthContext';

export function PasswordPromptModal() {
  const {isAuthenticated} = useAuth();
  const {toast} = useToast();
  const {data: statusData, isLoading: isLoadingStatus} = usePasswordStatus(isAuthenticated);
  const createPasswordMutation = useCreatePassword();

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Check if we should show the modal
  useEffect(() => {
    if (!isAuthenticated || isLoadingStatus || !statusData) return;

    const hasPassword = statusData.hasPassword;
    const canCreate = statusData.canCreatePassword;
    const isDismissed = sessionStorage.getItem('dismissedPasswordPrompt') === 'true';

    // Show modal if they don't have a password, can create one, and haven't dismissed it
    if (!hasPassword && canCreate && !isDismissed) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, statusData, isLoadingStatus]);

  // Keep body overflow controlled when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleClose = () => {
    sessionStorage.setItem('dismissedPasswordPrompt', 'true');
    setOpen(false);
  };

  const handleCreatePassword = () => {
    if (!password) {
      toast({
        title: 'Password Required',
        description: 'Please enter a password.',
        variant: 'destructive',
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: 'Please make sure both passwords match.',
        variant: 'destructive',
      });
      return;
    }
    if (password.length < 6) {
      toast({
        title: 'Password Too Short',
        description: 'Your password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }

    createPasswordMutation.mutate(
      {password},
      {
        onSuccess: () => {
          toast({
            title: 'Password Created',
            description: 'You can now log in using your email and password!',
            variant: 'success',
          });
          setOpen(false);
        },
        onError: (err: any) => {
          toast({
            title: 'Failed to Create Password',
            description: err?.response?.data?.message || 'Something went wrong. Please try again.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/75 z-9999 backdrop-blur-sm animate-in fade-in'
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className='fixed inset-0 z-9999 flex items-center justify-center p-4'>
        <div
          className='relative bg-[#1e1e1e] border border-white/10 text-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Header Button */}
          <button
            onClick={handleClose}
            className='absolute right-4 top-4 rounded-full p-2 text-zinc-400 hover:text-white hover:bg-white/5 transition-all focus:outline-none'
          >
            <X className='h-5 w-5' />
            <span className='sr-only'>Close</span>
          </button>

          {/* Form Content */}
          <div className='p-6 md:p-8 flex flex-col items-center text-center'>
            <div className='w-16 h-16 rounded-full bg-[#fbbe15]/10 border border-[#fbbe15]/20 flex items-center justify-center mb-5 text-[#fbbe15]'>
              <KeyRound size={28} />
            </div>

            <h3 className='text-xl font-bold text-white mb-2'>Secure Your Account</h3>
            <p className='text-zinc-400 text-sm mb-6'>
              You signed in via Google. Set a password now to allow direct email sign-in, or you can skip and set it later in Settings.
            </p>

            <div className='w-full flex flex-col gap-4 text-left'>
              {/* Password Input */}
              <div className='relative'>
                <label className='absolute top-2 left-3 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider z-10'>
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter password'
                  className='w-full pt-6 pb-2 px-3 pr-10 bg-[#2a2a2a] border border-white/10 focus:border-[#FBBE15]/80 rounded-xl text-white text-sm focus:outline-none transition-colors placeholder:text-zinc-600'
                  disabled={createPasswordMutation.isPending}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 cursor-pointer bg-transparent border-0'
                  type='button'
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>

              {/* Confirm Password Input */}
              <div className='relative'>
                <label className='absolute top-2 left-3 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider z-10'>
                  Confirm Password
                </label>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Re-enter password'
                  className='w-full pt-6 pb-2 px-3 pr-10 bg-[#2a2a2a] border border-white/10 focus:border-[#FBBE15]/80 rounded-xl text-white text-sm focus:outline-none transition-colors placeholder:text-zinc-600'
                  disabled={createPasswordMutation.isPending}
                />
                <button
                  onClick={() => setShowConfirm(!showConfirm)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 cursor-pointer bg-transparent border-0'
                  type='button'
                >
                  {showConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className='w-full flex flex-col gap-3 mt-8'>
              <button
                onClick={handleCreatePassword}
                disabled={createPasswordMutation.isPending}
                className='w-full py-3 bg-[#fbbe15] text-[#1a1a1a] font-bold rounded-xl hover:bg-[#e5ac10] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer'
              >
                {createPasswordMutation.isPending && (
                  <Loader2 size={16} className='animate-spin' />
                )}
                {createPasswordMutation.isPending ? 'Creating Password...' : 'Create Password'}
              </button>
              
              <button
                onClick={handleClose}
                disabled={createPasswordMutation.isPending}
                className='w-full py-3 bg-transparent text-zinc-400 hover:text-white text-sm font-semibold transition-colors cursor-pointer border-none'
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
