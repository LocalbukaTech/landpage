'use client';

import {Suspense, useState, useMemo, useEffect} from 'react';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {useQueryClient} from '@tanstack/react-query';
import {MainLayout} from '@/components/layout/MainLayout';
import {VideoFeed} from '@/components/video/VideoFeed';
import {
  useInfinitePosts,
  useInfinitePersonalisedFeed,
} from '@/lib/api/services/posts.hooks';
import {Loader2} from 'lucide-react';
import {cn} from '@/lib/utils';
import {queryKeys} from '@/lib/api/types';
import {feedStore, type FeedType} from '@/lib/feed-state';
import {PasswordPromptModal} from '@/components/modals';
import {useAuth} from '@/context/AuthContext';
import {useRequireAuth} from '@/hooks/useRequireAuth';
import {useShuffledFeed} from '@/hooks/useShuffledFeed';
import {trackEvent} from '@/lib/analytics';

function HomeContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('video');
  const queryClient = useQueryClient();
  const {isAuthenticated} = useAuth();
  const {requireAuth} = useRequireAuth();

  // Disable pull-to-refresh / overscroll bounce on mobile browsers while on the feeds page
  useEffect(() => {
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;
    const originalBodyOverscroll = document.body.style.overscrollBehavior;

    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overscrollBehavior = 'none';

    return () => {
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;
      document.body.style.overscrollBehavior = originalBodyOverscroll;
    };
  }, []);

  // Consume the reset flag once on mount (useState initialiser runs exactly
  // once even under React StrictMode).  If the user clicked Home explicitly
  // the flag is true → start fresh from the top.
  const [wasReset] = useState(() => feedStore.consumeReset());

  // Restore the last active feed tab unless we're resetting.
  const [feedType, setFeedType] = useState<FeedType>(
    wasReset ? 'foryou' : feedStore.getFeedType(),
  );

  const typeParam = searchParams.get('type');
  useEffect(() => {
    if (typeParam === 'following') {
      if (!isAuthenticated) {
        const timer = setTimeout(() => {
          setFeedType('foryou');
          requireAuth(() => {
            setFeedType('following');
          });
        }, 0);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setFeedType('following');
        }, 0);
        return () => clearTimeout(timer);
      }
    } else if (typeParam === 'foryou') {
      const timer = setTimeout(() => {
        setFeedType('foryou');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [typeParam, isAuthenticated, requireAuth]);

  // Handle runtime logout/auth change state sync
  useEffect(() => {
    if (feedType === 'following' && !isAuthenticated) {
      const timer = setTimeout(() => {
        setFeedType('foryou');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [feedType, isAuthenticated]);

  // Track home view in GA4 on load and when tab changes
  useEffect(() => {
    trackEvent('home_view', {
      feed_type: feedType,
      page_name: 'home',
    });
  }, [feedType]);

  // The post ID to restore to (null if first visit or reset).
  const savedPostId = wasReset ? null : feedStore.getPostId();

  // Force refetch when user switches back to the app (tab focus)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // User switched back to this tab, invalidate and refetch all post data
        queryClient.invalidateQueries({queryKey: queryKeys.posts.all});
      }
    };

    const handleFocus = () => {
      // User switched back to window
      queryClient.invalidateQueries({queryKey: queryKeys.posts.all});
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [queryClient]);

  // Fetch both feeds using infinite query
  const {
    data: personalisedData,
    isLoading: isLoadingPersonalised,
    isError: isErrorPersonalised,
    fetchNextPage: fetchNextPersonalisedPage,
    hasNextPage: hasNextPersonalisedPage,
    isFetchingNextPage: isFetchingNextPersonalisedPage,
  } = useInfinitePersonalisedFeed({pageSize: 20}, {enabled: isAuthenticated});

  const {
    data: chronologicalData,
    isLoading: isLoadingChronological,
    isError: isErrorChronological,
    fetchNextPage: fetchNextChronologicalPage,
    hasNextPage: hasNextChronologicalPage,
    isFetchingNextPage: isFetchingNextChronologicalPage,
  } = useInfinitePosts({pageSize: 20});

  // Mapping: Following -> personalisedFeed (/posts/feed), For You -> posts (/posts)
  const activeData =
    feedType === 'following' ? personalisedData : chronologicalData;
  const isLoading =
    feedType === 'following' ? isLoadingPersonalised : isLoadingChronological;
  const isError =
    feedType === 'following' ? isErrorPersonalised : isErrorChronological;

  const fetchNextPage =
    feedType === 'following' ? fetchNextPersonalisedPage : fetchNextChronologicalPage;
  const hasNextPage =
    feedType === 'following' ? hasNextPersonalisedPage : hasNextChronologicalPage;
  const isFetchingNextPage =
    feedType === 'following' ? isFetchingNextPersonalisedPage : isFetchingNextChronologicalPage;

  const rawPosts = useMemo(() => {
    return activeData?.pages.flatMap((page) => page.data) || [];
  }, [activeData]);

  // Apply Weighted Reservoir Shuffle on 'foryou' feed while keeping 'following' chronological
  const posts = useShuffledFeed(rawPosts, {
    enabled: feedType === 'foryou',
    targetVideoId: videoId,
    resetKey: `${feedType}-${wasReset}`,
  });

  // Find the index to start the feed at.
  // Priority: 1) URL ?video=<id>  2) saved post from store  3) 0
  const initialIndex = useMemo(() => {
    if (videoId && posts.length > 0) {
      const index = posts.findIndex((p) => p.id === videoId);
      if (index >= 0) return index;
    }
    if (savedPostId && posts.length > 0) {
      const index = posts.findIndex((p) => p.id === savedPostId);
      if (index >= 0) return index;
    }
    return 0;
  }, [videoId, savedPostId, posts]);

  return (
    <MainLayout>
      <div className='relative w-full h-full overscroll-none'>
        <div className='hidden md:flex absolute top-6 left-0 right-0 z-50 justify-center items-center pointer-events-none'>
          <div className='flex items-center gap-4 bg-black/35 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg pointer-events-auto'>
            <button
              onClick={() => {
                requireAuth(() => {
                  setFeedType('following');
                });
              }}
              className={cn(
                'text-sm font-bold transition-all hover:scale-105 pointer-events-auto cursor-pointer bg-transparent border-none drop-shadow-xs outline-none',
                feedType === 'following'
                  ? 'text-white scale-105'
                  : 'text-white/60',
              )}>
              Following
            </button>
            <div className='w-px h-3.5 bg-white/20' />
            <button
              onClick={() => setFeedType('foryou')}
              className={cn(
                'text-sm font-bold transition-all hover:scale-105 pointer-events-auto cursor-pointer bg-transparent border-none drop-shadow-xs outline-none',
                feedType === 'foryou' ? 'text-white scale-105' : 'text-white/60',
              )}>
              For You
            </button>
          </div>
        </div>

        {/* State rendering */}
        {isLoading ? (
          <div className='flex flex-col items-center justify-center h-full w-full text-white/70 space-y-4'>
            <Loader2 className='w-8 h-8 animate-spin text-[#FFC727]' />
            <p className='font-medium text-sm drop-shadow-md'>
              Loading feed...
            </p>
          </div>
        ) : isError ? (
          <div className='flex flex-col items-center justify-center h-full w-full text-white/70 space-y-4'>
            <p className='font-medium text-sm drop-shadow-md'>
              Failed to load feed. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className='px-4 py-2 bg-[#FFC727] text-black font-semibold rounded-full hover:bg-yellow-500 transition-colors pointer-events-auto'>
              Retry
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full w-full text-white/70'>
            <p className='font-medium text-sm drop-shadow-md'>No posts yet.</p>
          </div>
        ) : (
          <VideoFeed
            key={feedType}
            posts={posts}
            initialIndex={initialIndex}
            initialMuted={true}
            feedType={feedType}
            hideFollowButton={feedType === 'following'}
            showTimestamp={true}
            onLoadMore={fetchNextPage}
            hasMore={!!hasNextPage}
            isLoadingMore={isFetchingNextPage}
          />
        )}
        <PasswordPromptModal />
      </div>
    </MainLayout>
  );
}

function LocalBukaEditorialSection() {
  return (
    <section
      aria-label='LocalBuka Culinary Discovery, Restaurant Directory & Nigerian Food Culture Guide'
      className='sr-only'
    >
      <header>
        <h1>LocalBuka — Discover the Best Restaurants, Authentic Nigerian Cuisine, and Culinary Communities Across Africa</h1>
        <p>
          By <span>LocalBuka Editorial Team</span> · Published <time dateTime='2026-11-12'>November 12, 2026</time>
        </p>
        <p>
          Welcome to LocalBuka, the premier restaurant discovery platform, neighborhood buka directory, and interactive culinary community built for food lovers across Nigeria and Africa. Whether you are searching for smoky firewood Jollof rice in Lagos, traditional Tuwo Shinkafa in Abuja, roasted plantain (Bole) and grilled fish in Port Harcourt, or chef-led culinary masterclasses, LocalBuka connects diners with verified restaurants, transparent hygiene ratings, honest customer reviews, and short-form culinary video feeds.
        </p>
        <form role='search' action='/search' method='get' aria-label='Search Restaurants, Bukas and Dishes'>
          <label htmlFor='localbuka-site-search'>Search Restaurants, Bukas, Dishes &amp; Communities</label>
          <input
            id='localbuka-site-search'
            type='search'
            name='q'
            placeholder='Search restaurants, bukas, dishes, or neighborhoods...'
            aria-label='Search restaurants, bukas, dishes, or neighborhoods'
          />
          <button type='submit'>Search</button>
        </form>
      </header>

      <h2>How LocalBuka Transforms Restaurant Discovery and Local Dining</h2>
      <p>
        Finding a clean, reliable, and authentic place to eat in a bustling city should never require guesswork. Millions of diners rely on neighborhood bukas, independent kitchens, family-owned restaurants, and contemporary bistros every single day, yet many of the best culinary spots remain hidden offline without standardized menus or verified customer feedback. LocalBuka bridges that gap by combining GPS-powered restaurant discovery with community-verified video reviews, real-time menu pricing, dietary filters, and kitchen hygiene benchmarks.
      </p>
      <p>
        Through our interactive Buka Explorer, diners can search and filter thousands of culinary establishments by city, neighborhood, regional specialty, average meal price, seating ambiance, delivery availability, and verified diner rating. Every restaurant profile highlights signature dishes, operating hours, directions, and authentic video walk-throughs filmed by real customers and culinary creators.
      </p>

      <h2>Comprehensive Regional Guide to Nigerian &amp; West African Cuisine</h2>

      <article>
        <h3>1. South-West Nigeria: Lagos, Ibadan &amp; Abeokuta Buka Classics</h3>
        <p>
          The culinary landscape of South-West Nigeria is famous for rich, aromatic stews, vibrant leafy vegetable soups, and smooth traditional swallows. In neighborhoods such as Surulere, Yaba, Ikeja, Lekki, and Victoria Island in Lagos—as well as Bodija and Ring Road in Ibadan—local bukas perfect dishes that have been passed down through generations.
        </p>
        <p>
          Signature dishes include Amala (yam flour swallow) served hot with Ewedu (jute leaf soup), Gbegiri (creamy peeled bean soup), and assorted stew simmered with locust beans (Iru). Another beloved specialty is Ofada rice served in uma leaves alongside fiery Ayamase (green pepper designer stew) or Ofada sauce slow-cooked in bleached palm oil with assorted meats and dried fish. Party Jollof rice cooked over firewood, Efo Riro prepared with fluted pumpkin leaves (Ugu) or Lagos spinach (Soko), and Asun (peppered roasted goat meat) round out the essential South-West dining experience.
        </p>
      </article>

      <article>
        <h3>2. South-South &amp; Niger Delta: Port Harcourt, Calabar, Uyo &amp; Warri</h3>
        <p>
          Rooted in coastal waterways, mangrove estuaries, and fertile rainforests, the cuisine of the South-South region celebrates fresh seafood, palm nut extracts, and nutrient-dense indigenous herbs. In Port Harcourt, street corners and sit-down lounges alike are famous for Bole and Fish—sweet or semi-ripe plantains roasted slowly over charcoal and paired with deeply spiced grilled mackerel or croaker, rich palm-oil pepper sauce, and crunchy groundnuts.
        </p>
        <p>
          In Calabar and Uyo, culinary heritage shines through Edikang Ikong (a nourishing vegetable soup made with waterleaf and fluted pumpkin leaves), Afang soup (wild okazi leaves pounded and simmered with waterleaf, periwinkle, stockfish, and crayfish), Fisherman soup brimming with fresh prawns and crabs, and Ekpang Nkukwo (grated cocoyam and wateryam wrapped in tender cocoyam leaves). Across Warri and Benin City, Banga soup extracted from fresh palm fruit and spiced with Ataiko, Irugje, and Beletete leaves is traditionally enjoyed with Starch (Usi) or pounded yam.
        </p>
      </article>

      <article>
        <h3>3. South-East Nigeria: Enugu, Owerri, Awka &amp; Aba</h3>
        <p>
          South-Eastern Nigerian cooking emphasizes seasonal freshness, aromatic forest spices such as Uziza and Ehuru (calabash nutmeg), and time-honored fermentation techniques. Visitors exploring Enugu, Owerri, or Onitsha will encounter Ofe Oha (tender oha leaves in a broth thickened with cocoyam paste), Ofe Nsala (white soup spiced with utazi and yam paste, traditionally prepared with fresh catfish), and Ofe Onugbu (bitterleaf soup washed to perfection and simmered with cocoyam and assorted meats).
        </p>
        <p>
          Beyond soups, Abacha (African salad crafted from shredded dried cassava tossed in palm oil potash emulsion with ugba, garden eggs, kpomo, and fried fish) and Okpa (steamed Bambara nut pudding wrapped in banana leaves, an iconic Enugu breakfast staple) represent the vibrant street and market food traditions documented on LocalBuka.
        </p>
      </article>

      <article>
        <h3>4. Northern Nigeria: Abuja, Kano, Kaduna &amp; Jos Culinary Traditions</h3>
        <p>
          Across Abuja and Northern Nigeria, grains, grilled meats, aromatic spice blends, and dairy delicacies take center stage. Evening food culture is synonymous with Suya—thinly sliced beef, ram, or chicken skewered and grilled over open embers after being coated in Yaji, a savory blend of roasted groundnut cake (kuli-kuli), ginger, garlic, cloves, and dried cayenne pepper. Kilishi (sun-dried, spice-crusted beef jerky) and Masa (fermented rice cakes pan-fried to a golden crust and served with Miyan Taushe pumpkin stew or yaji) are cherished across Kano, Kaduna, and Wuse.
        </p>
        <p>
          Hearty main meals include Tuwo Shinkafa (soft mashed rice pudding) and Tuwo Masara (corn flour swallow) paired with Miyan Kuka (baobab leaf soup), Miyan Karkashi, or Miyan Wake, followed by refreshing Fura da Nono (spiced millet doughballs whisked into fermented cow milk) and Zobo (hibiscus flower infusion steeped with ginger, pineapple, and cloves).
        </p>
      </article>

      <h2>Food Safety, Kitchen Hygiene &amp; Community Verification Standards</h2>
      <p>
        At LocalBuka, we believe that every diner deserves confidence in how their meal is prepared. Our community review framework encourages diners and culinary creators to evaluate restaurants across five core pillars:
      </p>
      <ul>
        <li>
          <strong>Kitchen &amp; Dining Hygiene:</strong> Cleanliness of food preparation counters, hand-washing stations, potable water access, covered food display warmers, and tidy dining tables.
        </li>
        <li>
          <strong>Ingredient Freshness &amp; Authenticity:</strong> Use of fresh seasonal vegetables, properly stored proteins, unrefined local spices, and freshly prepared daily batches.
        </li>
        <li>
          <strong>Transparent Pricing &amp; Portion Value:</strong> Clear menu boards, accurate price brackets per protein and swallow portion, and zero hidden charges.
        </li>
        <li>
          <strong>Customer Service &amp; Speed:</strong> Welcoming hospitality, accurate order fulfillment, and respectful handling of diner feedback.
        </li>
        <li>
          <strong>Accessibility &amp; Takeaway Packaging:</strong> Safe, food-grade takeaway containers, clear neighborhood landmarks, and convenient seating options.
        </li>
      </ul>

      <h2>Empowering Food Creators, Chefs &amp; Culinary Communities</h2>
      <p>
        LocalBuka is more than a restaurant finder—it is a home for culinary storytelling and creator-led communities. Through LocalBuka Communities, professional chefs, home cooks, food historians, dietitians, and restaurant reviewers can launch free public discussion hubs or specialized creator kitchens. Members share step-by-step video recipes, organize neighborhood food crawls, host live cooking Q&amp;As, and preserve indigenous African recipes for future generations.
      </p>
      <p>
        Independent restaurant owners can also list their buka or restaurant on LocalBuka at no cost, upload verified photos of their dining space and menu items, respond to customer reviews, and reach thousands of nearby food lovers actively deciding what to eat today.
      </p>

      <h2>Traditional Nigerian Cooking Techniques &amp; Indigenous Ingredients</h2>
      <article>
        <h3>Fermentation, Smoke-Roasting &amp; Stone-Grinding Heritage</h3>
        <p>
          Authentic West African flavor profiles depend on centuries-old culinary techniques that cannot be replicated with artificial shortcuts. Across Nigerian kitchens, locust beans are naturally fermented into Iru (Yoruba), Dawadawa (Hausa), or Ogiri (Igbo) to provide deep umami complexity to soups and stews. Fresh red bell peppers (Tatashe), Scotch bonnets (Atarodo), tomatoes, and red onions are fire-roasted or steamed down before being blended and fried in pure palm oil or groundnut oil to create the unmistakable base of Nigerian stew and smoky party Jollof rice.
        </p>
        <p>
          Leafy greens such as Ugu (fluted pumpkin), Efirin (scent leaf), Uziza, Utazi, Waterleaf, and Ewedu are harvested fresh from local farms and added at the final stage of simmering to preserve their vibrant color, crisp texture, and essential vitamins. Root crops and grains—including white yam, yellow yam, cassava, plantain, cocoyam, guinea corn, and millet—are pounded, stone-ground, or sun-dried into nutrient-rich flours that sustain families across the continent.
        </p>
      </article>

      <article>
        <h3>City-by-City Neighborhood Dining Highlights on LocalBuka</h3>
        <p>
          Whether you are a resident exploring a new district or a traveler visiting Nigeria for business and culture, LocalBuka organizes verified restaurant recommendations by neighborhood so you always know where to eat:
        </p>
        <ul>
          <li>
            <strong>Lagos Mainland (Ikeja, Surulere, Yaba, Maryland &amp; Festac):</strong> Famous for bustling lunchtime bukas serving hot Amala, Ofada rice in leaves, Ewa Agoyin with freshly baked Agege bread, and late-night suya spots along Allen Avenue and Bode Thomas.
          </li>
          <li>
            <strong>Lagos Island (Victoria Island, Ikoyi, Lekki &amp; Ajah):</strong> Home to contemporary Afro-fusion dining rooms, waterfront seafood grills, artisanal bakeries, and heritage kitchens offering elevated takes on traditional Nigerian classics.
          </li>
          <li>
            <strong>Abuja Federal Capital Territory (Wuse II, Maitama, Garki, Jabi &amp; Gwarinpa):</strong> Renowned for garden grills, northern Kilishi and Masa hubs, lakeside fish spots in Jabi, and pan-Nigerian restaurants catering to diplomats, families, and professionals.
          </li>
          <li>
            <strong>Port Harcourt, Enugu &amp; Ibadan:</strong> Celebrated for authentic regional specialties—from GRA Port Harcourt Bole lounges and New Haven Enugu Okpa and Ofe Oha kitchens to legendary Ibadan Amala bukas that attract food lovers from across West Africa.
          </li>
        </ul>
      </article>

      <h2>Frequently Asked Questions About LocalBuka</h2>
      <article>
        <h3>How do I find verified local bukas and restaurants near me?</h3>
        <p>
          Visit the Buka Explorer page on LocalBuka, enable location access or type your city and neighborhood (such as Lekki, Ikeja, Surulere, Wuse, or GRA Port Harcourt), and filter by dish type, rating, or budget.
        </p>
      </article>
      <article>
        <h3>Can restaurant owners and chefs list their kitchen on LocalBuka?</h3>
        <p>
          Yes. Any restaurant, neighborhood buka, bakery, or food business can submit a listing through the List Restaurant page with their address, operating hours, signature dishes, and photos for community discovery.
        </p>
      </article>
      <article>
        <h3>What are LocalBuka Culinary Communities?</h3>
        <p>
          LocalBuka Communities are interactive groups where food lovers and culinary creators connect around shared food interests—ranging from regional Nigerian soup recipes and budget meal prep to city-specific restaurant hunting.
        </p>
      </article>

      <nav aria-label='Essential Platform Links'>
        <Link href='/about'>About LocalBuka</Link>
        <Link href='/contact'>Contact Us &amp; Support</Link>
        <Link href='/blog'>Culinary Blog &amp; Articles</Link>
        <Link href='/buka'>Explore Restaurants &amp; Bukas</Link>
        <Link href='/community'>Food Communities</Link>
        <Link href='/faqs'>Frequently Asked Questions</Link>
        <Link href='/team'>Our Team</Link>
        <Link href='/privacy'>Privacy Policy &amp; Terms of Service</Link>
      </nav>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Suspense
        fallback={
          <MainLayout>
            <div className='flex flex-col items-center justify-center h-full w-full text-white/70'>
              <Loader2 className='w-8 h-8 animate-spin text-[#FFC727]' />
            </div>
          </MainLayout>
        }>
        <HomeContent />
      </Suspense>
      <LocalBukaEditorialSection />
    </>
  );
}
