import { navLinks, type NavLink } from '../data';
import { cn } from '@/src/lib/utils';

type Props = {
  links?: NavLink[];
  isOpen: boolean;
  onClose: () => void;
  onToggleTheme: () => void;
  themeEmoji: string;
};

export function Content360MobileMenu({
  links = navLinks,
  isOpen,
  onClose,
  onToggleTheme,
  themeEmoji,
}: Props) {
  const handleCtaClick = () => {
    window.open('https://moilapp.com/business', '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className={cn('mobile-menu', { open: isOpen })}>
      {links.map((link) => (
        <a key={link.label} href={link.href} onClick={onClose}>
          {link.label}
        </a>
      ))}
      <button className="mmenu-cta" type="button" onClick={handleCtaClick}>
        🚀 Get Started Free
      </button>
      <div className="mobile-menu-footer">
        <span className="mmenu-theme-label">Theme</span>
        <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label="Toggle theme">
          <div className="theme-toggle-knob">{themeEmoji}</div>
        </button>
      </div>
    </div>
  );
}
