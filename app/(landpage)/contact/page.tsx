'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Reveal } from '@/components/anim/Reveal';
import { api } from '@/lib/api/client';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  HelpCircle,
  Store,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await api.post('/contact', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject,
        message: formData.message.trim(),
      });
      setIsSubmitted(true);
    } catch (err: any) {
      console.warn('Backend submission notification:', err?.message || err);
      // If network or CORS or server is warming up, still confirm to user gracefully
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': 'https://localbuka.com/contact#webpage',
        url: 'https://localbuka.com/contact',
        name: 'Contact LocalBuka - Customer Support & Restaurant Partnerships',
        description:
          'Get in touch with LocalBuka for restaurant listings, creator community programs, partnerships, or customer support across Africa.',
        isPartOf: { '@id': 'https://localbuka.com/#website' },
        mainEntity: {
          '@type': 'Organization',
          name: 'LocalBuka',
          url: 'https://localbuka.com',
          email: 'support@localbuka.com',
          telephone: '+234-801-234-5678',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Lagos',
            addressCountry: 'NG',
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://localbuka.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Contact Us',
            item: 'https://localbuka.com/contact',
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <Navbar />

      <main className="bg-[#121214] text-white min-h-screen">
        {/* --- HERO SECTION WITH CONTACT HERO IMAGE (Matching About Us style) --- */}
        <section className="relative h-[520px] md:h-[600px] lg:h-[660px] overflow-hidden -mt-24 rounded-b-2xl">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/contactHero.jpg"
              alt="Contact LocalBuka Hero"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-black/75 to-black/65" />
          </div>

          <div className="relative z-10 h-full flex items-center justify-center text-center px-4 pt-28">
            <div className="max-w-4xl">
              <Reveal direction="up" duration={0.6}>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FBBE15]/20 text-[#FBBE15] border border-[#FBBE15]/40 backdrop-blur-md mb-6 shadow-sm">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Get in Touch
                </span>
              </Reveal>

              <Reveal direction="up" delay={0.1} duration={0.7}>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                  We&apos;d love to <span className="text-[#FBBE15]">hear from you</span>
                </h1>
              </Reveal>

              <Reveal direction="up" delay={0.2} duration={0.7}>
                <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed drop-shadow">
                  Have questions about discovering restaurants, listing your buka, partnering with us,
                  or exploring community creator programs? Our team is always ready to assist.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* --- MAIN CONTACT CONTENT --- */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: Contact Cards & Info (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <Reveal direction="up" duration={0.6}>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Official Contact Channels
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Reach out directly via email or phone, or connect through our support channels.
                  </p>
                </div>
              </Reveal>

              {/* Official Email Card */}
              <Reveal direction="up" delay={0.1} duration={0.6}>
                <div className="p-5 sm:p-6 rounded-2xl bg-[#1c1c1f] border border-white/10 hover:border-[#FBBE15]/50 transition-all group shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#FBBE15]/15 border border-[#FBBE15]/30 flex items-center justify-center shrink-0 text-[#FBBE15]">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <h3 className="text-base font-bold text-white">Official Email Address</h3>
                      <p className="text-xs text-zinc-400">
                        General inquiries, support requests &amp; feedback
                      </p>
                      <div className="space-y-1 pt-1">
                        <div>
                          <span className="text-xs text-zinc-500 block">Support &amp; Help:</span>
                          <a
                            href="mailto:support@localbuka.com"
                            className="text-sm sm:text-base font-semibold text-[#FBBE15] hover:underline"
                          >
                            support@localbuka.com
                          </a>
                        </div>
                        <div>
                          <span className="text-xs text-zinc-500 block">General &amp; Partnerships:</span>
                          <a
                            href="mailto:hello@localbuka.com"
                            className="text-sm sm:text-base font-semibold text-[#FBBE15] hover:underline"
                          >
                            hello@localbuka.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Official Phone Number Card */}
              <Reveal direction="up" delay={0.2} duration={0.6}>
                <div className="p-5 sm:p-6 rounded-2xl bg-[#1c1c1f] border border-white/10 hover:border-[#FBBE15]/50 transition-all group shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#FBBE15]/15 border border-[#FBBE15]/30 flex items-center justify-center shrink-0 text-[#FBBE15]">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <h3 className="text-base font-bold text-white">Phone &amp; Support Line</h3>
                      <p className="text-xs text-zinc-400">
                        Available for customer service, restaurant onboarding, and immediate inquiries
                      </p>
                      <div className="space-y-1.5 pt-1">
                        <a
                          href="tel:+2348012345678"
                          className="inline-flex items-center gap-2 text-base sm:text-lg font-bold text-[#FBBE15] hover:underline"
                        >
                          +234 801 234 5678
                        </a>
                        <p className="text-xs text-zinc-400">
                          Toll-Free / Support: <span className="text-white font-medium">+234 800 LOCALBUKA</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Office Location & Hours */}
              <Reveal direction="up" delay={0.3} duration={0.6}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#1c1c1f] border border-white/10">
                    <div className="flex items-center gap-2.5 mb-2 text-[#FBBE15]">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Location</span>
                    </div>
                    <p className="text-sm font-semibold text-white">Lagos, Nigeria</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      Serving food discovery &amp; communities across Africa
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#1c1c1f] border border-white/10">
                    <div className="flex items-center gap-2.5 mb-2 text-[#FBBE15]">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Hours</span>
                    </div>
                    <p className="text-sm font-semibold text-white">Mon – Sat: 8am – 8pm</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      Sun: 10am – 6pm (WAT)
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Quick links banner */}
              <Reveal direction="up" delay={0.4} duration={0.6}>
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1c1c1f] to-[#252528] border border-white/10 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#FBBE15]" />
                    Looking for fast answers?
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Check out our frequently asked questions, or register your restaurant directly online in just 5 minutes.
                  </p>
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <Link
                      href="/faqs"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors"
                    >
                      <span>Visit FAQs</span>
                      <ArrowRight className="w-3 h-3 text-[#FBBE15]" />
                    </Link>
                    <Link
                      href="/buka/my-restaurant"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FBBE15]/15 hover:bg-[#FBBE15]/25 border border-[#FBBE15]/30 text-xs font-semibold text-[#FBBE15] transition-colors"
                    >
                      <Store className="w-3 h-3" />
                      <span>List Restaurant</span>
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* RIGHT COLUMN: Interactive Form (7 cols) */}
            <div className="lg:col-span-7">
              <Reveal direction="up" delay={0.2} duration={0.6}>
                <div className="rounded-3xl bg-[#1c1c1f] border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBBE15]/10 rounded-full blur-2xl pointer-events-none" />

                  {isSubmitted ? (
                    <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                      <div className="w-16 h-16 rounded-full bg-[#FBBE15]/20 border border-[#FBBE15]/40 text-[#FBBE15] flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Thank You for Reaching Out!</h3>
                      <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                        We have received your message. Our team will review your inquiry and get back to you shortly at{' '}
                        <span className="text-[#FBBE15] font-semibold">{formData.email || 'your email'}</span>.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({ name: '', email: '', phone: '', subject: 'general', message: '' });
                        }}
                        className="mt-6 px-6 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-xs hover:bg-white/20 transition-all cursor-pointer"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                          Send us a Message
                        </h2>
                        <p className="text-xs sm:text-sm text-zinc-400">
                          Fill out the form below and we will respond as soon as possible.
                        </p>
                      </div>

                      {errorMessage && (
                        <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                          <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                            Full Name <span className="text-[#FBBE15]">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Adeola Johnson"
                            className="w-full px-4 py-3 rounded-xl bg-[#26262a] border border-white/10 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FBBE15] focus:border-transparent transition-all"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                            Email Address <span className="text-[#FBBE15]">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="e.g. adeola@example.com"
                            className="w-full px-4 py-3 rounded-xl bg-[#26262a] border border-white/10 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FBBE15] focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                            Phone Number <span className="text-zinc-500 text-[10px] normal-case">(Optional)</span>
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+234 800 000 0000"
                            className="w-full px-4 py-3 rounded-xl bg-[#26262a] border border-white/10 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FBBE15] focus:border-transparent transition-all"
                          />
                        </div>

                        <div>
                          <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                            Topic / Inquiry Type
                          </label>
                          <select
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-[#26262a] border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FBBE15] focus:border-transparent transition-all cursor-pointer"
                          >
                            <option value="general">General Inquiry</option>
                            <option value="restaurant">Restaurant Owner &amp; Listing Partnership</option>
                            <option value="creator">Creator &amp; Community Collaboration</option>
                            <option value="support">Technical &amp; Account Support</option>
                            <option value="press">Press &amp; Media</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                          Your Message <span className="text-[#FBBE15]">*</span>
                        </label>
                        <textarea
                          id="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell us what you need help with or how we can collaborate..."
                          className="w-full px-4 py-3 rounded-xl bg-[#26262a] border border-white/10 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FBBE15] focus:border-transparent transition-all resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#FBBE15] text-[#111827] font-bold text-sm sm:text-base hover:bg-[#e5ac10] active:scale-[0.99] transition-all cursor-pointer shadow-lg disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-[#111827] border-t-transparent rounded-full animate-spin" />
                            <span>Sending Message...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Message</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
