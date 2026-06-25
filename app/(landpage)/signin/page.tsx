'use client';

import {useState, Suspense} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {Eye, EyeOff, ChevronRight, Loader2} from 'lucide-react';
import {
  useSigninMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from '@/lib/api/services/auth.hooks';
import {userAuthService} from '@/lib/api';
import {useToast} from '@/hooks/use-toast';
import {API_BASE_URL} from '@/lib/api/client';
import {useAuth} from '@/context/AuthContext';
import {trackEvent, setAnalyticsUser} from '@/lib/analytics';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const onboardingSlides = [
  {
    image: '/images/Onboarding.png',
    title: 'Explore Your Restaurant Haven',
    description:
      'Explore local restaurants, filter by budget, location, and cleanliness, and embark on a journey tailored just for you.',
  },
  {
    image: '/images/hero.jpg',
    title: 'Discover Authentic Local Cuisine',
    description:
      'Find the best local dishes from trusted vendors, read reviews, and order with confidence.',
  },
];

const SignInContent = () => {
  const router = useRouter();
  const {toast} = useToast();
  const {loginUser} = useAuth();
  const signinMutation = useSigninMutation();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const resetPasswordMutation = useResetPasswordMutation();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/feeds';

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Forgot password views: 'signin' | 'forgot' | 'reset'
  const [authView, setAuthView] = useState<'signin' | 'forgot' | 'reset'>('signin');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [resetError, setResetError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    signinMutation.mutate(
      {
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: async (response) => {
          const {token, user} = response.data;
          loginUser(user, token.access_token);
          setAnalyticsUser(user.id, user.fullName, user.email, user.created_at);
          trackEvent('login', {method: 'email'});
          toast({
            title: 'Welcome back! 🎉',
            description: 'You have successfully signed in.',
          });
          
          try {
            const prefResponse = await userAuthService.getPreferences();
            const prefs = prefResponse?.data?.preferences;
            if (Array.isArray(prefs)) {
              router.push(redirect);
            } else {
              router.push(`/signup/preferences?flow=login&redirect=${encodeURIComponent(redirect)}`);
            }
          } catch (err) {
            console.log('No preferences found or error fetching, redirecting to onboarding:', err);
            router.push(`/signup/preferences?flow=login&redirect=${encodeURIComponent(redirect)}`);
          }
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message ||
            'Invalid email or password. Please try again.';
          setError(message);
        },
      },
    );
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    if (!forgotEmail) return;

    forgotPasswordMutation.mutate(
      {email: forgotEmail},
      {
        onSuccess: () => {
          toast({
            title: 'Reset code sent! ✉️',
            description: 'Please check your email for the reset code.',
          });
          setAuthView('reset');
        },
        onError: (err: any) => {
          setForgotError(
            err?.response?.data?.message ||
              'Failed to send reset code. Please try again.'
          );
        },
      }
    );
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    if (!resetCode || !newPassword || !confirmNewPassword) return;

    if (newPassword !== confirmNewPassword) {
      setResetError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setResetError("Password must be at least 6 characters.");
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
          setShowSuccessModal(true);
        },
        onError: (err: any) => {
          setResetError(
            err?.response?.data?.message ||
              'Failed to reset password. Please check the code and try again.'
          );
        },
      }
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % onboardingSlides.length);
  };

  return (
    <div className='min-h-screen flex'>
      {/* Left Side - Onboarding Carousel */}
      <div className='hidden lg:flex lg:w-1/2 relative'>
        <div className='absolute inset-0'>
          <Image
            src={onboardingSlides[currentSlide].image}
            alt='Onboarding'
            fill
            className='object-cover'
            priority
          />
          {/* Gradient Overlay */}
          <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent' />
        </div>

        {/* Content */}
        <div className='relative z-10 flex flex-col justify-end p-12 pb-16 text-white'>
          <h2 className='text-3xl xl:text-4xl font-bold mb-4'>
            {onboardingSlides[currentSlide].title}
          </h2>
          <p className='text-gray-200 text-lg max-w-md mb-8'>
            {onboardingSlides[currentSlide].description}
          </p>
          {/* Navigation */}
          <div className='flex justify-end relative z-10'>
            <button
              onClick={nextSlide}
              className='w-12 h-12 rounded-full border-2 border-white flex items-center justify-center hover:bg-white/20 transition-colors'>
              <ChevronRight className='w-6 h-6' />
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className='absolute bottom-8 left-12 flex gap-2'>
          {onboardingSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-black'>
        <div className='w-full max-w-md'>
          <h1 className='text-2xl sm:text-3xl font-bold text-[#0A1F44] dark:text-white mb-2'>
            {authView === 'signin' && 'Login'}
            {authView === 'forgot' && 'Forgot Password'}
            {authView === 'reset' && 'Reset Password'}
          </h1>
          <p className='text-gray-500 dark:text-gray-400 mb-8'>
            {authView === 'signin' && 'Welcome back!'}
            {authView === 'forgot' && 'Enter your email to receive a password reset code.'}
            {authView === 'reset' && `Enter the code sent to ${forgotEmail} and your new password.`}
          </p>

          {/* Google Sign In - only show on signin view */}
          {authView === 'signin' && (
            <>
              <button
                type='button'
                onClick={() => {
                  // Remember that the user initiated auth from the signin page
                  localStorage.setItem('google_auth_origin', 'signin');
                  const currentOrigin =
                    typeof window !== 'undefined'
                      ? window.location.origin
                      : 'http://localhost:3000';
                  window.location.href = `${API_BASE_URL}/auth/google?redirect_uri=${encodeURIComponent(currentOrigin + '/google_success')}&callbackUrl=${encodeURIComponent(currentOrigin + '/google_success')}`;
                }}
                className='w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
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
                <span className='text-gray-700 dark:text-gray-300 font-medium'>
                  Continue with Google
                </span>
              </button>

              {/* Divider */}
              <div className='flex items-center gap-4 my-6'>
                <div className='flex-1 h-px bg-gray-200 dark:bg-gray-800' />
                <span className='text-gray-400 text-sm'>or</span>
                <div className='flex-1 h-px bg-gray-200 dark:bg-gray-800' />
              </div>
            </>
          )}

          {/* Form conditional rendering */}
          {authView === 'signin' && (
            <form onSubmit={handleSubmit} className='space-y-4'>
              {error && (
                <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm'>
                  {error}
                </div>
              )}

              <div className='relative'>
                <input
                  type='email'
                  name='email'
                  placeholder='Email'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className='w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent peer'
                />
                {formData.email && (
                  <label className='absolute -top-2 left-3 px-1 text-xs text-primary bg-white dark:bg-gray-900'>
                    Email
                  </label>
                )}
              </div>

              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  placeholder='Password'
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className='w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                  {showPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>

              <div className='flex justify-end'>
                <button
                  type='button'
                  onClick={() => {
                    setForgotEmail(formData.email);
                    setAuthView('forgot');
                  }}
                  className='text-sm text-primary hover:underline font-semibold bg-transparent border-0 cursor-pointer p-0'>
                  Forgot Password?
                </button>
              </div>

              <button
                type='submit'
                disabled={signinMutation.isPending}
                className='w-full py-3.5 bg-primary hover:bg-primary/90 text-[#0A1F44] font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
                {signinMutation.isPending ? (
                  <>
                    <Loader2 className='w-5 h-5 animate-spin' />
                    Signing in...
                  </>
                ) : (
                  'Log In'
                )}
              </button>
            </form>
          )}

          {authView === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className='space-y-4'>
              {forgotError && (
                <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm'>
                  {forgotError}
                </div>
              )}

              <div className='relative'>
                <input
                  type='email'
                  placeholder='Email'
                  value={forgotEmail}
                  onChange={(e) => {
                    setForgotEmail(e.target.value);
                    setForgotError('');
                  }}
                  required
                  className='w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                />
                {forgotEmail && (
                  <label className='absolute -top-2 left-3 px-1 text-xs text-primary bg-white dark:bg-gray-900'>
                    Email
                  </label>
                )}
              </div>

              <button
                type='submit'
                disabled={forgotPasswordMutation.isPending}
                className='w-full py-3.5 bg-primary hover:bg-primary/90 text-[#0A1F44] font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
                {forgotPasswordMutation.isPending ? (
                  <>
                    <Loader2 className='w-5 h-5 animate-spin' />
                    Sending Code...
                  </>
                ) : (
                  'Send Reset Code'
                )}
              </button>

              <button
                type='button'
                onClick={() => setAuthView('signin')}
                className='w-full py-3.5 bg-transparent border border-gray-300 dark:border-gray-700 text-[#0A1F44] dark:text-white font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                Back to Login
              </button>
            </form>
          )}

          {authView === 'reset' && (
            <form onSubmit={handleResetSubmit} className='space-y-4'>
              {resetError && (
                <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm'>
                  {resetError}
                </div>
              )}

              <div className='relative'>
                <input
                  type='text'
                  placeholder='Verification Code'
                  value={resetCode}
                  onChange={(e) => {
                    setResetCode(e.target.value);
                    setResetError('');
                  }}
                  required
                  className='w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                />
                {resetCode && (
                  <label className='absolute -top-2 left-3 px-1 text-xs text-primary bg-white dark:bg-gray-900'>
                    Verification Code
                  </label>
                )}
              </div>

              <div className='relative'>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder='New Password'
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setResetError('');
                  }}
                  required
                  className='w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                />
                <button
                  type='button'
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                  {showNewPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>

              <div className='relative'>
                <input
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  placeholder='Confirm New Password'
                  value={confirmNewPassword}
                  onChange={(e) => {
                    setConfirmNewPassword(e.target.value);
                    setResetError('');
                  }}
                  required
                  className='w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                  {showConfirmNewPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>

              <button
                type='submit'
                disabled={resetPasswordMutation.isPending}
                className='w-full py-3.5 bg-primary hover:bg-primary/90 text-[#0A1F44] font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
                {resetPasswordMutation.isPending ? (
                  <>
                    <Loader2 className='w-5 h-5 animate-spin' />
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>

              <button
                type='button'
                onClick={() => setAuthView('forgot')}
                className='w-full py-3.5 bg-transparent border border-gray-300 dark:border-gray-700 text-[#0A1F44] dark:text-white font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                Back
              </button>
            </form>
          )}

          {authView === 'signin' && (
            <p className='text-center text-gray-500 dark:text-gray-400 mt-6'>
              Don&apos;t have an account? &nbsp;
              <Link
                href={`/signup${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
                className='text-[#0A1F44] dark:text-white font-semibold hover:underline'>
                Create an account
              </Link>
            </p>
          )}
        </div>
      </div>

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
              Password Reset
            </DialogTitle>
            <DialogDescription className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
              Your password has been successfully reset. You can now use your new password to log in.
            </DialogDescription>
          </DialogHeader>
          <div className='mt-6'>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setAuthView('signin');
                setFormData((prev) => ({ ...prev, password: '' })); // clear old password
              }}
              className='w-full py-3 bg-primary hover:bg-primary/90 text-[#0A1F44] font-bold rounded-xl transition-all cursor-pointer border-none'>
              Log In Now
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SignInPage = () => {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center'>
          <Loader2 className='w-8 h-8 animate-spin text-primary' />
        </div>
      }>
      <SignInContent />
    </Suspense>
  );
};

export default SignInPage;
