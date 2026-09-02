'use client';

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown, Globe, Moon, Sun, ArrowUpRight, Briefcase, Megaphone, UsersRound } from 'lucide-react';
import { appendLangToUrl } from '../utils/appendLangToUrl';
import { getRegisterOrigin, getRegisterUrl } from '../preview/previewClient';

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
  switchLabel?: string;
  switchHref?: string;
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
  ctaHref = getRegisterUrl(),
  signinLabel = 'Log In',
  signinHref = getRegisterOrigin(),
  switchLabel = 'Switch to candidates',
  switchHref = '/candidate',
  onLanguageChange,
  currentLang,
}: BusinessNavProps) {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showProducts, setShowProducts] = useState(false);

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
    if (typeof window !== 'undefined') {
      localStorage.setItem('tlang', selectedLang);
      document.cookie = `googtrans=${selectedLang === 'en' ? '/auto/en' : '/auto/es'}; path=/`;
      window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang: selectedLang } }));

      // Map between the EN canonical URL and its /es/* counterpart when one
      // exists. Keeps the hreflang signal consistent — users land on the
      // same URL Google indexes for their locale.
      const localeRouteMap: Record<'en' | 'es', Record<string, string>> = {
        es: { '/business': '/es/business', '/business/pricing': '/es/business/pricing' },
        en: { '/es/business': '/business', '/es/business/pricing': '/business/pricing' },
      };
      const url = new URL(window.location.href);
      const mappedPath = localeRouteMap[selectedLang][url.pathname];
      if (mappedPath) {
        url.pathname = mappedPath;
        url.searchParams.delete('lg');
      } else {
        url.searchParams.set('lg', selectedLang);
      }
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
            src="https://res.cloudinary.com/drlcisipo/image/upload/f_auto,q_auto,w_138/v1705704261/Website%20images/logo_gox0fw.png"
            alt="Moil Logo"
            className="nav-logo-img"
            width={69}
            height={32}
            fetchPriority="high"
            style={{
              height: '32px',
              width: 'auto',
              filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none'
            }}
          />
        )}
      </a>

      <ul className="nav-links">
        <li
          className="nav-products"
          onMouseEnter={() => setShowProducts(true)}
          onMouseLeave={() => setShowProducts(false)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setShowProducts(false);
          }}
        >
          <button
            className="nav-products-trigger"
            type="button"
            aria-expanded={showProducts}
            aria-controls="products-mega-menu"
            onClick={() => setShowProducts((open) => !open)}
          >
            Products <ChevronDown size={14} aria-hidden="true" />
          </button>
          <div id="products-mega-menu" className={`products-mega-menu ${showProducts ? 'is-open' : ''}`}>
            <div className="products-mega-intro">
              <span>ONE BUSINESS, LESS HAT-WEARING</span>
              <strong>Tools that turn the work in front of you into a finished next step.</strong>
            </div>
            <div className="products-mega-links">
              <a href="/business" className="products-mega-card" onClick={() => setShowProducts(false)}>
                <span className="products-mega-icon"><Briefcase size={19} aria-hidden="true" /></span>
                <span>
                  <strong>Business Plan</strong>
                  <small>Research, financials, and an investor-ready plan built around your business.</small>
                </span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a href="/marketing" className="products-mega-card" onClick={() => setShowProducts(false)}>
                <span className="products-mega-icon is-purple"><Megaphone size={19} aria-hidden="true" /></span>
                <span>
                  <strong>Moil Services</strong>
                  <small>A month of strategic marketing, ready to review, publish, and repeat.</small>
                </span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a href="/candidate" className="products-mega-card" onClick={() => setShowProducts(false)}>
                <span className="products-mega-icon is-green"><UsersRound size={19} aria-hidden="true" /></span>
                <span>
                  <strong>Hiring</strong>
                  <small>Connect growing businesses with job seekers ready for their next role.</small>
                </span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </li>
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

        <a className="nav-switch" href={switchHref}>
          {switchLabel} <ArrowUpRight size={13} aria-hidden="true" />
        </a>

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
