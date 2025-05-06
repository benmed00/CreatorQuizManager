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
        <SelectTrigger className="w-[95px] border-0 focus:ring-0 focus:ring-offset-0 rounded-full h-8 px-2.5 text-gray-600 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors">
          <SelectValue placeholder={t('language')}>
            <span className="flex items-center">
              <span className="mr-2 text-base">{languages.find(l => l.code === currentLang)?.flag}</span>
              <span className="text-xs font-normal">{languages.find(l => l.code === currentLang)?.name}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 shadow-lg rounded-lg overflow-hidden min-w-[120px]">
          {languages.map((lang) => (
            <SelectItem 
              key={lang.code} 
              value={lang.code} 
              className="flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer rounded-md my-0.5"
            >
              <span className="mr-2 text-base">{lang.flag}</span>
              <span className="text-xs font-normal">{lang.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;