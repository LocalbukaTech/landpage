'use client';

/**
 * Signup onboarding — step 3 of 3
 * Route: /signup/postCreateOverview
 */

import {Suspense} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {Loader2, Volume2, Maximize2} from 'lucide-react';

const PAGE_INDEX = 2;

// ── Scaled Figma SVG icons ───────────────────────────────────────────────────
function PinIcon({size = 11}: {size?: number}) {
  return (
    <svg width={size} height={size * 1.36} viewBox="0 0 11 15" fill="none" aria-hidden>
      <path d="M5.1158 6.94288C4.63123 6.94288 4.16651 6.75038 3.82387 6.40774C3.48123 6.0651 3.28873 5.60037 3.28873 5.1158C3.28873 4.63123 3.48123 4.16651 3.82387 3.82387C4.16651 3.48123 4.63123 3.28873 5.1158 3.28873C5.60037 3.28873 6.0651 3.48123 6.40774 3.82387C6.75038 4.16651 6.94288 4.63123 6.94288 5.1158C6.94288 5.35574 6.89562 5.59332 6.8038 5.81499C6.71198 6.03667 6.5774 6.23808 6.40774 6.40774C6.23808 6.5774 6.03667 6.71198 5.81499 6.8038C5.59332 6.89562 5.35574 6.94288 5.1158 6.94288ZM5.1158 0C3.75901 0 2.45778 0.538985 1.49838 1.49838C0.538985 2.45778 0 3.75901 0 5.1158C0 8.95266 5.1158 14.6166 5.1158 14.6166C5.1158 14.6166 10.2316 8.95266 10.2316 5.1158C10.2316 3.75901 9.69262 2.45778 8.73322 1.49838C7.77382 0.538985 6.4726 0 5.1158 0Z" fill="currentColor"/>
    </svg>
  );
}

function TagIcon({size = 15}: {size?: number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" aria-hidden>
      <path fillRule="evenodd" clipRule="evenodd" d="M6.12854 0.00901961C6.42362 -0.0178284 6.72107 0.0154109 7.00294 0.10673C7.28481 0.198049 7.54525 0.345553 7.76852 0.540332L7.87815 0.642648L13.5947 6.35993C13.9881 6.75342 14.2172 7.28178 14.2355 7.83791C14.2538 8.39404 14.06 8.93633 13.6934 9.35486L13.5947 9.4601L9.46039 13.5944C9.0669 13.9878 8.53854 14.2169 7.98241 14.2352C7.42628 14.2535 6.88399 14.0597 6.46546 13.6931L6.36022 13.5944L0.642209 7.87713C0.432808 7.66774 0.267996 7.4181 0.157713 7.14327C0.0474308 6.86845 -0.00603528 6.57413 0.000540696 6.27807L0.00857993 6.12825L0.353531 2.3389C0.397818 1.85055 0.604536 1.39114 0.940646 1.0341C1.27676 0.677056 1.72285 0.442993 2.20764 0.369318L2.33846 0.353971L6.12854 0.00901961ZM4.29197 4.29241C4.15621 4.42816 4.04853 4.58933 3.97506 4.7667C3.90159 4.94407 3.86377 5.13418 3.86377 5.32617C3.86377 5.51815 3.90159 5.70826 3.97506 5.88563C4.04853 6.06301 4.15621 6.22417 4.29197 6.35993C4.42772 6.49568 4.58889 6.60337 4.76626 6.67684C4.94363 6.75031 5.13374 6.78812 5.32573 6.78812C5.51771 6.78812 5.70782 6.75031 5.88519 6.67684C6.06257 6.60337 6.22373 6.49568 6.35949 6.35993C6.63365 6.08576 6.78768 5.7139 6.78768 5.32617C6.78768 4.93843 6.63365 4.56658 6.35949 4.29241C6.08532 4.01824 5.71346 3.86421 5.32573 3.86421C4.93799 3.86421 4.56614 4.01824 4.29197 4.29241Z" fill="currentColor"/>
    </svg>
  );
}

