export interface FAQ {
  question: string;
  answer: string;
}

export interface FAQCategory {
  category: string;
  faqs: FAQ[];
}

export const faqCategories: FAQCategory[] = [
  {
    category: 'General Questions',
    faqs: [
      {
        question: 'What is LocalBuka?',
        answer:
          'LocalBuka is a platform that helps users discover nearby restaurants and bukas, plan meals, and engage with a vibrant foodie community.',
      },
      {
        question: 'How do I sign up for LocalBuka?',
        answer:
          'You can sign up using your email address or Gmail accounts on our app.',
      },
      {
        question: 'Is LocalBuka free to use?',
        answer:
          'Yes, LocalBuka is free to use to discover restaurants and engage with the community.',
      },
    ],
  },
  {
    category: 'Account and Profile',
    faqs: [
      {
        question: 'How do I reset my password?',
        answer:
          'Click on "Forgot Password" on the login page and follow the instructions to reset your password.',
      },
      {
        question: 'Can I update my profile information?',
        answer:
          'Yes, go to "My Profile" in the app or website, and you can edit your name, profile picture, and preferences.',
      },
      {
        question: 'How do I delete my LocalBuka account?',
        answer:
          'If you wish to delete your account, go to the "Profile" section, select the "3 bar icon on the top right corner of your screen," and click "Delete Account."',
      },
    ],
  },
  {
    category: 'Using the Platform',
    faqs: [
      {
        question: 'How do I search for restaurants or bukas?',
        answer:
          'Use the search bar to type the name, location, or cuisine. You can also filter by ratings, price, or distance.',
      },
      {
        question: 'Can I save my favorite restaurants?',
        answer:
          'Yes, click the "Save to Favorites" button on a restaurant\'s page to add it to your saved list.',
      },
    ],
  },
  {
    category: 'Community Features',
    faqs: [
      {
        question: 'Can I post reviews or share my dining experiences?',
        answer:
          'Yes, you can write posts about your experiences, upload photos, and tag the restaurant to share with the community.',
      },
    ],
  },
  {
    category: 'Technical Issues',
    faqs: [
      {
        question: 'Why am I not receiving my links for email verification?',
        answer:
          'Ensure that your email address is correct and check your spam folder. If the issue persists, click "Resend OTP."',
      },
      {
        question: 'The app is not loading properly. What should I do?',
        answer:
          'Try restarting the app, clearing your cache, or updating to the latest version. Contact support if the problem continues.',
      },
      {
        question: 'Can I use LocalBuka offline?',
        answer:
          'Some features, like viewing saved favorites, are accessible offline. However, features like live tracking require an internet connection.',
      },
    ],
  },
  {
    category: 'Privacy and Security',
    faqs: [
      {
        question: 'How does LocalBuka protect my personal information?',
        answer:
          'We use encryption and follow industry best practices to secure your data. Visit our Privacy Policy for more details.',
      },
      {
        question: 'Can I control what data LocalBuka collects?',
        answer:
          'Yes, you can manage your data preferences in your account\'s "Privacy Settings" section.',
      },
      {
        question: 'How do I report inappropriate content or behavior?',
        answer:
          'Use the "Report" option for the offending content or contact support directly.',
      },
    ],
  },
];

// Flattened FAQs for simpler use cases (like the landing page)
export const allFaqs: FAQ[] = faqCategories.flatMap(
  (category) => category.faqs
);
