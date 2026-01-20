'use client';

import Image from 'next/image';
import {useEffect, useState} from 'react';
import {Footer} from '@/components/layout/footer';
import GoBack from '@/components/layout/GoBack';

const sections = [
  {id: 'terms-of-service', title: 'Terms of Service'},
  {
    id: 'website-app-privacy',
    title: 'Privacy Policy (Integrated for Website and App)',
  },
  {
    id: 'prohibited-content',
    title: 'Community Guidelines & Explicitly Prohibited Content',
  },
  {
    id: 'ugc-reporting',
    title: 'UGC Reporting, Moderation, and Violation System',
  },
  {
    id: 'health-disclaimer',
    title: 'Health, Fitness, and Food Safety Disclaimer',
  },
  {id: 'payment-terms', title: 'Payment, Financial, and Cryptocurrency Terms'},
  {id: 'ai-recommendations', title: 'AI Features and User Content Policy'},
  {
    id: 'data-protection',
    title: 'How we protect your personal information',
  },
];

const PrivacyPage = () => {
  const [activeSection, setActiveSection] = useState('terms-of-service');

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <main className='min-h-screen bg-white dark:bg-black scroll-smooth'>
        {/* Custom Header */}
        <header className='relative bg-primary h-32 overflow-hidden'>
          <Image
            src='/images/privacy_header_background.png'
            alt='Privacy Policy Header'
            fill
            className='object-cover opacity-60'
            priority
          />
          <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center'>
            <GoBack color='black' />
            <h1 className='text-3xl font-bold text-black ml-4'>
              Privacy Policy
            </h1>
          </div>
        </header>

        {/* Main Content with Sidebar */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='flex flex-col lg:flex-row gap-8'>
            {/* Sticky Sidebar Navigation */}
            <aside className='lg:w-80 shrink-0'>
              <div className='lg:sticky lg:top-8'>
                <div className='bg-gray-100 dark:bg-gray-900 rounded-lg p-6'>
                  <nav>
                    <ol className='space-y-3'>
                      {sections.map((section, index) => (
                        <li key={section.id}>
                          <a
                            href={`#${section.id}`}
                            className={`text-sm transition-all duration-300 block py-1 px-3 rounded ${
                              activeSection === section.id
                                ? 'text-primary font-semibold scale-105'
                                : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-800'
                            }`}>
                            {index + 1}. {section.title}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className='flex-1 max-w-none'>
              {/* Section 1: Terms of Service */}
              <section id='terms-of-service' className='mb-12 scroll-mt-8'>
                <h2 className='text-2xl font-bold mb-4 pb-3 border-b-2 border-primary text-foreground'>
                  1. Terms of Service
                </h2>
                <div className='bg-gray-100 dark:bg-gray-900 p-6 rounded-lg'>
                  <h3 className='text-lg font-semibold mt-4 mb-3 text-foreground'>
                    1.1. Acceptance of Terms
                  </h3>
                  <p className='mb-4 text-foreground/80'>
                    By downloading, accessing, or using the LocalBuka mobile
                    application, website, and related services (the
                    &ldquo;Service&rdquo;), you agree to be bound by these Terms
                    of Service (&ldquo;Terms&rdquo;), our Privacy Policy,
                    Community Guidelines, and all other policies incorporated
                    herein by reference. By using our services, you also agree
                    to any future updates or modifications to these Terms, as
                    published on our website or within the app. Continued use of
                    the Service after such updates constitutes your acceptance
                    of the revised Terms.
                  </p>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    1.2. Eligibility and Age Restrictions
                  </h3>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      <strong className='text-foreground'>Minimum Age:</strong>{' '}
                      You must be at least 13 years old to create an account and
                      use the LocalBuka service.
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        Age-Restricted Features:
                      </strong>{' '}
                      Access to certain features is further restricted:
                      <ul className='list-disc pl-6 mt-2 space-y-1'>
                        <li>
                          <strong className='text-foreground'>
                            Payment Features & Cryptocurrency:
                          </strong>{' '}
                          You must be at least 18 years old to make payments,
                          conduct transactions, or use the Crypto LocalBuka app
                          features, as these involve legally binding contracts.
                        </li>
                        <li>
                          <strong className='text-foreground'>
                            Advanced Community Features:
                          </strong>{' '}
                          Participation in certain user-generated content areas
                          may be restricted to users 18 and over to mitigate
                          exposure to mature content (e.g., discussions about
                          culinary techniques involving alcohol).
                        </li>
                      </ul>
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        Parental Guidance:
                      </strong>{' '}
                      If you are under 18, you represent that you have your
                      parent or guardian&apos;s permission to use the Service
                      and that they have read and agreed to these Terms on your
                      behalf. Parents/guardians are responsible for supervising
                      their minor&apos;s use of the app.
                    </li>
                  </ul>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    1.3. Account Registration and Verification
                  </h3>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      <strong className='text-foreground'>
                        Account Creation:
                      </strong>{' '}
                      You can register using your email address or through
                      third-party sign-in services like Google (Email
                      verification with Google Sign In).
                    </li>
                    <li>
                      <strong className='text-foreground'>Verification:</strong>{' '}
                      To enhance security and trust, we may require verification
                      of your account using an OTP sent via SMS or email.
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        Account Accuracy:
                      </strong>{' '}
                      You agree to provide accurate and complete information
                      during registration and to keep your Profile information
                      updated.
                    </li>
                  </ul>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    1.4. License to User-Generated Content
                  </h3>
                  <p className='mb-4 text-foreground/80'>
                    You retain ownership of the content you create and share on
                    LocalBuka (e.g., reviews, photos, videos, posts, recipes,
                    fitness logs). By posting content, you grant LocalBuka a
                    worldwide, non-exclusive, royalty-free, sublicensable
                    license to use, reproduce, and display that content in
                    connection with the Service. This license ends when you
                    delete the content, except where it has been shared with
                    others (e.g., in a Community).
                  </p>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    1.5. Prohibited Activities
                  </h3>
                  <p className='mb-3 text-foreground/80'>You agree not to:</p>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>Use the Service for any illegal purpose.</li>
                    <li>
                      Post content that is harmful, fraudulent, defamatory, or
                      infringes on intellectual property.
                    </li>
                    <li>Harass, bully, or intimidate other users.</li>
                    <li>
                      Use the Service to spread misinformation, especially
                      regarding health (allergens, calorie data), food safety,
                      or financial advice.
                    </li>
                    <li>
                      Manipulate the review and rating system with fake or
                      incentivized reviews.
                    </li>
                    <li>
                      Interfere with the Service&apos;s security or use
                      automated systems (&ldquo;bots&rdquo;) to scrape data or
                      create accounts.
                    </li>
                    <li>
                      Attempt to exploit the gamification system (Daily Streaks,
                      Badges, Rewards) through fraudulent means.
                    </li>
                    <li>
                      Post any content that violates our explicit prohibitions
                      outlined in Section 3.
                    </li>
                  </ul>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    1.6. Termination
                  </h3>
                  <p className='mb-4 text-foreground/80'>
                    We may suspend or terminate your account for violations of
                    these Terms, in accordance with our moderation process
                    outlined in Section 4. You may delete your account at any
                    time via the app settings.
                  </p>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    1.7. Disclaimer of Warranties
                  </h3>
                  <p className='mb-4 text-foreground/80'>
                    THE SERVICE, INCLUDING ALL AI FEATURES (BUKA GENIE, AI FOOD
                    TRACKER, RECIPE CHECKER), IS PROVIDED &ldquo;AS IS&rdquo;
                    AND &ldquo;AS AVAILABLE.&rdquo; LOCALBUKA DISCLAIMS ALL
                    WARRANTIES, INCLUDING THE ACCURACY OF USER-GENERATED
                    CONTENT, NUTRITIONAL DATA FROM THE CALORIE TRACKER, OR
                    RECOMMENDATIONS FROM THE MEAL PLANNER.
                  </p>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    1.8. Limitation of Liability
                  </h3>
                  <p className='mb-3 text-foreground/80'>
                    LOCALBUKA SHALL NOT BE LIABLE FOR ANY DAMAGES ARISING FROM
                    YOUR USE OF THE SERVICE, INCLUDING BUT NOT LIMITED TO:
                  </p>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      RELIANCE ON RESTAURANT LISTINGS, USER REVIEWS, OR
                      AI-GENERATED ADVICE.
                    </li>
                    <li>
                      ADVERSE HEALTH EFFECTS FROM FOLLOWING DIETARY OR FITNESS
                      SUGGESTIONS.
                    </li>
                    <li>
                      FINANCIAL LOSS FROM USING THE PAYMENT FEATURE OR CRYPTO
                      LOCAL BUKA APP.
                    </li>
                    <li>
                      DISRUPTIONS TO YOUR DAILY STREAK OR REWARDS SYSTEM DUE TO
                      SERVICE DOWNTIME.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 2: Privacy Policy */}
              <section id='website-app-privacy' className='mb-12 scroll-mt-8'>
                <h2 className='text-2xl font-bold mb-4 pb-3 border-b-2 border-primary text-foreground'>
                  2. Privacy Policy (Integrated for Website and App)
                </h2>
                <div className='bg-gray-100 dark:bg-gray-900 p-6 rounded-lg'>
                  <p className='mb-4 text-foreground/80'>
                    This policy applies to information collected through the
                    LocalBuka website and mobile application.
                  </p>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    2.1. Information We Collect
                  </h3>
                  <p className='mb-3 text-foreground/80'>
                    <strong className='text-foreground'>
                      a. Information You Provide:
                    </strong>
                  </p>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      <strong className='text-foreground'>Profile Data:</strong>{' '}
                      Name, email, profile picture, bio, dietary preferences,
                      favorite dishes.
                    </li>
                    <li>
                      <strong className='text-foreground'>User Content:</strong>{' '}
                      Reviews, ratings, posts, media uploads, recipes, fitness
                      journey logs, poll responses.
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        Financial Data:
                      </strong>{' '}
                      Payment information (processed by secure third-party
                      gateways), cryptocurrency wallet addresses (if
                      applicable).
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        Verification Data:
                      </strong>{' '}
                      Email address, phone number for OTP verification.
                    </li>
                  </ul>

                  <p className='mb-3 text-foreground/80 mt-6'>
                    <strong className='text-foreground'>
                      b. Information Collected Automatically:
                    </strong>
                  </p>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      <strong className='text-foreground'>Usage Data:</strong>{' '}
                      Features used (Restaurant Search, Meal Planner, Visual
                      Search), time spent, post insights, pages viewed.
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        Device Information:
                      </strong>{' '}
                      IP address, device type, OS, app crashes.
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        Precise Location Data:
                      </strong>{' '}
                      Via GPS (with your permission) to power the Location
                      Tracker for finding nearby restaurants, food festivals,
                      and live music events. You can control this in device
                      settings.
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        Cookies and Similar Technologies:
                      </strong>{' '}
                      To personalize your Feed Page, remember your saved
                      restaurants, and manage your login session on the website.
                    </li>
                  </ul>

                  <p className='mb-3 text-foreground/80 mt-6'>
                    <strong className='text-foreground'>
                      c. Information from Third Parties:
                    </strong>
                  </p>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      <strong className='text-foreground'>
                        Social Logins:
                      </strong>{' '}
                      If you use &ldquo;Sign in with Google,&rdquo; we receive
                      the information you consent to share.
                    </li>
                    <li>
                      <strong className='text-foreground'>Vendors:</strong>{' '}
                      Restaurants may provide data for their listings.
                    </li>
                  </ul>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    2.2. How We Use Your Information
                  </h3>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      <strong className='text-foreground'>
                        To Provide and Personalize the Service:
                      </strong>{' '}
                      To operate the Restaurant Search, Meal Planner, show
                      relevant Communities, and display your Feed Page.
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        For AI Features:
                      </strong>{' '}
                      To train and operate Buka Genie, the AI Food Tracker, and
                      the Recipe Checker.
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        For Gamification:
                      </strong>{' '}
                      To track your Daily Streak, award Badges and Achievements,
                      and manage the user rewards system.
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        For Communication:
                      </strong>{' '}
                      To send you transactional messages (account verification),
                      push notifications about new features, event trackers, and
                      (if opted-in) marketing newsletters.
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        For Analytics:
                      </strong>{' '}
                      To analyze trends, improve the app (Help Desk and
                      Feedback), and understand user engagement.
                    </li>
                  </ul>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    2.3. How We Share Your Information
                  </h3>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      <strong className='text-foreground'>Publicly:</strong>{' '}
                      Your username, profile, reviews, and public posts are
                      visible to others.
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        Within Communities:
                      </strong>{' '}
                      Content you post in Communities (e.g., based on dish
                      choice) is visible to members of that community.
                    </li>
                    <li>
                      <strong className='text-foreground'>With Vendors:</strong>{' '}
                      When you make a reservation or order, necessary
                      information is shared with the restaurant.
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        With Service Providers:
                      </strong>{' '}
                      We use partners for cloud hosting (AWS, Google Cloud),
                      analytics, push notifications, and payment processing.
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        For Legal Compliance:
                      </strong>{' '}
                      As required by law.
                    </li>
                  </ul>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    2.4. Your Rights and Choices
                  </h3>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      <strong className='text-foreground'>
                        Access and Correction:
                      </strong>{' '}
                      Update your information in your Profile.
                    </li>
                    <li>
                      <strong className='text-foreground'>Deletion:</strong>{' '}
                      Delete your account in settings.
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        Location Controls:
                      </strong>{' '}
                      Manage via your device settings.
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        Push Notifications and Newsletters:
                      </strong>{' '}
                      Manage preferences in the app settings or unsubscribe via
                      email links.
                    </li>
                    <li>
                      <strong className='text-foreground'>Ad Tracking:</strong>{' '}
                      You can opt-out of personalized advertising through your
                      device settings.
                    </li>
                  </ul>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    2.5. Data Security
                  </h3>
                  <p className='mb-4 text-foreground/80'>
                    We implement robust security measures. However, no system is
                    100% secure. We securely transmit and encrypt sensitive
                    data. &ldquo;We do not sell or share personal data with
                    third parties for marketing without user consent.&rdquo;
                  </p>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    2.6. International Data Transfers
                  </h3>
                  <p className='mb-4 text-foreground/80'>
                    Your data may be processed outside your country of
                    residence. We ensure appropriate safeguards are in place.
                  </p>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    2.7. Children&apos;s Privacy
                  </h3>
                  <p className='mb-4 text-foreground/80'>
                    LocalBuka is not directed at children under 18. We do not
                    knowingly collect their data. If we become aware that a
                    child under 18 has provided us with personal information, we
                    will take steps to delete such information.
                  </p>
                </div>
              </section>

              {/* Section 3: Community Guidelines */}
              <section id='prohibited-content' className='mb-12 scroll-mt-8'>
                <h2 className='text-2xl font-bold mb-4 pb-3 border-b-2 border-primary text-foreground'>
                  3. Community Guidelines & Explicitly Prohibited Content
                </h2>
                <div className='bg-gray-100 dark:bg-gray-900 p-6 rounded-lg'>
                  <h3 className='text-lg font-semibold mt-4 mb-3 text-foreground'>
                    3.1. Be Respectful and Constructive
                  </h3>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      Engage positively in Communities and comment sections.
                      Community Polls should be used for constructive
                      engagement, not harassment.
                    </li>
                    <li>Do not post hate speech, harassment, or spam.</li>
                    <li>Respect differing opinions.</li>
                  </ul>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    3.2. Ensure Authenticity
                  </h3>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      Post genuine reviews and ratings based on real
                      experiences.
                    </li>
                    <li>
                      Do not misrepresent food originality or post fake recipes.
                    </li>
                    <li>Be transparent in your Fitness Journey Tracker.</li>
                  </ul>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    3.3. Explicitly Prohibited Content
                  </h3>
                  <p className='mb-3 text-foreground/80'>
                    To maintain a safe and appropriate platform for our diverse
                    user base, the following content is strictly forbidden and
                    will result in immediate content removal and account
                    sanctions:
                  </p>

                  <p className='mb-2 font-semibold text-foreground'>
                    Nudity and Sexually Explicit Content:
                  </p>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      Absolutely no nudity, pornography, or sexually explicit
                      material of any kind.
                    </li>
                    <li>
                      No sexually suggestive or lewd content involving food.
                      This includes, but is not limited to:
                      <ul className='list-disc pl-6 mt-2 space-y-1'>
                        <li>
                          Content that uses food in a sexually suggestive
                          manner.
                        </li>
                        <li>
                          Imagery or language that is overtly erotic or
                          pornographic in nature.
                        </li>
                        <li>
                          &ldquo;Food fetish&rdquo; content that is sexually
                          gratifying or explicit.
                        </li>
                        <li>
                          Content that depicts, promotes, or glorifies sexual
                          violence or exploitation.
                        </li>
                      </ul>
                    </li>
                    <li>
                      Profile pictures, posts, reviews, or any other
                      user-generated content that contains sexually explicit
                      imagery or language.
                    </li>
                  </ul>

                  <p className='mb-2 font-semibold text-foreground'>
                    Harmful and Dangerous Acts:
                  </p>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      Content that promotes or depicts self-harm, suicide, or
                      eating disorders.
                    </li>
                    <li>
                      Dangerous challenges or dares that could lead to physical
                      harm.
                    </li>
                    <li>Instructions on how to commit violent acts.</li>
                  </ul>

                  <p className='mb-2 font-semibold text-foreground'>
                    Hate Speech and Harassment:
                  </p>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      Content that attacks or incites hatred against individuals
                      or groups based on race, ethnicity, religion, gender,
                      sexual orientation, disability, or other protected
                      characteristics.
                    </li>
                    <li>
                      Bullying, threats, or targeted harassment of other users.
                    </li>
                  </ul>

                  <p className='mb-2 font-semibold text-foreground'>
                    Illegal Activities:
                  </p>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      Content that promotes or facilitates illegal activities,
                      including drug abuse, violence, or fraud.
                    </li>
                  </ul>

                  <p className='mb-2 font-semibold text-foreground'>
                    Misinformation:
                  </p>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      Deliberately spreading false information about food
                      safety, health claims, or current events that could lead
                      to real-world harm.
                    </li>
                  </ul>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    3.4. Intellectual Property
                  </h3>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      Only post content you own. Do not post copyrighted recipes
                      or images.
                    </li>
                    <li>You are responsible for the media you upload.</li>
                  </ul>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    3.5. Enforcement
                  </h3>
                  <p className='mb-4 text-foreground/80'>
                    Violations may result in content removal, badge loss,
                    account suspension, or permanent ban, as outlined in our UGC
                    Reporting and Violation System (Section 4).
                  </p>
                </div>
              </section>

              {/* Section 4: UGC Reporting */}
              <section id='ugc-reporting' className='mb-12 scroll-mt-8'>
                <h2 className='text-2xl font-bold mb-4 pb-3 border-b-2 border-primary text-foreground'>
                  4. UGC Reporting, Moderation, and Violation System
                </h2>
                <div className='bg-gray-100 dark:bg-gray-900 p-6 rounded-lg'>
                  <h3 className='text-lg font-semibold mt-4 mb-3 text-foreground'>
                    4.1. Community-Driven Reporting
                  </h3>
                  <p className='mb-4 text-foreground/80'>
                    Users can also report illegal content directly via our
                    in-app &lsquo;Report&rsquo; button or via
                    support@localbuka.com for immediate review.
                  </p>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    4.2. Violation Notification (The Pop-Up)
                  </h3>
                  <p className='mb-3 text-foreground/80'>
                    If your content is removed for a violation, you will receive
                    an in-app pop-up notification that clearly states:
                  </p>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>The specific content that was removed.</li>
                    <li>
                      The exact policy violated (e.g., &ldquo;Section 3.3:
                      Nudity and Sexually Explicit Content&rdquo;).
                    </li>
                    <li>
                      The action taken (e.g., post removal, account suspension).
                    </li>
                    <li>Instructions on how to appeal the decision.</li>
                  </ul>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    4.3. Appeal Process
                  </h3>
                  <p className='mb-4 text-foreground/80'>
                    You can appeal a moderation decision by contacting
                    support@localbuka.com. Appeals will be reviewed by a
                    separate moderator, and you will be notified of the outcome.
                  </p>
                </div>
              </section>

              {/* Section 5: Health Disclaimer */}
              <section id='health-disclaimer' className='mb-12 scroll-mt-8'>
                <h2 className='text-2xl font-bold mb-4 pb-3 border-b-2 border-primary text-foreground'>
                  5. Health, Fitness, and Food Safety Disclaimer
                </h2>
                <div className='bg-gray-100 dark:bg-gray-900 p-6 rounded-lg'>
                  <h3 className='text-lg font-semibold mt-4 mb-3 text-foreground'>
                    5.1. General Disclaimer
                  </h3>
                  <p className='mb-4 text-foreground/80'>
                    LocalBuka is a discovery platform. We are not healthcare
                    providers, nutritionists, or food safety inspectors. The
                    Calorie Tracker, Meal Planner, Fitness Journey Tracker, and
                    all health-related content are for informational purposes
                    only.
                  </p>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    5.2. User Responsibility
                  </h3>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      <strong className='text-foreground'>
                        Consult a Professional:
                      </strong>{' '}
                      Consult a doctor or dietitian before making significant
                      dietary or exercise changes.
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        Verify Allergens:
                      </strong>{' '}
                      Always confirm allergen information directly with
                      restaurants. The AI Food Tracker is a guide, not a
                      guarantee.
                    </li>
                    <li>
                      <strong className='text-foreground'>Food Safety:</strong>{' '}
                      We do not guarantee the hygiene or safety of any listed
                      restaurant, food festival, or food course.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 6: Payment Terms */}
              <section id='payment-terms' className='mb-12 scroll-mt-8'>
                <h2 className='text-2xl font-bold mb-4 pb-3 border-b-2 border-primary text-foreground'>
                  6. Payment, Financial, and Cryptocurrency Terms
                </h2>
                <div className='bg-gray-100 dark:bg-gray-900 p-6 rounded-lg'>
                  <h3 className='text-lg font-semibold mt-4 mb-3 text-foreground'>
                    6.1. Payment Processing
                  </h3>
                  <p className='mb-4 text-foreground/80'>
                    All transactions via the Payment Feature are processed by
                    secure third-party gateways. We do not store your full
                    financial details.
                  </p>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    6.2. Cryptocurrency (&ldquo;Crypto LocalBuka App&rdquo;)
                  </h3>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      <strong className='text-foreground'>
                        High Risk Acknowledgement:
                      </strong>{' '}
                      Cryptocurrency transactions are highly volatile and risky.
                      You acknowledge that you are solely responsible for any
                      gains or losses.
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        No Investment Advice:
                      </strong>{' '}
                      LocalBuka does not provide financial advice. The ability
                      to transact with crypto is a utility feature, not an
                      investment platform.
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        Wallet Security:
                      </strong>{' '}
                      You are responsible for the security of your
                      cryptocurrency wallet.
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        Age Restriction:
                      </strong>{' '}
                      This feature is restricted to users over 18 years of age
                      and older.
                    </li>
                  </ul>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    6.3. Refunds
                  </h3>
                  <p className='mb-4 text-foreground/80'>
                    Refund policies are set by the individual vendors or event
                    organizers (Food Festivals, Food Courses). LocalBuka
                    facilitates but does not guarantee refunds.
                  </p>
                </div>
              </section>

              {/* Section 7: AI Features */}
              <section id='ai-recommendations' className='mb-12 scroll-mt-8'>
                <h2 className='text-2xl font-bold mb-4 pb-3 border-b-2 border-primary text-foreground'>
                  7. AI Features and User Content Policy
                </h2>
                <div className='bg-gray-100 dark:bg-gray-900 p-6 rounded-lg'>
                  <h3 className='text-lg font-semibold mt-4 mb-3 text-foreground'>
                    7.1. AI-Generated Content
                  </h3>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      <strong className='text-foreground'>
                        Buka Genie, AI Food Tracker, Recipe Checker:
                      </strong>{' '}
                      These tools use artificial intelligence and machine
                      learning. Their outputs are estimates and suggestions.
                      They are not infallible and should be verified by the
                      user.
                    </li>
                    <li>
                      <strong className='text-foreground'>
                        No Liability for AI Output:
                      </strong>{' '}
                      We are not liable for decisions made based on AI-generated
                      content.
                    </li>
                  </ul>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    7.2. User Content for AI Training
                  </h3>
                  <p className='mb-4 text-foreground/80'>
                    By using the Service, you agree that your public, anonymized
                    User Content may be used to improve and train our AI models.
                  </p>
                </div>
              </section>

              {/* Section 8: Data Protection */}
              <section id='data-protection' className='mb-12 scroll-mt-8'>
                <h2 className='text-2xl font-bold mb-4 pb-3 border-b-2 border-primary text-foreground'>
                  8. How we protect your personal information
                </h2>
                <div className='bg-gray-100 dark:bg-gray-900 p-6 rounded-lg'>
                  <h3 className='text-lg font-semibold mt-4 mb-3 text-foreground'>
                    8.1. Gamification (Daily Streak, Badges, Rewards)
                  </h3>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      The gamification system is designed to enhance user
                      experience.
                    </li>
                    <li>
                      LocalBuka reserves the right to modify, pause, or
                      terminate the rewards system at any time.
                    </li>
                    <li>
                      Any attempt to manipulate the system is a violation of
                      these Terms.
                    </li>
                  </ul>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    8.2. Communications
                  </h3>
                  <ul className='list-disc pl-6 space-y-2 mb-4 text-foreground/80'>
                    <li>
                      <strong className='text-foreground'>
                        Push Notifications:
                      </strong>{' '}
                      You can control notifications for app updates, new
                      messages, event reminders, and streak alerts in your
                      device settings.
                    </li>
                    <li>
                      <strong className='text-foreground'>Newsletters:</strong>{' '}
                      You can unsubscribe from marketing Newsletter Subscription
                      Emails at any time.
                    </li>
                    <li>
                      <strong className='text-foreground'>Referrals:</strong>{' '}
                      The referrals program will have its own specific terms,
                      which will be presented at the time of use.
                    </li>
                  </ul>

                  <h3 className='text-lg font-semibold mt-6 mb-3 text-foreground'>
                    8.3. Monetization
                  </h3>
                  <p className='mb-4 text-foreground/80'>
                    LocalBuka may be monetized through advertising, promoted
                    restaurant listings, premium features, or commissions on
                    transactions. You will always be able to distinguish organic
                    content from promotional content.
                  </p>
                </div>
              </section>

              {/* Contact Section */}
              <section className='mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800'>
                <h2 className='text-2xl font-bold mb-4 text-foreground'>
                  Contact Us
                </h2>
                <p className='mb-4 text-foreground/80'>
                  For questions about these policies, your data, or to access
                  our FAQs Section and Help Desk, contact us at:
                </p>
                <ul className='space-y-2 text-foreground/80'>
                  <li>
                    <strong className='text-foreground'>Email:</strong>{' '}
                    <a
                      href='mailto:support@localbuka.com'
                      className='text-primary hover:underline'>
                      support@localbuka.com
                    </a>
                  </li>
                  <li>
                    <strong className='text-foreground'>In-App:</strong> Help
                    Desk and Feedback section within the LocalBuka app.
                  </li>
                  <li>
                    <strong className='text-foreground'>
                      For Account Appeals:
                    </strong>{' '}
                    If your account has been suspended, please use the appeal
                    process outlined in the in-app notification or contact{' '}
                    <a
                      href='mailto:support@localbuka.com'
                      className='text-primary hover:underline'>
                      support@localbuka.com
                    </a>{' '}
                    with the subject &ldquo;Account Appeal.&rdquo;
                  </li>
                </ul>
                {/* <p className='mt-4 text-sm text-muted-foreground'>
                  <strong>Last Updated:</strong> December 10, 2025
                </p> */}
                <p className='mt-2 text-sm text-muted-foreground'>
                  We reserve the right to update these policies at any time.
                  Changes will be posted on this page with an updated revision
                  date. Continued use of our services after changes constitutes
                  acceptance of the updated policies.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPage;
