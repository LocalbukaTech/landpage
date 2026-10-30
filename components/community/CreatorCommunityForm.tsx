'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

const PRESET_AVATARS = [
  '/images/community/avatar-4.png',
  '/images/community/avatar-3.png',
  '/images/community/avatar-2.png',
  '/images/community/avatar-1.png',
];

interface CreatorCommunityFormProps {
  onSelectPaidPlan: (formData: {
    name: string;
    bio: string;
    category: 'free' | 'paid';
    avatar: string;
  }) => void;
  onSelectFreePlan: (formData: {
    name: string;
    bio: string;
    category: 'free' | 'paid';
    avatar: string;
  }) => void;
}

export function CreatorCommunityForm({
  onSelectPaidPlan,
  onSelectFreePlan,
}: CreatorCommunityFormProps) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [category, setCategory] = useState<'free' | 'paid'>('paid');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomAvatar(url);
      setSelectedAvatar(url);
    }
  };

  const handleFreeSubmit = () => {
    onSelectFreePlan({ name, bio, category: 'free', avatar: selectedAvatar });
  };

  const handlePaidSubmit = () => {
    onSelectPaidPlan({ name, bio, category: 'paid', avatar: selectedAvatar });
  };

  return (
    <div className='h-full flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-8 lg:py-10 text-white bg-[#1a1a1a]'>
      {/* ── Header ─────────────────────────────── */}
      <div className='mb-6 text-left'>
        <h2 className='text-2xl sm:text-[28px] font-bold leading-tight text-white mb-1.5'>
          Welcome to Localbuka<br />Creator Community!
        </h2>
        <p className='text-xs sm:text-sm text-gray-400'>Please enter your details</p>
      </div>

      {/* ── Inputs ─────────────────────────────── */}
      <div className='space-y-3 mb-6'>
        <input
          type='text'
          placeholder='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='w-full max-w-[384px] px-4 py-3 bg-[#252525] border border-white/5 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#FFC533] transition-all h-[48px]'
        />
        <textarea
          placeholder='Bio'
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className='w-full max-w-[384px] px-4 py-3 bg-[#252525] border border-white/5 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#FFC533] transition-all resize-none h-[90px]'
        />
      </div>

      {/* ── Select Category ─────────────────────── */}
      <div className='mb-6'>
        <p className='text-sm font-semibold text-white mb-3'>Select Category</p>

        <div className='flex items-center gap-3.5 flex-wrap sm:flex-nowrap'>
          {/* Free Card */}
          <div
            onClick={() => setCategory('free')}
            className={`cursor-pointer p-4 border transition-all duration-200 flex flex-col justify-between gap-2 flex-shrink-0 ${
              category === 'free'
                ? 'bg-[#252525] border-[#FFC533] shadow-[0_0_0_1px_#FFC533]'
                : 'bg-[#222222] border-white/5 hover:border-white/15'
            }`}
            style={{ width: '185px', height: '304px', borderRadius: '15px' }}
          >
            <div>
              <span
                className='inline-flex items-center justify-center text-[11px] font-bold bg-[#FFC533] text-black mb-3 flex-shrink-0'
                style={{ width: '58.35px', height: '24.21px', borderRadius: '20.17px' }}
              >
                Free
              </span>
              <ul className='space-y-3 text-[9.5px] text-gray-300 leading-snug pl-1'>
                <li className='flex gap-1.5'>
                  <span className='text-gray-400 font-medium shrink-0'>1.</span>
                  <span>Gain unlimited access to free localbuka communities</span>
                </li>
                <li className='flex gap-1.5'>
                  <span className='text-gray-400 font-medium shrink-0'>2.</span>
                  <span>View and participate using approved community engagement features.</span>
                </li>
                <li className='flex gap-1.5'>
                  <span className='text-gray-400 font-medium shrink-0'>3.</span>
                  <span>Return to community activity and receive relevant notifications where supported.</span>
                </li>
              </ul>
            </div>
            <div className='flex justify-start pt-1'>
              <button
                type='button'
                onClick={(e) => { e.stopPropagation(); setCategory('free'); handleFreeSubmit(); }}
                className='inline-flex items-center justify-center bg-[#FFC533] hover:bg-[#e6b12d] text-black font-semibold text-xs tracking-wide transition-colors'
                style={{ width: '98px', height: '24px', borderRadius: '20.17px' }}
              >
                Select
              </button>
            </div>
          </div>

          {/* Paid Card */}
          <div
            onClick={() => setCategory('paid')}
            className={`cursor-pointer p-4 border transition-all duration-200 flex flex-col justify-between gap-2 flex-shrink-0 ${
              category === 'paid'
                ? 'bg-[#252525] border-[#FFC533] shadow-[0_0_0_1px_#FFC533]'
                : 'bg-[#222222] border-white/5 hover:border-white/15'
            }`}
            style={{ width: '185px', height: '304px', borderRadius: '15px' }}
          >
            <div>
              <span
                className='inline-flex items-center justify-center text-[11px] font-bold bg-[#86efac] text-black mb-2.5 flex-shrink-0'
                style={{ width: '58.35px', height: '24.21px', borderRadius: '20.17px' }}
              >
                Paid
              </span>
              <ul className='space-y-1.5 text-[9px] text-gray-300 leading-snug pl-1'>
                <li className='flex gap-1'>
                  <span className='text-gray-400 font-medium shrink-0'>1.</span>
                  <span>Accesses the community creation experience.</span>
                </li>
                <li className='flex gap-1'>
                  <span className='text-gray-400 font-medium shrink-0'>2.</span>
                  <span>Configure community identity and description.</span>
                </li>
                <li className='flex gap-1'>
                  <span className='text-gray-400 font-medium shrink-0'>3.</span>
                  <span>Select the applicable membership model, sets price where paid, and define member value.</span>
                </li>
                <li className='flex gap-1'>
                  <span className='text-gray-400 font-medium shrink-0'>4.</span>
                  <span>Review the community before publishing.</span>
                </li>
                <li className='flex gap-1'>
                  <span className='text-gray-400 font-medium shrink-0'>5.</span>
                  <span>Manage community information, content and relevant membership information.</span>
                </li>
              </ul>
            </div>
            <div className='flex flex-col items-start gap-1.5 pt-1'>
              <span
                className='inline-flex items-center justify-center bg-[#FFC533] text-black shrink-0'
                style={{
                  width: '85px',
                  height: '19.83px',
                  borderRadius: '14.17px',
                  fontSize: '9.21px',
                  fontWeight: 600,
                  lineHeight: '140%',
                }}
              >
                ₦2,500/mo
              </span>
              <button
                type='button'
                onClick={(e) => { e.stopPropagation(); setCategory('paid'); handlePaidSubmit(); }}
                className='inline-flex items-center justify-center bg-[#FFC533] hover:bg-[#e6b12d] text-black font-semibold text-xs tracking-wide transition-colors'
                style={{ width: '98px', height: '24px', borderRadius: '20.17px' }}
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Choose Avatar ───────────────────────── */}
      <div className='max-w-[384px]'>
        <p className='text-sm font-semibold text-white mb-3'>Choose your Avatar</p>

        <div className='flex items-center gap-3.5 mb-4 flex-wrap'>
          {PRESET_AVATARS.map((avatar, idx) => (
            <button
              key={idx}
              type='button'
              onClick={() => { setSelectedAvatar(avatar); setCustomAvatar(null); }}
              className={`relative w-12 h-12 rounded-full overflow-hidden transition-all duration-200 ${
                selectedAvatar === avatar && !customAvatar
                  ? 'ring-2 ring-[#FFC533] ring-offset-2 ring-offset-[#1a1a1a] scale-105'
                  : 'opacity-70 hover:opacity-100 ring-1 ring-white/10 hover:scale-105'
              }`}
            >
              <Image src={avatar} alt={`Avatar ${idx + 1}`} fill className='object-cover' />
            </button>
          ))}

          {customAvatar && (
            <div className='relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#FFC533] ring-offset-2 ring-offset-[#1a1a1a] scale-105'>
              <Image src={customAvatar} alt='Custom avatar' fill className='object-cover' />
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={handleCustomImageUpload}
        />
        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          className='w-full py-3 px-4 bg-[#222222] hover:bg-[#2a2a2a] border border-white/10 rounded-xl text-sm text-gray-300 flex items-center justify-between transition-colors group'
        >
          <span>Choose your photo from gallery</span>
          <ImageIcon className='w-5 h-5 text-gray-400 group-hover:text-white transition-colors' />
        </button>
      </div>
    </div>
  );
}

