'use client';

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { ChevronDown, Globe, Moon, Sun, ArrowUpRight } from 'lucide-react';
import { appendLangToUrl } from '../utils/appendLangToUrl';
import { usePathname } from 'next/navigation';
import { twinPath } from '../../../src/common/i18n/localeRoutes';
import { getRegisterOrigin, getRegisterUrl } from '../preview/previewClient';
import { documentLocaleFromPathname, isSpanishPath } from '../../../src/common/i18n/pathLocale';
import { productHref } from '../productLinks';

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

type MegaMenuName = 'products' | 'work' | 'partners';

type MegaMenuCard = {
  title: string;
  copy: string;
  href: string;
  image: string;
  imageAlt: string;
  eyebrow: string;
  external?: boolean;
  imageVariant?: 'queen-creek' | 'buda-edc';
};

type MegaMenu = {
  eyebrow: string;
  title: string;
  copy: string;
  href?: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  cards: MegaMenuCard[];
};

const MEGA_MENUS: Record<MegaMenuName, MegaMenu> = {
  products: {
    eyebrow: 'COMING SOON',
    title: 'A CRM that keeps your customer relationships moving.',
    copy: 'Bring leads, follow-ups, and the next best action into the same place you already plan and grow your business.',
    image: '/navigation/crm-coming-soon.png',
    imageAlt: 'Concept preview of the upcoming Moil CRM workspace',
    imagePosition: 'center center',
    cards: [
      {
        eyebrow: 'PLAN WITH CLARITY',
        title: 'Business Plan',
        copy: 'Research, financials, and an investor-ready plan built around your business.',
        href: productHref('businessPlan'),
        image: 'https://res.cloudinary.com/daudj5isi/image/upload/f_auto,q_auto,w_800/v1783460386/Business_plan_light_vswzyt.png',
        imageAlt: 'Moil business plan workspace',
      },
      {
        eyebrow: 'STAY CONSISTENT',
        title: 'Moil360',
        copy: 'A month of content, written for you, ready to review, publish, and repeat.',
        href: productHref('moil360'),
        image: 'https://res.cloudinary.com/daudj5isi/image/upload/f_auto,q_auto,w_800/v1783460801/Moil_360_light_mzwasc.png',
        imageAlt: 'Moil360 content workspace',
      },
      {
        eyebrow: 'BUILD YOUR TEAM',
        title: 'Hiring',
        copy: 'Connect growing businesses with job seekers ready for their next role.',
        href: productHref('hiring'),
        image: '/BackgroundEmployerDesktop.png',
        imageAlt: 'Employer hiring experience',
      },
    ],
  },
  work: {
    eyebrow: 'SELECTED WORK',
    title: 'Digital experiences made for businesses with somewhere to go.',
    copy: 'We make credible, clear websites that help a business look as established online as it is in real life.',
    href: '/work',
    image: '/work-sites/bluebonnet-bookkeeping.png',
    imageAlt: 'Bluebonnet Bookkeeping website',
    cards: [
      {
        eyebrow: 'BOOKKEEPING · BUDA, TX',
        title: 'Bluebonnet Bookkeeping',
        copy: 'A poised, high-trust digital presence.',
        href: '/work',
        image: '/work-sites/bluebonnet-bookkeeping.png',
        imageAlt: 'Bluebonnet Bookkeeping website',
      },
      {
        eyebrow: 'FITNESS · BUDA, TX',
        title: 'Refinery Fitness',
        copy: 'A high-energy site built to start conversations.',
        href: '/work',
        image: '/work-sites/refinery-fitness.png',
        imageAlt: 'Refinery Fitness website',
      },
      {
        eyebrow: 'HOSPITALITY · BUDA, TX',
        title: 'Meridian Buda',
        copy: 'A warm, editorial home for a local destination.',
        href: '/work',
        image: '/work-sites/meridian-buda.png',
        imageAlt: 'Meridian Buda website',
      },
    ],
  },
  partners: {
    eyebrow: 'PARTNER WITH MOIL',
    title: 'More capacity for the businesses your community depends on.',
    copy: 'We work alongside organizations already close to small-business owners, turning support into a useful next step.',
    href: '/partners',
    image: '/page-heroes/partner-community-v2.png',
    imageAlt: 'A small-business owner and community-development partners reviewing a growth plan',
    cards: [
      {
        eyebrow: 'QUEEN CREEK, ARIZONA',
        title: 'Queen Creek Chamber',
        copy: 'Connecting businesses, resources, and community.',
        href: 'https://queencreekchamber.com/',
        image: '/partners/queen-creek-chamber-logo.png',
        imageAlt: 'Queen Creek Chamber of Commerce logo',
        external: true,
        imageVariant: 'queen-creek',
      },
      {
        eyebrow: 'BUDA, TEXAS',
        title: 'Buda EDC',
        copy: 'Championing carefully managed commerce and growth.',
        href: 'https://www.budaedc.com/',
        image: '/partners/buda-edc-logo.svg',
        imageAlt: 'Buda Economic Development Corporation logo',
        external: true,
        imageVariant: 'buda-edc',
      },
      {
        eyebrow: 'BUILD WITH MOIL',
        title: 'Become a partner',
        copy: 'Turn trusted local support into a practical next step.',
        href: '/partners',
        image: '/page-heroes/partner-community-v2.png',
        imageAlt: 'Community partners working with a small-business owner',
      },
    ],
  },
};