function HashIcon({size = 12}: {size?: number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M11.6933 3.65415C11.6933 3.25219 11.3644 2.92332 10.9624 2.92332H8.76995V0.730829C8.76995 0.328873 8.44108 0 8.03912 0C7.63717 0 7.30829 0.328873 7.30829 0.730829V2.92332H4.38497V0.730829C4.38497 0.328873 4.0561 0 3.65415 0C3.25219 0 2.92332 0.328873 2.92332 0.730829V2.92332H0.730829C0.328873 2.92332 0 3.25219 0 3.65415C0 4.0561 0.328873 4.38497 0.730829 4.38497H2.92332V7.30829H0.730829C0.328873 7.30829 0 7.63717 0 8.03912C0 8.44108 0.328873 8.76995 0.730829 8.76995H2.92332V10.9624C2.92332 11.3644 3.25219 11.6933 3.65415 11.6933C4.0561 11.6933 4.38497 11.3644 4.38497 10.9624V8.76995H7.30829V10.9624C7.30829 11.3644 7.63717 11.6933 8.03912 11.6933C8.44108 11.6933 8.76995 11.3644 8.76995 10.9624V8.76995H10.9624C11.3644 8.76995 11.6933 8.44108 11.6933 8.03912C11.6933 7.63717 11.3644 7.30829 10.9624 7.30829H8.76995V4.38497H10.9624C11.3644 4.38497 11.6933 4.0561 11.6933 3.65415ZM7.30829 7.30829H4.38497V4.38497H7.30829V7.30829Z" fill="currentColor"/>
    </svg>
  );
}

// ── Desktop Figma exact values ────────────────────────────────────────────────
const F = {
  leftColW: 435.5741882324219,
  leftColH: 249.0953826904297,
  gap: 7.31,
  actionW: 285.02337646484375,
  actionH: 77.4678955078125,
  btnH: 35.07979965209961,
  mediaW: 374.1845397949219,
  mediaH: 336.1814270019531,
  mediaR: 8.77,
  shareW: 447.2674560546875,
  shareH: 409.26434326171875,
  shareGap: 29.23,
  sharePad: 36.54,
  shareR: 17.54,
  detailsLabelFS: 16.81,
  whatHappensH: 177.59,
  whatHappensFS: 13.89,
  shareHeadingFS: 23,
  shareBodyFS: 16,
  finishSkipFS: 19,
  fs: 11.69,
} as const;

