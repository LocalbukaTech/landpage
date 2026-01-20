'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import {ChevronDownIcon} from 'lucide-react';

import {cn} from '@/lib/utils';

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot='accordion' {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot='accordion-item'
      className={cn(
        // Card look like design
        'relative overflow-hidden rounded-xl bg-gray-100',
        // Left accent border spans full item height, switches on open
        'border-l-2 border-gray-300 data-[state=open]:border-primary',
        // Spacing between items
        '',
        className
      )}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className='flex'>
      <AccordionPrimitive.Trigger
        data-slot='accordion-trigger'
        className={cn(
          // Layout and spacing
          'flex flex-1 items-center gap-3 py-6 px-6 min-h-[84px] text-left text-sm font-medium transition-all outline-none',
          // Left border states: gray when closed, primary when open
          '',
          // Icon rotation on open
          '[&[data-state=open]>svg]:rotate-180',
          // Focus-visible
          'focus-visible:ring-primary/40 focus-visible:ring-[3px]',
          // Disabled
          'disabled:pointer-events-none disabled:opacity-50',
          className
        )}
        {...props}>
        <ChevronDownIcon className='text-zinc-500 pointer-events-none size-4 shrink-0 transition-transform duration-200 data-[state=open]:text-primary' />
        <span className='flex-1'>{children}</span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot='accordion-content'
      className='data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm'
      {...props}>
      <div
        className={cn(
          // Padding
          'pt-0 pb-4 px-6',
          // Active background set to primary
          'data-[state=open]:bg-primary text-primary-foreground',
          className
        )}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export {Accordion, AccordionItem, AccordionTrigger, AccordionContent};
