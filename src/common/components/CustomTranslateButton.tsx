"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getCookie, hasCookie } from 'cookies-next';

// TypeScript declarations
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit?: () => void;
  }
}

interface CustomTranslateButtonProps {
  setShowLanguageModal: (show: boolean) => void;
  setLgQuery: (lg: string) => void;
  lgQuery: string;
  parentClass?: string;
  className?: string;
  textClassName?: string;
  variant?: 'business' | 'candidate' | 'home';
  showText?: boolean;
  showIcon?: boolean;
  iconOnly?: boolean;
  showMobileText?: boolean;
}

// Helper to trigger Google Translate programmatically
const triggerGoogleTranslate = (langCode: string) => {
  const maxAttempts = 20;
  let attempts = 0;
  
  const tryTranslate = () => {
    attempts++;
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('Google Translate triggered for:', langCode);
      return true;
    }
    
    if (attempts < maxAttempts) {
      setTimeout(tryTranslate, 200);
    } else {
      console.warn('Google Translate dropdown not found after', maxAttempts, 'attempts');
    }
    return false;
  };
  
  // Start trying after a short delay to let Google Translate initialize
  setTimeout(tryTranslate, 500);
};

const CustomTranslateButton: React.FC<CustomTranslateButtonProps> = ({
  setShowLanguageModal,
  setLgQuery,
  lgQuery,
  parentClass = '',
  className = '',
  textClassName = '',
  variant = 'business',
  showText = true,
  showIcon = true,
  iconOnly = false,
  showMobileText = false
}) => {
  const [currentLang, setCurrentLang] = useState<'en' | 'es'>('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const hasTriggeredTranslation = useRef(false);

  // Determine the current language from multiple sources (priority order)
  useEffect(() => {
    // Priority 1: URL parameter (lgQuery prop)
    if (lgQuery === 'es' || lgQuery === 'en') {
      setCurrentLang(lgQuery as 'en' | 'es');
      return;
    }
    
    // Priority 2: localStorage (most reliable for persistence)
    const storedLang = localStorage.getItem('tlang');
    if (storedLang === 'es' || storedLang === 'en') {
      setCurrentLang(storedLang as 'en' | 'es');
      return;
    }
    
    // Priority 3: URL search params
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lg');
    if (urlLang === 'es' || urlLang === 'en') {
      setCurrentLang(urlLang as 'en' | 'es');
      return;
    }
    
    // Priority 4: Cookie (fallback)
    if (hasCookie('googtrans')) {
      const cookieValue = getCookie('googtrans') as string;
      if (cookieValue?.includes('/es')) {
        setCurrentLang('es');
        return;
      }
    }
    
    // Default to English
    setCurrentLang('en');
  }, [lgQuery]);

  // Load Google Translate script and initialize
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Define the init function
    const googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'es,en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');
        
        console.log('Google Translate initialized');
        setScriptLoaded(true);
      }
    };
    
    // Set the global callback
    window.googleTranslateElementInit = googleTranslateElementInit;
    
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="translate.google.com"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate?.TranslateElement) {
      // Script exists and Google Translate is ready
      googleTranslateElementInit();
    }
    
    return () => {
      // Don't remove - causes issues
    };
  }, []);

  // Trigger translation when script is loaded and language is Spanish
  useEffect(() => {
    if (!scriptLoaded || hasTriggeredTranslation.current) return;
    
    const targetLang = lgQuery || localStorage.getItem('tlang');
    
    if (targetLang === 'es') {
      hasTriggeredTranslation.current = true;
      triggerGoogleTranslate('es');
    }
  }, [scriptLoaded, lgQuery]);

  // Handle translate button click
  const handleTranslateClick = useCallback(() => {
    setIsTranslating(true);
    setShowLanguageModal(true);
    setIsTranslating(false);
  }, [setShowLanguageModal]);

  // Get button styles based on variant
  const getButtonStyles = () => {
    const baseStyles = 'flex items-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    switch (variant) {
      case 'business':
        return `${baseStyles} px-3 py-2 text-[#1A1433] text-xs rounded-full hover:bg-white/50 focus:ring-[#5843BE] ${className}`;
      case 'candidate':
        return `${baseStyles} px-3 py-2 text-xs text-gray-600 hover:text-[#5843BE] rounded-full hover:bg-gray-100/50 focus:ring-[#5843BE] ${className}`;
      case 'home':
        return `${baseStyles} px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 focus:ring-white/50 ${className}`;
      default:
        return `${baseStyles} ${className}`;
    }
  };

  // Get text styles based on variant
  const getTextStyles = () => {
    const baseStyles = 'font-medium notranslate';
    
    switch (variant) {
      case 'business':
        return `${baseStyles} text-[#1A1433] text-xs ${textClassName}`;
      case 'candidate':
        return `${baseStyles} text-xs ${textClassName}`;
      case 'home':
        return `${baseStyles} text-white text-sm ${textClassName}`;
      default:
        return `${baseStyles} ${textClassName}`;
    }
  };

  // Get flag image source - show the flag of the CURRENT language
  const getFlagSrc = () => {
    return currentLang === 'en'
      ? 'https://res.cloudinary.com/drlcisipo/image/upload/v1714663084/English_1_z3fa77.png' // English flag when in English
      : 'https://res.cloudinary.com/drlcisipo/image/upload/v1713288601/Website%20images/Spanish_2_oaawih.svg'; // Spanish flag when in Spanish
  };

  // Get display text - show current language since clicking opens language selection
  const getDisplayText = () => {
    if (variant === 'home') {
      return currentLang === 'en' ? 'English' : 'Español';
    }
    return currentLang === 'en' ? 'ENG' : 'ESP';
  };

  // Get mobile text - show that clicking opens language selection
  const getMobileText = () => {
    return currentLang === 'en' 
      ? 'Select Language' 
      : 'Seleccionar Idioma';
  };

  return (
    <div className={`cursor-pointer ${parentClass}`}>
      {/* Hidden Google Translate element */}
      <div 
        id="google_translate_element" 
        style={{
          width: '0px',
          height: '0px',
          position: 'absolute',
          left: '50%',
          zIndex: -99999
        }}
      />
      <button
        type="button"
        className={getButtonStyles()}
        onClick={handleTranslateClick}
        disabled={isTranslating}
        aria-label={currentLang === 'en' ? 'Select Language' : 'Seleccionar Idioma'}
      >
        {/* Loading state */}
        {isTranslating && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
        )}
        
        {/* Flag icon */}
        {showIcon && !isTranslating && (
          <img
            src={getFlagSrc()}
            alt={currentLang === 'en' ? 'Spanish Flag' : 'English Flag'}
            className="w-5 h-5 md:w-6 md:h-6 object-contain"
            width={24}
            height={24}
            loading="lazy"
          />
        )}
        
        {/* Text content */}
        {showText && !iconOnly && (
          <>
            {/* Desktop text */}
            <span className={`${getTextStyles()} lg:inline hidden ml-2`}>
              {getDisplayText()}
            </span>
            
            {/* Mobile text */}
            {variant !== 'home' && (
              <span className={`${getTextStyles()} inline lg:hidden ml-2`}>
                {showMobileText ? getMobileText() : getDisplayText()}
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
};

export default CustomTranslateButton;