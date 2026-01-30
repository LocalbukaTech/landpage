'use client';
import {ChevronLeftCircle} from 'lucide-react';
import {useRouter} from 'next/navigation';

interface IGoBack {
  color: 'black' | 'white';
  url?: string;
}
const GoBack = ({color}: IGoBack) => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className={`inline-flex items-center gap-2 transition-colors ${
        color === 'black'
          ? 'text-black hover:text-black/80'
          : 'text-white hover:text-white/80'
      }`}>
      <ChevronLeftCircle
        className={`w-7 h-7 ${color === 'black' ? 'text-black' : 'text-white'}`}
      />
    </button>
  );
};

export default GoBack;
