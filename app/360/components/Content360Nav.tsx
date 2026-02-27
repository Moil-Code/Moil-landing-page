import { navLinks, type NavLink } from '../data';
import { cn } from '@/src/lib/utils';

type Props = {
  links?: NavLink[];
  scrolled: boolean;
  menuOpen: boolean;
  onToggleTheme: () => void;
  themeEmoji: string;
  onToggleMenu: () => void;
};

export function Content360Nav({
  links = navLinks,
  scrolled,
  menuOpen,
  onToggleTheme,
  themeEmoji,
  onToggleMenu,
}: Props) {
  const handleCtaClick = () => {
    window.open('https://moilapp.com/business', '_blank', 'noopener,noreferrer');
  };

  return (
    <nav className={cn('content360-nav', { scrolled })}>
      <a href="#hero" className="nav-logo">
        MOIL <span className="logo-dot">·</span> CONTENT<span className="logo-dot">360</span>{' '}
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
        <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label="Toggle theme">
          <div className="theme-toggle-knob">{themeEmoji}</div>
        </button>
        <button className="nav-cta" type="button" onClick={handleCtaClick}>
          Start Free →
        </button>
        <button className={cn('hamburger', { open: menuOpen })} type="button" onClick={onToggleMenu} aria-label="Menu">
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
