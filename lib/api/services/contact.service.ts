import { api } from '../client';
import type { ApiResponse } from '../types';

export type ContactStatus = 'pending' | 'in_progress' | 'resolved' | 'archived';

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: ContactStatus;
  is_read: boolean;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactListData {
  total_docs: number;
  current_page: number;
  total_pages: number;
  page_size: number;
  unread_count?: number;
  counts?: {
    all: number;
    pending: number;
    in_progress: number;
    resolved: number;
    archived: number;
  };
  docs: ContactInquiry[];
}

export interface CreateContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  website?: string;
}

export interface UpdateContactPayload {
  status?: ContactStatus;
  is_read?: boolean;
  admin_notes?: string;
}

export interface CoreValueItem {
  title: string;
  description: string;
}

export interface AboutUsContent {
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaHref: string;
  heroImageUrl: string;
  storyHeading: string;
  storyParagraph1: string;
  storyParagraph2: string;
  storyImageUrl: string;
  missionSectionTitle: string;
  missionLabel: string;
  missionHeading: string;
  missionBody: string;
  visionLabel: string;
  visionHeading: string;
  visionBody: string;
  valuesSectionTitle: string;
  valuesSectionSubtitle: string;
  coreValues: CoreValueItem[];
  ctaHeading: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  ctaButtonHref: string;
}

export interface ContactInfoContent {
  heroBadge: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroImageUrl: string;
  supportEmail: string;
  generalEmail: string;
  gmailForwardTarget: string;
  primaryPhone: string;
  tollFreePhone: string;
  locationCity: string;
  locationSubtitle: string;
  weekdayHours: string;
  weekendHours: string;
}

export interface SiteSettingsData {
  aboutUs: AboutUsContent;
  contactInfo: ContactInfoContent;
  updatedAt: string | null;
}

export const DEFAULT_ABOUT_US_CONTENT: AboutUsContent = {
  heroSubtitle:
    'Join a vibrant community of food lovers exploring the best local dining experience across Africa.',
  heroCtaText: 'Get Started',
  heroCtaHref: '/feeds',
  heroImageUrl: '/images/aboutUsHero.png',
  storyHeading: 'About Localbuka',
  storyParagraph1:
    "LocalBuka is Africa's food discovery and community platform built for the people who care deeply about where they eat, what they eat, and who they eat with. We exist at the intersection of food, community, and everyday life.",
  storyParagraph2:
    "We started with a simple observation: finding a great restaurant in an African city shouldn't feel like guesswork. Recommendations from friends, honest reviews from real people, and local knowledge should be easy to find and easy to trust. LocalBuka makes that possible. Whether you're a chef, a home cook, or someone who just loves a good meal, LocalBuka is the place to discover your next favorite restaurant, connect with fellow food lovers, and become part of a community that celebrates every dish.",
  storyImageUrl: '/images/peopleInResturant.png',
  missionSectionTitle: 'Our Mission & Vision',
  missionLabel: 'Our Mission',
  missionHeading: "What We're Here to Do",
  missionBody:
    'To create a connected food community where people discover restaurants, share authentic experiences, leave honest reviews and ratings, and build healthier, more intentional everyday habits through food and social connection.',
  visionLabel: 'Our Vision',
  visionHeading: "Where We're Going",
  visionBody:
    "To become Africa's leading food discovery and community platform, where restaurants, people, experiences, and better everyday living come together.",
  valuesSectionTitle: 'Our Core Values',
  valuesSectionSubtitle:
    'Five principles that guide everything we build and every decision we make.',
  coreValues: [
    {
      title: 'Authentic Discovery',
      description:
        'We believe restaurant discovery should feel simple, genuine, and trustworthy through real reviews, experiences and recommendations from everyday people.',
    },
    {
      title: 'Exploration',
      description:
        'We encourage people to discover new restaurants, cuisines, tastes, and experiences that enrich everyday life.',
    },
    {
      title: 'Simplicity',
      description:
        'We strive to make discovering restaurants, sharing experiences, and connecting with others feel natural and intuitive.',
    },
    {
      title: 'Community & Connection',
      description:
        'We believe food brings people together and fosters meaningful human connections through shared moments and experiences.',
    },
    {
      title: 'Wellness & Better Living',
      description:
        'We believe mindful food choices and healthy habits contribute to a healthier and more fulfilling lifestyle.',
    },
  ],
  ctaHeading: 'Ready to Discover Your Next Favourite Meal?',
  ctaSubtitle:
    'Join thousands of food lovers exploring the rich culinary landscape of Africa. Share your experiences and connect with a community that cares.',
  ctaButtonText: 'Join Localbuka',
  ctaButtonHref: '/signup',
};

