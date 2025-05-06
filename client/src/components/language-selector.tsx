import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { languages, getCurrentLanguage, changeLanguage } from '@/lib/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSelector = () => {
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());

  // Handle language change
  const handleLanguageChange = (value: string) => {
    changeLanguage(value);
    setCurrentLang(value);
    
    // Save to localStorage for persistence
    localStorage.setItem('i18nextLng', value);
    
    // Update document direction for RTL languages
    const dir = languages.find(lang => lang.code === value)?.dir || 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = value;
    
    // Add a language-specific class to the html element
    document.documentElement.className = `lang-${value}`;
  };

  // Set initial direction on component mount
  useEffect(() => {
    const dir = languages.find(lang => lang.code === currentLang)?.dir || 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
    document.documentElement.className = `lang-${currentLang}`;
  }, [currentLang]);

  return (
    <div className="relative z-50">
      <Select value={currentLang} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[80px] border-0 focus:ring-0 focus:ring-offset-0 h-8 px-2 text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <SelectValue placeholder={t('language')}>
            <span className="flex items-center">
              <span className="mr-1.5 text-lg">{languages.find(l => l.code === currentLang)?.flag}</span>
              <span className="text-xs font-medium">{languages.find(l => l.code === currentLang)?.code.toUpperCase()}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg overflow-hidden min-w-[140px]">
          {languages.map((lang) => (
            <SelectItem 
              key={lang.code} 
              value={lang.code} 
              className="flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer my-0.5"
            >
              <span className="mr-2 text-lg">{lang.flag}</span>
              <span className="text-sm">{lang.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;