import React, { useState, useEffect, useCallback } from 'react';
import { safeWindow } from '../../../utils/safe_window';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit?: () => void;
  }
}

interface TranslateButtonProps {
  setShowLanguageModal: (show: boolean) => void;
  parentClass: string;
  className: string;
  textClassName: string;
}

const TranslateButton: React.FC<TranslateButtonProps> = ({
  setShowLanguageModal,
  parentClass,
  className,
  textClassName
}) => {
  const [isSpanish, setIsSpanish] = useState(false);
  const [scriptAdded, setScriptAdded] = useState(false);
  const [count, setCount] = useState(0);
  const [changed, setChanged] = useState("en");

  const googleTranslateElementInit = useCallback(() => {
    if (typeof window !== 'undefined' && window.google?.translate) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'es,en',
          layout: window.google.translate.TranslateElement.InlineLayout.TEXT,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    }
  }, []);

  useEffect(() => {
    if (!scriptAdded && typeof window !== 'undefined') {
      const myTranslateScript = document.querySelectorAll(
        'script[src^="//translate.google.com/translate_a/element.js"]'
      );

      if (myTranslateScript.length === 0) {
        const addScript = document.createElement('script');
        addScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        addScript.async = true;
        addScript.onerror = () => {
          console.error('Failed to load Google Translate script');
        };

        window.googleTranslateElementInit = googleTranslateElementInit;
        document.body.appendChild(addScript);
        setScriptAdded(true);

        return () => {
          if (document.body.contains(addScript)) {
            document.body.removeChild(addScript);
          }
          delete window.googleTranslateElementInit;
        };
      } else {
        setScriptAdded(true);
      }
    }
  }, [scriptAdded, googleTranslateElementInit]);

  useEffect(() => {
    if (count % 2 === 0 && count !== 0) {
      location.reload();
    }
  }, [count]);

  const toggleTranslation = useCallback(() => {
    setIsSpanish(prev => !prev);
    setShowLanguageModal(true);
  }, [setShowLanguageModal]);

  const triggerHtmlEvent = useCallback((element: HTMLElement | null, eventName: string) => {
    if (!element) return;

    let event: Event;
    if (typeof Event === 'function') {
      event = new Event(eventName, { bubbles: true, cancelable: true });
    } else {
      event = document.createEvent('Event');
      event.initEvent(eventName, true, true);
    }
    element.dispatchEvent(event);
  }, []);

  const translatePage = useCallback((newLang: string) => {
    if (typeof document === 'undefined') return;

    const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (!combo) {
      if (safeWindow?.location.pathname === '/') {
        safeWindow?.location.reload();
      }
      return;
    }

    combo.value = newLang;
    triggerHtmlEvent(combo, 'change');
  }, [triggerHtmlEvent]);

  return (
    <div className={`cursor-pointer ${parentClass}`}>
      <div id="google_translate_element" className="hidden" />
      <button
        type="button"
        className={className}
        onClick={toggleTranslation}
        aria-label={isSpanish ? 'Switch to English' : 'Cambiar a Español'}
      >
        <img
          src={
            isSpanish
              ? 'https://res.cloudinary.com/drlcisipo/image/upload/v1714663084/English_1_z3fa77.png'
              : 'https://res.cloudinary.com/drlcisipo/image/upload/v1713288601/Website%20images/Spanish_2_oaawih.svg'
          }
          alt={isSpanish ? 'English Flag' : 'Spanish Flag'}
          className="w-7 h-7"
          width={28}
          height={28}
          loading="lazy"
        />
        <span className={`${textClassName} lg:inline hidden notranslate`}>
          {isSpanish ? 'ENG' : 'ESP'}
        </span>
        <span className={`${textClassName} inline lg:hidden notranslate`}>
          {isSpanish ? 'Translate to English' : 'Traducir al Español'}
        </span>
      </button>
    </div>
  );
};

export default TranslateButton;