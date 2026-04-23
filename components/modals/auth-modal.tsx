'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {X, Eye, EyeOff, Loader2} from 'lucide-react';
import {useAuth} from '@/context/AuthContext';
import {
  useSigninMutation,
  useSignupMutation,
} from '@/lib/api/services/auth.hooks';
import {API_BASE_URL} from '@/lib/api/client';
import {trackEvent, setAnalyticsUser} from '@/lib/analytics';

type AuthTab = 'signin' | 'signup';

export function AuthModal() {
  const {isAuthModalOpen, closeAuthModal, loginUser} = useAuth();
  const router = useRouter();
  const signinMutation = useSigninMutation();
  const signupMutation = useSignupMutation();

  const [tab, setTab] = useState<AuthTab>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [signinData, setSigninData] = useState({email: '', password: ''});
  const [signupData, setSignupData] = useState({
    fullName: '',
    referrerName: '',
    email: '',
    password: '',
  });

  if (!isAuthModalOpen) return null;

  const handleSignin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    signinMutation.mutate(
      {email: signinData.email, password: signinData.password},
      {
        onSuccess: (response) => {
          const {token, user} = response.data;
          setAnalyticsUser(user.id);
          trackEvent('login', {method: 'email'});
          loginUser(user, token.access_token);
          // Reset form
          setSigninData({email: '', password: ''});
          setError('');
        },
        onError: (err: any) => {
          setError(
            err?.response?.data?.message ||
              'Invalid email or password. Please try again.',
          );
        },
      },
    );
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    signupMutation.mutate(
      {
        email: signupData.email,
        fullName: signupData.fullName,
        referrerName: signupData.referrerName || undefined,
        password: signupData.password,
      },
      {
        onSuccess: () => {
          trackEvent('sign_up', {method: 'email'});
          // After signup, redirect to verification page
          closeAuthModal();
          router.push(
            `/signup/verify?email=${encodeURIComponent(signupData.email)}`,
          );
          setSignupData({
            fullName: '',
            referrerName: '',
            email: '',
            password: '',
          });
          setError('');
        },
        onError: (err: any) => {
          setError(
            err?.response?.data?.message ||
              'Failed to create account. Please try again.',
          );
        },
      },
    );
  };

  const handleGoogleAuth = () => {
    localStorage.setItem('google_auth_origin', tab);
    const currentOrigin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost:3000';
    window.location.href = `${API_BASE_URL}/auth/google?redirect_uri=${encodeURIComponent(currentOrigin + '/google_success')}&callbackUrl=${encodeURIComponent(currentOrigin + '/google_success')}`;
  };

  const switchTab = (newTab: AuthTab) => {
    setTab(newTab);
    setError('');
    setShowPassword(false);
  };

  const isLoading = signinMutation.isPending || signupMutation.isPending;

  return (
    <div className='fixed inset-0 z-9999 flex items-center justify-center'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/70 backdrop-blur-sm'
        onClick={closeAuthModal}
      />

      {/* Modal */}
      <div className='relative w-full max-w-md mx-4 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300'>
        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className='absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors z-10 cursor-pointer'>
          <X size={16} />
        </button>

        {/* Header */}
        <div className='px-8 pt-8 pb-4'>
          <h2 className='text-white text-xl font-bold'>
            {tab === 'signin' ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className='text-zinc-400 text-sm mt-1'>
            {tab === 'signin'
              ? 'Sign in to access all features'
              : 'Join LocalBuka to discover great restaurants'}
          </p>
        </div>

        {/* Tabs */}
        <div className='flex mx-8 mb-6 bg-[#111] rounded-xl p-1 gap-1'>
          <button
            onClick={() => switchTab('signin')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              tab === 'signin'
                ? 'bg-[#fbbe15] text-[#1a1a1a]'
                : 'text-zinc-400 hover:text-white'
            }`}>
            Sign In
          </button>
          <button
            onClick={() => switchTab('signup')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              tab === 'signup'
                ? 'bg-[#fbbe15] text-[#1a1a1a]'
                : 'text-zinc-400 hover:text-white'
            }`}>
            Sign Up
          </button>
        </div>

        {/* Content */}
        <div className='px-8 pb-8'>
          {/* Google Auth */}
          <button
            type='button'
            onClick={handleGoogleAuth}
            className='w-full flex items-center justify-center gap-3 px-4 py-3 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer'>
            <svg className='w-5 h-5' viewBox='0 0 24 24'>
              <path
                fill='#4285F4'
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
              />
              <path
                fill='#34A853'
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
              />
              <path
                fill='#FBBC05'
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
              />
              <path
                fill='#EA4335'
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
              />
            </svg>
            <span className='text-white text-sm font-medium'>
              Continue with Google
            </span>
          </button>

          {/* Divider */}
          <div className='flex items-center gap-4 my-5'>
            <div className='flex-1 h-px bg-white/10' />
            <span className='text-zinc-500 text-xs'>or</span>
            <div className='flex-1 h-px bg-white/10' />
          </div>

          {/* Error */}
          {error && (
            <div className='bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-4'>
              {error}
            </div>
          )}

          {/* Sign In Form */}
          {tab === 'signin' && (
            <form onSubmit={handleSignin} className='space-y-3'>
              <input
                type='email'
                placeholder='Email'
                value={signinData.email}
                onChange={(e) => {
                  setSigninData({...signinData, email: e.target.value});
                  setError('');
                }}
                required
                className='w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#fbbe15] transition-colors text-sm'
              />
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  value={signinData.password}
                  onChange={(e) => {
                    setSigninData({...signinData, password: e.target.value});
                    setError('');
                  }}
                  required
                  className='w-full px-4 py-3 pr-12 border border-white/10 rounded-xl bg-white/5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#fbbe15] transition-colors text-sm'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors'>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button
                type='submit'
                disabled={isLoading}
                className='w-full py-3.5 bg-[#fbbe15] hover:bg-[#e5ac10] text-[#1a1a1a] font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm'>
                {signinMutation.isPending ? (
                  <>
                    <Loader2 size={18} className='animate-spin' />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {tab === 'signup' && (
            <form onSubmit={handleSignup} className='space-y-3'>
              <input
                type='text'
                placeholder='Full Name'
                value={signupData.fullName}
                onChange={(e) => {
                  setSignupData({...signupData, fullName: e.target.value});
                  setError('');
                }}
                required
                className='w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#fbbe15] transition-colors text-sm'
              />
              <input
                type='text'
                placeholder='Referrer Name (optional)'
                value={signupData.referrerName}
                onChange={(e) =>
                  setSignupData({...signupData, referrerName: e.target.value})
                }
                className='w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#fbbe15] transition-colors text-sm'
              />
              <input
                type='email'
                placeholder='Email'
                value={signupData.email}
                onChange={(e) => {
                  setSignupData({...signupData, email: e.target.value});
                  setError('');
                }}
                required
                className='w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#fbbe15] transition-colors text-sm'
              />
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  value={signupData.password}
                  onChange={(e) => {
                    setSignupData({...signupData, password: e.target.value});
                    setError('');
                  }}
                  required
                  className='w-full px-4 py-3 pr-12 border border-white/10 rounded-xl bg-white/5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#fbbe15] transition-colors text-sm'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors'>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className='text-xs text-zinc-500'>
                By signing up you agree with our{' '}
                <a
                  href='https://www.localbuka.com/privacy'
                  className='text-[#fbbe15] hover:underline'>
                  Terms of Use
                </a>{' '}
                and{' '}
                <a
                  href='https://www.localbuka.com/privacy'
                  className='text-[#fbbe15] hover:underline'>
                  Privacy Policy
                </a>
                .
              </p>
              <button
                type='submit'
                disabled={isLoading}
                className='w-full py-3.5 bg-[#fbbe15] hover:bg-[#e5ac10] text-[#1a1a1a] font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm'>
                {signupMutation.isPending ? (
                  <>
                    <Loader2 size={18} className='animate-spin' />
                    Creating account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
