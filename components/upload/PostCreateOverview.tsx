'use client';

/**
 * PostCreateOverview — Post Creation screen shown during signup / after upload
 *
 * Figma measurements (exact):
 *   Outer frame:   974 × 716.497px  |  gap: 24px
 *   Left col:      435.574 × 249.095px  |  gap: 7.31px
 *   Action group:  285.023 × 77.467px  |  gap: 7.31px
 *   Post btn:      285.023 × 35.079px
 *   Discard btn:   285.023 × 35.079px  (77.467 − 35.079 − 7.31)
 *   Media frame:   374.184 × 336.181px  |  border-radius: 8.77px
 *                  padding: 73.08px  |  gap: 7.31px
 *   Details card gap (space-between):
 *     974 − 2×16(card-pad) − 435.574 − 374.184 = 132.24px
 *   Share card:    510px wide  |  border-radius: 17.54px
 *
 *   Fonts: Nunito Sans 700 Bold 11.69px / 600 SemiBold 11.69px (labels & buttons)
 *          DM Serif Display (share title)
 */

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Hash, MapPin, Tag, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Figma exact values that Tailwind cannot express as utility classes ──────
const FIGMA = {
  leftColW:   435.5741882324219,
  leftColH:   249.0953826904297,
  gap:        7.31,
  actionW:    285.02337646484375,
  actionH:    77.4678955078125,
  btnH:       35.07979965209961,
  mediaW:     374.1845397949219,
  mediaH:     336.1814270019531,
  mediaR:     8.77,
  mediaPad:   73.08,
  shareR:     17.54,
  fontSize:   11.69,
} as const;

// ── SVG icons from Figma spec (exact paths, exact viewBoxes) ─────────────────

function PinIcon() {
  return (
    <svg width="11" height="15" viewBox="0 0 11 15" fill="none" aria-hidden>
      <path
        d="M5.1158 6.94288C4.63123 6.94288 4.16651 6.75038 3.82387 6.40774C3.48123
           6.0651 3.28873 5.60037 3.28873 5.1158C3.28873 4.63123 3.48123 4.16651
           3.82387 3.82387C4.16651 3.48123 4.63123 3.28873 5.1158 3.28873C5.60037
           3.28873 6.0651 3.48123 6.40774 3.82387C6.75038 4.16651 6.94288 4.63123
           6.94288 5.1158C6.94288 5.35574 6.89562 5.59332 6.8038 5.81499C6.71198
           6.03667 6.5774 6.23808 6.40774 6.40774C6.23808 6.5774 6.03667 6.71198
           5.81499 6.8038C5.59332 6.89562 5.35574 6.94288 5.1158 6.94288ZM5.1158
           0C3.75901 0 2.45778 0.538985 1.49838 1.49838C0.538985 2.45778 0 3.75901
           0 5.1158C0 8.95266 5.1158 14.6166 5.1158 14.6166C5.1158 14.6166 10.2316
           8.95266 10.2316 5.1158C10.2316 3.75901 9.69262 2.45778 8.73322 1.49838
           C7.77382 0.538985 6.4726 0 5.1158 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.12854 0.00901961C6.42362 -0.0178284 6.72107 0.0154109 7.00294
           0.10673C7.28481 0.198049 7.54525 0.345553 7.76852 0.540332L7.87815
           0.642648L13.5947 6.35993C13.9881 6.75342 14.2172 7.28178 14.2355
           7.83791C14.2538 8.39404 14.06 8.93633 13.6934 9.35486L13.5947
           9.4601L9.46039 13.5944C9.0669 13.9878 8.53854 14.2169 7.98241
           14.2352C7.42628 14.2535 6.88399 14.0597 6.46546 13.6931L6.36022
           13.5944L0.642209 7.87713C0.432808 7.66774 0.267996 7.4181 0.157713
           7.14327C0.0474308 6.86845 -0.00603528 6.57413 0.000540696
           6.27807L0.00857993 6.12825L0.353531 2.3389C0.397818 1.85055 0.604536
           1.39114 0.940646 1.0341C1.27676 0.677056 1.72285 0.442993 2.20764
           0.369318L2.33846 0.353971L6.12854 0.00901961ZM4.29197 4.29241C4.15621
           4.42816 4.04853 4.58933 3.97506 4.7667C3.90159 4.94407 3.86377
           5.13418 3.86377 5.32617C3.86377 5.51815 3.90159 5.70826 3.97506
           5.88563C4.04853 6.06301 4.15621 6.22417 4.29197 6.35993C4.42772
           6.49568 4.58889 6.60337 4.76626 6.67684C4.94363 6.75031 5.13374
           6.78812 5.32573 6.78812C5.51771 6.78812 5.70782 6.75031 5.88519
           6.67684C6.06257 6.60337 6.22373 6.49568 6.35949 6.35993C6.63365
           6.08576 6.78768 5.7139 6.78768 5.32617C6.78768 4.93843 6.63365
           4.56658 6.35949 4.29241C6.08532 4.01824 5.71346 3.86421 5.32573
           3.86421C4.93799 3.86421 4.56614 4.01824 4.29197 4.29241Z"
        fill="currentColor"
      />
    </svg>
  );
}

function HashIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M11.6933 3.65415C11.6933 3.25219 11.3644 2.92332 10.9624
           2.92332H8.76995V0.730829C8.76995 0.328873 8.44108 0 8.03912
           0C7.63717 0 7.30829 0.328873 7.30829 0.730829V2.92332H4.38497
           V0.730829C4.38497 0.328873 4.0561 0 3.65415 0C3.25219 0 2.92332
           0.328873 2.92332 0.730829V2.92332H0.730829C0.328873 2.92332 0
           3.25219 0 3.65415C0 4.0561 0.328873 4.38497 0.730829
           4.38497H2.92332V7.30829H0.730829C0.328873 7.30829 0 7.63717 0
           8.03912C0 8.44108 0.328873 8.76995 0.730829 8.76995H2.92332
           V10.9624C2.92332 11.3644 3.25219 11.6933 3.65415 11.6933
           C4.0561 11.6933 4.38497 11.3644 4.38497 10.9624V8.76995
           H7.30829V10.9624C7.30829 11.3644 7.63717 11.6933 8.03912
           11.6933C8.44108 11.6933 8.76995 11.3644 8.76995
           10.9624V8.76995H10.9624C11.3644 8.76995 11.6933 8.44108
           11.6933 8.03912C11.6933 7.63717 11.3644 7.30829 10.9624
           7.30829H8.76995V4.38497H10.9624C11.3644 4.38497 11.6933
           4.0561 11.6933 3.65415ZM7.30829 7.30829H4.38497V4.38497
           H7.30829V7.30829Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ── Props ────────────────────────────────────────────────────────────────────

export interface PostCreateOverviewProps {
  /** Live file selected in the upload dropzone */
  file?: File;
  /** Called when the user clicks Post */
  onPost?: (data: { description: string; tags: string[]; location: string }) => void;
  /** Called when the user clicks Discard */
  onDiscard?: () => void;
  /** Called when the user clicks Finish on the share card */
  onFinish?: () => void;
  /** Called when the user clicks Skip on the share card */
  onSkip?: () => void;
  /** Disable all controls while uploading */
  isUploading?: boolean;
}

// ── Component ────────────────────────────────────────────────────────────────

