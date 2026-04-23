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
  useDeleteMe,
  useChangePassword,
} from '@/lib/api/services/auth.hooks';
import {useAuth} from '@/context/AuthContext';
import {useQueryClient} from '@tanstack/react-query';

interface AccountInformationProps {
  activeSubTab: string;
  onSubTabChange: (tab: string) => void;
}

const subTabs = [
  {id: 'account', label: 'Account'},
  {id: 'password', label: 'Password & Security'},
  {id: 'delete', label: 'Delete Account'},
  {id: 'logout', label: 'Logout'},
];

export function AccountInformation({
  activeSubTab,
  onSubTabChange,
}: AccountInformationProps) {
  return (
    <div className='flex flex-col h-full'>
      {/* Sub-tabs */}
      <div className='flex gap-0 border-b border-white/10'>
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSubTabChange(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-all border-b-2 cursor-pointer bg-transparent whitespace-nowrap ${
                isActive
                  ? 'border-[#FBBE15] text-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
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
        {activeSubTab === 'delete' && <DeleteTab />}
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

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = () => {
    if (!currentPassword) {
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
  };

  return (
    <div className='flex flex-col gap-5 max-w-lg'>
      {/* Current Password */}
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

      {/* New Password */}
      <div className='relative'>
        <label className='absolute top-2 left-3 text-[11px] text-zinc-500 z-10'>
          New Password
        </label>
        <input
          type={showNew ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder='Enter new password'
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
          Confirm New Password
        </label>
        <input
          type={showConfirm ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder='Re-enter new password'
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
          disabled={changePasswordMutation.isPending}
          className='px-16 py-3 bg-[#FBBE15] text-[#1a1a1a] font-semibold text-sm rounded-lg hover:bg-[#e5ab13] transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'>
          {changePasswordMutation.isPending && (
            <Loader2 size={16} className='animate-spin' />
          )}
          {changePasswordMutation.isPending ? 'Updating...' : 'Save'}
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
          router.push('/feeds');
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
      router.push('/feeds');
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
