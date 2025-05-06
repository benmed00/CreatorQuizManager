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
        <SelectTrigger className="w-[120px] bg-background border-2 shadow-md h-8">
          <SelectValue placeholder={t('language')}>
            <span className="flex items-center">
              <span className="mr-2 text-lg">{languages.find(l => l.code === currentLang)?.flag}</span>
              <span className="text-sm font-medium">{languages.find(l => l.code === currentLang)?.name}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-background border-2 shadow-lg">
          {languages.map((lang) => (
            <SelectItem 
              key={lang.code} 
              value={lang.code} 
              className="flex items-center hover:bg-accent transition-colors cursor-pointer"
            >
              <span className="mr-2 text-lg">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;