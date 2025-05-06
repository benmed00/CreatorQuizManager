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
  }, [i18n.language]);

  return (
    <div 
      dir={direction} 
      className={`rtl-wrapper ${direction === 'rtl' ? 'rtl-content' : 'ltr-content'}`}
      style={{ 
        width: '100%',
        textAlign: direction === 'rtl' ? 'right' : 'left'
      }}
    >
      {children}
    </div>
  );
};

export default RTLWrapper;