import {TeamMember} from './types';
import type {IconType} from 'react-icons';
import {
  RiLinkedinFill,
  RiInstagramFill,
  RiTwitterXFill,
  RiTiktokFill,
} from 'react-icons/ri';

// Navigation links configuration
export const NAV_LINKS = [
  {href: '/blog', label: 'Blog'},
  {href: '/', label: 'Get the App'},
] as const;

// Feature cards data
export const FEATURES = [
  {
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop',
    title: 'Find Restaurants Near You',
  },
  {
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&auto=format&fit=crop',
    title: 'Share Your Food Reels',
  },
  {
    image:
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&auto=format&fit=crop',
    title: 'Chat with Buka Genie AI',
  },
  {
    image:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&auto=format&fit=crop',
    title: 'Follow Top Food Creators',
  },
] as const;

// Team members data
export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Obinna Nwachukwu',
    role: 'CEO',
    department: 'Operations',
    link: 'https://www.linkedin.com',
    image: '/images/1.png',
    details:
      'Obinna leads LocalBuka with a vision to revolutionize how people discover and experience local food culture.',
  },
  {
    name: 'Aisha Mohammed',
    role: 'CTO',
    department: 'Operations',
    link: 'https://www.linkedin.com',
    image: '/images/2.png',
    details:
      'Aisha oversees all technology and engineering efforts, ensuring LocalBuka delivers cutting-edge solutions.',
  },
  {
    name: 'Tunde Olaniyan',
    role: 'Senior Full-Stack Dev',
    department: 'Engineering',
    link: 'https://www.linkedin.com',
    image: '/images/3.png',
    details:
      'Tunde builds robust and scalable features across the entire LocalBuka platform.',
  },
  {
    name: 'Zainab Aliyu',
    role: 'Data Scientist',
    department: 'Engineering',
    link: 'https://www.linkedin.com',
    image: '/images/4.png',
    details:
      'Zainab analyzes user behavior and leverages data to personalize the LocalBuka experience.',
  },
  {
    name: 'Chinedu Okoro',
    role: 'Product Designer',
    department: 'Product',
    link: 'https://www.linkedin.com',
    image: '/images/5.png',
    details:
      'Chinedu designs beautiful, intuitive interfaces that delight LocalBuka users.',
  },
  {
    name: 'Kelechi Amadi',
    role: 'Product Manager',
    department: 'Product',
    link: 'https://www.linkedin.com',
    image: '/images/6.png',
    details:
      'Kelechi guides product strategy and ensures we build features that users love.',
  },
  {
    name: 'Fatima Balarabe',
    role: 'HR Specialist',
    department: 'Human Resource',
    link: 'https://www.linkedin.com',
    image: '/images/7.png',
    details:
      'Fatima nurtures our team culture and ensures LocalBuka attracts and retains top talent.',
  },
  {
    name: 'Kunle Adebayo',
    role: 'Financial Analyst',
    department: 'Brand & Finance',
    link: 'https://www.linkedin.com',
    image: '/images/8.png',
    details:
      'Kunle manages financial planning and ensures sustainable growth for LocalBuka.',
  },
  {
    name: 'Yinka Babatunde',
    role: 'Brand & Communications',
    department: 'Brand & Finance',
    link: 'https://www.linkedin.com',
    image: '/images/9.png',
    details:
      'Yinka crafts the LocalBuka brand story and connects with our growing community.',
  },
  {
    name: 'Ngozi Eze',
    role: 'Content Marketer',
    department: 'Brand & Finance',
    link: 'https://www.linkedin.com',
    image: '/images/10.png',
    details:
      'Ngozi creates compelling content that showcases the best of local food culture.',
  },
] as const;

// Testimonials data
export const TESTIMONIALS = [
  {
    text: 'The good thing is, the app actually located most of the restaurant around this my axis. Love it💃💃💃',
    author: 'Orji, Happiness',
    avatar:
      'https://play-lh.googleusercontent.com/a-/ALV-UjXEVnrqP93YOm4SeQw3i2BqvDJWsC2vmX0S2qYAP-Pvcp_hRnXC=s64-rw',
  },
  {
    text: `Great app. Very useful for when you visit new locations don't trust where to eat. The user interface is excellent and the reviews are great . Kudus to the team`,
    author: 'Ifejika, Amaka',
    avatar:
      'https://play-lh.googleusercontent.com/a-/ALV-UjUOs8lPACWGpPTcfLoXrSWCBmL9oRjPx3tT2avNayrv3WOPyvuD=s64-rw',
  },
  {
    text: 'I had a seamless experience navigating through, and I was able to get lists of good Nigerian restaurants here in the UK. The app is a must have',
    author: 'Promise Benson, United Kingdom',
    avatar:
      'https://play-lh.googleusercontent.com/a/ACg8ocKAicBiy9ASVRp6VEATqKoW3akuohapdawbYa-l-hb5l6587w=s64-rw-mo',
  },
  {
    text: 'Best app to check for food in your area',
    author: 'Kingsley, Dadzi',
    avatar:
      'https://play-lh.googleusercontent.com/a/ACg8ocI-vPgZYeBLPnb-JqNnAgRCf8zPuni2vt0rRpaWXq9c_l3iZA=s64-rw-mo',
  },
] as const;

// FAQ data
export const FAQS = [
  {
    question: 'What is LocalBuka?',
    answer:
      'LocalBuka is a platform that helps users discover nearby restaurants and bukas, plan meals, and engage with a vibrant foodie community.',
  },
  {
    question: 'How do I sign up for LocalBuka?',
    answer:
      'You can sign up using your email address or gmail accounts on our app',
  },
  {
    question: 'Is LocalBuka free to use?',
    answer:
      'Yes, LocalBuka is free to use to discover restaurants and engage with the community Account and Profile',
  },
  {
    question: 'How does LocalBuka protect my personal Information?',
    answer:
      'We use encryption and follow industry best practices to secure your data. Visit our Privacy Policy for more details.',
  },
  {
    question: 'Can I control what data LocalBuka collects?',
    answer: `Yes, you can manage your data preferences in your account's “Privacy Settings” section.`,
  },
] as const;

// Footer links
export const FOOTER_LINKS = {
  how: [{href: '#app', label: 'Get the App'}],
  company: [{href: '#', label: 'About'}],
} as const;

// Social media links
type SocialLink = {href: string; label: string; Icon: IconType};

export const SOCIAL_LINKS: ReadonlyArray<SocialLink> = [
  {
    href: 'https://www.linkedin.com/company/localbuka/',
    label: 'LinkedIn',
    Icon: RiLinkedinFill,
  },
  {
    href: 'https://www.instagram.com/localbuka_app/',
    label: 'Instagram',
    Icon: RiInstagramFill,
  },
  {
    href: 'https://www.tiktok.com/@localbuka_app',
    label: 'Tiktok',
    Icon: RiTiktokFill,
  },
  {href: 'https://x.com/LocalBuka/', label: 'Twitter/X', Icon: RiTwitterXFill},
];
