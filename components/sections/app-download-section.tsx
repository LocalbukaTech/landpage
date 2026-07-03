import Image from 'next/image';
import {Button} from '@/components/ui/button';
import PlayStore from '@/public/svg/PlayStore';
import {Images} from '@/public/images';
import AppleStore from '@/public/svg/AppleStore';
import React, {useState, useEffect} from 'react';
import {Reveal, RevealStagger} from '@/components/anim/Reveal';
import {motion, AnimatePresence} from 'framer-motion';

const storeButtons = [
  {
    icon: <AppleStore />,
    label: 'Get on App Store',
  },
  {
    icon: <PlayStore />,
    label: 'Get on Play Store',
  },
];

const StoreButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <Button
    onClick={onClick}
    className='bg-[#334C65] hover:bg-gray-900 text-white px-6 py-5 sm:px-8 sm:py-6 text-base rounded-lg flex items-center gap-2 cursor-pointer border-none'>
    {icon}
    <span>{label}</span>
  </Button>
);

type MockScreen = 'feed' | 'explore' | 'chat';

interface Reaction {
  id: number;
  x: number;
  scale: number;
  rotation: number;
  emoji: string;
}

export function AppDownloadSection() {
  const [showMessage, setShowMessage] = useState(false);
  const [activeScreen, setActiveScreen] = useState<MockScreen>('feed');
  const [reactions, setReactions] = useState<Reaction[]>([]);

  const addReaction = (e: React.MouseEvent) => {
    // Prevent reaction click on "Coming Soon" card button or footer links if clicked
    const emojis = ['❤️', '🔥', '😋', '😍', '👍'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const id = Date.now() + Math.random();

    setReactions(prev => [
      ...prev,
      {
        id,
        x: (Math.random() - 0.5) * 80,
        scale: 0.7 + Math.random() * 0.7,
        rotation: (Math.random() - 0.5) * 50,
        emoji: randomEmoji
      }
    ]);

    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 1200);
  };

  return (
    <section
      id='app'
      className='bg-secondary dark:bg-black text-secondary-foreground relative overflow-hidden rounded-t-xl py-20 transition-colors duration-300'>
      <div className='absolute w-full h-full inset-0 z-0'>
        <Image
          src={Images.pattern}
          className='object-cover rounded-t-lg opacity-40 dark:opacity-10 dark:invert'
          fill
          alt='Abstract background pattern'
        />
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='grid lg:grid-cols-12 gap-12 items-center'>
          
          {/* Left panel: Info & Tabs */}
          <div className='lg:col-span-7 flex flex-col justify-center'>
            <Reveal
              as='h2'
              direction='up'
              duration={0.7}
              className='text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white text-center lg:text-left'>
              Get the LocalBuka App
            </Reveal>
            <Reveal
              as='p'
              direction='up'
              delay={0.08}
              duration={0.6}
              className='text-gray-300 text-md sm:text-lg mb-8 max-w-2xl text-center lg:text-left mx-auto lg:mx-0'>
              Discover local bukás, chat directly with chefs, view live video feeds, and order authentic delicacies right from your phone.
            </Reveal>

            {/* Interactive Control Tabs */}
            <div className='flex flex-col gap-3 my-6 max-w-md mx-auto lg:mx-0 w-full'>
              <span className='text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1 text-center lg:text-left block'>
                Interactive App Simulator — Tap a screen below
              </span>
              
              <button
                onClick={() => setActiveScreen('feed')}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  activeScreen === 'feed'
                    ? 'bg-[#fbbe15]/10 border-[#fbbe15] text-[#fbbe15] shadow-lg shadow-yellow-500/5'
                    : 'bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10'
                }`}>
                <div className='flex items-center gap-3'>
                  <span className='text-xl'>📱</span>
                  <div>
                    <span className='font-bold text-sm block'>Exclusive Video Feed</span>
                    <span className='text-xs text-zinc-400 block mt-0.5'>Follow top food creators and share your food reels</span>
                  </div>
                </div>
                {activeScreen === 'feed' && <span className='text-xs font-bold bg-[#fbbe15] text-black px-2 py-0.5 rounded-md'>Active</span>}
              </button>

              <button
                onClick={() => setActiveScreen('explore')}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  activeScreen === 'explore'
                    ? 'bg-[#fbbe15]/10 border-[#fbbe15] text-[#fbbe15] shadow-lg shadow-yellow-500/5'
                    : 'bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10'
                }`}>
                <div className='flex items-center gap-3'>
                  <span className='text-xl'>🔍</span>
                  <div>
                    <span className='font-bold text-sm block'>Local Buka Explorer</span>
                    <span className='text-xs text-zinc-400 block mt-0.5'>Find restaurants near you and discover cuisines</span>
                  </div>
                </div>
                {activeScreen === 'explore' && <span className='text-xs font-bold bg-[#fbbe15] text-black px-2 py-0.5 rounded-md'>Active</span>}
              </button>

              <button
                onClick={() => setActiveScreen('chat')}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  activeScreen === 'chat'
                    ? 'bg-[#fbbe15]/10 border-[#fbbe15] text-[#fbbe15] shadow-lg shadow-yellow-500/5'
                    : 'bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10'
                }`}>
                <div className='flex items-center gap-3'>
                  <span className='text-xl'>💬</span>
                  <div>
                    <span className='font-bold text-sm block'>Chat with BukaGenie AI</span>
                    <span className='text-xs text-zinc-400 block mt-0.5'>Get instant recommendations from your personal AI helper</span>
                  </div>
                </div>
                {activeScreen === 'chat' && <span className='text-xs font-bold bg-[#fbbe15] text-black px-2 py-0.5 rounded-md'>Active</span>}
              </button>
            </div>

            <RevealStagger
              as='div'
              className='flex flex-wrap justify-center lg:justify-start gap-4 mt-8'
              from={0.12}
              gap={0.08}
              itemProps={{direction: 'up', duration: 0.5}}>
              {storeButtons.map((button) => (
                <StoreButton 
                  key={button.label} 
                  icon={button.icon}
                  label={button.label}
                  onClick={() => setShowMessage(true)} 
                />
              ))}
            </RevealStagger>

            {/* Under Development Notice */}
            {showMessage && (
              <div className='mt-8 p-5 bg-[#334C65]/90 backdrop-blur-md border border-white/10 text-white rounded-2xl max-w-md mx-auto lg:mx-0 text-sm animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-2 items-center text-center lg:text-left shadow-lg'>
                <p className='font-bold text-[#fbbe15]'>Mobile App Under Development</p>
                <p className='text-gray-200 text-xs max-w-xs leading-relaxed'>
                  Our iOS and Android apps are currently being cooked. Please proceed with the web login for now to explore LocalBuka!
                </p>
                <button 
                  onClick={() => setShowMessage(false)}
                  className='mt-2 px-5 py-1.5 bg-white text-secondary font-bold text-xs rounded-full hover:bg-gray-200 transition-colors border-none cursor-pointer'
                >
                  Got it
                </button>
              </div>
            )}
          </div>

          {/* Right panel: Phone simulator */}
          <div className='lg:col-span-5 flex justify-center items-center'>
            <div className='relative w-[280px] h-[570px] bg-zinc-900 border-10 border-zinc-800 rounded-[45px] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col ring-4 ring-white/5'>
              {/* iPhone Dynamic Island */}
              <div className='absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-center'>
                <div className='w-2.5 h-2.5 bg-zinc-900 rounded-full ml-auto mr-4 border border-zinc-800' />
              </div>

              {/* iPhone screen viewport */}
              <div 
                onClick={addReaction}
                className='relative flex-1 w-full bg-[#111] overflow-hidden flex flex-col text-white select-none z-10 cursor-pointer'>
                
                {/* Floating Emojis React Layer overlay */}
                <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                  <AnimatePresence>
                    {reactions.map((r) => (
                      <motion.span
                        key={r.id}
                        initial={{ y: 220, x: r.x, opacity: 1, scale: 0.1, rotate: 0 }}
                        animate={{ y: -220, opacity: 0, scale: r.scale, rotate: r.rotation }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="absolute text-4xl pointer-events-none select-none z-30">
                        {r.emoji}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Subtle Interactive Instruction Banner */}
                {reactions.length === 0 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 pointer-events-none text-center">
                    <span className="text-[10px] font-bold text-white/80 animate-pulse">Tap screen to react! ❤️</span>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  
                  {/* SCREEN 1: Video Feed */}
                  {activeScreen === 'feed' && (
                    <motion.div
                      key="feed-screen"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className='absolute inset-0 w-full h-full bg-black'>
                      <Image
                        src="/images/feed.png"
                        alt="LocalBuka App Feed"
                        fill
                        className="object-cover"
                        priority
                      />
                    </motion.div>
                  )}

                  {/* SCREEN 2: Explore */}
                  {activeScreen === 'explore' && (
                    <motion.div
                      key="explore-screen"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className='absolute inset-0 w-full h-full bg-black'>
                      <Image
                        src="/images/buka.png"
                        alt="LocalBuka App Explore"
                        fill
                        className="object-cover"
                        priority
                      />
                    </motion.div>
                  )}

                  {/* SCREEN 3: Chat */}
                  {activeScreen === 'chat' && (
                    <motion.div
                      key="chat-screen"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className='absolute inset-0 w-full h-full bg-black'>
                      <Image
                        src="/images/ChatWithBukaGenieAi.png"
                        alt="LocalBuka App BukaGenie Chat"
                        fill
                        className="object-cover"
                        priority
                      />
                      {/* Glassmorphic Coming Soon Banner */}
                      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 z-20">
                        <motion.div
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="bg-[#fbbe15] text-black font-extrabold text-xs px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                          Coming Soon
                        </motion.div>
                        <p className="text-[10px] text-white/90 text-center font-semibold mt-2.5 max-w-[80%] bg-black/60 px-3 py-1.5 rounded-xl border border-white/5 leading-normal">
                          Our AI assistant is currently being cooked!
                        </p>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Home Indicator */}
              <div className='absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-zinc-700 rounded-full z-30' />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

