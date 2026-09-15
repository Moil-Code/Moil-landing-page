"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { buildCandidateUrl, openCandidateRegister } from "../utils/urlBuilder";
import CustomTranslateButton from "../../common/components/CustomTranslateButton";
import styles from "./navigation.module.css";

interface CandidateNavigationProps {
  page: string;
  refQuery: string | null;
  lgQuery: string;
  setQueryLg: (query: string) => void;
  setShowLanguageModal: (show: boolean) => void;
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
}

const sectionLinks = [
  { label: "AI Resume", href: "#ai-resume" },
  { label: "Voice Assistant", href: "#voice-assistant" },
  { label: "Blog", href: "https://blog.moilapp.com", external: true },
];

export default function CandidateNavigation({
  refQuery,
  lgQuery,
  setQueryLg,
  setShowLanguageModal,
  theme = "light",
  onToggleTheme,
}: CandidateNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleLoginClick = () => {
    const loginUrl = buildCandidateUrl({
      ref: refQuery || undefined,
      lg: lgQuery,
    });
    window.open(loginUrl, "_blank", "noopener,noreferrer");
    setIsMobileMenuOpen(false);
  };

  const handleGetStartedClick = () => {
    openCandidateRegister({ ref: refQuery || undefined, lg: lgQuery });
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={styles.header}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      }}
    >
      <div className={styles.container}>
        <div className={styles.bar}>
          <Link
            href="/candidate"
            className={styles.logo}
            aria-label="Moil home"
          >
            <img
              src="https://res.cloudinary.com/drlcisipo/image/upload/v1705704261/Website%20images/logo_gox0fw.png"
              alt="Moil"
              width={80}
              height={40}
            />
          </Link>

          <nav
            className={styles.desktopLinks}
            aria-label="Candidate navigation"
          >
            {sectionLinks.map(({ label, href, external }) => (
              <a
                key={href}
                href={href}
                className={styles.navLink}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                {label}
                {external && <ArrowUpRight size={13} aria-hidden="true" />}
              </a>
            ))}
          </nav>

          <div className={styles.actions}>
            <Link
              href={`/business?lg=${lgQuery}`}
              className={styles.businessLink}
            >
              Switch to Business <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
            <div className={styles.utilities}>
              <CustomTranslateButton
                variant="candidate"
                setShowLanguageModal={setShowLanguageModal}
                setLgQuery={setQueryLg}
                lgQuery={lgQuery}
                className={styles.languageButton}
                textClassName={styles.languageText}
              />
              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  aria-label="Toggle theme"
                  className={styles.iconButton}
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              )}
            </div>
            <div className={styles.desktopAuth}>
              <button onClick={handleLoginClick} className={styles.loginButton}>
                Login
              </button>
              <button
                onClick={handleGetStartedClick}
                className={styles.primaryButton}
              >
                Get Started <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
            <button
              ref={menuButtonRef}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${styles.iconButton} ${styles.menuButton}`}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="candidate-mobile-menu"
            >
              {isMobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav
            id="candidate-mobile-menu"
            className={styles.mobileMenu}
            aria-label="Mobile candidate navigation"
          >
            <div className={styles.mobileLinks}>
              {sectionLinks.map(({ label, href, external }) => (
                <a
                  key={href}
                  href={href}
                  className={styles.navLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                >
                  {label} <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              ))}
              <Link
                href={`/business?lg=${lgQuery}`}
                className={styles.navLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Switch to Business <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className={styles.mobileAuth}>
              <button onClick={handleLoginClick} className={styles.loginButton}>
                Login
              </button>
              <button
                onClick={handleGetStartedClick}
                className={styles.primaryButton}
              >
                Get Started <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
