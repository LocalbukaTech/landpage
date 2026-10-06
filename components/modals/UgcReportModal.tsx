'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSubmitPostReport, useSubmitUserReport, useSubmitReport } from '@/lib/api/services/moderation.hooks';
import type { ModerationReason } from '@/lib/api/services/moderation.service';
import { useToast } from '@/hooks/use-toast';

export interface UgcReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId?: string;
  targetType?: 'post' | 'profile' | 'user';
  targetTitle?: string;
}

const USER_REPORT_REASONS: { id: ModerationReason; label: string }[] = [
  { id: 'Harassment', label: 'Harassment' },
  { id: 'Pretending to be someone else', label: 'Pretending to be someone else' },
  { id: 'Fake account or bot', label: 'Fake account or bot' },
  { id: 'Scam or dishonest selling', label: 'Scam or dishonest selling' },
  { id: 'Inappropriate Profile Content', label: 'Inappropriate Profile Content' },
  { id: 'Other', label: 'Other' },
];

const POST_REPORT_REASONS: { id: ModerationReason; label: string }[] = [
  { id: 'Harassment', label: 'Harassment' },
  { id: 'Inappropriate Profile Content', label: 'Inappropriate content' },
  { id: 'Scam or dishonest selling', label: 'Scam or dishonest selling' },
  { id: 'Fake account or bot', label: 'Spam' },
  { id: 'Pretending to be someone else', label: 'Misinformation' },
  { id: 'Other', label: 'Other' },
];

