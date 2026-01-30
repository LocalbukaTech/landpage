'use client';

import {useState, useRef, useEffect, Suspense} from 'react';
import Image from 'next/image';
import {useRouter, useSearchParams} from 'next/navigation';
import {ChevronRight, Pencil, Loader2} from 'lucide-react';
import {useVerifyMutation, useResendCodeMutation} from '@/lib/api/services/auth.hooks';
import {useToast} from '@/hooks/use-toast';
import {VerificationCodeModal} from '@/components/modals';

const onboardingSlides = [
  {
    image: '/images/hero.jpg',
    title: 'Explore Your Restaurant Haven',
    description:
      'Explore local restaurants, filter by budget, location, and cleanliness, and embark on a journey tailored just for you.',
  },
  {
    image: '/images/soup.png',
    title: 'Discover Authentic Local Cuisine',
    description:
      'Find the best local dishes from trusted vendors, read reviews, and order with confidence.',
  },
];

const VerifyPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {toast} = useToast();
  const email = searchParams.get('email') || '';

  const verifyMutation = useVerifyMutation();
  const resendCodeMutation = useResendCodeMutation();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Extract code from message (e.g., "Your verification code is 1234")
  const extractCodeFromMessage = (message: string): string => {
    const codeMatch = message.match(/\b\d{4,6}\b/);
    return codeMatch ? codeMatch[0] : '';
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(''); // Clear error when user types

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < 4; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    setError('');

    const focusIndex = Math.min(pastedData.length, 3);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some((digit) => !digit)) return;

    setError('');
    const code = otp.join('');

    verifyMutation.mutate(
      {email, code},
      {
        onSuccess: () => {
          toast({
            title: 'Email verified! 🎉',
            description: 'Your account has been successfully verified.',
          });
  const redirect = searchParams.get('redirect') || '/';
  // ...
          router.push(`/signup/success?redirect=${encodeURIComponent(redirect)}`);
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message ||
            'Invalid verification code. Please try again.';
          setError(message);
        },
      }
    );
  };

  const handleResendCode = () => {
    if (!email) {
      setError('Email is required to resend code.');
      return;
    }

    resendCodeMutation.mutate(
      {email},
      {
        onSuccess: (response) => {
          // Extract code from data.message (API returns: { message: "...", data: { message: "...OTP is: \"1234\"" } })
          const dataMessage = response?.data?.message || '';
          const code = extractCodeFromMessage(dataMessage);
          
          if (code) {
            setVerificationCode(code);
            setShowCodeModal(true);
            setOtp(['', '', '', '']);
          } else {
            toast({
              title: 'Code sent! 📧',
              description: response?.message || 'A new verification code has been sent to your email.',
            });
            setOtp(['', '', '', '']);
            inputRefs.current[0]?.focus();
          }
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message ||
            'Failed to resend code. Please try again.';
          setError(message);
        },
      }
    );
  };

  const handleModalClose = () => {
    setShowCodeModal(false);
    inputRefs.current[0]?.focus();
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
          <button
            onClick={nextSlide}
            className='w-12 h-12 rounded-full border-2 border-white flex items-center justify-center hover:bg-white/20 transition-colors'>
            <ChevronRight className='w-6 h-6' />
          </button>
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

      {/* Right Side - Verify Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-black'>
        <div className='w-full max-w-md'>
          <h1 className='text-2xl sm:text-3xl font-bold text-[#0A1F44] dark:text-white mb-2'>
            Verify your account
          </h1>
          <p className='text-gray-500 dark:text-gray-400 mb-1'>
            We emailed you a 4 digit code to{' '}
            <span className='inline-flex items-center gap-1'>🍻</span>
          </p>
          <div className='flex items-center gap-2 mb-8'>
            <span className='text-primary font-medium'>{email}</span>
            <button
              onClick={() => router.back()}
              className='text-gray-400 hover:text-gray-600'>
              <Pencil className='w-4 h-4' />
            </button>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleVerify}>
            {error && (
              <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm mb-4'>
                {error}
              </div>
            )}

            <div className='flex gap-4 mb-8 justify-center'>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type='text'
                  inputMode='numeric'
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className='w-16 h-16 text-center text-2xl font-semibold border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                />
              ))}
            </div>

            <button
              type='submit'
              disabled={verifyMutation.isPending || otp.some((digit) => !digit)}
              className='w-full py-3.5 bg-primary hover:bg-primary/90 text-[#0A1F44] font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
              {verifyMutation.isPending ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' />
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </button>
          </form>

          <button
            onClick={handleResendCode}
            disabled={resendCodeMutation.isPending}
            className='w-full text-center text-gray-500 dark:text-gray-400 hover:text-[#0A1F44] dark:hover:text-white font-medium mt-4 transition-colors disabled:opacity-50 flex items-center justify-center gap-2'>
            {resendCodeMutation.isPending ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin' />
                Sending...
              </>
            ) : (
              'Resend Code'
            )}
          </button>
        </div>
      </div>
      
      {/* Verification Code Modal */}
      <VerificationCodeModal
        open={showCodeModal}
        onOpenChange={handleModalClose}
        code={verificationCode}
        email={email}
        title="New Code Sent! 📧"
        description="Here's your new verification code. Copy it and enter it above to verify your account."
      />
    </div>
  );
};

const VerifyPage = () => {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center'>
          <div className='animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full' />
        </div>
      }>
      <VerifyPageContent />
    </Suspense>
  );
};

export default VerifyPage;
