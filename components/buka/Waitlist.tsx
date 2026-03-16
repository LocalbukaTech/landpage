'use client';

import {useState} from 'react';
import Image from 'next/image';
import {Loader2, Check} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Images} from '@/public/images';
import {useCreateWaitlistMutation} from '@/lib/api/services/waitlist.hooks';
import {useToast} from '@/hooks/use-toast';


export function Waitlist() {
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
    setIsSuccess(false);
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
          setTimeout(() => {
            resetForm();
          }, 1500);
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
    <div className="w-[92%] mx-auto">
      <div className="relative bg-white rounded-2xl w-full overflow-hidden">
        {/* Header Section - Centered at top */}
        <div className="relative px-8 pt-16 pb-6 text-center bg-white z-10 w-[60%] mx-auto">
          <h2 className="text-3xl lg:text-5xl font-bold leading-tight text-gray-900">
            Be the first to experience the&nbsp;
            <span className="relative inline-block">
              <span className="relative z-10">LocalBuka App</span>
              <span
                className="absolute bottom-1 left-0 w-full h-3 bg-[#FBBE15] -rotate-1 z-0"
                aria-hidden="true"
              />
            </span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Left Side - Form */}
          <div className="flex-1 p-8 md:p-10 lg:p-12 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `url(${Images.pattern})`,
                backgroundSize: '400px',
                backgroundRepeat: 'repeat',
              }}
            />

            <div className="relative z-10 max-w-md mx-auto">
              {/* Subtitle */}
              <p className="text-gray-600 mb-8 text-base">
                Get early access to our application when it launches on the
                App & Play Store.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="w-full">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 outline-none text-black border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="w-full">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 outline-none text-black border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="w-full">
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 outline-none text-black border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="w-full">
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 outline-none text-black border border-gray-300 rounded-lg"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={createWaitlistMutation.isPending || isSuccess}
                  className="w-full h-12 font-semibold text-base rounded-lg transition-colors bg-[#FBBE15] hover:bg-[#FBBE15]/90 text-white">
                  {createWaitlistMutation.isPending ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      Joining...
                    </>
                  ) : isSuccess ? ( 
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Joined
                    </>
                  ) : (
                    'Join the Waitlist'
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Right Side - Phone Images */}
          <div className="hidden md:flex flex-1 bg-white items-center justify-center p-6 lg:p-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div
              className="absolute inset-0 opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: `url(${Images.pattern})`,
                backgroundSize: '500px',
                backgroundRepeat: 'repeat',
              }}
            />

            {/* Phone Mockups */}
            <div className="relative w-full flex items-center justify-center">
              <div className="relative w-full max-w-[500px]">
                <Image
                  src={Images.phones}
                  alt="LocalBuka App Preview"
                  width={500}
                  height={450}
                  className="object-contain w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
