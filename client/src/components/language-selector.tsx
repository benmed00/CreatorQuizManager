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
    <div className="relative">
      <Select value={currentLang} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder={t('language')}>
            <span className="flex items-center">
              <span className="mr-2">{languages.find(l => l.code === currentLang)?.flag}</span>
              <span>{languages.find(l => l.code === currentLang)?.name}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <AnimatePresence>
            {languages.map((lang) => (
              <motion.div
                key={lang.code}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
              >
                <SelectItem value={lang.code} className="flex items-center">
                  <span className="mr-2">{lang.flag}</span>
                  <span>{lang.name}</span>
                </SelectItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;