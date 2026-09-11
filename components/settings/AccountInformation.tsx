'use client';

import {useState, useRef} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {Camera, Eye, EyeOff, Loader2, MapPin} from 'lucide-react';
import {AvatarCropModal} from '@/components/ui/AvatarCropModal';
import {useToast} from '@/hooks/use-toast';
import {
  useMe,
  useUpdateMe,
  useUpdateLanguage,
  useDeleteMe,
  useChangePassword,
  usePasswordStatus,
  useCreatePassword,
} from '@/lib/api/services/auth.hooks';
import {useAuth} from '@/context/AuthContext';
import {useQueryClient} from '@tanstack/react-query';
import {useBlockedUsers, type BlockedUser} from '@/hooks/useBlockedUsers';
import {useTranslation, type SupportedLanguage} from '@/context/LanguageContext';
import {Ban} from 'lucide-react';

interface AccountInformationProps {
  activeSubTab: string;
  onSubTabChange: (tab: string) => void;
}

export function AccountInformation({
  activeSubTab,
  onSubTabChange,
}: AccountInformationProps) {
  const {t} = useTranslation();

  const subTabs = [
    {id: 'account', label: t('settings.tabs.account', 'Account')},
    {id: 'password', label: t('settings.tabs.password', 'Password & Security')},
    {id: 'blocked', label: t('settings.tabs.blocked', 'Blocked Users')},
    {id: 'languages', label: t('settings.tabs.languages', 'Languages')},
    {id: 'logout', label: t('settings.tabs.logout', 'Logout')},
  ];

  return (
    <div className='flex flex-col h-full'>
      {/* Sub-tabs */}
      <div className='flex gap-0 border-b border-white/10 overflow-x-auto scrollbar-hide'>
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSubTabChange(tab.id)}
              className={`px-3 md:px-4 py-3 text-xs md:text-sm font-medium transition-all border-b-2 cursor-pointer bg-transparent whitespace-nowrap shrink-0 ${
                isActive
                  ? 'border-[#FBBE15] text-[#FBBE15]'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className='flex-1 pt-6'>
        {activeSubTab === 'account' && <AccountTab />}
        {activeSubTab === 'password' && <PasswordTab />}
        {activeSubTab === 'blocked' && <BlockedUsersTab />}
        {activeSubTab === 'delete' && <DeleteTab />}
        {activeSubTab === 'languages' && <LanguagesTab />}
        {activeSubTab === 'logout' && <LogoutTab />}
      </div>
    </div>
  );
}

function AccountTab() {
  const {user} = useAuth();
  const {data: meResponse, isLoading} = useMe();

  const meData =
    (meResponse as any)?.data?.data || (meResponse as any)?.data || null;
  const apiUser = meData || user;

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-40'>
        <Loader2 className='w-5 h-5 animate-spin text-[#fbbe15]' />
      </div>
    );
  }

  return <AccountForm key={apiUser?.id ?? 'no-user'} apiUser={apiUser} />;
}

function AccountForm({apiUser}: {apiUser: any}) {
  const {toast} = useToast();
  const {updateUser} = useAuth();
  const updateMeMutation = useUpdateMe();

  const BIO_MAX = 300;
  const LOCATION_MAX = 100;

  const [profileImage, setProfileImage] = useState(
    apiUser?.image_url || apiUser?.avatar || '/images/profile.png',
  );
  const [avatarBlob, setAvatarBlob] = useState<Blob | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: apiUser?.fullName || '',
    username: apiUser?.username || '',
    email: apiUser?.email || '',
    bio: apiUser?.bio || '',
    location: apiUser?.location || '',
  });

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setCropSrc(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = (blob: Blob) => {
    setCropSrc(null);
    setAvatarBlob(blob);
    const objectUrl = URL.createObjectURL(blob);
    setProfileImage(objectUrl);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {name, value} = e.target;
    if (name === 'bio' && value.length > BIO_MAX) return;
    if (name === 'location' && value.length > LOCATION_MAX) return;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleSave = () => {
    let payload: FormData | Record<string, string>;

    if (avatarBlob) {
      payload = new FormData();
      payload.append('fullName', formData.fullName);
      payload.append('bio', formData.bio);
      payload.append('location', formData.location);
      payload.append('avatar', avatarBlob, 'avatar.png');
      if (formData.username) payload.append('username', formData.username);
    } else {
      payload = {
        fullName: formData.fullName,
        bio: formData.bio,
        location: formData.location,
      };
      if (formData.username) payload.username = formData.username;
    }

    updateMeMutation.mutate(payload as any, {
      onSuccess: (response: any) => {
        const updatedUser = response?.data?.data || response?.data;
        if (updatedUser) updateUser(updatedUser);
        toast({
          title: 'Account Updated',
          description: 'Your account information has been saved successfully.',
          variant: 'success',
        });
      },
      onError: (err: any) => {
        toast({
          title: 'Update Failed',
          description:
            err?.response?.data?.message ||
            'Unable to update account. Please try again.',
          variant: 'destructive',
        });
      },
    });
  };

  const isBusy = updateMeMutation.isPending;

  return (
    <>
      {cropSrc && (
        <AvatarCropModal
          imageSrc={cropSrc}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropSrc(null)}
        />
      )}

      <div className='flex flex-col gap-5 max-w-lg'>
        {/* Avatar */}
        <div className='relative w-20 h-20'>
          <Image
            src={profileImage}
            alt='Profile'
            width={80}
            height={80}
            className='w-20 h-20 rounded-lg object-cover'
          />
          <button
            onClick={handleAvatarClick}
            className='absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#2a2a2a] border border-white/20 flex items-center justify-center cursor-pointer disabled:opacity-50'>
            <Camera size={14} className='text-zinc-400' />
          </button>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            className='hidden'
          />
        </div>

        {/* Full Name */}
        <div className='relative'>
          <label className='absolute top-2 left-3 text-[11px] text-zinc-500'>
            Full Name
          </label>
          <input
            type='text'
            name='fullName'
            value={formData.fullName}
            onChange={(e) =>
              setFormData((p) => ({...p, fullName: e.target.value}))
            }
            className='w-full pt-6 pb-2 px-3 bg-[#2a2a2a] border border-[#FBBE15]/50 rounded-lg text-white text-sm focus:outline-none focus:border-[#FBBE15] transition-colors'
          />
        </div>

        {/* Username */}
        <div className='relative'>
          <label className='absolute top-2 left-3 text-[11px] text-zinc-500'>
            Username
          </label>
          <input
            type='text'
            name='username'
            value={formData.username}
            onChange={(e) =>
              setFormData((p) => ({...p, username: e.target.value}))
            }
            placeholder='Choose a username'
            className='w-full pt-6 pb-2 px-3 bg-[#2a2a2a] border border-[#FBBE15]/50 rounded-lg text-white text-sm focus:outline-none focus:border-[#FBBE15] transition-colors placeholder:text-zinc-600'
          />
        </div>

        {/* Email (read-only) */}
        <div className='relative'>
          <input
            type='email'
            value={formData.email}
            readOnly
            className='w-full py-3 px-3 bg-[#333] border border-white/10 rounded-lg text-zinc-500 text-sm cursor-not-allowed'
          />
        </div>

        {/* Location */}
        <div className='relative'>
          <label className='absolute top-2 left-3 text-[11px] text-zinc-500 z-10'>
            Location
          </label>
          <MapPin
            size={14}
            className='absolute right-3 bottom-3 text-zinc-600 pointer-events-none'
          />
          <input
            type='text'
            name='location'
            value={formData.location}
            onChange={handleChange}
            placeholder='City, State, Country'
            maxLength={LOCATION_MAX}
            className='w-full pt-6 pb-2 px-3 pr-8 bg-[#2a2a2a] border border-[#FBBE15]/50 rounded-lg text-white text-sm focus:outline-none focus:border-[#FBBE15] transition-colors placeholder:text-zinc-600'
          />
          <span className='absolute right-3 top-2 text-[10px] text-zinc-600'>
            {formData.location.length}/{LOCATION_MAX}
          </span>
        </div>

        {/* Bio */}
        <div className='relative'>
          <label className='absolute top-2 left-3 text-[11px] text-zinc-500 z-10'>
            Bio
          </label>
          <textarea
            name='bio'
            value={formData.bio}
            onChange={handleChange}
            placeholder='Tell people a little about yourself...'
            maxLength={BIO_MAX}
            rows={4}
            className='w-full pt-6 pb-2 px-3 bg-[#2a2a2a] border border-[#FBBE15]/50 rounded-lg text-white text-sm focus:outline-none focus:border-[#FBBE15] transition-colors placeholder:text-zinc-600 resize-none'
          />
          <span className='absolute right-3 top-2 text-[10px] text-zinc-600'>
            {formData.bio.length}/{BIO_MAX}
          </span>
        </div>

        {/* Save Button */}
        <div className='flex justify-end mt-6'>
          <button
            onClick={handleSave}
            disabled={isBusy}
            className='px-16 py-3 bg-[#FBBE15] text-[#1a1a1a] font-semibold text-sm rounded-lg hover:bg-[#e5ab13] transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'>
            {isBusy && <Loader2 size={16} className='animate-spin' />}
            {updateMeMutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </>
  );
}

function PasswordTab() {
  const {toast} = useToast();
  const changePasswordMutation = useChangePassword();
  const createPasswordMutation = useCreatePassword();
  const {data: statusData, isLoading: isLoadingStatus} = usePasswordStatus();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const canCreate = statusData?.canCreatePassword === true;
  const isPending = changePasswordMutation.isPending || createPasswordMutation.isPending;

  const handleSave = () => {
    if (!canCreate && !currentPassword) {
      toast({
        title: 'Current Password Required',
        description: 'Please enter your current password.',
        variant: 'destructive',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: 'Please make sure both passwords are the same.',
        variant: 'destructive',
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: 'Password Too Short',
        description: 'Your new password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }

    if (canCreate) {
      createPasswordMutation.mutate(
        {password: newPassword},
        {
          onSuccess: () => {
            toast({
              title: 'Password Created',
              description: 'Your password has been successfully created. You can now use it to sign in.',
              variant: 'success',
            });
            setNewPassword('');
            setConfirmPassword('');
          },
          onError: (err: any) => {
            toast({
              title: 'Password Creation Failed',
              description:
                err?.response?.data?.message ||
                'Unable to create password. Please try again.',
              variant: 'destructive',
            });
          },
        }
      );
    } else {
      changePasswordMutation.mutate(
        {currentPassword, newPassword},
        {
          onSuccess: () => {
            toast({
              title: 'Password Updated',
              description: 'Your password has been changed successfully.',
              variant: 'success',
            });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
          },
          onError: (err: any) => {
            toast({
              title: 'Password Change Failed',
              description:
                err?.response?.data?.message ||
                'Unable to change password. Please check your current password and try again.',
              variant: 'destructive',
            });
          },
        },
      );
    }
  };

  if (isLoadingStatus) {
    return (
      <div className='flex items-center justify-center h-40'>
        <Loader2 className='w-6 h-6 animate-spin text-[#fbbe15]' />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-5 max-w-lg'>
      {canCreate ? (
        <div className='bg-[#fbbe15]/10 border border-[#fbbe15]/20 p-4 rounded-xl text-sm text-zinc-300 mb-2'>
          You signed in via Google and don&apos;t have a password. Create one below to log in directly with your email next time.
        </div>
      ) : (
        /* Current Password (only show if not creating) */
        <div className='relative'>
          <label className='absolute top-2 left-3 text-[11px] text-zinc-500 z-10'>
            Current Password
          </label>
          <input
            type={showCurrent ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder='Enter current password'
            className='w-full pt-6 pb-2 px-3 pr-10 bg-[#2a2a2a] border border-[#FBBE15]/50 rounded-lg text-white text-sm focus:outline-none focus:border-[#FBBE15] transition-colors placeholder:text-zinc-600'
          />
          <button
            onClick={() => setShowCurrent(!showCurrent)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 cursor-pointer bg-transparent border-0'>
            {showCurrent ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
      )}

      {/* New Password */}
      <div className='relative'>
        <label className='absolute top-2 left-3 text-[11px] text-zinc-500 z-10'>
          {canCreate ? 'Password' : 'New Password'}
        </label>
        <input
          type={showNew ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder={canCreate ? 'Enter password' : 'Enter new password'}
          className='w-full pt-6 pb-2 px-3 pr-10 bg-[#2a2a2a] border border-[#FBBE15]/50 rounded-lg text-white text-sm focus:outline-none focus:border-[#FBBE15] transition-colors placeholder:text-zinc-600'
        />
        <button
          onClick={() => setShowNew(!showNew)}
          className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 cursor-pointer bg-transparent border-0'>
          {showNew ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>

      {/* Confirm Password */}
      <div className='relative'>
        <label className='absolute top-2 left-3 text-[11px] text-zinc-500 z-10'>
          {canCreate ? 'Confirm Password' : 'Confirm New Password'}
        </label>
        <input
          type={showConfirm ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={canCreate ? 'Re-enter password' : 'Re-enter new password'}
          className='w-full pt-6 pb-2 px-3 pr-10 bg-[#2a2a2a] border border-[#FBBE15]/50 rounded-lg text-white text-sm focus:outline-none focus:border-[#FBBE15] transition-colors placeholder:text-zinc-600'
        />
        <button
          onClick={() => setShowConfirm(!showConfirm)}
          className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 cursor-pointer bg-transparent border-0'>
          {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>

      {/* Save Button */}
      <div className='flex justify-end mt-6'>
        <button
          onClick={handleSave}
          disabled={isPending}
          className='px-16 py-3 bg-[#FBBE15] text-[#1a1a1a] font-semibold text-sm rounded-lg hover:bg-[#e5ab13] transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'>
          {isPending && (
            <Loader2 size={16} className='animate-spin' />
          )}
          {isPending ? (canCreate ? 'Creating...' : 'Updating...') : (canCreate ? 'Create Password' : 'Save')}
        </button>
      </div>
    </div>
  );
}

function DeleteTab() {
  const {toast} = useToast();
  const router = useRouter();
  const {logout} = useAuth();
  const deleteMeMutation = useDeleteMe();
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);

  const handleDelete = () => {
    deleteMeMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDialog(false);
        toast({
          title: 'Account Deleted',
          description: 'Your account has been permanently deleted.',
          variant: 'destructive',
        });
        logout();
        queryClient.clear();
        setTimeout(() => {
          router.push('/');
        }, 1500);
      },
      onError: (err: any) => {
        setShowDialog(false);
        toast({
          title: 'Deletion Failed',
          description:
            err?.response?.data?.message ||
            'Unable to delete account. Please try again.',
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <div className='flex flex-col justify-between h-full'>
      <div className='max-w-2xl'>
        <p className='text-zinc-300 text-sm leading-relaxed'>
          <span className='text-red-500 font-semibold'>Deleting</span> your
          account is permanent and cannot be undone. All your data, order
          history, and rewards will be removed. If you&apos;re sure, click the{' '}
          <span className='text-red-500 font-semibold'>Delete button</span>{' '}
          below to proceed.
        </p>
      </div>

      <div className='flex justify-end mt-8'>
        <button
          onClick={() => setShowDialog(true)}
          className='px-16 py-3 bg-red-600 text-white font-semibold text-sm rounded-lg hover:bg-red-700 transition-colors cursor-pointer border-none'>
          Delete
        </button>
      </div>

      {/* Confirm Dialog */}
      {showDialog && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
          <div className='bg-[#2a2a2a] rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-white/10'>
            <h3 className='text-lg font-bold text-white mb-2'>
              Delete Account?
            </h3>
            <p className='text-sm text-zinc-400 mb-6'>
              This action is permanent and cannot be undone. All your data will
              be lost.
            </p>
            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => setShowDialog(false)}
                disabled={deleteMeMutation.isPending}
                className='px-6 py-2.5 bg-transparent border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/5 transition-colors cursor-pointer'>
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMeMutation.isPending}
                className='px-6 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors cursor-pointer border-none disabled:opacity-50 flex items-center gap-2'>
                {deleteMeMutation.isPending && (
                  <Loader2 size={14} className='animate-spin' />
                )}
                {deleteMeMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LogoutTab() {
  const {toast} = useToast();
  const router = useRouter();
  const {logout} = useAuth();
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);

  const handleSignOut = () => {
    setShowDialog(false);
    logout();
    queryClient.clear();
    toast({
      title: 'Signed Out',
      description: 'You have been successfully signed out.',
      variant: 'success',
    });
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  return (
    <div className='flex flex-col justify-between h-full'>
      <p className='text-zinc-400 text-sm'>
        Safely log out of your account to protect your information.
      </p>

      <div className='flex justify-end mt-8'>
        <button
          onClick={() => setShowDialog(true)}
          className='px-16 py-3 bg-[#FBBE15] text-[#1a1a1a] font-semibold text-sm rounded-lg hover:bg-[#e5ab13] transition-colors cursor-pointer border-none'>
          Sign Out
        </button>
      </div>

      {/* Confirm Dialog */}
      {showDialog && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
          <div className='bg-[#2a2a2a] rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-white/10'>
            <h3 className='text-lg font-bold text-white mb-2'>Sign Out?</h3>
            <p className='text-sm text-zinc-400 mb-6'>
              Are you sure you want to sign out of your account?
            </p>
            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => setShowDialog(false)}
                className='px-6 py-2.5 bg-transparent border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/5 transition-colors cursor-pointer'>
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className='px-6 py-2.5 bg-[#FBBE15] text-[#1a1a1a] text-sm font-semibold rounded-lg hover:bg-[#e5ab13] transition-colors cursor-pointer border-none'>
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UKFlag() {
  return (
    <svg viewBox='0 0 32 32' className='w-full h-full object-cover rounded-full'>
      <clipPath id='circle-uk'>
        <circle cx='16' cy='16' r='16' />
      </clipPath>
      <g clipPath='url(#circle-uk)'>
        <rect width='32' height='32' fill='#012169' />
        <path d='M0 0 L32 32 M32 0 L0 32' stroke='#ffffff' strokeWidth='4' />
        <path d='M0 0 L32 32 M32 0 L0 32' stroke='#C8102E' strokeWidth='2' />
        <path d='M16 0 V32 M0 16 H32' stroke='#ffffff' strokeWidth='7' />
        <path d='M16 0 V32 M0 16 H32' stroke='#C8102E' strokeWidth='4' />
      </g>
    </svg>
  );
}

function NigeriaFlag() {
  return (
    <svg viewBox='0 0 32 32' className='w-full h-full object-cover rounded-full'>
      <clipPath id='circle-ng'>
        <circle cx='16' cy='16' r='16' />
      </clipPath>
      <g clipPath='url(#circle-ng)'>
        <rect x='0' y='0' width='10.66' height='32' fill='#008751' />
        <rect x='10.66' y='0' width='10.68' height='32' fill='#ffffff' />
        <rect x='21.34' y='0' width='10.66' height='32' fill='#008751' />
      </g>
    </svg>
  );
}

function FranceFlag() {
  return (
    <svg viewBox='0 0 32 32' className='w-full h-full object-cover rounded-full'>
      <clipPath id='circle-fr'>
        <circle cx='16' cy='16' r='16' />
      </clipPath>
      <g clipPath='url(#circle-fr)'>
        <rect x='0' y='0' width='10.66' height='32' fill='#002395' />
        <rect x='10.66' y='0' width='10.68' height='32' fill='#ffffff' />
        <rect x='21.34' y='0' width='10.66' height='32' fill='#ED2939' />
      </g>
    </svg>
  );
}

function SpainFlag() {
  return (
    <svg viewBox='0 0 32 32' className='w-full h-full object-cover rounded-full'>
      <clipPath id='circle-es'>
        <circle cx='16' cy='16' r='16' />
      </clipPath>
      <g clipPath='url(#circle-es)'>
        <rect x='0' y='0' width='32' height='8' fill='#AA151B' />
        <rect x='0' y='8' width='32' height='16' fill='#F1BF00' />
        <rect x='0' y='24' width='32' height='8' fill='#AA151B' />
      </g>
    </svg>
  );
}

function GermanyFlag() {
  return (
    <svg viewBox='0 0 32 32' className='w-full h-full object-cover rounded-full'>
      <clipPath id='circle-de'>
        <circle cx='16' cy='16' r='16' />
      </clipPath>
      <g clipPath='url(#circle-de)'>
        <rect x='0' y='0' width='32' height='10.66' fill='#000000' />
        <rect x='0' y='10.66' width='32' height='10.68' fill='#DD0000' />
        <rect x='0' y='21.34' width='32' height='10.66' fill='#FFCE00' />
      </g>
    </svg>
  );
}

function PortugalFlag() {
  return (
    <svg viewBox='0 0 32 32' className='w-full h-full object-cover rounded-full'>
      <clipPath id='circle-pt'>
        <circle cx='16' cy='16' r='16' />
      </clipPath>
      <g clipPath='url(#circle-pt)'>
        <rect x='0' y='0' width='12.8' height='32' fill='#006600' />
        <rect x='12.8' y='0' width='19.2' height='32' fill='#FF0000' />
        <circle cx='12.8' cy='16' r='4.5' fill='#FFCE00' stroke='#000000' strokeWidth='0.5' />
      </g>
    </svg>
  );
}

const langToCodeMap: Record<string, string> = {
  english: 'en',
  pidgin: 'pcm',
  french: 'fr',
  spanish: 'es',
  german: 'de',
  portuguese: 'pt',
};

const codeToLangMap: Record<string, string> = {
  en: 'english',
  pcm: 'pidgin',
  fr: 'french',
  es: 'spanish',
  de: 'german',
  pt: 'portuguese',
};

function LanguagesTab() {
  const {toast} = useToast();
  const {user} = useAuth();
  const {data: meResponse} = useMe();
  const {setLanguage, t} = useTranslation();
  const updateLanguageMutation = useUpdateLanguage();

  const meData = (meResponse as any)?.data?.data || (meResponse as any)?.data || null;
  const apiUser = meData || user;
  const initialLangId = codeToLangMap[apiUser?.language || 'en'] || 'english';

  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLangId);
  const [savedLanguage, setSavedLanguage] = useState<string>(initialLangId);
  const [isSaved, setIsSaved] = useState(false);

  const languages = [
    {id: 'english', label: 'English', flag: <UKFlag />},
    {id: 'pidgin', label: 'Pidgin', flag: <NigeriaFlag />},
    {id: 'french', label: 'French', flag: <FranceFlag />},
    {id: 'spanish', label: 'Spanish', flag: <SpainFlag />},
    {id: 'german', label: 'German', flag: <GermanyFlag />},
    {id: 'portuguese', label: 'Portugese', flag: <PortugalFlag />},
  ];

  const hasChanges = selectedLanguage !== savedLanguage;
  const isPending = updateLanguageMutation.isPending;
  const isYellowState = hasChanges || isPending || isSaved;

  const handleSave = () => {
    setIsSaved(false);
    const langCode = langToCodeMap[selectedLanguage] || 'en';

    updateLanguageMutation.mutate(langCode, {
      onSuccess: () => {
        setSavedLanguage(selectedLanguage);
        setIsSaved(true);
        setLanguage(langCode as SupportedLanguage);
        const activeLang = languages.find((l) => l.id === selectedLanguage);
        toast({
          title: 'Language Updated',
          description: `Your language preference has been saved to ${activeLang?.label}.`,
          variant: 'success',
        });
      },
      onError: (err: any) => {
        toast({
          title: 'Update Failed',
          description:
            err?.response?.data?.message || 'Unable to update language. Please try again.',
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <div className='flex flex-col justify-between h-full w-full min-h-[420px] pb-4'>
      <div className='flex flex-col gap-6 pt-4'>
        {languages.map((lang) => {
          const isSelected = selectedLanguage === lang.id;
          return (
            <div key={lang.id} className='flex items-center gap-12 sm:gap-20 max-w-md'>
              <div className='flex items-center gap-4 w-36 shrink-0'>
                <div className='w-8 h-8 rounded-full shrink-0 shadow-sm overflow-hidden'>
                  {lang.flag}
                </div>
                <span className='text-sm font-medium text-zinc-200'>
                  {lang.label}
                </span>
              </div>

              <button
                type='button'
                onClick={() => {
                  setSelectedLanguage(lang.id);
                  setIsSaved(false);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isSelected ? 'bg-[#001F3F]' : 'bg-[#52525B]'
                }`}>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isSelected ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      <div className='flex justify-end mt-16 w-full'>
        <button
          onClick={handleSave}
          disabled={isPending}
          className={`w-64 py-3.5 font-semibold text-sm rounded-xl transition-all duration-300 cursor-pointer border-none flex items-center justify-center gap-2 shadow-sm ${
            isYellowState
              ? 'bg-[#FBBE15] text-[#1a1a1a] hover:bg-[#e5ab13]'
              : 'bg-[#EFEFEF] text-zinc-600 hover:bg-white'
          }`}>
          {isPending && (
            <Loader2 size={16} className='animate-spin text-[#1a1a1a]' />
          )}
          {isPending ? t('settings.language.saving', 'Saving...') : t('settings.language.save', 'Save')}
        </button>
      </div>
    </div>
  );
}

