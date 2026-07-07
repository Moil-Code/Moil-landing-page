'use client';

import { useState } from 'react';
import { BusinessFooter } from '../business/components/BusinessFooter';
import { BusinessNav, type NavItem } from '../business/components/BusinessNav';
import { I18nProvider } from '../../src/common/components/I18nProvider';
import '../business/business.css';

const NAV_ITEMS: NavItem[] = [
  { label: 'Features', href: '/business#capabilities' },
  { label: 'How It Works', href: '/business#journey' },
  { label: 'Hiring', href: '/business#hiring' },
  { label: 'Pricing', href: '/business#pricing' },
  { label: 'Blog', href: 'https://blog.moilapp.com', external: true },
];

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <I18nProvider>
      <div data-theme={theme} style={{ minHeight: '100vh', background: 'var(--surface, #06080d)', color: 'var(--text, #e8e8f0)' }}>
        <BusinessNav
          scrolled={false}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen(o => !o)}
          onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          theme={theme}
          items={NAV_ITEMS}
          ctaHref="https://business.moilapp.com/register"
          ctaLabel="Get Started Free"
        />
        {children}
        <BusinessFooter
          theme={theme}
          onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        />
      </div>
    </I18nProvider>
  );
}
