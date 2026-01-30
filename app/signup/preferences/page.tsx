'use client';

import {useState, Suspense} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {Loader2} from 'lucide-react';

const foodCategories = [
  {id: 'soups-stews', label: 'Soups & Stews'},
  {id: 'swallows', label: 'Swallows'},
  {id: 'rice-dishes', label: 'Rice Dishes'},
  {id: 'meat-dishes', label: 'Meat Dishes'},
  {id: 'snacks', label: 'Snacks'},
];

const PreferencesContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleGoToFeed = () => {
    // Save preferences and navigate to feed/home (or redirect target)
    router.push(redirect);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-white dark:bg-black p-6'>
      <div className='text-center max-w-lg w-full'>
        {/* Title */}
        <h1 className='text-2xl sm:text-3xl font-bold text-[#0A1F44] dark:text-white mb-2'>
          What kind of food do you crave?
        </h1>
        <p className='text-gray-500 dark:text-gray-400 mb-10'>
          Select all that apply
        </p>

        {/* Food Categories */}
        <div className='flex flex-wrap justify-center gap-3 mb-12'>
          {foodCategories.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            return (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`px-5 py-2.5 rounded-full border-2 font-medium transition-all ${
                  isSelected
                    ? 'bg-[#0A1F44] text-white border-[#0A1F44]'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                }`}>
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Go to Feed Button */}
        <button
          onClick={handleGoToFeed}
          className='w-full max-w-xs mx-auto py-3.5 bg-primary hover:bg-primary/90 text-[#0A1F44] font-semibold rounded-xl transition-colors'>
          Go to Feed
        </button>
      </div>
    </div>
  );
};

const PreferencesPage = () => {
  return (
    <Suspense fallback={
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    }>
      <PreferencesContent />
    </Suspense>
  );
};

export default PreferencesPage;

