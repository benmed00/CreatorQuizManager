import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Supported languages
export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' }
];

const DETECTION_OPTIONS = {
  order: ['localStorage', 'navigator'],
  lookupLocalStorage: 'i18nextLng',
  caches: ['localStorage'],
};

// Initialize i18next
i18n
  // Load translations using http backend
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize configuration
  .init({
    debug: import.meta.env.DEV, // Enable debug in development
    fallbackLng: 'en',
    supportedLngs: languages.map(lang => lang.code),
    defaultNS: 'common',
    ns: ['common'],
    detection: DETECTION_OPTIONS,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    // Special handling for pluralization and formatting
    pluralSeparator: '_',
    contextSeparator: '_',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    react: {
      useSuspense: true,
    },
  });

// Function to get language direction (RTL or LTR)
export const getLanguageDirection = (lang: string): 'rtl' | 'ltr' => {
  const language = languages.find(l => l.code === lang);
  return language?.dir || 'ltr';
};

// Helper function to change language
export const changeLanguage = (lang: string): Promise<any> => {
  return i18n.changeLanguage(lang);
};

// Helper to get current language
export const getCurrentLanguage = (): string => {
  return i18n.language || 'en';
};

export default i18n;