function NavMegaMenu({ name, onClose }: { name: MegaMenuName; onClose: () => void }) {
  const menu = MEGA_MENUS[name];
  const menuHeading = name === 'products' ? 'Products' : name === 'work' ? 'Selected work' : 'Partnerships';
  const menuIntro = name === 'products'
    ? 'Practical tools for planning, marketing, hiring, and what comes next.'
    : name === 'work'
      ? 'Websites built to make strong businesses unmistakable.'
      : 'Programs for organizations helping small businesses thrive.';
  const viewAllHref = name === 'products' ? '/business' : name === 'work' ? '/work' : '/partners';
  const viewAllLabel = name === 'products' ? 'Explore Moil' : name === 'work' ? 'View all work' : 'Explore partnerships';

  return (
    <div id={`${name}-mega-menu`} className={`nav-mega-menu nav-mega-menu--${name}`} aria-label={`${menuHeading} menu`}>
      <div className="nav-mega-header">
        <div>
          <span>{menuHeading}</span>
          <p>{menuIntro}</p>
        </div>
        <a href={viewAllHref} onClick={onClose}>{viewAllLabel} <ArrowUpRight size={14} aria-hidden="true" /></a>
      </div>
      <div className="nav-mega-body">
        <div className="nav-mega-links">
          {menu.cards.map((card) => (
            <a href={card.href} className="nav-mega-card" key={card.title} onClick={onClose} target={card.external ? '_blank' : undefined} rel={card.external ? 'noreferrer' : undefined}>
              <div className={`nav-mega-card-image${card.imageVariant ? ` is-${card.imageVariant}` : ''}`}><Image src={card.image} alt={card.imageAlt} fill sizes="(max-width: 960px) 0px, 92px" /></div>
              <div className="nav-mega-card-copy">
                <span>{card.eyebrow}</span>
                <strong>{card.title}</strong>
                <small>{card.copy}</small>
              </div>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ))}
        </div>
        <div className="nav-mega-feature">
          <div className="nav-mega-feature-image">
            <Image src={menu.image} alt={menu.imageAlt} fill sizes="(max-width: 960px) 0px, 340px" style={{ objectPosition: menu.imagePosition }} />
            <span>{menu.eyebrow}</span>
          </div>
          <div className="nav-mega-feature-copy">
            <strong>{menu.title}</strong>
            <p>{menu.copy}</p>
            {name === 'products' ? (
              <em><i aria-hidden="true" /> CRM is on its way</em>
            ) : (
              <a href={menu.href} onClick={onClose}>Explore the story <ArrowUpRight size={14} aria-hidden="true" /></a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const pathname = usePathname() || '/';
  // The PATH is the locale source of truth (src/common/i18n/pathLocale.ts says so
  // in its own header, and `langCookieValue` gives the path priority over `?lg=`
  // and any stored value). These chrome components read only the prop, `?lg=` and
  // localStorage — none of which a Spanish visitor arriving from Google has — so
  // on /es/* they defaulted to English and every signup CTA carried ?lg=en.
  const [lang, setLang] = useState<'en' | 'es'>(currentLang ?? documentLocaleFromPathname(pathname));
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [openMegaMenu, setOpenMegaMenu] = useState<MegaMenuName | null>(null);

  // Initialize from currentLang prop, URL, or localStorage
  useEffect(() => {
    if (currentLang) {
      setLang(currentLang);
    } else if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const lgParam = isSpanishPath(pathname) ? 'es' : (url.searchParams.get('lg') as 'en' | 'es' | null);
      const storedLang = localStorage.getItem('tlang') as 'en' | 'es' | null;
      
      if (lgParam && (lgParam === 'en' || lgParam === 'es')) {
        setLang(lgParam);
      } else if (storedLang && (storedLang === 'en' || storedLang === 'es')) {
        setLang(storedLang);
      }
    }
  }, [currentLang, pathname]);

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
      // Navigation is the provider's job (I18nProvider.setLang → localeRoutes),
      // reached through onLanguageChange above. When no parent wires it, fall
      // back to the twin ourselves so the control is never dead.
      if (!onLanguageChange) {
        const url = new URL(window.location.href);
        const twin = twinPath(url.pathname, selectedLang);
        if (twin) {
          url.pathname = twin;
          url.searchParams.delete('lg');
        } else {
          url.searchParams.set('lg', selectedLang);
        }
        window.location.href = url.toString();
      }
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
          className="nav-menu nav-menu--products"
          onMouseEnter={() => setOpenMegaMenu('products')}
          onMouseLeave={() => setOpenMegaMenu(null)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpenMegaMenu(null);
          }}
        >
          <button
            className="nav-menu-trigger"
            type="button"
            aria-expanded={openMegaMenu === 'products'}
            aria-controls="products-mega-menu"
            onClick={() => setOpenMegaMenu((open) => open === 'products' ? null : 'products')}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setOpenMegaMenu(null);
            }}
          >
            Products <ChevronDown size={14} aria-hidden="true" />
          </button>
          <NavMegaMenu name="products" onClose={() => setOpenMegaMenu(null)} />
        </li>
        {items.map((item) => {
          const menuName = item.label === 'Work' ? 'work' : item.label === 'Partners' ? 'partners' : null;

          if (!menuName) {
            return (
              <li key={item.href + item.label}>
                <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined}>
                  {item.label}
                </a>
              </li>
            );
          }

          return (
            <li
              className={`nav-menu nav-menu--${menuName}`}
              key={item.href + item.label}
              onMouseEnter={() => setOpenMegaMenu(menuName)}
              onMouseLeave={() => setOpenMegaMenu(null)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpenMegaMenu(null);
              }}
            >
              <button
                className="nav-menu-trigger"
                type="button"
                aria-expanded={openMegaMenu === menuName}
                aria-controls={`${menuName}-mega-menu`}
                onClick={() => setOpenMegaMenu((open) => open === menuName ? null : menuName)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setOpenMegaMenu(null);
                }}
              >
                {item.label} <ChevronDown size={14} aria-hidden="true" />
              </button>
              <NavMegaMenu name={menuName} onClose={() => setOpenMegaMenu(null)} />
            </li>
          );
        })}
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
        <a className="nav-cta" href={appendLangToUrl(ctaHref, lang)} target="_blank" rel="noreferrer" data-signup-cta="nav">
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
