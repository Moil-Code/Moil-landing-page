'use client';

import type { NavItem } from './BusinessNav';

type BusinessMobileMenuProps = {
  open: boolean;
  onClose: () => void;
  onToggleTheme: () => void;
  theme: 'dark' | 'light';
  items: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
};

export function BusinessMobileMenu({
  open,
  onClose,
  onToggleTheme,
  theme,
  items,
  ctaLabel = '🚀 Get Started Free',
  ctaHref = 'https://business.moilapp.com/register',
}: BusinessMobileMenuProps) {
  return (
    <div className={`mob-menu ${open ? 'open' : ''}`} id="mobMenu">
      {items.map((item) => (
        <a
          key={item.href + item.label}
          href={item.href}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noreferrer' : undefined}
          onClick={onClose}
        >
          {item.label}
        </a>
      ))}
      <a className="mob-cta" href={ctaHref} target="_blank" rel="noreferrer" onClick={onClose}>
        {ctaLabel}
      </a>
      <div className="mob-footer">
        <span className="mob-theme-label">Theme</span>
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
          <div className="toggle-knob">{theme === 'dark' ? '🌙' : '☀️'}</div>
        </button>
      </div>
    </div>
  );
}
