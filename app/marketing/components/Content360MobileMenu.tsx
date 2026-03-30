'use client';

import { cn } from '@/src/lib/utils';
import { useContent360Translation } from '../hooks/useContent360Translation';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onToggleTheme: () => void;
  themeEmoji: string;
};

export function Content360MobileMenu({ isOpen, onClose, onToggleTheme, themeEmoji }: Props) {
  const { t, lang, setLang } = useContent360Translation();

  const links = [
    { label: t.nav.howItWorks, href: '#how' },
    { label: t.nav.features,   href: '#features' },
    { label: t.nav.pricing,    href: '#pricing' },
    { label: t.nav.compare,    href: '#comparison' },
  ];

  const handleCtaClick = () => {
    window.open('https://moilapp.com/business', '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className={cn('mobile-menu', { open: isOpen })}>
      {links.map((link) => (
        <a key={link.href} href={link.href} onClick={onClose}>
          {link.label}
        </a>
      ))}
      <button className="mmenu-cta" type="button" onClick={handleCtaClick}>
        {t.nav.getStarted}
      </button>
      <div className="mobile-menu-footer">
        <div className="lang-toggle">
          <button
            className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
            type="button"
            onClick={() => setLang('en')}
            aria-label="Switch to English"
          >
            EN
          </button>
          <button
            className={`lang-btn ${lang === 'es' ? 'active' : ''}`}
            type="button"
            onClick={() => setLang('es')}
            aria-label="Cambiar a Español"
          >
            ES
          </button>
        </div>
        <span className="mmenu-theme-label">{t.nav.theme}</span>
        <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label="Toggle theme">
          <div className="theme-toggle-knob">{themeEmoji}</div>
        </button>
      </div>
    </div>
  );
}
