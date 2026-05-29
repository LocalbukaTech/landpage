'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSavePreferencesMutation } from '@/lib/api/services/auth.hooks';

<<<<<<< HEAD
// Steps list
type OnboardingStep = 'preferences' | 'slide1' | 'slide2' | 'slide3' | 'welcome';

// Grid of 4 options for food preferences step
const preferenceOptions = [
  {
    id: 'affordability',
    title: 'Affordability',
    description: 'Find great food that wont break the bank.',
  },
  {
    id: 'hidden-gems',
    title: 'Hidden Gems',
    description: 'Explore local favorites and unique lesser known spots.',
  },
  {
    id: 'proximity',
    title: 'Proximity',
    description: 'Locate the best food options nearby and quickly.',
  },
  {
    id: 'ambiance',
    title: 'Ambiance',
    description: 'Discover places with great atmosphere & settings.',
  },
];
=======
const foodCategories = [
  { id: 'affordability', label: 'Affordability', description: 'Find food that won\'t break bank.' },
  { id: 'hidden-gems', label: 'Hidden Gems', description: 'Explore local favorites and unique lesser known spots.' },
  { id: 'proximity', label: 'Proximity', description: 'Locate the best food options nearby and quickly.' },
  { id: 'ambiance', label: 'Ambiance', description: 'Discover places with great atmosphere & settings.' },
]
>>>>>>> e27e097 (fix: onboarding mobile layout and feeds text alignment)

const PreferencesContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/feeds';

  // State machine values
  const [step, setStep] = useState<OnboardingStep>('preferences');
  const [direction, setDirection] = useState<number>(1); // For slide transitions direction
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);

  const savePreferencesMutation = useSavePreferencesMutation();

  // Toggles the selection of a preference option card
  const togglePreference = (id: string) => {
    setSelectedPrefs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

<<<<<<< HEAD
  // Navigates to a specific step with animation direction
  const goToStep = (nextStep: OnboardingStep, isNext: boolean = true) => {
    setDirection(isNext ? 1 : -1);
    setStep(nextStep);
  };

  // Submit preferences to backend and advance to slide1
  const handlePreferencesSubmit = () => {
    savePreferencesMutation.mutate(selectedPrefs, {
      onSuccess: () => {
        goToStep('slide1');
      },
      onError: (err) => {
        console.error('Error saving onboarding preferences:', err);
        goToStep('slide1'); // Proceed anyway so as to not block the user
      },
    });
  };

  // Skip direct to feed/redirect
  const handleSkipAll = () => {
    router.push(redirect);
=======
  const handleGoToFeed = () => {
    router.push(`/signup/feedsOverview?redirect=${encodeURIComponent(redirect)}`);
>>>>>>> e27e097 (fix: onboarding mobile layout and feeds text alignment)
  };

  // Main custom framer-motion variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 350, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      transition: {
        x: { type: 'spring' as const, stiffness: 350, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-white dark:bg-black flex flex-col justify-between overflow-x-hidden relative">

      {/* Top Bar with Skip (except on Welcome page) */}
      <div className="w-full flex justify-end px-6 py-6 sm:px-12 sm:py-8 z-20">
        {step !== 'welcome' && (
          <button
            onClick={handleSkipAll}
            className="text-sm sm:text-base font-semibold text-[#0A1F44] dark:text-white hover:opacity-75 transition-opacity cursor-pointer"
          >
            Skip
          </button>
        )}
=======
    <div className='relative min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black px-6 md:px-0'>
      <button
        onClick={() => {handleGoToFeed()}}
        className='absolute top-[71px] right-[16px] md:top-[75px] md:right-[40px] text-[13px] md:text-[19px] font-semibold leading-[1.4] text-[#0A1F44] md:text-[#000000] dark:text-white'>
        Skip
      </button>
      <div className='text-left md:text-center max-w-[576px] w-full'>
        <h1 className='text-[19px] md:text-[23px] font-bold text-[#151515] dark:text-white mb-2'>
          What matters to you the most when it comes to food?
        </h1>
        <p className='text-[13px] font-normal leading-[1.4] text-[#767676] dark:text-gray-400 mb-10'>
          Tell us your priority to get personalized recommendation
        </p>

        <div className='grid grid-cols-2 gap-[10px] mb-12'>
          {foodCategories.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            return (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`min-h-[82px] px-[16px] py-[10px] rounded-[20px] border text-left transition-all ${
                  isSelected
                    ? 'bg-[#E6E9EC] border-[#001F3F] text-gray-700 dark:text-gray-300'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-[#EBEBEB] dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                }`}>
               <p className='text-[11px] md:text-[19px] font-semibold leading-[1.4] text-[#001F3F] dark:text-white mb-1'>
               {category.label}
              </p>
              <p className='text-[11px] md:text-[13px] font-normal leading-[1.4] text-[#001F3F] dark:text-gray-400'>
                {category.description}
              </p>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleGoToFeed}
          className='fixed bottom-6 left-4 right-4 md:relative md:bottom-auto md:left-auto md:right-auto md:w-full h-[48px] px-[40px] bg-[#FBBE15] hover:bg-[#FBBE15]/90 text-[#0A1F44] font-semibold rounded-[12px] transition-colors'>
          Continue
        </button>
>>>>>>> e27e097 (fix: onboarding mobile layout and feeds text alignment)
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 z-10">
        <div className="max-w-[1200px] w-full flex flex-col items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>

            {/* STEP 1: PREFERENCES */}
            {step === 'preferences' && (
              <motion.div
                key="preferences"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full max-w-3xl flex flex-col items-center"
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1F44] dark:text-white mb-2 text-center tracking-tight px-2">
                  What matters to you the most when it comes to food?
                </h1>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-8 sm:mb-12 text-center px-4 py-2">
                  Tell us your priority to get personalized recommendation
                </p>

                {/* Grid 2x2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4 mb-10 sm:mb-14">
                  {preferenceOptions.map((opt) => {
                    const isSelected = selectedPrefs.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => togglePreference(opt.id)}
                        className={`text-left px-4 py-2 rounded-[20px] border transition-all duration-300 ${isSelected
                          ? 'bg-[#eef2f6] dark:bg-[#112240] border-[#0A1F44] dark:border-primary shadow-xs'
                          : 'bg-white dark:bg-[#1a1a1a] border-gray-100 dark:border-gray-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:border-gray-200 dark:hover:border-gray-700'
                          }`}
                      >
                        <h3 className="text-base sm:text-lg font-bold text-[#0A1F44] dark:text-white mb-1">
                          {opt.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                          {opt.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Continue button */}
                <div className="w-full max-w-2xl px-4 mb-6">
                  <button
                    onClick={handlePreferencesSubmit}
                    disabled={savePreferencesMutation.isPending}
                    className="w-full py-4 sm:py-4.5 bg-[#fbbe15] hover:opacity-90 active:scale-[0.99] text-[#0A1F44] font-bold rounded-xl transition-all text-sm sm:text-base shadow-sm cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {savePreferencesMutation.isPending && (
                      <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    )}
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: ONBOARDING SLIDE 1 */}
            {step === 'slide1' && (
              <motion.div
                key="slide1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full max-w-xl flex flex-col items-center"
              >
                {/* Overlay Cards Image */}
                <div className="w-full aspect-[4/3] relative mb-6 sm:mb-8 flex items-center justify-center">
                  <Image
                    src="/images/onboard1.png"
                    alt="This is where we eat"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-[#0A1F44] dark:text-white mb-2 text-center tracking-tight">
                  This is where we eat
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 sm:mb-12 text-center max-w-md px-4 leading-relaxed">
                  Find good meals, trusted spots, and honest recommendations.
                </p>

                {/* Next button */}
                <div className="w-[70%] px-6 mb-6">
                  <button
                    onClick={() => goToStep('slide2')}
                    className="w-full py-3 bg-[#fbbe15] hover:opacity-90 active:scale-[0.99] text-[#0A1F44] font-bold rounded-xl transition-all text-sm sm:text-base shadow-sm cursor-pointer"
                  >
                    Next
                  </button>
                </div>

                {/* Dots indicator */}
                <div className="flex gap-2.5 pb-4">
                  <span className="w-2 h-2 rounded-full bg-[#fbbe15]" />
                  <span className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <span className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-800" />
                </div>
              </motion.div>
            )}

            {/* STEP 3: ONBOARDING SLIDE 2 */}
            {step === 'slide2' && (
              <motion.div
                key="slide2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full max-w-xl flex flex-col items-center"
              >
                {/* Route Map Image */}
                <div className="w-full  aspect-[4/3] relative mb-6 sm:mb-8 flex items-center justify-center">
                  <Image
                    src="/images/onboard2.png"
                    alt="Found somewhere worth going back to?"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-[#0A1F44] dark:text-white mb-2 text-center tracking-tight">
                  Found somewhere worth going back to?
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 sm:mb-12 text-center max-w-md px-4 leading-relaxed">
                  Get back to your favorite spots with one tap.
                </p>

                {/* Next button */}
                <div className="w-[70%]  px-6 mb-6">
                  <button
                    onClick={() => goToStep('slide3')}
                    className="w-full py-3 bg-[#fbbe15] hover:opacity-90 active:scale-[0.99] text-[#0A1F44] font-bold rounded-xl transition-all text-sm sm:text-base shadow-sm cursor-pointer"
                  >
                    Next
                  </button>
                </div>

                {/* Dots indicator */}
                <div className="flex gap-2.5 pb-4">
                  <span className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <span className="w-2 h-2 rounded-full bg-[#fbbe15]" />
                  <span className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-800" />
                </div>
              </motion.div>
            )}

            {/* STEP 4: ONBOARDING SLIDE 3 */}
            {step === 'slide3' && (
              <motion.div
                key="slide3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full max-w-xl flex flex-col items-center"
              >
                {/* Card creation and Video Image */}
                <div className="w-full aspect-[4/3] relative mb-6 sm:mb-8 flex items-center justify-center">
                  <Image
                    src="/images/onboard3.png"
                    alt="Share your food story!"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-[#0A1F44] dark:text-white mb-2 text-center tracking-tight">
                  Share your food story!
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 sm:mb-12 text-center max-w-md px-4 leading-relaxed">
                  Post your meal, tag the spot, and help others discover it.
                </p>

                {/* Finish button & Skip subtext */}
                <div className="w-[70%] px-6 flex flex-col items-center">
                  <button
                    onClick={() => goToStep('welcome')}
                    className="w-full py-3 bg-[#fbbe15] hover:opacity-90 active:scale-[0.99] text-[#0A1F44] font-bold rounded-xl transition-all text-sm sm:text-base shadow-sm cursor-pointer"
                  >
                    Finish
                  </button>

                  <button
                    onClick={handleSkipAll}
                    className="mt-4 text-sm font-semibold text-[#0A1F44] dark:text-white hover:opacity-75 transition-all cursor-pointer"
                  >
                    Skip
                  </button>
                </div>

                {/* Dots indicator (all three highlighted matching mockup) */}
                <div className="flex gap-2.5 pt-6 pb-4">
                  <span className="w-2 h-2 rounded-full bg-[#fbbe15]" />
                  <span className="w-2 h-2 rounded-full bg-[#fbbe15]" />
                  <span className="w-2 h-2 rounded-full bg-[#fbbe15]" />
                </div>
              </motion.div>
            )}

            {/* STEP 5: WELCOME SCREEN */}
            {step === 'welcome' && (
              <motion.div
                key="welcome"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="fixed inset-0 w-screen h-screen flex flex-col items-center justify-center px-4 bg-white dark:bg-black z-50 overflow-hidden"
              >
                {/* Background Pattern Layer */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-90 dark:opacity-10 dark:invert">
                  <Image
                    src="/images/background-welcome.png"
                    alt="Background UT"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>

                {/* Badge */}
                <div className="z-10 bg-[#fefce8] border border-[#fbbe15] rounded-full px-5 py-2.5 mb-8 flex items-center shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#fbbe15] mr-2.5 inline-block" />
                  <span className="text-[10px] sm:text-xs font-bold text-[#0A1F44] tracking-widest uppercase">
                    Africa&apos;s Food Community
                  </span>
                </div>

                {/* Brand Title */}
                <h1 className="z-10 text-center flex flex-col items-center font-extrabold tracking-tight">
                  <span className="text-4xl sm:text-6xl text-[#0A1F44] dark:text-white">
                    Welcome to
                  </span>
                  <span className="text-4xl sm:text-6xl text-[#fbbe15] mt-1 sm:mt-2">
                    Localbuka.
                  </span>
                </h1>

                {/* Little yellow divider */}
                <div className="z-10 w-12 h-1 bg-[#fbbe15] my-6 rounded-full" />

                {/* Subheading */}
                <p className="z-10 text-[#0A1F44] dark:text-gray-200 text-lg sm:text-xl font-semibold mb-6 text-center">
                  You&apos;re exactly where food is.
                </p>

                {/* Detail Description */}
                <div className="z-10 max-w-sm text-center mb-10 px-4 leading-relaxed">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Africa&apos;s food community is here, and so are you.
                  </p>
                  <p className="text-sm text-[#0A1F44] dark:text-white font-bold mt-1.5">
                    Your first great discovery is closer than you think.
                  </p>
                </div>

                {/* Explore button */}
                <div className="z-10 w-full max-w-md px-4">
                  <button
                    onClick={handleSkipAll}
                    className="w-full py-4 bg-[#fbbe15] hover:opacity-90 active:scale-[0.99] text-[#0A1F44] font-bold rounded-xl transition-all text-sm sm:text-base shadow-sm cursor-pointer"
                  >
                    Explore
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Decorative spacing element for spacing alignment */}
      <div className="h-6 sm:h-12 z-0" />
    </div>
  );
};

const PreferencesPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <PreferencesContent />
    </Suspense>
  );
};

<<<<<<< HEAD
export default PreferencesPage;
=======
export default PreferencesPage;
>>>>>>> e27e097 (fix: onboarding mobile layout and feeds text alignment)
