'use client';

import React from 'react';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setReduced(m.matches);
    handler();
    m.addEventListener?.('change', handler);
    return () => m.removeEventListener?.('change', handler);
  }, []);
  return reduced;
}

const getGraphemes = (text: string): string[] => {
  if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
    const segmenter = new (Intl as any).Segmenter('en', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), (s: any) => s.segment);
  }
  return Array.from(text);
};

interface TypewriterProps {
  words: string[];
  typingSpeed?: number; // ms per character
  deletingSpeed?: number; // ms per character
  pauseTime?: number; // ms between word complete and delete
  loop?: boolean;
  className?: string;
  cursorClassName?: string;
}

export function Typewriter({
  words,
  typingSpeed = 50,
  deletingSpeed = 30,
  pauseTime = 1800,
  loop = true,
  className,
  cursorClassName,
}: TypewriterProps) {
  const prefersReduced = usePrefersReducedMotion();
  const [index, setIndex] = React.useState(0);
  const [subIndex, setSubIndex] = React.useState(0);
  const [deleting, setDeleting] = React.useState(false);

  const graphemesList = React.useMemo(() => {
    return words.map((w) => getGraphemes(w));
  }, [words]);

  React.useEffect(() => {
    if (!words.length) return;
    if (prefersReduced) return; // degrade to static

    const currentGraphemes = graphemesList[index % words.length] || [];
    const currentLength = currentGraphemes.length;

    if (!deleting && subIndex === currentLength) {
      const t = setTimeout(() => setDeleting(true), pauseTime);
      return () => clearTimeout(t);
    }

    if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex((v) =>
        loop ? (v + 1) % words.length : Math.min(v + 1, words.length - 1)
      );
      return;
    }

    const timeout = setTimeout(
      () => {
        setSubIndex((v) => v + (deleting ? -1 : 1));
      },
      deleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [
    subIndex,
    index,
    deleting,
    words,
    graphemesList,
    typingSpeed,
    deletingSpeed,
    pauseTime,
    loop,
    prefersReduced,
  ]);

  const currentGraphemes = graphemesList[index % words.length] || [];
  const display = prefersReduced
    ? words[0] ?? ''
    : currentGraphemes.slice(0, subIndex).join('');

  return (
    <span className={className}>
      {display}
      <span
        className={`inline-block h-[0.9em] ml-1 align-baseline rounded-sm animate-pulse ${
          cursorClassName || 'w-0.5 bg-current'
        }`}
        aria-hidden='true'
      />
    </span>
  );
}

