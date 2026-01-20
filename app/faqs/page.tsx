'use client';

import {useState} from 'react';
import {Footer} from '@/components/layout/footer';
import {Navbar} from '@/components/layout/navbar';
import SectionHeader from '@/components/SectionHeader';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {faqCategories} from '@/lib/faq-data';

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <>
      <main className='bg-white dark:bg-black min-h-screen'>
        <Navbar />
        <div className='pt-24 pb-16 px-4 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='text-center mb-12'>
            <div className='flex flex-row justify-center w-full'>
              <SectionHeader title='Frequently Asked Questions' />
            </div>
            <p className='text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto'>
              Find answers to common questions about LocalBuka. Can&apos;t find
              what you&apos;re looking for? Feel free to contact our support
              team.
            </p>
          </div>

          {/* Category Tabs */}
          <div className='max-w-4xl mx-auto mb-8'>
            <div className='flex flex-wrap justify-center gap-2'>
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === null
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}>
                All
              </button>
              {faqCategories.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => setActiveCategory(cat.category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat.category
                      ? 'bg-primary text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}>
                  {cat.category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordions */}
          <div className='max-w-3xl mx-auto'>
            {faqCategories
              .filter(
                (cat) =>
                  activeCategory === null || cat.category === activeCategory
              )
              .map((category) => (
                <div key={category.category} className='mb-8'>
                  {/* Category Title - show only when viewing all */}
                  {activeCategory === null && (
                    <h2 className='text-xl font-bold text-[#0A1F44] dark:text-white mb-4'>
                      {category.category}
                    </h2>
                  )}

                  <Accordion type='single' collapsible className='space-y-2'>
                    {category.faqs.map((faq, idx) => (
                      <AccordionItem
                        key={`${category.category}-${idx}`}
                        value={`${category.category}-${idx}`}
                        className='bg-gray-100 dark:bg-muted/20 '>
                        <AccordionTrigger className='hover:no-underline px-4 text-left'>
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className='text-gray-600 dark:text-gray-400 px-4 pb-4'>
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
          </div>

          {/* Contact CTA */}
          <div className='max-w-3xl mx-auto mt-12 text-center'>
            <div className='bg-white dark:bg-gray-900 rounded-2xl p-8'>
              <h3 className='text-xl font-bold text-[#0A1F44] dark:text-white mb-2'>
                Still have questions?
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-6'>
                We&apos;re here to help. Reach out to our support team for
                personalized assistance.
              </p>
              <a
                href='mailto:support@localbuka.com'
                className='inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors'>
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FAQPage;
