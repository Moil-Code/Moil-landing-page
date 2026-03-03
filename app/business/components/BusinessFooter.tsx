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
    <footer>
      <div className="footer-grid">
        <div>
          <a href="/business" className="footer-brand-logo">
            <img 
              src="https://res.cloudinary.com/drlcisipo/image/upload/v1705704261/Website%20images/logo_gox0fw.png" 
              alt="Moil Logo" 
              style={{ 
                height: '40px', 
                width: 'auto',
                filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none'
              }}
            />
          </a>
          <p className="footer-tagline">
            {t.footer.tagline}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
            <span className="f-badge fb-g">{t.footer.badges.aiPowered}</span>
            <span className="f-badge fb-p">{t.footer.badges.bilingual}</span>
            <span className="f-badge fb-o">{t.footer.badges.businesses}</span>
          </div>
        </div>
        <div>
          <div className="footer-col-title">{t.footer.platform}</div>
          <div className="footer-links">
            <a href="#capabilities">{t.footer.platformLinks.features}</a>
            <a href="#journey">{t.footer.platformLinks.howItWorks}</a>
            <a href="#hiring">{t.footer.platformLinks.smartHiring}</a>
            <a href="#pricing">{t.footer.platformLinks.pricing}</a>
            <a href={appendLangToUrl("https://business.moilapp.com/register", lang)} target="_blank" rel="noreferrer">
              {t.footer.platformLinks.postAJob}
            </a>
          </div>
        </div>
        <div>
          <div className="footer-col-title">{t.footer.resources}</div>
          <div className="footer-links">
            <a href="https://blog.moilapp.com" target="_blank" rel="noreferrer">
              {t.footer.resourceLinks.blog}
            </a>
            <a href={appendLangToUrl("https://moilapp.com/business", lang)} target="_blank" rel="noreferrer">
              {t.footer.resourceLinks.aboutUs}
            </a>
            <a href={appendLangToUrl("https://moilapp.com/business", lang)} target="_blank" rel="noreferrer">
              {t.footer.resourceLinks.contact}
            </a>
            <a href={appendLangToUrl("https://moilapp.com/business", lang)} target="_blank" rel="noreferrer">
              {t.footer.resourceLinks.privacyPolicy}
            </a>
            <a href={`/candidate?lg=${lang}`}>{t.footer.resourceLinks.forJobSeekers}</a>
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
            <a href="#pricing">{t.business.pricing.starter.name} — $15/mo</a>
            <a href="#pricing">{t.business.pricing.professional.name} — $25/mo</a>
            <a href="#pricing">{t.business.pricing.marketPro.name} — $75/mo</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">{t.footer.copyright}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div className="lang-toggle" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Globe size={14} style={{ color: 'var(--text3)', marginRight: '4px' }} />
            <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => handleLangChange('en')}>
              EN
            </button>
            <button className={`lang-btn ${lang === 'es' ? 'active' : ''}`} onClick={() => handleLangChange('es')}>
              ES
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '10px',
                color: 'var(--text3)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Theme
            </span>
            <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
              <div className="toggle-knob">
                {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
              </div>
            </button>
          </div>
        </div>
        <div className="footer-badges">
          <span className="f-badge fb-g">SOC 2</span>
          <span className="f-badge fb-p">EN/ES</span>
          <span className="f-badge fb-o">{t.business.pricing.trust.guarantee}</span>
        </div>
      </div>
    </footer>
  );
}
