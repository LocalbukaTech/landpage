'use client';

import React, {useRef} from 'react';
import {motion, useInView, useReducedMotion} from 'framer-motion';

export type RevealDirection =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'fade'
  | 'zoom';

type ElementTag =
  | 'div'
  | 'section'
  | 'span'
  | 'p'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'nav'
  | 'footer'
  | 'header'
  | 'main';

interface RevealProps {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements & ElementTag;
  direction?: RevealDirection;
  distance?: number; // px offset for slide
  delay?: number; // seconds
  duration?: number; // seconds
  once?: boolean;
  className?: string;
}

export function Reveal({
  children,
  as = 'div',
  direction = 'up',
  distance = 24,
  delay = 0,
  duration = 0.6,
  once = true,
  className,
}: RevealProps) {
  const components: Record<ElementTag, React.ElementType> = {
    div: motion.div,
    section: motion.section,
    span: motion.span,
    p: motion.p,
    h1: motion.h1,
    h2: motion.h2,
    h3: motion.h3,
    nav: motion.nav,
    footer: motion.footer,
    header: motion.header,
    main: motion.main,
  };
  const Component = components[as] ?? motion.div;
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const inView = useInView(ref, {once, margin: '-10% 0px -10% 0px'});

  const offsets = {
    x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
    y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
  };

  const initial = prefersReducedMotion
    ? {opacity: 1, x: 0, y: 0, scale: 1}
    : direction === 'zoom'
    ? {opacity: 0, scale: 0.95}
    : direction === 'fade'
    ? {opacity: 0}
    : {opacity: 0, ...offsets};

  const animate = prefersReducedMotion
    ? {opacity: 1, x: 0, y: 0, scale: 1}
    : direction === 'zoom'
    ? {opacity: 1, scale: 1}
    : {opacity: 1, x: 0, y: 0};

  return (
    <Component
      ref={ref}
      initial={initial}
      animate={inView ? animate : initial}
      transition={{duration: prefersReducedMotion ? 0 : duration, delay}}
      className={className}>
      {children}
    </Component>
  );
}

interface StaggerProps {
  children: React.ReactNode[] | React.ReactNode;
  gap?: number; // seconds between children
  from?: number; // base delay
  itemProps?: Partial<RevealProps>;
  as?: keyof React.JSX.IntrinsicElements & ElementTag;
  className?: string;
}

export function RevealStagger({
  children,
  gap = 0.08,
  from = 0,
  itemProps,
  as = 'div',
  className,
}: StaggerProps) {
  const items = React.Children.toArray(children);
  const WrapperTag = (as ?? 'div') as React.ElementType;
  return React.createElement(
    WrapperTag,
    {className},
    items.map((child, i) => (
      <Reveal key={i} delay={from + i * gap} {...itemProps}>
        {child}
      </Reveal>
    ))
  );
}
