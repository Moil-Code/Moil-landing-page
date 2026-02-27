'use client';

import type { ReactNode } from 'react';

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
};

export function BusinessNav({
  scrolled,
  menuOpen,
  onToggleMenu,
  onToggleTheme,
  theme,
  items,
  logo,
  logoHref = "/business",
  ctaLabel = "Get Started",
  ctaHref = "https://business.moilapp.com/register",
  signinLabel = "Log In",
  signinHref = "https://business.moilapp.com",
}: BusinessNavProps) {
  return (
    <nav id="nav" className={scrolled ? "scrolled" : ""}>
      <a href={logoHref} className="nav-logo">
        {logo ?? (
          <>
            MO<span className="lo">I</span>L{" "}
            <span className="ai-badge">AI Co-Founder</span>
          </>
        )}
      </a>
      <ul className="nav-links">
        {items.map((item) => (
          <li key={item.href + item.label}>
            <a
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="nav-right">
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          <div className="toggle-knob">{theme === "dark" ? "🌙" : "☀️"}</div>
        </button>
        <a
          className="nav-signin"
          href={signinHref}
          target="_blank"
          rel="noreferrer"
        >
          {signinLabel}
        </a>
        <a className="nav-cta" href={ctaHref} target="_blank" rel="noreferrer">
          {ctaLabel}
        </a>
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={onToggleMenu}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
