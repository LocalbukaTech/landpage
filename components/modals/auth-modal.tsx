'use client';

import {useState, useEffect, useRef} from 'react';
import Image from 'next/image';
import {useRouter, usePathname} from 'next/navigation';
import {X, Eye, EyeOff, Loader2} from 'lucide-react';
import {useAuth} from '@/context/AuthContext';
import {
  useSigninMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from '@/lib/api/services/auth.hooks';
import {useValidateReferralCode} from '@/lib/api/services/referral.hooks';
import {getDeviceId} from '@/lib/deviceId';
import {useToast} from '@/hooks/use-toast';
import {userAuthService} from '@/lib/api';
import {API_BASE_URL} from '@/lib/api/client';
import {trackEvent, setAnalyticsUser} from '@/lib/analytics';

type AuthTab = 'signin' | 'signup' | 'forgot' | 'reset';

export function AuthModal() {
  const {isAuthModalOpen, closeAuthModal, loginUser} = useAuth();
  const {toast} = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const signinMutation = useSigninMutation();
  const signupMutation = useSignupMutation();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const resetPasswordMutation = useResetPasswordMutation();

  const [tab, setTab] = useState<AuthTab>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [signinData, setSigninData] = useState({email: '', password: ''});
  const [signupData, setSignupData] = useState({
    fullName: '',
    referralCode: '',
    email: '',
    password: '',
  });

  const {mutate: validateCode} = useValidateReferralCode();
  const [referrerStatus, setReferrerStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
  const [referrerName, setReferrerName] = useState('');
  const [referrerMessage, setReferrerMessage] = useState('');
  const lastValidatedCodeRef = useRef<string>('');

  // Auto-detect referral code from URL or storage when modal opens
  useEffect(() => {
    if (typeof window !== 'undefined' && isAuthModalOpen) {
      try {
        const params = new URLSearchParams(window.location.search);
        const refCode = params.get('ref') || params.get('referral') || localStorage.getItem('localbuka_ref_code');
        if (refCode) {
          setSignupData((prev) => (prev.referralCode ? prev : {...prev, referralCode: refCode}));
          if (params.get('ref') || params.get('referral')) {
            setTab('signup');
          }
        }
      } catch {
        // Ignore URL parsing errors
      }
    }
  }, [isAuthModalOpen]);

  useEffect(() => {
    const code = signupData.referralCode.trim();
    if (!code) {
      lastValidatedCodeRef.current = '';
      setReferrerStatus('idle');
      setReferrerName('');
      setReferrerMessage('');
      return;
    }

    if (code === lastValidatedCodeRef.current) return;

    const timeoutId = setTimeout(() => {
      lastValidatedCodeRef.current = code;
      setReferrerStatus('loading');
      validateCode(
        { referralCode: code },
        {
          onSuccess: (res: any) => {
            const data = res?.data !== undefined ? res.data : res;
            if (data?.valid !== false && data?.valid === true) {
              setReferrerStatus('valid');
              setReferrerName(data?.referrerName || '');
              setReferrerMessage(data?.message || 'Referral code is valid!');
            } else {
              setReferrerStatus('invalid');
              setReferrerName('');
              setReferrerMessage(data?.message || 'This code is not valid. Check it and try again.');
            }
          },
          onError: (err: any) => {
            setReferrerStatus('invalid');
            setReferrerName('');
            setReferrerMessage(err?.response?.data?.message || 'This code is not valid. Check it and try again.');
          },
        }
      );
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [signupData.referralCode, validateCode]);

  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  if (!isAuthModalOpen) return null;
  if (pathname?.startsWith('/signup') || pathname?.startsWith('/signin') || pathname?.startsWith('/secure-admin')) return null;

  const handleSignin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    signinMutation.mutate(
      {email: signinData.email, password: signinData.password},
      {
        onSuccess: (response) => {
          const {token, user} = response.data;
          setAnalyticsUser(user.id, user.fullName, user.email, user.created_at);
          trackEvent('login', {method: 'email'});
          loginUser(user, token.access_token);
          // Reset form
          setSigninData({email: '', password: ''});
          setError('');

          userAuthService.getPreferences()
            .then((prefResponse) => {
              const prefs = prefResponse?.data?.preferences;
              if (!Array.isArray(prefs)) {
                closeAuthModal();
                router.push('/signup/preferences?flow=login');
              }
            })
            .catch((err) => {
              console.log('No preferences found or error fetching, redirecting to onboarding:', err);
              closeAuthModal();
              router.push('/signup/preferences?flow=login');
            });
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

    const trimmedCode = signupData.referralCode.trim();
    const deviceId = trimmedCode ? getDeviceId() : undefined;

    signupMutation.mutate(
      {
        email: signupData.email,
        fullName: signupData.fullName,
        referralCode: trimmedCode || undefined,
        deviceId,
        password: signupData.password,
      },
      {
        onSuccess: (response: any) => {
          trackEvent('sign_up', {method: 'email'});
          toast({
            title: 'Account created! 🎉',
            description:
              response?.message ||
              'Please check your email for the verification code.',
          });

          // After signup, redirect to verification page
          closeAuthModal();
          router.push(
            `/signup/verify?email=${encodeURIComponent(signupData.email)}`,
          );
          setSignupData({
            fullName: '',
            referralCode: '',
            email: '',
            password: '',
          });
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

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!forgotEmail) return;

    forgotPasswordMutation.mutate(
      {email: forgotEmail},
      {
        onSuccess: () => {
          toast({
            title: 'Code Sent! ✉️',
            description: 'Check your inbox for a password reset code.',
          });
          setTab('reset');
        },
        onError: (err: any) => {
          setError(
            err?.response?.data?.message ||
              'Failed to request reset. Please try again.'
          );
        },
      }
    );
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!resetCode || !newPassword || !confirmNewPassword) return;

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    resetPasswordMutation.mutate(
      {
        email: forgotEmail,
        code: resetCode,
        newPassword: newPassword,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Password Reset Successful! 🎉',
            description: 'Please sign in with your new password.',
          });
          setTab('signin');
          setSigninData((prev) => ({...prev, email: forgotEmail, password: ''}));
        },
        onError: (err: any) => {
          setError(
            err?.response?.data?.message ||
              'Failed to reset password. Please check the code and try again.'
          );
        },
      }
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
            {tab === 'signin' && 'Welcome back'}
            {tab === 'signup' && 'Create an account'}
            {tab === 'forgot' && 'Forgot Password'}
            {tab === 'reset' && 'Reset Password'}
          </h2>
          <p className='text-zinc-400 text-sm mt-1'>
            {tab === 'signin' && 'Sign in to access all features'}
            {tab === 'signup' && 'Join LocalBuka to discover great restaurants'}
            {tab === 'forgot' && 'Enter your email to receive a password reset code.'}
            {tab === 'reset' && `Enter the code sent to ${forgotEmail} and your new password.`}
          </p>
        </div>

        {/* Tabs */}
        {(tab === 'signin' || tab === 'signup') && (
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
        )}

        {/* Content */}
        <div className='px-8 pb-8'>
          {/* Google Auth */}
          {(tab === 'signin' || tab === 'signup') && (
            <>
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
            </>
          )}

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

              <div className='flex justify-end'>
                <button
                  type='button'
                  onClick={() => {
                    setForgotEmail(signinData.email);
                    setTab('forgot');
                    setError('');
                  }}
                  className='text-xs text-[#fbbe15] hover:underline font-semibold bg-transparent border-0 cursor-pointer p-0'>
                  Forgot Password?
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
            <div className='flex flex-col gap-3'>
              {/* Referrer Banner */}
              {referrerStatus === 'valid' && (
                <div className='flex items-center justify-between bg-[#f6fcf8] border border-green-200 dark:bg-green-900/20 dark:border-green-800 rounded-xl px-4 py-2 mb-1 animate-in fade-in slide-in-from-top-2 duration-300'>
                  <div className='flex items-center gap-3'>
                    <span className='text-xs text-emerald-900 dark:text-emerald-50'>
                      <span className='font-semibold text-gray-900 dark:text-white capitalize'>{referrerName || 'A friend'}</span> invited you to join localbuka.<br />
                      <span className='text-gray-500 dark:text-gray-400'>Sign up to claim your first reward.</span>
                    </span>
                  </div>
                  <Image
                    src='/images/verified-badge.png'
                    alt='Verified'
                    width={24}
                    height={24}
                    className='w-6 h-6 flex-shrink-0 ml-2'
                  />
                </div>
              )}

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
                <div>
                  <input
                    type='text'
                    placeholder='Referral Code (optional) e.g. REF-CYM67C'
                    value={signupData.referralCode}
                    onChange={(e) =>
                      setSignupData({...signupData, referralCode: e.target.value})
                    }
                    className='w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#fbbe15] transition-colors text-sm'
                  />
                  {referrerStatus === 'loading' && (
                    <div className='flex items-center gap-1.5 mt-1 px-1 text-xs text-zinc-400'>
                      <Loader2 className='w-3.5 h-3.5 animate-spin text-[#fbbe15]' />
                      <span>Verifying referral code...</span>
                    </div>
                  )}
                  {referrerStatus === 'invalid' && (
                    <div className='flex items-center gap-1.5 mt-1 px-1 text-xs text-red-400'>
                      <span>{referrerMessage}</span>
                    </div>
                  )}
                </div>
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
          </div>
          )}

          {/* Forgot Password Form */}
          {tab === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className='space-y-3'>
              <input
                type='email'
                placeholder='Email'
                value={forgotEmail}
                onChange={(e) => {
                  setForgotEmail(e.target.value);
                  setError('');
                }}
                required
                className='w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#fbbe15] transition-colors text-sm'
              />
              <button
                type='submit'
                disabled={forgotPasswordMutation.isPending}
                className='w-full py-3.5 bg-[#fbbe15] hover:bg-[#e5ac10] text-[#1a1a1a] font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm'>
                {forgotPasswordMutation.isPending ? (
                  <>
                    <Loader2 size={18} className='animate-spin' />
                    Sending Code...
                  </>
                ) : (
                  'Send Reset Code'
                )}
              </button>
              <button
                type='button'
                onClick={() => {
                  setTab('signin');
                  setError('');
                }}
                className='w-full py-3.5 bg-transparent border border-white/10 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-sm'>
                Back to Sign In
              </button>
            </form>
          )}

          {/* Reset Password Form */}
          {tab === 'reset' && (
            <form onSubmit={handleResetSubmit} className='space-y-3'>
              <input
                type='text'
                placeholder='Verification Code'
                value={resetCode}
                onChange={(e) => {
                  setResetCode(e.target.value);
                  setError('');
                }}
                required
                className='w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#fbbe15] transition-colors text-sm'
              />
              <div className='relative'>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder='New Password'
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError('');
                  }}
                  required
                  className='w-full px-4 py-3 pr-12 border border-white/10 rounded-xl bg-white/5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#fbbe15] transition-colors text-sm'
                />
                <button
                  type='button'
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors'>
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className='relative'>
                <input
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  placeholder='Confirm New Password'
                  value={confirmNewPassword}
                  onChange={(e) => {
                    setConfirmNewPassword(e.target.value);
                    setError('');
                  }}
                  required
                  className='w-full px-4 py-3 pr-12 border border-white/10 rounded-xl bg-white/5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#fbbe15] transition-colors text-sm'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors'>
                  {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button
                type='submit'
                disabled={resetPasswordMutation.isPending}
                className='w-full py-3.5 bg-[#fbbe15] hover:bg-[#e5ac10] text-[#1a1a1a] font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm'>
                {resetPasswordMutation.isPending ? (
                  <>
                    <Loader2 size={18} className='animate-spin' />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
              <button
                type='button'
                onClick={() => {
                  setTab('forgot');
                  setError('');
                }}
                className='w-full py-3.5 bg-transparent border border-white/10 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-sm'>
                Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
