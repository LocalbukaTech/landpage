'use client';

import {useState, useEffect, useRef} from 'react';
import {useRouter} from 'next/navigation';
import {X, Clock, TrendingUp} from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'lb_search_history';
const TRENDING = ['Rice', 'Ofada'];
const MAX_HISTORY = 5;
const MAX_TRENDING = 5;

function readHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeHistory(items: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable — silently skip
  }
}

export function SearchOverlay({isOpen, onClose}: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load history from localStorage on mount (client-only)
  useEffect(() => {
    setRecentSearches(readHistory());
  }, []);

  // Reload history whenever the overlay opens so it stays in sync
  // if the search page also pushes to history.
  useEffect(() => {
    if (isOpen) {
      setRecentSearches(readHistory());
    }
  }, [isOpen]);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleRemoveRecent = (term: string) => {
    setRecentSearches((prev) => {
      const next = prev.filter((item) => item !== term);
      writeHistory(next);
      return next;
    });
  };

  const handleSearch = (term: string) => {
    setRecentSearches((prev) => {
      const next = [term, ...prev.filter((item) => item !== term)].slice(
        0,
        MAX_HISTORY,
      );
      writeHistory(next);
      return next;
    });
    setSearchQuery('');
    onClose();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed top-0 left-20 w-[350px] bottom-0 bg-[#1a1a1a] z-100 p-6 flex flex-col border-r border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.4)] animate-[slideInDrawer_0.3s_ease-out]'>
      <div className='w-full max-w-[500px]'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-white text-lg font-medium'>Search</h2>
          <button
            className='flex items-center justify-center w-8 h-8 bg-[#3a3a3a] rounded-md text-[#a0a0a0] transition-all duration-200 hover:bg-[#4a4a4a] hover:text-white border-none cursor-pointer'
            onClick={onClose}
            aria-label='Close search'>
            <X size={20} />
          </button>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSubmit}>
          <div className='my-10'>
            <input
              ref={inputRef}
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full p-2 4 bg-[#3a3a3a] border-none rounded-lg text-white text-base caret-[#fbbe15] placeholder:text-zinc-500 focus:outline-none'
              placeholder=''
            />
          </div>
        </form>

        {/* Recent Search */}
        {recentSearches.length > 0 && (
          <div className='mb-8'>
            <h3 className='text-white text-[15px] font-medium mb-4'>
              Recent Search
            </h3>
            <ul className='list-none p-0 m-0 flex flex-col gap-2'>
              {recentSearches.slice(0, MAX_HISTORY).map((term) => (
                <li
                  key={term}
                  className='flex items-center justify-between py-2'>
                  <button
                    className='flex items-center gap-3 bg-transparent border-none text-white text-[15px] cursor-pointer transition-colors duration-200 hover:text-[#fbbe15]'
                    onClick={() => handleSearch(term)}>
                    <Clock size={18} className='text-[#a0a0a0]' />
                    <span>{term}</span>
                  </button>
                  <button
                    className='flex items-center justify-center bg-transparent border-none text-zinc-500 cursor-pointer p-1 transition-colors duration-200 hover:text-white'
                    onClick={() => handleRemoveRecent(term)}
                    aria-label={`Remove ${term} from recent searches`}>
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Trending */}
        {TRENDING.length > 0 && (
          <div className='mb-8'>
            <h3 className='text-white text-[15px] font-medium mb-4'>
              Trending
            </h3>
            <ul className='list-none p-0 m-0 flex flex-col gap-2'>
              {TRENDING.slice(0, MAX_TRENDING).map((term) => (
                <li
                  key={term}
                  className='flex items-center justify-between py-2'>
                  <button
                    className='flex items-center gap-3 bg-transparent border-none text-white text-[15px] cursor-pointer transition-colors duration-200 hover:text-[#fbbe15]'
                    onClick={() => handleSearch(term)}>
                    <TrendingUp size={18} className='text-[#fbbe15]' />
                    <span>{term}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
