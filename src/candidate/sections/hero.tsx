"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Briefcase, FileText, Languages, Mic } from "lucide-react";
import { useCandidateTheme } from "../hooks/useCandidateTheme";
import SearchComponent from "../components/search";
import { useCandidateCopy, styles } from "../components/landing/elements";
import { openCandidateApp, openCandidateRegister } from "../utils/urlBuilder";

interface CandidateHeroProps {
  onGetStarted?: () => void;
  refQuery?: string;
  lgQuery?: string;
}

const HERO_VIDEO = {
  light: {
    src: "/candidate/shaders/hero-shader-loop-v1.mp4",
    poster: "/candidate/shaders/hero-shader-v2.webp",
  },
  dark: {
    src: "/candidate/shaders/hero-shader-dark-loop-v1.mp4",
    poster: "/candidate/shaders/hero-shader-dark-poster-v1.jpg",
  },
} as const;

/**
 * One background loop, for the theme on screen.
 *
 * The hero used to render BOTH loops (light and dark, ~3 MB each) with
 * autoPlay and hide one with CSS, so every visit downloaded and decoded the
 * one nobody could see, and both kept playing after the hero scrolled away.
 * Now only the current theme's video exists; it plays while the hero is on
 * screen and the tab is visible, as the /business hero does. The poster is
 * the hero's CSS background, so nothing is lost before the client mounts or
 * when reduced motion is preferred (no video at all then).
 */
function HeroVideo() {
  const { theme } = useCandidateTheme();
  const video = useRef<HTMLVideoElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionAllowed(!preference.matches);
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const player = video.current;
    if (!player || !motionAllowed) return;
    let visible = true;
    const syncPlayback = () => {
      if (!visible || document.hidden) player.pause();
      else void player.play().catch(() => { /* the poster stays when autoplay is refused */ });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(player);
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      player.pause();
    };
  }, [theme, motionAllowed]);

  if (!motionAllowed) return null;
  const { src, poster } = HERO_VIDEO[theme === "dark" ? "dark" : "light"];
  return (
    <video
      ref={video}
      key={theme}
      className={styles.heroVideo}
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      src={src}
      aria-hidden="true"
    />
  );
}

export default function CandidateHero({ refQuery, lgQuery }: CandidateHeroProps) {
  const copy = useCandidateCopy();
  const appParams = { ref: refQuery, lg: lgQuery };
  const features = [
    {
      icon: Mic,
      title: copy("Voice Interview Coach", "Coach de entrevistas por voz"),
      detail: copy("Practice with AI feedback", "Practica con comentarios de IA"),
    },
    {
      icon: Briefcase,
      title: copy("Smart Job Matching", "Empleos para tus habilidades"),
      detail: copy("Find relevant opportunities", "Encuentra oportunidades relevantes"),
    },
    {
      icon: Languages,
      title: copy("English & Spanish", "Inglés y español"),
      detail: copy("Use every career tool", "Usa todas las herramientas"),
    },
  ];

  return (
    <section id="candidate-top" className={styles.hero} aria-labelledby="candidate-hero-heading">
      <HeroVideo />

      <div className={styles.heroContainer}>
        <div className={styles.heroBadge}>
          <FileText size={15} aria-hidden="true" />
          {copy(
            "Build your profile in English or Spanish",
            "Crea tu perfil en inglés o español",
          )}
        </div>

        <h1 id="candidate-hero-heading">
          {copy("Your AI Career Assistant", "Tu asistente profesional con IA")}
        </h1>
        <p className={styles.heroIntro}>
          {copy(
            "Beyond job matching—practice interviews with voice coaching, build a professional resume in minutes, and find your path with AI. Free, in English and Spanish.",
            "Mucho más que encontrar empleo: practica entrevistas con coaching de voz, crea un currículum profesional en minutos y encuentra tu camino con IA. Gratis, en inglés y español.",
          )}
        </p>

        <div className={styles.heroSearch}>
          <SearchComponent lgQuery={lgQuery || "en"} />
        </div>

        <div className={styles.heroActions}>
          <button
            type="button"
            className={styles.heroPrimary}
            onClick={() => openCandidateRegister(appParams)}
          >
            {copy("Create personal profile", "Crear perfil personal")}
            <ArrowRight size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.heroSecondary}
            onClick={() => openCandidateApp(appParams)}
          >
            {copy("Log in to your profile", "Entrar a tu perfil")}
          </button>
        </div>

        <div className={styles.heroFeatureRow}>
          {features.map(({ icon: Icon, title, detail }) => (
            <div className={styles.heroFeature} key={title}>
              <span>
                <Icon size={17} aria-hidden="true" />
              </span>
              <div>
                <strong>{title}</strong>
                <small>{detail}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
