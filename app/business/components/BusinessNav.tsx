'use client';

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Globe, Moon, Sun, Menu, X } from 'lucide-react';
import { appendLangToUrl } from '../utils/appendLangToUrl';
import Image from 'next/image';

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

type BusinessNavProps = {
  scrolled: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onToggleTheme: () => void;
  theme: 'dark' | 'light';
  items: NavItem[];
  logo?: ReactNode;
  logoHref?: string;
  ctaLabel?: string;
  ctaHref?: string;
  signinLabel?: string;
  signinHref?: string;
  onLanguageChange?: (lang: 'en' | 'es') => void;
  currentLang?: 'en' | 'es';
  setShowLanguageModal?: (show: boolean) => void;
};

export function BusinessNav({
  scrolled,
  menuOpen,
  onToggleMenu,
  onToggleTheme,
  theme,
  items,
  logo,
  logoHref = '/business',
  ctaLabel = 'Get Started',
  ctaHref = 'https://business.moilapp.com/register',
  signinLabel = 'Log In',
  signinHref = 'https://business.moilapp.com',
  onLanguageChange,
  currentLang,
  setShowLanguageModal,
}: BusinessNavProps) {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  // Initialize from currentLang prop, URL, or localStorage
  useEffect(() => {
    if (currentLang) {
      setLang(currentLang);
    } else if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const lgParam = url.searchParams.get('lg') as 'en' | 'es' | null;
      const storedLang = localStorage.getItem('tlang') as 'en' | 'es' | null;
      
      if (lgParam && (lgParam === 'en' || lgParam === 'es')) {
        setLang(lgParam);
      } else if (storedLang && (storedLang === 'en' || storedLang === 'es')) {
        setLang(storedLang);
      }
    }
  }, [currentLang]);

  // Listen for language change events from other components
  useEffect(() => {
    const handleLanguageChangeEvent = (e: CustomEvent<{ lang: 'en' | 'es' }>) => {
      setLang(e.detail.lang);
    };
    
    window.addEventListener('languageChange', handleLanguageChangeEvent as EventListener);
    return () => window.removeEventListener('languageChange', handleLanguageChangeEvent as EventListener);
  }, []);

  const handleLanguageSelect = (selectedLang: 'en' | 'es') => {
    setLang(selectedLang);
    setShowLangDropdown(false);
    if (onLanguageChange) {
      onLanguageChange(selectedLang);
    }
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('tlang', selectedLang);
      // Update URL with language parameter and reload to apply Google Translate
      const url = new URL(window.location.href);
      url.searchParams.set('lg', selectedLang);
      // Set Google Translate cookie
      document.cookie = `googtrans=${selectedLang === 'en' ? '/auto/en' : '/auto/es'}; path=/`;
      // Dispatch event for other components to sync
      window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang: selectedLang } }));
      // Reload page to apply translation
      window.location.href = url.toString();
    }
  };

  const getFlagSrc = () => {
    return lang === 'en'
      ? 'https://res.cloudinary.com/drlcisipo/image/upload/v1714663084/English_1_z3fa77.png'
      : 'https://res.cloudinary.com/drlcisipo/image/upload/v1713288601/Website%20images/Spanish_2_oaawih.svg';
  };

  return (
    <nav id="nav" className={scrolled ? 'scrolled' : ''}>
      <a href={logoHref} className="nav-logo">
        {logo ?? (
          <img 
            src="https://res.cloudinary.com/drlcisipo/image/upload/v1705704261/Website%20images/logo_gox0fw.png" 
            alt="Moil Logo" 
            className="nav-logo-img"
            style={{ 
              height: '32px', 
              width: 'auto',
              filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none'
            }}
          />
        )}
      </a>
      <ul className="nav-links">
        {items.map((item) => (
          <li key={item.href + item.label}>
            <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="nav-right">
        {/* Language Switcher */}
        <div className="lang-switcher" style={{ position: 'relative' }}>
          <button 
            className="lang-toggle-btn"
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'var(--surface2)',
              border: '1px solid var(--border2)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'var(--mono)',
              color: 'var(--text2)',
              transition: 'all 0.2s',
            }}
          >
            <img 
              src={getFlagSrc()} 
              alt={lang === 'en' ? 'English' : 'Español'}
              style={{ width: '18px', height: '18px', objectFit: 'contain', borderRadius: '2px' }}
            />
            <span>{lang === 'en' ? 'EN' : 'ES'}</span>
            <Globe size={14} />
          </button>
          {showLangDropdown && (
            <div 
              className="lang-dropdown"
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'var(--surface)',
                border: '1px solid var(--border2)',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow)',
                zIndex: 100,
                minWidth: '120px',
              }}
            >
              <button
                onClick={() => handleLanguageSelect('en')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '10px 14px',
                  background: lang === 'en' ? 'var(--orange-dim)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: lang === 'en' ? 'var(--orange)' : 'var(--text)',
                  transition: 'background 0.2s',
                }}
              >
                <img 
                  src="https://res.cloudinary.com/drlcisipo/image/upload/v1714663084/English_1_z3fa77.png" 
                  alt="English"
                  style={{ width: '20px', height: '20px', objectFit: 'contain', borderRadius: '2px' }}
                />
                English
              </button>
              <button
                onClick={() => handleLanguageSelect('es')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '10px 14px',
                  background: lang === 'es' ? 'var(--purple-dim)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: lang === 'es' ? 'var(--purple-light)' : 'var(--text)',
                  transition: 'background 0.2s',
                }}
              >
                <img 
                  src="https://res.cloudinary.com/drlcisipo/image/upload/v1713288601/Website%20images/Spanish_2_oaawih.svg" 
                  alt="Español"
                  style={{ width: '20px', height: '20px', objectFit: 'contain', borderRadius: '2px' }}
                />
                Español
              </button>
            </div>
          )}
        </div>

        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
          <div className="toggle-knob">
            {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
          </div>
        </button>
        <a className="nav-signin" href={appendLangToUrl(signinHref, lang)} target="_blank" rel="noreferrer">
          {signinLabel}
        </a>
        <a className="nav-cta" href={appendLangToUrl(ctaHref, lang)} target="_blank" rel="noreferrer">
          {ctaLabel}
        </a>
        <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={onToggleMenu} aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
