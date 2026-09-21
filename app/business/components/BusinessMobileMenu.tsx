'use client';

import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { ArrowRight, ArrowUpRight, Moon, Sun } from 'lucide-react';
import type { NavItem } from './BusinessNav';
import { appendLangToUrl } from '../utils/appendLangToUrl';
import { getRegisterUrl } from '../preview/previewClient';
import { usePathname } from 'next/navigation';
import { documentLocaleFromPathname, isSpanishPath } from '../../../src/common/i18n/pathLocale';

type BusinessMobileMenuProps = {
  open: boolean;
  onClose: () => void;
  onToggleTheme: () => void;
  theme: 'dark' | 'light';
  items: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
  currentLang?: 'en' | 'es';
};

export function BusinessMobileMenu({
  open,
  onClose,
  onToggleTheme,
  theme,
  items,
  ctaLabel = 'Start free — no credit card',
  ctaHref = getRegisterUrl(),
  currentLang,
}: BusinessMobileMenuProps) {
  // Seeded from the prop, exactly as BusinessNav and BusinessFooter do. An
  // unconditional 'en' here is only corrected by the effect below, i.e. after
  // hydration — so the SERVED HTML of every Spanish page sent its primary
  // mobile CTA to the English signup, and a reader who tapped before hydration
  // got it. Mobile is the dominant device for this audience.
  const pathname = usePathname() || '/';
  // The PATH is the locale source of truth (src/common/i18n/pathLocale.ts says so
  // in its own header, and `langCookieValue` gives the path priority over `?lg=`
  // and any stored value). These chrome components read only the prop, `?lg=` and
  // localStorage — none of which a Spanish visitor arriving from Google has — so
  // on /es/* they defaulted to English and every signup CTA carried ?lg=en.
  const [lang, setLang] = useState<'en' | 'es'>(currentLang ?? documentLocaleFromPathname(pathname));

  useEffect(() => {
    if (currentLang) {
      setLang(currentLang);
    } else if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const lgParam = isSpanishPath(pathname) ? 'es' : (url.searchParams.get('lg') as 'en' | 'es' | null);
      const storedLang = localStorage.getItem('tlang') as 'en' | 'es' | null;
      if (lgParam && (lgParam === 'en' || lgParam === 'es')) setLang(lgParam);
      else if (storedLang && (storedLang === 'en' || storedLang === 'es')) setLang(storedLang);
    }
  }, [currentLang, pathname]);

  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent<{ lang: 'en' | 'es' }>) => setLang(e.detail.lang);
    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
  }, []);

  const localizeHref = (href: string) => {
    if (lang === 'es' && href.startsWith('/business')) return `/es${href}`;
    if (lang === 'en' && href.startsWith('/es/business')) return href.slice(3);
    return href;
  };

  const itemDescription = (item: NavItem) => {
    const href = item.href.toLowerCase();
    const spanish = lang === 'es';
    if (href.includes('product-business-plan')) return spanish ? 'Planes y proyecciones para tu negocio' : 'Plans and projections for your business';
    if (href.includes('product-moil360')) return spanish ? 'Contenido de marca listo para publicar' : 'On-brand content ready to publish';
    if (href.includes('/candidate')) return spanish ? 'Herramientas profesionales para candidatos' : 'Career tools for candidates';
    if (href.includes('/work')) return spanish ? 'Sitios que hemos creado' : 'See websites we have built';
    if (href.includes('/partners')) return spanish ? 'Programas para comunidades empresariales' : 'Programs for business communities';
    if (href.includes('blog.moilapp.com')) return spanish ? 'Ideas prácticas para crecer' : 'Practical ideas for growing';
    if (href.includes('/contact')) return spanish ? 'Habla con el equipo de Moil' : 'Talk with the Moil team';
    if (href.includes('#capabilities')) return spanish ? 'Explora lo que Moil puede hacer' : 'Explore what Moil can do';
    if (href.includes('#journey')) return spanish ? 'Mira cómo funciona' : 'See how it works';
    if (href.includes('#pricing')) return spanish ? 'Compara planes y precios' : 'Compare plans and pricing';
    if (href.includes('#identity')) return spanish ? 'Conoce qué es Moil' : 'Learn what Moil is';
    return spanish ? 'Explora esta sección' : 'Explore this section';
  };

  const handleItemClick = (event: MouseEvent<HTMLAnchorElement>, href: string, external?: boolean) => {
    if (external) {
      onClose();
      return;
    }

    const url = new URL(href, window.location.href);
    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    const targetPath = url.pathname.replace(/\/$/, '') || '/';
    const target = url.hash ? document.getElementById(url.hash.slice(1)) : null;

    if (!url.hash || currentPath !== targetPath || !target) {
      onClose();
      return;
    }

    event.preventDefault();
    onClose();
    window.history.pushState(null, '', `${window.location.pathname}${window.location.search}${url.hash}`);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const headerHeight = document.getElementById('nav')?.getBoundingClientRect().height ?? 64;
        const revealOffset = target.classList.contains('rv') && !target.classList.contains('in') ? 32 : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20 - revealOffset;
        const canAnimate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
          && Math.abs(top - window.scrollY) < window.innerHeight * 1.5;

        if (canAnimate) {
          window.scrollTo({ top, behavior: 'smooth' });
          return;
        }

        // Long smooth-scroll animations are easily interrupted by videos and
        // reveal effects higher on this page. Jump long distances exactly so
        // a menu choice always lands on its heading, not midway between blocks.
        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        window.scrollTo({ top, behavior: 'auto' });
        root.style.scrollBehavior = previousScrollBehavior;
      });
    });
  };

  return (
    <nav
      className={`mob-menu ${open ? 'open' : ''}`}
      id="business-mobile-menu"
      aria-label="Mobile business navigation"
      aria-hidden={!open}
    >
      <div className="mob-menu-intro">
        <span>{lang === 'es' ? 'Explorar Moil' : 'Explore Moil'}</span>
        <p>{lang === 'es' ? 'Elige dónde quieres ir.' : 'Choose where you want to go.'}</p>
      </div>
      <div className="mob-menu-links">
        {items.map((item, index) => {
          const href = localizeHref(item.href);
          return (
            <a
              key={item.href + item.label}
              href={href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noreferrer' : undefined}
              onClick={(event) => handleItemClick(event, href, item.external)}
            >
              <span className="mob-menu-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="mob-menu-copy">
                <strong>{item.label}</strong>
                <small>{itemDescription(item)}</small>
              </span>
              {item.external ? <ArrowUpRight size={18} aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}
            </a>
          );
        })}
      </div>
      <div className="mob-menu-preferences">
        <a className="mob-product-switch" href={`/candidate?lg=${lang}`} onClick={onClose}>
          <span>
            <strong>{lang === 'es' ? 'Cambiar a candidatos' : 'Switch to candidate'}</strong>
            <small>{lang === 'es' ? 'Empleos, currículum y entrevistas' : 'Jobs, resumes, and interview tools'}</small>
          </span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
        <div className="mob-theme-control">
          <span>
            <strong>{lang === 'es' ? 'Tema' : 'Theme'}</strong>
            <small>{theme === 'dark' ? (lang === 'es' ? 'Modo oscuro' : 'Dark mode') : (lang === 'es' ? 'Modo claro' : 'Light mode')}</small>
          </span>
          <button type="button" onClick={onToggleTheme} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
            {theme === 'dark' ? <Moon size={17} aria-hidden="true" /> : <Sun size={17} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <a className="mob-cta" href={appendLangToUrl(ctaHref, lang)} target="_blank" rel="noreferrer" onClick={onClose} data-signup-cta="mobile-menu">
        <span>{ctaLabel}</span>
        <ArrowUpRight size={18} aria-hidden="true" />
      </a>
    </nav>
  );
}