export function UgcReportModal({
  isOpen,
  onClose,
  targetId,
  targetType = 'post',
  targetTitle: _targetTitle,
}: UgcReportModalProps) {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [selectedReason, setSelectedReason] = useState<ModerationReason | ''>('');
  const [notes, setNotes] = useState('');
  const [attachLink, setAttachLink] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const submitPostReport = useSubmitPostReport();
  const submitUserReport = useSubmitUserReport();
  const submitReport = useSubmitReport();

  const isSubmitting =
    submitPostReport.isPending ||
    submitUserReport.isPending ||
    submitReport.isPending;
  const reasons = targetType === 'post' ? POST_REPORT_REASONS : USER_REPORT_REASONS;
  const isOther = selectedReason === 'Other';

  if (!isOpen || !mounted) return null;

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      setAttachedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0] ?? null;
    handleFileChange(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason || !targetId) return;

    const hasExtras = attachedFile || attachLink.trim();

    try {
      if (hasExtras) {
        // Use multipart FormData when file or link is attached
        const fd = new FormData();
        fd.append('targetType', targetType);
        fd.append('targetId', targetId);
        fd.append('reason', selectedReason);
        if (notes.trim()) fd.append('notes', notes.trim());
        if (attachLink.trim()) fd.append('link', attachLink.trim());
        if (attachedFile) fd.append('proofImage', attachedFile);
        await submitReport.mutateAsync(fd);
      } else if (targetType === 'post') {
        await submitPostReport.mutateAsync({
          postId: targetId,
          data: { reason: selectedReason as ModerationReason, notes: notes.trim() || undefined },
        });
      } else {
        await submitUserReport.mutateAsync({
          userId: targetId,
          data: { reason: selectedReason as ModerationReason, notes: notes.trim() || undefined },
        });
      }
      setIsSubmitted(true);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 429) {
        setIsRateLimited(true);
      } else {
        toast({
          title: 'Could not submit report',
          description: 'Please try again in a moment.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleResetAndClose = () => {
    setSelectedReason('');
    setNotes('');
    setAttachLink('');
    setAttachedFile(null);
    setIsSubmitted(false);
    setIsRateLimited(false);
    onClose();
  };

  return createPortal(
    <div
      className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200'
      onClick={handleResetAndClose}
    >
      {/* Outer Card */}
      <div
        className='relative w-full text-white shadow-2xl overflow-hidden font-plus-jakarta-sans transition-all duration-200'
        style={{
          width: '100%',
          maxWidth: isSubmitted || isRateLimited ? '435px' : '415px',
          backgroundColor: '#1E1E1E',
          borderRadius: '20px',
          padding: isSubmitted || isRateLimited ? '44px 36px 36px 36px' : '28px 36px 26px 36px',
          fontFamily: "var(--font-plus-jakarta-sans), 'Plus Jakarta Sans', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {isRateLimited ? (
          /* ── Rate Limit Screen ── */
          <div className='flex flex-col items-center justify-center text-center animate-in fade-in duration-200'>
            {/* Warning triangle — Vector-19.svg, Figma: 402.52×359.38 scaled to modal */}
            <div className='flex items-center justify-center mb-6'>
              <img
                src='/icons/Vector-19.svg'
                alt='Warning'
                style={{ width: '110px', height: '98px' }}
              />
            </div>

            <h3
              className='text-white text-center font-semibold mb-3'
              style={{ fontSize: '18px', lineHeight: '135%', letterSpacing: '0%' }}
            >
              You&apos;ve reached the report<br />limit for today
            </h3>

            <p
              className='text-center'
              style={{ color: '#A8A8A8', fontSize: '14px', lineHeight: '140%' }}
            >
              Please try again tomorrow.
            </p>
          </div>
        ) : isSubmitted ? (
          /* ── Success Screen ── */
          <div className='flex flex-col items-center justify-center text-center animate-in fade-in duration-200'>
            {/* Scalloped badge — exact Figma Vector-18.svg */}
            <div className='relative flex items-center justify-center mb-6' style={{ width: '105px', height: '105px' }}>
              <img
                src='/icons/Vector-18.svg'
                alt=''
                style={{ width: '105px', height: '105px', position: 'absolute', inset: 0 }}
              />
              <svg
                width='44'
                height='44'
                viewBox='0 0 40 40'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                style={{ position: 'relative', zIndex: 1 }}
              >
                <path
                  d='M8 20L16.5 28.5L32 12'
                  stroke='#25792B'
                  strokeWidth='5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>

            <h3
              className='text-white text-center font-semibold mb-6'
              style={{ fontSize: '18px', lineHeight: '135%', letterSpacing: '0%' }}
            >
              Thanks, we have received<br />your report
            </h3>

            <p
              className='text-center'
              style={{ color: '#A8A8A8', fontSize: '14px', lineHeight: '140%' }}
            >
              Our team will review it.
            </p>
          </div>
        ) : (
          /* ── Reason Selection Screen ── */
          <form onSubmit={handleSubmit} className='flex flex-col'>
            {/* Header */}
            <h2
              className='text-[#FBBE15] font-bold mb-5 tracking-normal leading-none'
              style={{
                fontSize: '17px',
                fontFamily: "var(--font-plus-jakarta-sans), 'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
              }}
            >
              Reason
            </h2>

            {/* Reason List */}
            <div className='space-y-4'>
              {reasons.map((reason) => {
                const isSelected = selectedReason === reason.id;
                return (
                  <label
                    key={reason.id}
                    className='flex items-center justify-between cursor-pointer group select-none py-0.5'
                  >
                    <span
                      className='text-white'
                      style={{
                        fontFamily: "var(--font-plus-jakarta-sans), 'Plus Jakarta Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: '13.5px',
                        lineHeight: '140%',
                        letterSpacing: '0%',
                      }}
                    >
                      {reason.label}
                    </span>

                    {/* Radio Button */}
                    <div
                      className='flex items-center justify-center shrink-0 ml-3 transition-all'
                      style={{
                        width: '18px',
                        height: '18px',
                        minWidth: '18px',
                        minHeight: '18px',
                        borderRadius: '50%',
                        border: isSelected ? '1.5px solid #ffffff' : '1.5px solid #777777',
                        backgroundColor: 'transparent',
                      }}
                    >
                      {isSelected && (
                        <div
                          style={{
                            width: '9px',
                            height: '9px',
                            borderRadius: '50%',
                            backgroundColor: '#FBBE15',
                          }}
                        />
                      )}
                    </div>
                    <input
                      type='radio'
                      name='report_reason'
                      value={reason.id}
                      checked={isSelected}
                      onChange={(e) => setSelectedReason(e.target.value as ModerationReason)}
                      className='sr-only'
                    />
                  </label>
                );
              })}
            </div>

            {/* ── "Other" expanded fields ── */}
            {isOther && (
              <div className='flex flex-col gap-3 mt-4 animate-in fade-in duration-150'>

                {/* Textarea */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '120px',
                    borderRadius: '12px',
                    backgroundColor: '#131313',
                    border: '1px solid rgba(255,255,255,0.06)',
                    padding: '12px 14px 28px 14px',
                    boxSizing: 'border-box',
                  }}
                >
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder=''
                    rows={4}
                    maxLength={500}
                    className='w-full h-full bg-transparent text-white focus:outline-none resize-none placeholder-transparent'
                    style={{
                      fontFamily: "var(--font-plus-jakarta-sans), 'Plus Jakarta Sans', sans-serif",
                      fontWeight: 500,
                      fontSize: '13px',
                      lineHeight: '140%',
                      display: 'block',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '14px',
                      fontSize: '11px',
                      color: '#666',
                      fontWeight: 500,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  >
                    {notes.length}/500
                  </span>
                </div>

                {/* Attach Proof label */}
                <p
                  style={{
                    fontFamily: "var(--font-plus-jakarta-sans), 'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: '13px',
                    color: '#ffffff',
                    margin: 0,
                  }}
                >
                  Attach Proof
                </p>

                {/* Drag & Drop Zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  style={{
                    borderRadius: '12px',
                    backgroundColor: '#131313',
                    border: isDragging ? '1.5px dashed #FBBE15' : 'none',
                    padding: '20px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'border-color 0.15s',
                  }}
                >
                  {attachedFile ? (
                    /* Preview */
                    <div className='flex flex-col items-center gap-2'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(attachedFile)}
                        alt='Preview'
                        style={{ maxHeight: '80px', maxWidth: '100%', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <span style={{ fontSize: '11px', color: '#888', fontWeight: 500 }}>
                        {attachedFile.name}
                      </span>
                      <button
                        type='button'
                        onClick={() => setAttachedFile(null)}
                        style={{ fontSize: '11px', color: '#FF4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Upload icon — exact Figma Vector-20.svg */}
                      <img
                        src='/icons/Vector-20.svg'
                        alt=''
                        style={{ width: '36px', height: '36px' }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-plus-jakarta-sans), 'Plus Jakarta Sans', sans-serif",
                          fontWeight: 600,
                          fontSize: '12px',
                          color: '#ffffff',
                        }}
                      >
                        Drag Image
                      </span>
                      {/* Browse File button */}
                      <button
                        type='button'
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          marginTop: '2px',
                          paddingTop: '5px',
                          paddingBottom: '5px',
                          paddingLeft: '18px',
                          paddingRight: '18px',
                          borderRadius: '9999px',
                          backgroundColor: '#FBBE15',
                          color: '#000000',
                          fontWeight: 700,
                          fontSize: '11px',
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: "var(--font-plus-jakarta-sans), 'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        Browse File
                      </button>
                    </>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  className='sr-only'
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                />

                {/* Attach Link */}
                <input
                  type='url'
                  value={attachLink}
                  onChange={(e) => setAttachLink(e.target.value)}
                  placeholder='Attach Link'
                  style={{
                    width: '100%',
                    backgroundColor: '#131313',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '11px 14px',
                    color: '#ffffff',
                    fontFamily: "var(--font-plus-jakarta-sans), 'Plus Jakarta Sans', sans-serif",
                    fontSize: '13px',
                    fontWeight: 500,
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
              </div>
            )}

            {/* Submit Button */}
            <div className='flex justify-center mt-6'>
              <button
                type='submit'
                disabled={!selectedReason || isSubmitting}
                className='transition-all'
                style={{
                  fontFamily: "var(--font-plus-jakarta-sans), 'Plus Jakarta Sans', sans-serif",
                  paddingTop: '7px',
                  paddingBottom: '7px',
                  paddingLeft: '32px',
                  paddingRight: '32px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  backgroundColor: selectedReason && !isSubmitting ? '#FBBE15' : '#2E2E30',
                  color: selectedReason && !isSubmitting ? '#000000' : '#8E8E93',
                  border: 'none',
                  cursor: selectedReason && !isSubmitting ? 'pointer' : 'not-allowed',
                  boxShadow: selectedReason && !isSubmitting ? '0 2px 8px rgba(251, 190, 21, 0.25)' : 'none',
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
