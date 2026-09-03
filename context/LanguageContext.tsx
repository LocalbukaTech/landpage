'use client';

import React, { createContext, useContext, useState, useEffect, useTransition } from 'react';
import { useMe } from '@/lib/api/services/auth.hooks';

import en from '@/lib/i18n/translations/en.json';
import fr from '@/lib/i18n/translations/fr.json';
import pcm from '@/lib/i18n/translations/pcm.json';
import yo from '@/lib/i18n/translations/yo.json';
import ha from '@/lib/i18n/translations/ha.json';
import ig from '@/lib/i18n/translations/ig.json';
import es from '@/lib/i18n/translations/es.json';
import de from '@/lib/i18n/translations/de.json';
import pt from '@/lib/i18n/translations/pt.json';
import ja from '@/lib/i18n/translations/ja.json';

export type SupportedLanguage = 'en' | 'fr' | 'pcm' | 'yo' | 'ha' | 'ig' | 'es' | 'de' | 'pt' | 'ja';

const dictionaries: Record<SupportedLanguage, Record<string, string>> = {
  en,
  fr,
  pcm,
  yo,
  ha,
  ig,
  es,
  de,
  pt,
  ja,
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { data: userResponse } = useMe();
  const apiUser = userResponse?.data;
  
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [, startTransition] = useTransition();

  // Sync language with user profile from backend when available
  useEffect(() => {
    if (apiUser?.language) {
      const code = apiUser.language.toLowerCase() as SupportedLanguage;
      if (dictionaries[code]) {
        startTransition(() => {
          setLanguageState(code);
        });
      }
    }
  }, [apiUser?.language]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  const t = (key: string, fallback?: string): string => {
    const dict = dictionaries[language] || dictionaries.en;
    if (dict[key]) {
      return dict[key];
    }
    // Fallback to English if translation is missing in selected language
    if (dictionaries.en[key]) {
      return dictionaries.en[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
