'use client';

import { Content360Footer } from './components/Content360Footer';
import { Content360MobileMenu } from './components/Content360MobileMenu';
import { Content360Nav } from './components/Content360Nav';
import { Content360Styles } from './components/Content360Styles';
import {
  ComparisonSection,
  FeaturesSection,
  FinalCtaSection,
  HeroSection,
  JourneySection,
  PricingSection,
  ProblemSection,
  SolutionSection,
  StatsSection,
  TestimonialsSection,
} from './components/sections';
import { navLinks } from './data';
import { useContent360Ui } from './hooks/useContent360Ui';

export default function Content360Page() {
  const { theme, toggleTheme, menuOpen, setMenuOpen, navScrolled } = useContent360Ui();
  const themeEmoji = theme === 'dark' ? '🌙' : '☀️';

  return (
    <div className="content360-shell" data-theme={theme}>
      <Content360Styles />
      <div className="cursor" id="cursor" data-hoverable />
      <div className="cursor-ring" id="cursorRing" data-hoverable />

      <Content360Nav
        links={navLinks}
        scrolled={navScrolled}
        menuOpen={menuOpen}
        onToggleTheme={toggleTheme}
        themeEmoji={themeEmoji}
        onToggleMenu={() => setMenuOpen((prev) => !prev)}
      />
      <Content360MobileMenu
        links={navLinks}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onToggleTheme={toggleTheme}
        themeEmoji={themeEmoji}
      />

      <HeroSection />
      <div className="divider" />
      <ProblemSection />
      <div className="divider" />
      <SolutionSection />
      <div className="divider" />
      <JourneySection />
      <div className="divider" />
      <FeaturesSection />
      <div className="divider" />
      <StatsSection />
      <div className="divider" />
      <PricingSection />
      <div className="divider" />
      <ComparisonSection />
      <div className="divider" />
      <TestimonialsSection />
      <div className="divider" />
      <FinalCtaSection />
      <Content360Footer themeEmoji={themeEmoji} onToggleTheme={toggleTheme} />
    </div>
  );
}
