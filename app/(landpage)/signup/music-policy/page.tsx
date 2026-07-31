'use client';

import {useState, Suspense} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {motion} from 'framer-motion';
import {ArrowRight, Check, ShieldAlert, Disc3} from 'lucide-react';

function MusicPolicyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/feeds';
  const flow = searchParams.get('flow');

  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
    if (!agreed) return;
    const params = new URLSearchParams();
    if (redirect) params.set('redirect', redirect);
    if (flow) params.set('flow', flow);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    router.push(`/signup/preferences${queryString}`);
  };

  return (
    <div className='min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-black font-sans'>
      {/* Left Column: Image Banner */}
      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-900'>
        <Image
          src='/images/Onboarding.png'
          alt='Explore Your Restaurant Haven'
          fill
          priority
          className='object-cover object-center opacity-90'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent' />
        <div className='relative z-10 flex flex-col justify-end p-12 text-white'>
          <h1 className='text-2xl lg:text-3xl font-bold tracking-tight mb-3 text-white'>
            Explore Your Restaurant Haven
          </h1>
          <p className='text-zinc-200 text-base leading-relaxed mb-6 text-wrap w-[60%]'>
            Explore local restaurants, filter by budget, location, and cleanliness, and embark on a journey tailored just for you.
          </p>
          <div className='mb-8 flex items-center justify-end'>
            <div className='w-12 h-12 rounded-full border border-white/40 flex items-center justify-center text-white backdrop-blur-xs hover:bg-white/10 transition-colors cursor-pointer'>
              <ArrowRight className='w-6 h-6' />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Music Policy Consent Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 lg:p-12 overflow-y-auto'>
        <motion.div
          initial={{opacity: 0, y: 16}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.4, ease: 'easeOut'}}
          className='max-w-xl w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6'>
          {/* Header */}
          <div>
            <h2 className='text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2'>
              Music Usage Policy
            </h2>
            <p className='text-sm text-zinc-600 dark:text-zinc-400'>
              By continuing, you agree to Local Buka&apos;s music usage guidelines.
            </p>
          </div>

          {/* Policy Guidelines Content */}
          <div className='space-y-5 text-sm text-zinc-700 dark:text-zinc-300 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar'>
            {/* Section 1 */}
            <div>
              <h3 className='font-bold text-zinc-900 dark:text-white mb-2 text-sm'>
                What&apos;s allowed:
              </h3>
              <ul className='list-disc pl-5 space-y-1.5 marker:text-zinc-500'>
                <li>Original beats you created, royalty-free audio, or tracks you own rights to.</li>
                <li>
                  No In-App Music Library: LocalBuka does not provide a built-in music store or pre-licensed catalog. All uploaded audio is user-supplied.
                </li>
                <li>
                  Copyright Notice: Uploading unauthorized copyrighted music is prohibited. If infringement is detected, you may face content removal, account suspension, or third-party legal action. LocalBuka is not liable for unauthorized audio uploaded by users.
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div>
              <h3 className='font-bold text-zinc-900 dark:text-white mb-2 text-sm'>
                What&apos;s prohibited:
              </h3>
              <ul className='list-disc pl-5 space-y-1.5 marker:text-zinc-500'>
                <li>Commercial songs (e.g., Burna Boy, Davido) or unlicensed background audio playing in restaurants/events.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h3 className='font-bold text-zinc-900 dark:text-white mb-2 text-sm'>
                Enforcement:
              </h3>
              <ul className='list-disc pl-5 space-y-1.5 marker:text-zinc-500'>
                <li>Unauthorized audio may be muted or removed, and repeat violations can lead to account suspension.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h3 className='font-bold text-zinc-900 dark:text-white mb-2 text-sm'>
                Copyright Notice:
              </h3>
              <p className='text-zinc-600 dark:text-zinc-400 leading-relaxed text-xs md:text-sm'>
                Uploading unauthorized copyrighted music is prohibited. If infringement is detected, you may face content removal, account suspension, or third-party legal action. LocalBuka is not liable for unauthorized audio uploaded by users.
              </p>
            </div>

            <div className='pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500'>
              <span>Need full details?</span>
              <Link
                href='/privacy#music-usage-policy'
                target='_blank'
                className='text-[#b4830b] dark:text-[#fbbe15] hover:underline font-semibold'>
                Read Complete Policy →
              </Link>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className='pt-2'>
            <label className='flex items-start gap-3 cursor-pointer group select-none'>
              <div className='relative mt-0.5 flex items-center justify-center shrink-0'>
                <input
                  type='checkbox'
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className='peer sr-only'
                />
                <div className='w-5 h-5 rounded border-2 border-amber-600 dark:border-amber-500 bg-transparent peer-checked:bg-[#fbbe15] peer-checked:border-[#fbbe15] transition-all flex items-center justify-center'>
                  {agreed && <Check className='w-3.5 h-3.5 text-black stroke-[3]' />}
                </div>
              </div>
              <span className='text-xs md:text-sm font-medium text-amber-700 dark:text-amber-400 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors leading-snug'>
                I have read and agree to the Local Buka Music Usage Policy.
              </span>
            </label>
          </div>

          {/* Continue Action Button */}
          <button
            onClick={handleContinue}
            disabled={!agreed}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 ${
              agreed
                ? 'bg-[#fbbe15] text-black hover:bg-amber-400 cursor-pointer active:scale-[0.99]'
                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
            }`}>
            <span>Continue</span>
            <ArrowRight className='w-4 h-4' />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default function MusicPolicyPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-white dark:bg-black'>
          <div className='w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin' />
        </div>
      }>
      <MusicPolicyContent />
    </Suspense>
  );
}
