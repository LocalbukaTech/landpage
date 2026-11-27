import Image from 'next/image';
import Link from 'next/link';
import { Search, MapPin, Star, Heart, Users, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/anim/Reveal';

// We are using Unsplash placeholder images that match the food types.
// You can replace these URLs with local images later if you want.
const POPULAR_MEALS = [
  {
    id: 1,
    name: 'Suya',
    price: 'N3,000',
    tags: 'Street food · Wraps',
    distance: '1.2 km away',
    recommendations: 24,
    rating: 4.8,
    image: '/images/fb.png',
  },
  {
    id: 2,
    name: 'Jollof Rice',
    price: 'N5,000',
    tags: 'Nigerian · Rice',
    distance: '0.8 km away',
    recommendations: 38,
    rating: 4.7,
    image: '/images/Image.png',
  },
  {
    id: 3,
    name: 'Pancakes',
    price: 'N8,000',
    tags: 'Breakfast · Bakery',
    distance: '2.4 km away',
    recommendations: 17,
    rating: 4.9,
    image: '/images/pan.png',
  },
  {
    id: 4,
    name: 'Grilled Fish',
    price: 'N15,000',
    tags: 'Nigerian · Seafood',
    distance: '3.1 km away',
    recommendations: 21,
    rating: 4.7,
    image: '/images/grill.png',
  },
  {
    id: 5,
    name: 'Shawarma',
    price: 'N5,000',
    tags: 'Street food',
    distance: '1.6 km away',
    recommendations: 29,
    rating: 4.6,
    image: '/images/shawarma.png',
  },
  {
    id: 6,
    name: 'Fried Rice',
    price: 'N7,000',
    tags: 'Nigerian · Rice',
    distance: '1.1 km away',
    recommendations: 33,
    rating: 4.5,
    image: '/images/Image (1).png',
  },
  {
    id: 7,
    name: 'Amala',
    price: 'N4,000',
    tags: 'Yoruba · Swallow',
    distance: '2.0 km away',
    recommendations: 19,
    rating: 4.8,
    image: '/images/fb (1).png',
  },
  {
    id: 8,
    name: 'Asun',
    price: 'N8,000',
    tags: 'Nigerian · Grills',
    distance: '2.8 km away',
    recommendations: 15,
    rating: 4.7,
    image: '/images/asun.png',
  },
];

export function MealExplorerSection() {
  return (
    <section id='discover' className='bg-[#FDFBF7] py-24'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        {/* Header */}
        <div className='text-center max-w-3xl mx-auto mb-12'>
          <Reveal direction='up' duration={0.6}>
            <h2 className='text-[#0A1E44] text-4xl md:text-5xl font-bold mb-4'>
              Find your next meal near you
            </h2>
            <p className='text-gray-600 text-lg'>
              Discover local food, compare your options, and see what people are recommending.
            </p>
          </Reveal>
        </div>

        {/* Search Bar Container */}
        <Reveal direction='up' delay={0.1} duration={0.6} className='max-w-4xl mx-auto mb-8'>
          <div className='bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center gap-2'>
            
            {/* Search Input */}
            <div className='flex items-center flex-1 w-full px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200'>
              <Search className='text-gray-400 w-5 h-5 mr-3' />
              <input 
                type='text' 
                placeholder='Search meals, e.g. jollof, suya, pizza...' 
                className='w-full outline-none text-gray-700 bg-transparent'
              />
            </div>

            {/* Location Input */}
            <div className='flex items-center flex-1 w-full px-4 py-2'>
              <MapPin className='text-[#0A1E44] w-5 h-5 mr-3' />
              <input 
                type='text' 
                placeholder='Use my location' 
                className='w-full outline-none text-gray-700 bg-transparent'
              />
            </div>

            {/* Search Button */}
            <button className='w-full md:w-auto bg-[#FFC727] text-[#0A1E44] font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 transition-colors'>
              Search
            </button>
          </div>
        </Reveal>

        {/* Filter Pills */}
        <Reveal direction='up' delay={0.2} duration={0.6} className='flex flex-wrap justify-center gap-3 mb-12'>
          {['Near me', 'N Budget', 'NN Mid-range', 'NNN Premium'].map((filter) => (
            <button 
              key={filter}
              className='px-6 py-2 rounded-full border border-gray-300 text-gray-700 font-medium hover:border-[#0A1E44] hover:text-[#0A1E44] transition-colors bg-white'
            >
              {filter}
            </button>
          ))}
        </Reveal>

        {/* Popular Near You Grid */}
        <div>
          <div className='flex justify-between items-center mb-6'>
            <h3 className='text-2xl font-bold text-[#0A1E44]'>Popular near you</h3>
            <Link href='/buka' className='text-[#0A1E44] font-semibold flex items-center gap-1 hover:underline'>
              View all <ArrowRight className='w-4 h-4' />
            </Link>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {POPULAR_MEALS.map((meal, index) => (
              <Reveal 
                key={meal.id} 
                direction='up' 
                delay={index * 0.1} 
                duration={0.6}
                className='bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition-shadow'
              >
                {/* Image Container */}
                <div className='relative h-48 w-full'>
                  <Image 
                    src={meal.image} 
                    alt={meal.name} 
                    fill 
                    className='object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                  {/* Rating Badge */}
                  <div className='absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold text-[#0A1E44]'>
                    <Star className='w-3.5 h-3.5 fill-[#FFC727] text-[#FFC727]' />
                    {meal.rating}
                  </div>
                  {/* Heart Icon */}
                  <button className='absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white text-gray-500 hover:text-red-500 transition-colors'>
                    <Heart className='w-4 h-4' />
                  </button>
                </div>

                {/* Content */}
                <div className='p-4'>
                  <h4 className='text-lg font-bold text-[#0A1E44]'>{meal.name}</h4>
                  <div className='flex items-center gap-2 text-sm text-gray-500 mb-3'>
                    <span className='font-bold text-[#0A1E44]'>{meal.price}</span>
                    <span>·</span>
                    <span>{meal.tags}</span>
                  </div>

                  <div className='flex flex-col gap-1.5 text-xs text-gray-500'>
                    <div className='flex items-center gap-1.5'>
                      <MapPin className='w-3.5 h-3.5 text-[#FFC727]' />
                      {meal.distance}
                    </div>
                    <div className='flex items-center gap-1.5'>
                      <Users className='w-3.5 h-3.5 text-[#FFC727]' />
                      Recommended by {meal.recommendations} people
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}