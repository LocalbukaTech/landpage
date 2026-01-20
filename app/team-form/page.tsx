'use client';

import {useState} from 'react';
import Image from 'next/image';
import {Footer} from '@/components/layout/footer';
import {useCreateTeamMutation} from '@/lib/api/services/teams.hooks';
import {useToast} from '@/hooks/use-toast';
import {useRouter} from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const TeamForm = () => {
  const createTeam = useCreateTeamMutation();
  const loading = createTeam.isPending;
  const {toast} = useToast();
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    linkedin_url: '',
    department: '',
    position: '',
    description: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const {width, height} = img;
      URL.revokeObjectURL(url);

      if (width !== 768 || height !== 1344) {
        // Reset input and state, show error toast
        e.target.value = '';
        setImageFile(null);
        setImagePreview('');
        toast({
          title: 'Invalid image size',
          description:
            'Please upload an image with dimensions 768×1344 pixels.',
          variant: 'destructive',
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      e.target.value = '';
      setImageFile(null);
      setImagePreview('');
      toast({
        title: 'Invalid image file',
        description: 'We could not read this image. Please try another file.',
        variant: 'destructive',
      });
    };

    img.src = url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Build FormData payload for image upload
    const submitData = new FormData();
    submitData.append('first_name', formData.first_name);
    submitData.append('last_name', formData.last_name);
    submitData.append('phone', formData.phone);
    submitData.append('linkedin_url', formData.linkedin_url);
    submitData.append('department', formData.department);
    submitData.append('position', formData.position);
    submitData.append('description', formData.description);

    if (imageFile) {
      submitData.append('image', imageFile);
    }

    createTeam.mutate(submitData, {
      onSuccess: (res) => {
        toast({
          title: 'Application submitted',
          description:
            res.message ??
            'Your team information has been submitted successfully.',
          variant: 'success',
        });
        setTimeout(() => {
          router.replace('/');
        }, 2000);
        setFormData({
          first_name: '',
          last_name: '',
          phone: '',
          linkedin_url: '',
          department: '',
          position: '',
          description: '',
        });
        setImageFile(null);
        setImagePreview('');
      },
      onError: (error) => {
        console.error('Error creating team:', error);
        toast({
          title: 'Submission failed',
          description:
            'We could not submit your application. Please try again.',
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <>
      <div className='min-h-screen bg-linear-to-br from-primary/10 via-white to-primary/5 dark:from-black dark:via-gray-950 dark:to-black py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-3xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='flex justify-center mb-4'>
              <Image
                src='/images/localBuka_logo.png'
                alt='LocalBuka'
                width={64}
                height={64}
                className='w-16 h-16 object-contain rounded-full'
              />
            </div>
            <h1 className='text-4xl font-bold text-foreground mb-2'>
              Join LocalBuka Team
            </h1>
            <p className='text-muted-foreground'>
              Fill in your information to become part of our amazing team
            </p>
          </div>

          {/* Form Card */}
          <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Name Fields */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label
                    htmlFor='first_name'
                    className='block text-sm font-medium text-foreground mb-2'>
                    First Name <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    id='first_name'
                    name='first_name'
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
                    placeholder='John'
                  />
                </div>

                <div>
                  <label
                    htmlFor='last_name'
                    className='block text-sm font-medium text-foreground mb-2'>
                    Last Name <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    id='last_name'
                    name='last_name'
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
                    placeholder='Doe'
                  />
                </div>
              </div>

              {/* Contact Fields */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label
                    htmlFor='phone'
                    className='block text-sm font-medium text-foreground mb-2'>
                    Phone Number <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='tel'
                    id='phone'
                    name='phone'
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
                    placeholder='+234 800 000 0000'
                  />
                </div>

                <div>
                  <label
                    htmlFor='linkedin_url'
                    className='block text-sm font-medium text-foreground mb-2'>
                    LinkedIn URL <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='url'
                    id='linkedin_url'
                    name='linkedin_url'
                    required
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
                    placeholder='https://linkedin.com/in/username'
                  />
                </div>
              </div>

              {/* Position Fields */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label
                    htmlFor='department'
                    className='block text-sm font-medium text-foreground mb-2'>
                    Department <span className='text-red-500'>*</span>
                  </label>
                  <select
                    id='department'
                    name='department'
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all'>
                    <option value=''>Select Department</option>
                    <option value='Operations'>Operations</option>
                    <option value='Engineering'>Engineering</option>
                    <option value='Product'>Product</option>
                    <option value='Human Resource'>Human Resource</option>
                    <option value='Brand & Finance'>Brand & Finance</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor='position'
                    className='block text-sm font-medium text-foreground mb-2'>
                    Position <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    id='position'
                    name='position'
                    required
                    value={formData.position}
                    onChange={handleChange}
                    className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
                    placeholder='Software Engineer'
                  />
                </div>
              </div>

              {/* Image URL */}
              <TooltipProvider>
                <Tooltip delayDuration={150}>
                  <TooltipTrigger asChild>
                    <div>
                      <label
                        htmlFor='image'
                        className='block text-sm font-medium text-foreground mb-2'>
                        Profile Image <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='file'
                        id='image'
                        name='image'
                        accept='image/*'
                        required
                        onChange={handleImageChange}
                        className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90'
                      />
                      {imagePreview && (
                        <div className='mt-4'>
                          <p className='text-sm text-muted-foreground mb-2'>
                            Preview:
                          </p>
                          <Image
                            src={imagePreview}
                            alt='Preview'
                            width={128}
                            height={128}
                            className='w-32 h-32 rounded-lg object-cover border-2 border-gray-300 dark:border-gray-700'
                          />
                        </div>
                      )}
                      <p className='mt-2 text-sm text-muted-foreground'>
                        Upload a professional headshot (JPG, PNG, or WebP)
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side='top'
                    align='start'
                    collisionPadding={16}
                    className='max-w-[calc(100vw-2rem)] sm:max-w-sm px-4 py-3'>
                    <p className='font-semibold mb-1'>Image requirements</p>
                    <p className='text-xs sm:text-sm text-neutral-200'>
                      Please upload a clear portrait image in JPG, PNG, or WebP
                      format, with exact dimensions of
                      <span className='font-semibold'>
                        {' '}
                        768×1344 pixels
                      </span>{' '}
                      for the best display quality on the team page. Try
                      https://imageresizer.com/
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Description */}
              <div>
                <label
                  htmlFor='description'
                  className='block text-sm font-medium text-foreground mb-2'>
                  Bio / Description <span className='text-red-500'>*</span>
                </label>
                <textarea
                  id='description'
                  name='description'
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none'
                  placeholder='Tell us about yourself, your experience, and what you bring to the team...'
                />
              </div>

              {/* Submit Button */}
              <div className='pt-4'>
                <button
                  type='submit'
                  disabled={loading}
                  className='w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg'>
                  {loading ? (
                    <span className='flex items-center justify-center gap-2'>
                      <svg
                        className='animate-spin h-5 w-5'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'>
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'></circle>
                        <path
                          className='opacity-80'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className='text-center mt-8'>
            <p className='text-sm text-muted-foreground'>
              Need help? Contact us at{' '}
              <a
                href='mailto:support@localbuka.com'
                className='text-primary hover:underline'>
                support@localbuka.com
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TeamForm;
