import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {allFaqs} from '@/lib/faq-data';
import SectionHeader from '../SectionHeader';
import Link from 'next/link';

export function FAQSection() {
  // Show only the first 5 FAQs on the landing page
  const displayFaqs = allFaqs.slice(0, 5);

  return (
    <section className='py-20 bg-white dark:bg-black'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <SectionHeader title='FAQs' />
        <div className='max-w-3xl mx-auto py-2'>
          <Accordion
            type='single'
            collapsible
            defaultValue='item-0'
            className='space-y-2'>
            {displayFaqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className='bg-gray-100 dark:bg-muted/20 '>
                <AccordionTrigger className='hover:no-underline px-4 text-left'>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className='text-muted-foreground px-4'>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* View All FAQs Link */}
          <div className='text-center mt-8'>
            <Link
              href='/faqs'
              className='text-primary hover:text-primary/80 font-medium transition-colors'>
              View All FAQs →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
