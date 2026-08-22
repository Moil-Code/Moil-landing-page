'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Globe } from 'lucide-react';
import { appendLangToUrl } from '../utils/appendLangToUrl';
import { useLanguageContext } from '../../../src/common/components/I18nProvider';

type BusinessFooterProps = {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onLanguageChange?: (lang: 'en' | 'es') => void;
  currentLang?: 'en' | 'es';
};

export function BusinessFooter({ theme, onToggleTheme, onLanguageChange, currentLang }: BusinessFooterProps) {
  const { t } = useLanguageContext();
  const [lang, setLang] = useState<'en' | 'es'>('en');

  // Sync with external language state or initialize from localStorage/URL
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
    const handleLanguageChange = (e: CustomEvent<{ lang: 'en' | 'es' }>) => {
      setLang(e.detail.lang);
    };
    
    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
  }, []);

  const handleLangChange = (newLang: 'en' | 'es') => {
    setLang(newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('tlang', newLang);
      const url = new URL(window.location.href);
      url.searchParams.set('lg', newLang);
      // Set Google Translate cookie
      document.cookie = `googtrans=${newLang === 'en' ? '/auto/en' : '/auto/es'}; path=/`;
      // Dispatch event for other components to sync
      window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang: newLang } }));
      // Reload page to apply translation
      window.location.href = url.toString();
    }
  };

  return (
    <footer className="has-footer-2">
      {/* Large italic tagline — Manus-style */}
      <div className="footer-hero-tagline">
        One platform.<br />Every tool your<br />business needs.
      </div>

      {/* Nav columns */}
      <div className="footer-grid">
        <div>
          <div className="footer-col-title">{t.footer.platform}</div>
          <div className="footer-links">
            <a href="/business#capabilities">{t.footer.platformLinks.features}</a>
            <a href="/business#journey">{t.footer.platformLinks.howItWorks}</a>
            <a href="/business#pricing">{t.footer.platformLinks.pricing}</a>
            <a href="/reviews">Customer reviews</a>
            <a href="/ai-info">AI info</a>
            <a href={`/candidate?lg=${lang}`}>{t.footer.resourceLinks.forJobSeekers}</a>
          </div>
        </div>
        <div>
          <div className="footer-col-title">{t.footer.resources}</div>
          <div className="footer-links">
            <a href="https://blog.moilapp.com" target="_blank" rel="noreferrer">{t.footer.resourceLinks.blog}</a>
            <a href="/about">{t.footer.resourceLinks.aboutUs}</a>
            <a href={appendLangToUrl("https://moilapp.com/contact", lang)} target="_blank" rel="noreferrer">{t.footer.resourceLinks.contact}</a>
            <a href="/privacy">{t.footer.resourceLinks.privacyPolicy}</a>
            <a href="/terms">{t.footer.resourceLinks.termsOfService}</a>
            <a href="/cookies">{t.footer.resourceLinks.cookiePolicy}</a>
          </div>
        </div>
        <div>
          <div className="footer-col-title">Compare</div>
          <div className="footer-links">
            <a href="/compare/moil-vs-buffer">Moil vs Buffer</a>
            <a href="/compare/moil-vs-later">Moil vs Later</a>
            <a href="/compare/moil-vs-hootsuite">Moil vs Hootsuite</a>
            <a href="/compare/moil-vs-chatgpt">Moil vs ChatGPT</a>
            <a href="/compare/best-ai-content-calendar-tools">Best AI content calendar tools</a>
            <a href="/compare/done-for-you-social-media-alternatives">Done-for-you social media</a>
            <a href="/compare/moil-vs-agency">Moil vs a marketing agency</a>
          </div>
        </div>
        <div>
          <div className="footer-col-title">{t.footer.getStarted}</div>
          <div className="footer-links">
            <a href={appendLangToUrl("https://business.moilapp.com/register", lang)} target="_blank" rel="noreferrer">
              {t.footer.getStartedLinks.freeConsultation}
            </a>
            <a href={appendLangToUrl("https://moilapp.com/business", lang)} target="_blank" rel="noreferrer">
              {t.footer.getStartedLinks.login}
            </a>
            <a href="/business#pricing">{t.business.pricing.professional.name} — $25/mo</a>
            <a href="/business#pricing">{t.business.pricing.marketPro.name} — $75/mo</a>
          </div>
        </div>
      </div>

      {/* Bottom bar: logo | copyright | controls + socials */}
      <div className="footer-bottom">
        {/* Logo */}
        <div className="footer-bottom-logo">
          <a href="/business">
            <img
              src="https://res.cloudinary.com/drlcisipo/image/upload/f_auto,q_auto,w_138/v1705704261/Website%20images/logo_gox0fw.png"
              alt="Moil Logo"
              width={69}
              height={32}
              loading="lazy"
              decoding="async"
              style={{ height: '32px', width: 'auto', filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none' }}
            />
          </a>
        </div>

        {/* Copyright */}
        <span className="footer-copy">{t.footer.copyright}</span>

        {/* Controls + social icons */}
        <div className="footer-bottom-right">
          {/* Lang toggle */}
          <div className="lang-toggle" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Globe size={13} style={{ color: 'rgba(255,255,255,0.5)', marginRight: '2px' }} />
            <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => handleLangChange('en')}>EN</button>
            <button className={`lang-btn ${lang === 'es' ? 'active' : ''}`} onClick={() => handleLangChange('es')}>ES</button>
          </div>
          {/* Theme toggle */}
          <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
            <div className="toggle-knob">
              {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
            </div>
          </button>
          {/* Badges */}
          <div className="footer-badges">
            <span className="f-badge fb-g">{t.footer.badges.aiPowered}</span>
            <span className="f-badge fb-p">{t.footer.badges.bilingual}</span>
            <span className="f-badge fb-o">{t.footer.badges.businesses}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
