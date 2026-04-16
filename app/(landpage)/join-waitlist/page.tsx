'use client';

import {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {Loader2, Check, ArrowLeft} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Images} from '@/public/images';
import {useCreateWaitlistMutation} from '@/lib/api/services/waitlist.hooks';
import {useToast} from '@/hooks/use-toast';
import {Navbar} from '@/components/layout/navbar';
import {Footer} from '@/components/layout/footer';

export default function JoinWaitlistPage() {
  const {toast} = useToast();
  const createWaitlistMutation = useCreateWaitlistMutation();
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    location: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      location: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createWaitlistMutation.mutate(
      {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phoneNumber,
        location: formData.location,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          toast({
            title: "You're on the list!",
            description:
              "Thanks for joining our waitlist. We'll notify you when the app launches.",
            variant: 'success',
          });
        },
        onError: () => {
          toast({
            title: 'Something went wrong',
            description: 'Failed to join waitlist. Please try again.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  return (
    <>
      <Navbar />

      <main className='min-h-screen bg-white'>
        {/* Hero / Header Section */}
        <div className='relative pt-28 pb-8 text-center'>
          {/* Background Pattern */}
          <div
            className='absolute inset-0 opacity-[0.02] pointer-events-none'
            style={{
              backgroundImage: `url(${Images.pattern})`,
              backgroundSize: '500px',
              backgroundRepeat: 'repeat',
            }}
          />

          <div className='relative z-10 max-w-2xl mx-auto px-4'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900'>
              Be the first to experience the&nbsp;
              <span className='relative inline-block'>
                <span className='relative z-10'>LocalBuka App</span>
                <span
                  className='absolute bottom-1 left-0 w-full h-3 bg-[#FBBE15] -rotate-1 z-0'
                  aria-hidden='true'
                />
              </span>
            </h1>
          </div>
        </div>

        {/* Content Section */}
        <div className='max-w-[1100px] mx-auto px-4 pb-20'>
          <div className='flex flex-col md:flex-row gap-8 md:gap-12 items-center'>
            {/* Left Side - Form */}
            <div className='flex-1 w-full relative'>
              <div className='max-w-md mx-auto md:mx-0'>
                {!isSuccess ? (
                  <>
                    <p className='text-gray-600 mb-8 text-base'>
                      Get early access to our application when it launches on the
                      App & Play Store.
                    </p>

                    <form onSubmit={handleSubmit} className='space-y-4'>
                      <div>
                        <Input
                          type='text'
                          name='firstName'
                          placeholder='First Name'
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className='h-12 px-4 outline-none text-black'
                        />
                      </div>

                      <div>
                        <Input
                          type='text'
                          name='lastName'
                          placeholder='Last Name'
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className='h-12 px-4 rounded-lg border-gray-300 focus:border-primary focus:ring-primary text-black'
                        />
                      </div>

                      <div>
                        <Input
                          type='tel'
                          name='phoneNumber'
                          placeholder='Phone Number'
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          required
                          className='h-12 px-4 rounded-lg border-gray-300 focus:border-primary focus:ring-primary text-black'
                        />
                      </div>

                      <div>
                        <Input
                          type='text'
                          name='location'
                          placeholder='Location'
                          value={formData.location}
                          onChange={handleChange}
                          required
                          className='h-12 px-4 rounded-lg border-gray-300 focus:border-primary focus:ring-primary text-black'
                        />
                      </div>

                      <Button
                        type='submit'
                        disabled={createWaitlistMutation.isPending || isSuccess}
                        className='w-full h-12 font-semibold text-base rounded-lg transition-colors bg-[#FBBE15] hover:bg-[#FBBE15]/90 text-white'>
                        {createWaitlistMutation.isPending ? (
                          <>
                            <Loader2 className='w-6 h-6 animate-spin mr-2' />
                            Joining...
                          </>
                        ) : (
                          'Join the Waitlist'
                        )}
                      </Button>
                    </form>
                  </>
                ) : (
                  /* Success State */
                  <div className='text-center py-12'>
                    <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6'>
                      <Check className='w-8 h-8 text-green-600' />
                    </div>
                    <h2 className='text-2xl font-bold text-gray-900 mb-3'>
                      You&apos;re on the list!
                    </h2>
                    <p className='text-gray-600 mb-8'>
                      Thanks for joining our waitlist. We&apos;ll notify you when the
                      LocalBuka App launches on the App & Play Store.
                    </p>
                    <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                      <Button
                        onClick={() => {
                          setIsSuccess(false);
                          resetForm();
                        }}
                        variant='outline'
                        className='h-12 px-6 font-medium'>
                        Sign Up Another Person
                      </Button>
                      <Link href='/'>
                        <Button className='h-12 px-6 font-medium bg-[#FBBE15] hover:bg-[#FBBE15]/90 text-white w-full'>
                          <ArrowLeft className='w-4 h-4 mr-2' />
                          Back to Home
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Phone Images */}
            <div className='hidden md:flex flex-1 items-center justify-center relative overflow-hidden'>
              <div className='relative w-full max-w-[500px]'>
                <Image
                  src={Images.phones}
                  alt='LocalBuka App Preview'
                  width={500}
                  height={450}
                  className='object-contain w-full h-auto'
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