export function PostCreateOverview({
  file,
  onPost,
  onDiscard,
  onFinish,
  onSkip,
  isUploading = false,
}: PostCreateOverviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Form state
  const [description, setDescription] = useState('');
  const [charCount, setCharCount] = useState(0);

  // Media URL (blob URL from the uploaded file)
  const [mediaUrl] = useState<string | null>(() =>
    file ? URL.createObjectURL(file) : null,
  );
  const isImage = file?.type.startsWith('image/');

  // Video control state
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(18); // 18% per Figma mockup

  // Progress dots state (3 dots, first active)
  const [activeDot] = useState(0);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleHashtagClick = () => {
    setDescription((prev) => {
      const trimmed = prev.trimEnd();
      return trimmed + (trimmed ? ' #' : '#');
    });
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
      setProgress((currentTime / duration) * 100);
    }
  };

  const extractHashtags = (text: string) =>
    (text.match(/#(\w+)/g) ?? []).map((m) => m.slice(1));

  const handlePost = () => {
    onPost?.({
      description,
      tags: extractHashtags(description),
      location: '',
    });
  };

  return (
    /*
     * Outer page frame
     * width: 974px | gap: 24px
     * Height is 'hug' in Figma (716.497px) — we let it be content-driven
     */
    <div
      className="flex flex-col w-full mx-auto bg-[#F5F5F0]"
      style={{ maxWidth: 974, gap: 24 }}
    >

      {/* ── TOP CARD ── Details (left) + Media frame (right) ───────────────── */}
      {/*
        padding: 16px | border-radius: 18px
        justify-content: space-between gives the correct 132.24px column gap
      */}
      <div
        className="w-full bg-white border border-[#E5E7EB] flex flex-row items-start justify-between"
        style={{ borderRadius: 18, padding: 16 }}
      >

        {/* ── LEFT COLUMN ────────────────────────────────────────────────────
            width: 435.574px | min-height: 249.095px | gap: 7.31px
        ─────────────────────────────────────────────────────────────────── */}
        <div
          className="flex flex-col flex-shrink-0"
          style={{
            width: FIGMA.leftColW,
            minHeight: FIGMA.leftColH,
            gap: FIGMA.gap,
          }}
        >
          {/* "Details" label — Nunito Sans 700 11.69px */}
          <span
            className="text-[#111827] font-bold"
            style={{ fontSize: FIGMA.fontSize, lineHeight: '140%' }}
          >
            Details
          </span>

          {/* Description block */}
          <div className="flex flex-col">
            <label
              htmlFor="feeds-description"
              className="text-[#6B7280] font-bold mb-1"
              style={{ fontSize: FIGMA.fontSize, lineHeight: '140%' }}
            >
              Description
            </label>
            <div className="relative">
              <textarea
                id="feeds-description"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="What's happening?"
                maxLength={4000}
                disabled={isUploading}
                className={cn(
                  'w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-[10px]',
                  'px-3 py-2.5 resize-none outline-none text-[#374151]',
                  'placeholder:text-[#9CA3AF] transition-[border-color,box-shadow] duration-150',
                  'focus:border-[#FBBE15] focus:ring-2 focus:ring-[#FBBE15]/20',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                )}
                style={{
                  height: 110,
                  fontSize: FIGMA.fontSize,
                  lineHeight: '140%',
                }}
              />
            </div>
            <span
              className="text-[#9CA3AF] text-right mt-0.5"
              style={{ fontSize: 10 }}
            >
              {charCount}/4000
            </span>
          </div>

          {/* Meta row — Add Location | @Tag | Hashtags */}
          {/* font: Nunito Sans 700 Bold 11.69px */}
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              disabled={isUploading}
              className={cn(
                'flex items-center gap-1.5 text-[#6B7280] font-bold',
                'bg-transparent border-none cursor-pointer p-0',
                'hover:text-[#111827] transition-colors duration-150',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
              style={{ fontSize: FIGMA.fontSize, lineHeight: '140%' }}
            >
              <PinIcon />
              Add Location
            </button>

            <button
              type="button"
              disabled={isUploading}
              className={cn(
                'flex items-center gap-1.5 text-[#6B7280] font-bold',
                'bg-transparent border-none cursor-pointer p-0',
                'hover:text-[#111827] transition-colors duration-150',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
              style={{ fontSize: FIGMA.fontSize, lineHeight: '140%' }}
            >
              <TagIcon />
              Add @Tag
            </button>

            <button
              type="button"
              onClick={handleHashtagClick}
              disabled={isUploading}
              className={cn(
                'flex items-center gap-1.5 text-[#6B7280] font-bold',
                'bg-transparent border-none cursor-pointer p-0',
                'hover:text-[#111827] transition-colors duration-150',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
              style={{ fontSize: FIGMA.fontSize, lineHeight: '140%' }}
            >
              <HashIcon />
              Hashtags
            </button>
          </div>

          {/* ── Action button group ────────────────────────────────────────────
              width: 285.023px | height: 77.467px | gap: 7.31px
          ──────────────────────────────────────────────────────────────────── */}
          <div
            className="flex flex-col flex-shrink-0"
            style={{
              width: FIGMA.actionW,
              height: FIGMA.actionH,
              gap: FIGMA.gap,
            }}
          >
            {/* Post button — 285.023 × 35.079px | Nunito Sans 600 11.69px */}
            <button
              type="button"
              onClick={handlePost}
              disabled={isUploading || (!description && !file)}
              className={cn(
                'flex-shrink-0 bg-[#FBBE15] text-[#1a1000] font-semibold',
                'rounded-[10px] flex items-center justify-center',
                'hover:opacity-85 active:opacity-75 transition-opacity duration-150',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
              style={{
                width: FIGMA.actionW,
                height: FIGMA.btnH,
                fontSize: FIGMA.fontSize,
                lineHeight: '140%',
              }}
            >
              Post
            </button>

            {/* Discard button — 285.023 × 35.079px | Nunito Sans 600 11.69px */}
            <button
              type="button"
              onClick={onDiscard}
              disabled={isUploading}
              className={cn(
                'flex-shrink-0 bg-white border border-[#E5E7EB] text-[#6B7280] font-semibold',
                'rounded-[10px] flex items-center justify-center',
                'hover:bg-[#F9FAFB] active:bg-[#F3F4F6] transition-colors duration-150',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
              style={{
                width: FIGMA.actionW,
                height: FIGMA.btnH,
                fontSize: FIGMA.fontSize,
                lineHeight: '140%',
              }}
            >
              Discard
            </button>
          </div>
        </div>{/* /left-col */}

        {/* ── RIGHT MEDIA FRAME ─────────────────────────────────────────────
            width: 374.184px | height: 336.181px
            border-radius: 8.77px | padding: 73.08px | gap: 7.31px
            Inner video area = 374.184 − 2×73.08 − 2px(border) = 226.02px wide
                               336.181 − 2×73.08 − 2px(border) = 189.02px tall
        ──────────────────────────────────────────────────────────────────── */}
        <div
          className="flex-shrink-0 bg-white border border-[#E5E7EB] flex flex-col overflow-hidden"
          style={{
            width: FIGMA.mediaW,
            height: FIGMA.mediaH,
            borderRadius: FIGMA.mediaR,
            padding: FIGMA.mediaPad,
            gap: FIGMA.gap,
          }}
        >
          {/* Video / image thumbnail — fills inner padded area */}
          <div className="relative flex-1 rounded-[8px] bg-black overflow-hidden">
            {mediaUrl ? (
              isImage ? (
                <Image
                  src={mediaUrl}
                  alt="Post preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <video
                  ref={videoRef}
                  src={mediaUrl}
                  className="w-full h-full object-cover"
                  loop
                  autoPlay
                  muted={isMuted}
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                />
              )
            ) : (
              /* Fallback placeholder image when no file is provided */
              <Image
                src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80"
                alt="Food post preview"
                fill
                className="object-cover"
                unoptimized
              />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Video controls bar */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-1.5 px-2.5 py-2">
              {/* Play button */}
              <button
                type="button"
                aria-label="Play"
                className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center flex-shrink-0 border-none cursor-pointer"
              >
                {/* CSS triangle play icon */}
                <span
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: '4px solid transparent',
                    borderBottom: '4px solid transparent',
                    borderLeft: '7px solid #111827',
                    marginLeft: 2,
                    display: 'block',
                  }}
                />
              </button>

              {/* Timestamp */}
              <span className="text-white font-semibold flex-shrink-0" style={{ fontSize: 9 }}>
                00:03
              </span>

              {/* Progress bar */}
              <div className="flex-1 h-[2.5px] bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FBBE15] rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Mute toggle */}
              <button
                type="button"
                onClick={() => {
                  if (videoRef.current) videoRef.current.muted = !isMuted;
                  setIsMuted((m) => !m);
                }}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="flex items-center justify-center border-none bg-transparent cursor-pointer p-0 flex-shrink-0"
              >
                {isMuted ? (
                  <VolumeX size={12} className="text-white" />
                ) : (
                  <Volume2 size={12} className="text-white" />
                )}
              </button>

              {/* Expand */}
              <button
                type="button"
                aria-label="Expand"
                className="flex items-center justify-center border-none bg-transparent cursor-pointer p-0 flex-shrink-0"
              >
                <Maximize2 size={12} className="text-white" />
              </button>
            </div>
          </div>
        </div>{/* /media-frame */}

      </div>{/* /details-card */}

      {/* ── SHARE CARD ─────────────────────────────────────────────────────────
          width: 510px | centred | border-radius: 17.54px
          padding: 20px 24px | gap: 14px
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        className="mx-auto bg-white border border-[#E5E7EB] flex flex-col items-center text-center"
        style={{
          width: 510,
          borderRadius: FIGMA.shareR,
          padding: '20px 24px',
          gap: 14,
        }}
      >
        {/* Title — DM Serif Display 22px */}
        <h2
          className="font-display text-[#111827]"
          style={{ fontSize: 22, lineHeight: 1.25 }}
        >
          Share your food story!
        </h2>

        {/* Subtitle */}
        <p
          className="text-[#6B7280] max-w-[424px]"
          style={{ fontSize: 13, lineHeight: 1.55 }}
        >
          Post your meal, tag the spot, and help others discover it.
        </p>

        {/* Finish button — full inner width */}
        <button
          type="button"
          onClick={onFinish}
          disabled={isUploading}
          className={cn(
            'w-full bg-[#FBBE15] text-[#1a1000] font-bold rounded-[12px]',
            'flex items-center justify-center',
            'hover:opacity-85 active:opacity-75 transition-opacity duration-150',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
          style={{ height: 48, fontSize: 15 }}
        >
          Finish
        </button>

        {/* Skip */}
        <button
          type="button"
          onClick={onSkip}
          disabled={isUploading}
          className={cn(
            'bg-transparent border-none text-[#6B7280] font-semibold cursor-pointer p-0',
            'hover:text-[#374151] transition-colors duration-150',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
          style={{ fontSize: 13 }}
        >
          Skip
        </button>

        {/* Progress dots — 3 dots, first active */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block rounded-full transition-colors duration-200"
              style={{
                width: 8,
                height: 8,
                background: i === activeDot ? '#FBBE15' : '#E5E7EB',
              }}
            />
          ))}
        </div>
      </div>{/* /share-card */}

    </div>
  );
}
