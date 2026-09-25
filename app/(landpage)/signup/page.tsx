'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ChevronRight, Loader2 } from 'lucide-react';
import { PasswordChecklist, allPasswordRulesPass } from './password-checklist';
import { useSignupMutation } from '@/lib/api/services/auth.hooks';
import { useValidateReferralCode } from '@/lib/api/services/referral.hooks';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/lib/api/client';
import { trackEvent } from '@/lib/analytics';
import { getDeviceId } from '@/lib/deviceId';
import { getSafeRedirectUrl } from '@/lib/utils';

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

const SignUpContent = () => {
  const router = useRouter();
  const { toast } = useToast();
  const signupMutation = useSignupMutation();
  const searchParams = useSearchParams();
  const redirect = getSafeRedirectUrl(searchParams.get('redirect'), '/');

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(() => ({
    fullName: '',
    referralCode: searchParams.get('ref') || '',
    email: '',
    password: '',
  }));

  // Auto-fill referral code from ?ref= URL query param (for shared referral links)
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      const timer = setTimeout(() => {
        setFormData(prev => ({...prev, referralCode: refCode}));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const { mutate: validateCode } = useValidateReferralCode();
  const [referrerStatus, setReferrerStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
  const [referrerName, setReferrerName] = useState('');
  const [referrerMessage, setReferrerMessage] = useState('');
  const lastValidatedCodeRef = useRef<string>('');

  useEffect(() => {
    const code = formData.referralCode.trim();
    if (!code) {
      if (lastValidatedCodeRef.current) {
        lastValidatedCodeRef.current = '';
        const timer = setTimeout(() => {
          setReferrerStatus('idle');
          setReferrerName('');
          setReferrerMessage('');
        }, 0);
        return () => clearTimeout(timer);
      }
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
  }, [formData.referralCode, validateCode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const allRulesPass = allPasswordRulesPass(formData.password);

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    if (!allRulesPass) return;
    setError('');
    const trimmedCode = formData.referralCode.trim();
    const deviceId = trimmedCode ? getDeviceId() : undefined;

    signupMutation.mutate(
      {
        email: formData.email,
        fullName: formData.fullName,
        referralCode: trimmedCode || undefined,
        deviceId,
        password: formData.password,
      },
      {
        onSuccess: (response: any) => {
          trackEvent('sign_up', { method: 'email' });

          toast({
            title: 'Account created! 🎉',
            description:
              response?.message ||
              'Please check your email for the verification code.',
          });
          router.push(
            `/signup/verify?email=${encodeURIComponent(formData.email)}&redirect=${encodeURIComponent(redirect)}`,
          );
          // }
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message ||
            'Failed to create account. Please try again.';
          setError(message);
        },
      },
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
          <div className='flex justify-end'>
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
              className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/40'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-black'>
        <div className='w-full max-w-md'>

          {/* Referrer Banner */}
          {referrerStatus === 'valid' && (
            <div className='flex items-center justify-between bg-[#f6fcf8] border border-green-200 dark:bg-green-900/20 dark:border-green-800 rounded-xl px-4 py-2 mb-8 animate-in fade-in slide-in-from-top-2 duration-300'>
              <div className='flex items-center gap-3'>
                <span className='text-xs sm:text-sm text-emerald-900 dark:text-emerald-50'>
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

          <h1 className='text-2xl sm:text-3xl font-bold text-[#0A1F44] dark:text-white mb-2'>
            Create an account
          </h1>
          <p className='text-gray-500 dark:text-gray-400 mb-8'>
            Register to find restaurants near you! 👋
          </p>

          {/* Google Sign Up */}
          <button
            type='button'
            onClick={() => {
              // Remember that the user initiated auth from the signup page
              localStorage.setItem('google_auth_origin', 'signup');
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

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            {error && (
              <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm'>
                {error}
              </div>
            )}

            <div>
              <input
                type='text'
                name='fullName'
                placeholder='Full Name'
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className='w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
              />
            </div>

            <div className='relative'>
              <input
                type='text'
                name='referralCode'
                placeholder='Referral Code (optional) e.g. REF-CYM67C'
                value={formData.referralCode}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors peer`}
              />
              {referrerStatus === 'loading' && (
                <div className='flex items-center gap-1.5 mt-1.5 px-1'>
                  <Loader2 className='w-4 h-4 animate-spin text-gray-500' />
                  <span className='text-sm text-gray-500'>Verifying referral code...</span>
                </div>
              )}
              {referrerStatus === 'invalid' && (
                <div className='flex items-center gap-1.5 mt-1.5 px-1'>
                  <svg className='w-4 h-4 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                  <span className='text-sm text-red-500'>{referrerMessage}</span>
                </div>
              )}
            </div>

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

            <PasswordChecklist password={formData.password} />

            <p className='text-sm text-gray-500 dark:text-gray-400'>
              By signing up you agree with our{' '}
              <Link href='/privacy' className='text-primary hover:underline'>
                Terms of Use
              </Link>{' '}
              and{' '}
              <Link href='/privacy' className='text-primary hover:underline'>
                Privacy Policy
              </Link>
              .
            </p>

            <button
              type='submit'
              disabled={signupMutation.isPending || !allRulesPass}
              className='w-full py-3.5 bg-primary hover:bg-primary/90 text-[#0A1F44] font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
              {signupMutation.isPending ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <p className='text-center text-gray-500 dark:text-gray-400 mt-6'>
            Already have an account?{' '}
            <Link
              href={`/signin${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
              className='text-[#0A1F44] dark:text-white font-semibold hover:underline'>
              Log In
            </Link>
          </p>
        </div>
      </div>

      {/* Verification Code Modal */}
      {/* <VerificationCodeModal
        open={showCodeModal}
        onOpenChange={handleModalClose}
        code={verificationCode}
        email={formData.email}
        title='Account Created! 🎉'
        description="Here's your verification code. Copy it and use it on the next screen to verify your account."
      /> */}
    </div>
  );
};

const SignUpPage = () => {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center'>
          <Loader2 className='w-8 h-8 animate-spin text-primary' />
        </div>
      }>
      <SignUpContent />
    </Suspense>
  );
};

export default SignUpPage;