export const DEFAULT_CONTACT_INFO_CONTENT: ContactInfoContent = {
  heroBadge: 'Get in Touch',
  heroHeadline: "We'd love to hear from you",
  heroSubtitle:
    'Have questions about discovering restaurants, listing your buka, partnering with us, or exploring community creator programs? Our team is always ready to assist.',
  heroImageUrl: '/images/contactHero.jpg',
  supportEmail: 'support@localbuka.com',
  generalEmail: 'hello@localbuka.com',
  gmailForwardTarget: 'localbuka@gmail.com',
  primaryPhone: '+234 801 234 5678',
  tollFreePhone: '+234 800 LOCALBUKA',
  locationCity: 'Lagos, Nigeria',
  locationSubtitle: 'Serving food discovery & communities across Africa',
  weekdayHours: 'Mon – Sat: 8am – 8pm',
  weekendHours: 'Sun: 10am – 6pm (WAT)',
};

export interface BrandedReplyPayload {
  templateId?: string;
  subject?: string;
  categoryTitle?: string;
  heroEyebrow?: string;
  heroHeadline?: string;
  greeting?: string;
  replyMessage: string;
  highlightNote?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  signOff?: string;
  includeOriginalMessage?: boolean;
}

export interface SendTemplateEmailPayload extends BrandedReplyPayload {
  toEmail: string;
  recipientName?: string;
}

export const contactService = {
  create: (data: CreateContactPayload) =>
    api.post<ApiResponse<ContactInquiry | null>>('/contact', data),

  list: (params?: {
    page?: number;
    size?: number;
    status?: ContactStatus;
    q?: string;
  }) => api.get<ApiResponse<ContactListData>>('/contact', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<ContactInquiry>>(`/contact/${id}`),

  update: (id: string, data: UpdateContactPayload) =>
    api.patch<ApiResponse<ContactInquiry>>(`/contact/${id}`, data),

  reply: (id: string, data: BrandedReplyPayload) =>
    api.post<
      ApiResponse<{
        success: boolean;
        emailDelivered: boolean;
        emailReason?: string | null;
        message: string;
        data: ContactInquiry;
      }>
    >(`/contact/${id}/reply`, data),

  sendTemplateEmail: (data: SendTemplateEmailPayload) =>
    api.post<
      ApiResponse<{
        success: boolean;
        emailDelivered: boolean;
        emailReason?: string | null;
        message: string;
      }>
    >('/contact/send-template-email', data),

  ingestInboundEmail: (data: {
    name?: string;
    from: string;
    subject: string;
    message: string;
    phone?: string;
  }) => api.post<ApiResponse<ContactInquiry>>('/contact/inbound-webhook', data),

  remove: (id: string) =>
    api.delete<ApiResponse<{ success: boolean; message: string }>>(
      `/contact/${id}`
    ),

  bulkRemove: (ids: string[]) =>
    api.post<
      ApiResponse<{ success: boolean; deletedCount: number; message: string }>
    >('/contact/bulk-delete', { ids }),

  getSiteSettings: () =>
    api.get<ApiResponse<SiteSettingsData>>('/contact/site-settings'),

  updateSiteSettings: (data: {
    aboutUs?: Partial<AboutUsContent>;
    contactInfo?: Partial<ContactInfoContent>;
  }) =>
    api.patch<ApiResponse<SiteSettingsData>>('/contact/site-settings', data),
};