function PostCreateOverviewContent() {
  const router = useRouter();
  const handleSkip = () => router.push('/feeds');

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-white dark:bg-black overflow-x-hidden">

      {/* Skip button — top-right, both mobile & desktop */}
      <button
        onClick={handleSkip}
        className="absolute top-[71px] right-[16px] md:top-[75px] md:right-[40px] text-[13px] md:text-[19px] font-semibold leading-[1.4] text-[#000000] dark:text-white cursor-pointer hover:opacity-85 transition-opacity z-10"
      >
        Skip
      </button>

      {/* ═══════════════════════════════════════════════════════════════════════
          DESKTOP VIEW
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="w-full hidden md:flex flex-col items-center px-4 pt-[71px] md:pt-[75px] pb-[40px]">
        <div className="flex flex-col" style={{width: '100%', maxWidth: 974, gap: 24}}>

          {/* Details Card */}
          <div
            className="w-full bg-white dark:bg-zinc-900 border border-[#E5E7EB] dark:border-zinc-800 flex flex-row items-start justify-between shadow-sm"
            style={{borderRadius: 18, padding: 16}}
          >
            {/* Left Column */}
            <div className="flex flex-col flex-shrink-0" style={{width: F.leftColW, minHeight: F.leftColH, gap: F.gap}}>
              <span className="text-[#111827] dark:text-white font-bold" style={{fontSize: F.detailsLabelFS, lineHeight: '140%'}}>
                Details
              </span>

              <div className="flex flex-col">
                <span className="text-[#6B7280] font-bold mb-1 pl-3.5" style={{fontSize: F.detailsLabelFS, lineHeight: '140%'}}>
                  Description
                </span>
                <div
                  className="w-full bg-[#FAFAFA] dark:bg-zinc-800 border border-[#E5E7EB] dark:border-zinc-700 rounded-[10px] px-3 py-2.5 text-[#9CA3AF]"
                  style={{height: F.whatHappensH, fontSize: F.whatHappensFS, lineHeight: '140%'}}
                >
                  What&apos;s happening?
                </div>
                <span className="text-[#9CA3AF] text-right mt-0.5" style={{fontSize: 10}}>0/4000</span>
              </div>

              <div className="flex items-center gap-3.5">
                {[
                  {Icon: PinIcon, label: 'Add Location'},
                  {Icon: TagIcon, label: 'Add @Tag'},
                  {Icon: HashIcon, label: 'Hashtags'},
                ].map(({Icon, label}) => (
                  <div key={label} className="flex items-center gap-1.5 text-[#111827] dark:text-white font-semibold select-none" style={{fontSize: F.detailsLabelFS, lineHeight: '140%'}}>
                    <Icon />{label}
                  </div>
                ))}
              </div>

              <div className="flex flex-col flex-shrink-0" style={{width: F.actionW, height: F.actionH, gap: F.gap}}>
                <div className="flex-shrink-0 bg-[#FBBE15] text-[#1a1000] font-semibold rounded-[10px] flex items-center justify-center select-none" style={{width: F.actionW, height: F.btnH, fontSize: F.fs, lineHeight: '140%'}}>
                  Post
                </div>
                <div className="flex-shrink-0 bg-white dark:bg-zinc-800 border border-[#E5E7EB] dark:border-zinc-700 text-[#6B7280] font-semibold rounded-[10px] flex items-center justify-center select-none" style={{width: F.actionW, height: F.btnH, fontSize: F.fs, lineHeight: '140%'}}>
                  Discard
                </div>
              </div>
            </div>

            {/* Media Frame */}
            <div className="relative flex-shrink-0 overflow-hidden border border-[#E5E7EB] dark:border-zinc-700" style={{width: F.mediaW, height: F.mediaH, borderRadius: F.mediaR}}>
              <Image
                src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80"
                alt="Post preview"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-center gap-1.5 px-2.5 py-2">
                <button type="button" aria-label="Play" className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center flex-shrink-0 border-none cursor-default">
                  <span style={{width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '7px solid #111827', marginLeft: 2, display: 'block'}} />
                </button>
                <span className="text-white font-semibold flex-shrink-0" style={{fontSize: 9}}>00:03</span>
                <div className="flex-1 h-[2.5px] bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FBBE15] rounded-full" style={{width: '18%'}} />
                </div>
                <Volume2 size={12} className="text-white flex-shrink-0" />
                <Maximize2 size={12} className="text-white flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Share Card */}
          <div className="flex flex-col items-center text-center" style={{width: 935.4613647460938, gap: 11.69, padding: 14.62}}>
            <div className="flex flex-col items-center text-center bg-white dark:bg-zinc-900 rounded-[17.54px]" style={{width: F.shareW, minHeight: F.shareH, gap: F.shareGap, padding: F.sharePad}}>
              <h2 className="text-[#111827] dark:text-white font-bold" style={{fontSize: 23, lineHeight: '140%', fontFamily: 'Nunito Sans'}}>
                Share your food story!
              </h2>
              <p className="text-[#6B7280] max-w-[424px] font-normal" style={{fontSize: F.shareBodyFS, lineHeight: '140%'}}>
                Post your meal, tag the spot, and help others discover it.
              </p>
              <button
                onClick={() => router.push('/feeds')}
                className="w-full bg-[#FBBE15] hover:bg-[#FBBE15]/90 text-[#1a1000] font-semibold rounded-[12px] flex items-center justify-center cursor-pointer transition-colors"
                style={{height: 48, fontSize: F.finishSkipFS, lineHeight: '140%'}}
              >
                Finish
              </button>
              <button
                onClick={() => router.push('/feeds')}
                className="text-[#6B7280] hover:text-[#4B5563] font-semibold cursor-pointer transition-colors"
                style={{fontSize: F.finishSkipFS, lineHeight: '140%'}}
              >
                Skip
              </button>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="block rounded-full" style={{width: 12, height: 12, background: i === PAGE_INDEX ? '#FBBE15' : '#E5E7EB'}} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          MOBILE VIEW — matches Figma exactly
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="w-full md:hidden flex flex-col items-center min-h-screen bg-white dark:bg-black px-4">

        {/* Main content — centered vertically */}
        <div className="w-full flex flex-col items-center flex-1 justify-center" style={{maxWidth: 374, paddingTop: 80, paddingBottom: 20, gap: 20}}>

          {/* Preview Card — with outer border and inner spacing */}
          <div className="w-full bg-white dark:bg-zinc-900 rounded-[12px] border border-[#E5E7EB] dark:border-zinc-800 overflow-hidden shadow-sm" style={{padding: 8}}>
            <div className="flex items-stretch gap-2">
              {/* Left Column — Details (~55%) with inner background */}
              <div className="flex flex-col flex-shrink-0 bg-[#FAFAFA] dark:bg-zinc-800 rounded-[6px]" style={{width: '55%', padding: 8, gap: 5}}>

                {/* Details label */}
                <span className="text-[#111827] dark:text-white font-bold" style={{fontSize: 9, lineHeight: '140%'}}>Details</span>

                {/* Description block */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#6B7280] font-bold" style={{fontSize: 9, lineHeight: '140%'}}>Description</span>
                  <div className="w-full bg-white dark:bg-zinc-700 border border-[#E5E7EB] dark:border-zinc-600 rounded-[3px] text-[#9CA3AF] px-1 py-0.5" style={{minHeight: 45, fontSize: 8, lineHeight: '140%'}}>
                    What&apos;s happening?
                  </div>
                  <span className="text-[#9CA3AF] text-right" style={{fontSize: 6}}>0/4000</span>
                </div>

                {/* Meta row — Add Location / Add @Tag / Hashtags */}
                <div className="flex items-center gap-1 flex-wrap">
                  <div className="flex items-center gap-0.5 text-[#111827] dark:text-white font-semibold" style={{fontSize: 7, lineHeight: '140%'}}>
                    <PinIcon size={7} /> Add Location
                  </div>
                  <div className="flex items-center gap-0.5 text-[#111827] dark:text-white font-semibold" style={{fontSize: 7, lineHeight: '140%'}}>
                    <TagIcon size={7} /> Add @Tag
                  </div>
                  <div className="flex items-center gap-0.5 text-[#111827] dark:text-white font-semibold" style={{fontSize: 7, lineHeight: '140%'}}>
                    <HashIcon size={7} /> Hashtags
                  </div>
                </div>

                {/* Action buttons — STACKED VERTICALLY with fixed width */}
                <div className="flex flex-col mt-1" style={{gap: 3, width: 109.6875}}>
                  <div 
                    className="bg-[#FBBE15] text-[#1a1000] font-semibold rounded-[3px] flex items-center justify-center" 
                    style={{width: 109.6875, height: 13.5, fontSize: 7, lineHeight: '140%'}}
                  >
                    Post
                  </div>
                  <div 
                    className="bg-white dark:bg-zinc-700 border border-[#E5E7EB] dark:border-zinc-600 text-[#6B7280] font-semibold rounded-[3px] flex items-center justify-center" 
                    style={{width: 109.6875, height: 13.5, fontSize: 7, lineHeight: '140%'}}
                  >
                    Discard
                  </div>
                </div>
              </div>

              {/* Right Column — Media (~45%) with rounded corners and border */}
              <div className="relative flex-1 overflow-hidden rounded-[6px] border border-[#E5E7EB] dark:border-zinc-700" style={{minHeight: 160}}>
                <Image
                  src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&q=80"
                  alt="Post preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {/* Video controls */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center gap-1 px-1.5 py-1">
                  <div className="w-3 h-3 rounded-full bg-white/90 flex items-center justify-center flex-shrink-0">
                    <span style={{width:0,height:0,borderTop:'2px solid transparent',borderBottom:'2px solid transparent',borderLeft:'3px solid #111',marginLeft:0.5,display:'block'}} />
                  </div>
                  <span className="text-white font-semibold flex-shrink-0" style={{fontSize: 7}}>00:03</span>
                  <div className="flex-1 h-[1.5px] bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FBBE15] rounded-full" style={{width:'18%'}} />
                  </div>
                  <Volume2 size={8} className="text-white flex-shrink-0" />
                  <Maximize2 size={8} className="text-white flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* Text section — below card */}
          <div className="flex flex-col items-center text-center w-full" style={{gap: 8}}>
            <h2 className="text-[#111827] dark:text-white font-bold" style={{fontSize: 20, lineHeight: '130%', fontFamily: 'Nunito Sans'}}>
              Share your food story!
            </h2>
            <p className="text-[#6B7280] dark:text-gray-400 font-normal" style={{fontSize: 13, lineHeight: '140%', maxWidth: 320}}>
              Post your meal, tag the spot, and help others discover it.
            </p>
          </div>

        </div>

        {/* Bottom section — Next button + Dots */}
        <div className="w-full flex flex-col items-center pb-8" style={{maxWidth: 374, gap: 16}}>
          <button
            onClick={() => router.push('/feeds')}
            className="w-full bg-[#FBBE15] hover:bg-[#FBBE15]/90 text-[#1a1000] font-semibold rounded-[30px] flex items-center justify-center cursor-pointer transition-colors"
            style={{height: 52, fontSize: 17}}
          >
            Next
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className="block rounded-full" style={{width: 10, height: 10, background: i === PAGE_INDEX ? '#FBBE15' : '#E5E7EB'}} />
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

export default function PostCreateOverviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <PostCreateOverviewContent />
    </Suspense>
  );
}