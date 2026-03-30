'use client';

import { useContent360Translation } from '../hooks/useContent360Translation';
import { cn } from '@/src/lib/utils';

type Props = {
  scrolled: boolean;
  menuOpen: boolean;
  onToggleTheme: () => void;
  themeEmoji: string;
  onToggleMenu: () => void;
};

export function Content360Nav({
  scrolled,
  menuOpen,
  onToggleTheme,
  themeEmoji,
  onToggleMenu,
}: Props) {
  const { t, lang, setLang } = useContent360Translation();

  const handleCtaClick = () => {
    window.open('https://business.moilapp.com', '_blank', 'noopener,noreferrer');
  };

  const links = [
    { label: t.nav.howItWorks, href: '#how' },
    { label: t.nav.features,   href: '#features' },
    { label: t.nav.pricing,    href: '#pricing' },
    { label: t.nav.compare,    href: '#comparison' },
  ];

  return (
    <nav className={cn('content360-nav', { scrolled })}>
      <a href="#hero" className="nav-logo">
        MOIL <span className="logo-dot">·</span> CONTENT
        <span className="logo-dot">360</span>{' '}
        <span className="nav-badge">AI-POWERED</span>
      </a>
      <ul className="nav-links">
        {links.map((item) => (
          <li key={item.label}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
      <div className="nav-right">
        <div className="nav-lang-wrap">
          <span className="nav-lang-icon">🌐</span>
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
        </div>
        <button
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          <div className="theme-toggle-knob">{themeEmoji}</div>
        </button>
        <button className="nav-cta" type="button" onClick={handleCtaClick}>
          {t.nav.start}
        </button>
        <button
          className={cn('hamburger', { open: menuOpen })}
          type="button"
          onClick={onToggleMenu}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
