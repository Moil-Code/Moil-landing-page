'use client';

import { useContent360Translation } from '../hooks/useContent360Translation';

type Props = {
  themeEmoji: string;
  onToggleTheme: () => void;
};

export function Content360Footer({ themeEmoji, onToggleTheme }: Props) {
  const { t, lang, setLang } = useContent360Translation();
  const f = t.footer;

  return (
    <footer className="content360-footer">
      <div className="footer-inner">
        <a href="#hero" className="footer-logo">
          MOIL<span>·</span>AI
        </a>
        <div className="footer-links">
          <a href="#how">{f.howItWorks}</a>
          <a href="#features">{f.features}</a>
          <a href="#pricing">{f.pricing}</a>
          <a href="https://moilapp.com/business" target="_blank" rel="noreferrer">
            {f.getStarted}
          </a>
        </div>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1 }}>
            {f.mode}
          </span>
          <button className="theme-toggle" type="button" aria-label="Toggle theme" data-hoverable onClick={onToggleTheme}>
            <div className="theme-toggle-knob">{themeEmoji}</div>
          </button>
        </div>
        <span className="footer-copy">{f.copy}</span>
      </div>
    </footer>
  );
}
