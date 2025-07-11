import React, { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLanguageDirection } from '@/lib/i18n';

interface RTLWrapperProps {
  children: ReactNode;
}

/**
 * Component that wraps content and applies RTL or LTR styles based on the current language
 */
const RTLWrapper: React.FC<RTLWrapperProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [direction, setDirection] = useState<'rtl' | 'ltr'>(getLanguageDirection(i18n.language));

  // Update direction when language changes
  useEffect(() => {
    const dir = getLanguageDirection(i18n.language);
    setDirection(dir);
    
    // Update document direction
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
    
    // Update body class for RTL/LTR specific styling
    document.body.classList.remove('rtl', 'ltr');
    document.body.classList.add(dir);
    
    // Add language-specific class for font handling
    document.body.classList.remove('lang-en', 'lang-fr', 'lang-es', 'lang-zh', 'lang-ar');
    document.body.classList.add(`lang-${i18n.language}`);
    
  }, [i18n.language]);

  return (
    <div 
      dir={direction} 
      className={`rtl-wrapper ${direction === 'rtl' ? 'rtl-content' : 'ltr-content'}`}
      style={{ 
        width: '100%',
        minHeight: '100vh',
        fontFamily: direction === 'rtl' ? 
          "'Cairo', 'Tajawal', 'Noto Sans Arabic', 'Amiri', sans-serif" : 
          (i18n.language === 'zh' ? 
            "'Noto Sans SC', 'PingFang SC', sans-serif" : 
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif")
      }}
    >
      {children}
    </div>
  );
};

export default RTLWrapper;