'use client';

import React, { useState } from 'react';
import { X, Flag, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface UgcReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId?: string;
  targetType?: 'post' | 'comment' | 'community' | 'user';
  targetTitle?: string;
}

const REPORT_REASONS = [
  {
    id: 'inappropriate',
    label: 'Inappropriate or Adult Content',
    description: 'Sexually suggestive, violent, or graphic material.',
  },
  {
    id: 'harassment',
    label: 'Hate Speech or Harassment',
    description: 'Bullying, targeted abuse, threats, or discriminatory remarks.',
  },
  {
    id: 'child_safety',
    label: 'Child Safety Concern',
    description: 'Content endangering or exploiting minors (prioritized review).',
  },
  {
    id: 'safety_hazard',
    label: 'Dangerous Food / Health Safety Hazard',
    description: 'Harmful preparation advice, undeclared allergens, or false health claims.',
  },
  {
    id: 'copyright',
    label: 'Copyright or Trademark Infringement',
    description: 'Unauthorized use of original audio, video, or intellectual property.',
  },
  {
    id: 'spam_fraud',
    label: 'Spam, Scams, or Impersonation',
    description: 'Fraudulent schemes, bot activity, or deceptive commercial promotions.',
  },
];

export function UgcReportModal({
  isOpen,
  onClose,
  targetId: _targetId,
  targetType = 'post',
  targetTitle,
}: UgcReportModalProps) {
  const { toast } = useToast();
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) return;

    setIsSubmitting(true);
    // Simulate submission to moderation system
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: 'Report Received',
        description: 'Thank you for helping keep LocalBuka safe. Our moderation team will review this shortly.',
      });
    }, 600);
  };

  const handleResetAndClose = () => {
    setSelectedReason('');
    setDetails('');
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div
      className='fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200'
      onClick={handleResetAndClose}
    >
      <div
        className='relative w-full max-w-lg rounded-2xl bg-[#1a1a1a] border border-white/10 text-white shadow-2xl p-6 overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between pb-4 border-b border-white/10'>
          <div className='flex items-center gap-2.5'>
            <div className='w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400'>
              <Flag className='w-4.5 h-4.5' />
            </div>
            <div>
              <h3 className='text-lg font-bold'>Report Content</h3>
              <p className='text-xs text-gray-400'>
                Reporting {targetType} {targetTitle ? `"${targetTitle}"` : ''}
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={handleResetAndClose}
            className='p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {isSubmitted ? (
          <div className='py-8 text-center space-y-4'>
            <div className='w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400'>
              <CheckCircle2 className='w-8 h-8' />
            </div>
            <div className='space-y-1.5'>
              <h4 className='text-base font-bold text-white'>Report Submitted</h4>
              <p className='text-xs text-gray-400 max-w-sm mx-auto'>
                Your report has been escalated to our human moderation team in accordance with our UGC & Community Guidelines.
              </p>
            </div>
            <button
              type='button'
              onClick={handleResetAndClose}
              className='px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer'
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='mt-4 space-y-4'>
            <div className='space-y-2 max-h-[260px] overflow-y-auto pr-1'>
              <label className='text-xs font-semibold text-gray-300 block mb-1'>
                Select a violation reason:
              </label>
              {REPORT_REASONS.map((reason) => (
                <label
                  key={reason.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedReason === reason.id
                      ? 'bg-[#FFC533]/10 border-[#FFC533] text-white'
                      : 'bg-white/5 border-white/5 hover:border-white/15 text-gray-300'
                  }`}
                >
                  <input
                    type='radio'
                    name='report_reason'
                    value={reason.id}
                    checked={selectedReason === reason.id}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className='mt-1 accent-[#FFC533]'
                  />
                  <div>
                    <span className='text-xs font-bold block text-white'>
                      {reason.label}
                    </span>
                    <span className='text-[11px] text-gray-400 block mt-0.5 leading-relaxed'>
                      {reason.description}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <div>
              <label className='text-xs font-semibold text-gray-300 block mb-1.5'>
                Additional details (optional):
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder='Provide any context that will help our moderation team review this item...'
                rows={2}
                maxLength={300}
                className='w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-[#FFC533] transition-colors resize-none'
              />
            </div>

            <div className='flex items-center justify-end gap-3 pt-2 border-t border-white/10'>
              <button
                type='button'
                onClick={handleResetAndClose}
                className='px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={!selectedReason || isSubmitting}
                className='px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5'
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