function BlockedUsersTab() {
  const { blockedUsers, unblockUser, isLoading } = useBlockedUsers();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleUnblock = async (user: BlockedUser) => {
    try {
      await unblockUser(user.id);
      setToastMessage(`${user.fullName} is unblocked 🚫`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to unblock user';
      setToastMessage(msg);
    }
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center py-28 text-center'>
        <Loader2 className='w-6 h-6 animate-spin text-[#FFC727] mb-2' />
        <p className='text-zinc-400 text-xs'>Loading blocked accounts...</p>
      </div>
    );
  }

  if (!blockedUsers || blockedUsers.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-28 text-center select-none'>
        <div className='w-9 h-9 rounded-full border border-zinc-500 flex items-center justify-center mb-3 text-zinc-400'>
          <Ban size={18} />
        </div>
        <p className='text-zinc-400 text-xs sm:text-sm font-normal m-0'>
          You haven&apos;t blocked anyone yet.
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6 max-w-lg relative min-h-[300px]'>
      <div className='flex flex-col gap-4 pt-2'>
        {blockedUsers.map((user) => (
          <div
            key={user.id}
            className='flex items-center justify-between py-2'>
            <div className='flex items-center gap-3.5'>
              <div className='w-10 h-10 rounded-full overflow-hidden bg-zinc-700 shrink-0 border border-white/10'>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className='w-full h-full object-cover'
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/profile.png';
                    }}
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-xs font-bold text-zinc-300'>
                    {user.fullName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className='flex flex-col'>
                <span className='text-sm font-semibold text-white leading-tight'>
                  {user.fullName}
                </span>
                <span className='text-[11px] text-zinc-400 mt-0.5'>
                  Blocked · {user.blockedAt}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleUnblock(user)}
              className='px-4 py-1.5 bg-[#2a2a2a] hover:bg-zinc-700 text-white text-xs font-semibold rounded-md border-none cursor-pointer transition-colors shadow-sm'>
              Unblock
            </button>
          </div>
        ))}
      </div>

      {/* Floating pill toast */}
      {toastMessage && (
        <div className='fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 bg-black/85 backdrop-blur-md text-white text-xs rounded-full border border-white/15 shadow-2xl animate-in fade-in slide-in-from-bottom-3'>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
