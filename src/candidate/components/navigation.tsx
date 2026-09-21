"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { buildCandidateUrl, openCandidateRegister } from "../utils/urlBuilder";
import CustomTranslateButton from "../../common/components/CustomTranslateButton";
import styles from "./navigation.module.css";

interface CandidateNavigationProps {
  page: string;
  refQuery: string | null;
  lgQuery: string;
  setQueryLg: (query: string) => void;
  setShowLanguageModal: (show: boolean) => void;
}

const sectionLinks = [
  {
    label: { en: "Find jobs", es: "Buscar empleos" },
    description: { en: "Search roles that fit you", es: "Encuentra puestos para ti" },
    href: "#candidate-top",
  },
  {
    label: { en: "AI Resume", es: "Currículum con IA" },
    description: { en: "Build a stronger resume", es: "Crea un currículum mejor" },
    href: "#ai-resume",
  },
  {
    label: { en: "Voice Assistant", es: "Asistente de voz" },
    description: { en: "Practice for interviews", es: "Practica para entrevistas" },
    href: "#voice-assistant",
  },
  {
    label: { en: "English & Spanish", es: "Inglés y español" },
    description: { en: "Use Moil in your language", es: "Usa Moil en tu idioma" },
    href: "#bilingual",
  },
  {
    label: { en: "Blog", es: "Blog" },
    description: { en: "Career advice and resources", es: "Consejos y recursos profesionales" },
    href: "https://blog.moilapp.com",
    external: true,
  },
];

export default function CandidateNavigation({
  refQuery,
  lgQuery,
  setQueryLg,
  setShowLanguageModal,
}: CandidateNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const language = lgQuery === "es" ? "es" : "en";

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleSectionClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    external?: boolean,
  ) => {
    if (external || !href.startsWith("#")) {
      setIsMobileMenuOpen(false);
      return;
    }

    event.preventDefault();
    const target = document.getElementById(href.slice(1));
    setIsMobileMenuOpen(false);

    if (!target) return;
    window.history.pushState(null, "", href);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 56;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 24;
        const canAnimate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches
          && Math.abs(top - window.scrollY) < window.innerHeight * 1.5;

        if (canAnimate) {
          window.scrollTo({ top, behavior: "smooth" });
          return;
        }

        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        window.scrollTo({ top, behavior: "auto" });
        root.style.scrollBehavior = previousScrollBehavior;
      });
    });
  };

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
            {sectionLinks.slice(1).map(({ label, href, external }) => (
              <a
                key={href}
                href={href}
                className={styles.navLink}
                onClick={(event) => handleSectionClick(event, href, external)}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                {label[language]}
                {external && <ArrowUpRight size={13} aria-hidden="true" />}
              </a>
            ))}
          </nav>

          <div className={styles.actions}>
            <Link
              href={lgQuery === 'es' ? '/es/business' : '/business'}
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
              onClick={handleLoginClick}
              className={styles.mobileLoginButton}
            >
              {language === "es" ? "Entrar" : "Login"}
            </button>
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
            <div className={styles.mobileMenuIntro}>
              <span>{language === "es" ? "Explorar Moil" : "Explore Moil"}</span>
              <p>
                {language === "es"
                  ? "Herramientas para avanzar en tu carrera."
                  : "Tools to move your career forward."}
              </p>
            </div>
            <div className={styles.mobileLinks}>
              {sectionLinks.map(({ label, description, href, external }, index) => (
                <a
                  key={href}
                  href={href}
                  className={styles.mobileNavLink}
                  onClick={(event) => handleSectionClick(event, href, external)}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                >
                  <span className={styles.mobileLinkIndex}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.mobileLinkCopy}>
                    <strong>{label[language]}</strong>
                    <small>{description[language]}</small>
                  </span>
                  {external ? (
                    <ArrowUpRight size={17} aria-hidden="true" />
                  ) : (
                    <ArrowRight size={17} aria-hidden="true" />
                  )}
                </a>
              ))}
              <Link
                href={lgQuery === 'es' ? '/es/business' : '/business'}
                className={`${styles.mobileNavLink} ${styles.mobileSwitchLink}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className={styles.mobileLinkCopy}>
                  <strong>{language === "es" ? "Moil para empresas" : "Moil for business"}</strong>
                  <small>{language === "es" ? "Cambia a herramientas empresariales" : "Switch to business tools"}</small>
                </span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <div className={styles.mobileAuth}>
              <button
                onClick={handleGetStartedClick}
                className={styles.primaryButton}
              >
                {language === "es" ? "Crear perfil" : "Create profile"}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
