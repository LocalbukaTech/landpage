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

interface TypewriterProps {
  words: string[];
  typingSpeed?: number; // ms per character
  deletingSpeed?: number; // ms per character
  pauseTime?: number; // ms between word complete and delete
  loop?: boolean;
  className?: string;
}

export function Typewriter({
  words,
  typingSpeed = 34,
  deletingSpeed = 22,
  pauseTime = 1200,
  loop = true,
  className,
}: TypewriterProps) {
  const prefersReduced = usePrefersReducedMotion();
  const [index, setIndex] = React.useState(0);
  const [subIndex, setSubIndex] = React.useState(0);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    if (!words.length) return;
    if (prefersReduced) return; // degrade to static

    const currentWord = words[index % words.length];

    if (!deleting && subIndex === currentWord.length) {
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
    typingSpeed,
    deletingSpeed,
    pauseTime,
    loop,
    prefersReduced,
  ]);

  const display = prefersReduced
    ? words[0] ?? ''
    : words[index % words.length].slice(0, subIndex);

  return (
    <span className={className}>
      {display}
      <span className='ml-0.5 inline-block w-px h-[1em] bg-current align-middle animate-pulse' />
    </span>
  );
}
