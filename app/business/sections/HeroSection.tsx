'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useLanguageContext } from '../../../src/common/components/I18nProvider';
import type { ThemeMode } from '../../../src/common/hooks/usePersistentTheme';
import { PreviewMagnet } from '../components/PreviewMagnet';
import { buildRegisterUrl } from '../preview/previewClient';
import { appendLangToUrl } from '../utils/appendLangToUrl';
import { IconMap } from './iconMap';
import { PrimaryButton, SecondaryButton } from './ui';

function HeroShader({ theme, lang }: { theme: ThemeMode; lang: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMotionAllowed(!preference.matches);
    sync();
    preference.addEventListener('change', sync);
    return () => preference.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const player = video.current;
    if (!player || !motionAllowed) return;
    let visible = true;
    const syncPlayback = () => {
      if (paused || !visible || document.hidden) player.pause();
      else void player.play().catch(() => { /* The theme poster remains visible if autoplay is unavailable. */ });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(player);
    document.addEventListener('visibilitychange', syncPlayback);
    syncPlayback();
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      player.pause();
    };
  }, [theme, motionAllowed, paused]);

  return (
    <>
      <div className="business-hero__art" aria-hidden="true">
        {motionAllowed && (
          <video
            ref={video}
            key={theme}
            muted
            loop
            playsInline
            preload="metadata"
            poster={`/business/shaders/hero-${theme}-v1.jpg`}
            src={`/business/shaders/hero-${theme}-loop-v1.mp4`}
          />
        )}
      </div>
      {motionAllowed && (
        <button
          type="button"
          className="business-hero__motion"
          onClick={() => setPaused((value) => !value)}
          aria-label={lang === 'es'
            ? (paused ? 'Reproducir animación de fondo' : 'Pausar animación de fondo')
            : (paused ? 'Play background animation' : 'Pause background animation')}
        >
          {paused ? <Play size={13} aria-hidden /> : <Pause size={13} aria-hidden />}
          <span>{lang === 'es' ? (paused ? 'Reproducir' : 'Pausar') : (paused ? 'Play motion' : 'Pause motion')}</span>
        </button>
      )}
    </>
  );
}

/** One continuous reading path: promise, business preview, actions, reassurance. */
export function HeroSection({ theme }: { theme: ThemeMode }) {
  const { t, lang } = useLanguageContext();
  const copy = t.business.hero;
  const previewSteps = [copy.previewStep1, copy.previewStep2, copy.previewStep3];

  return (
    <section className="business-hero" aria-labelledby="business-hero-heading">
      <HeroShader theme={theme} lang={lang} />
      <div className="business-hero__content">
        <div className="business-hero__eyebrow">
          <span aria-hidden>{IconMap.rocket}</span>
          {copy.eyebrow}
        </div>
        <h1 id="business-hero-heading">
          {copy.headline} <strong>{copy.headlineHighlight}</strong>{' '}
          <span>{copy.headlineLine2}</span>
        </h1>
        <p className="business-hero__intro">{copy.subheadline}</p>

        <div className="business-hero__preview" aria-labelledby="business-preview-heading">
          <div className="business-hero__preview-heading">
            <span className="business-hero__preview-mark" aria-hidden>{IconMap.globe}</span>
            <h2 id="business-preview-heading">{copy.previewTitle}</h2>
            <span className="business-hero__preview-note">
              {lang === 'es' ? 'Empieza con tu sitio web' : 'Start with your website'}
            </span>
          </div>
<<<<<<< HEAD
          <PreviewMagnet />
          <ol className="business-hero__steps" aria-label={copy.previewStepsLabel}>
            {previewSteps.map((step, index) => (
              <li key={step}>
=======

          <h1 data-hero-item id="business-hero-heading">
            <span>{t.business.hero.headline}</span>{' '}
            <strong>{t.business.hero.headlineHighlight}</strong>{' '}
            <span className="business-hero-v3__headline-tail">{t.business.hero.headlineLine2}</span>
          </h1>

          <p data-hero-item className="business-hero-v3__intro">
            {t.business.hero.subheadline}
          </p>

          <div data-hero-item className="business-hero-v3__actions">
            <PrimaryButton
              href={buildRegisterUrl({ lang, appendLang: appendLangToUrl })}
              rel="noreferrer"
              signupCta="hero"
              className="business-hero-v3__primary"
            >
              {t.business.hero.cta} <span>→</span>
            </PrimaryButton>
            <SecondaryButton href="#pricing" className="business-hero-v3__secondary">
              <span aria-hidden className="business-hero-v3__play">{IconMap.play}</span>
              {t.business.hero.ctaSecondary}
            </SecondaryButton>
          </div>

          <div data-hero-item className="business-hero-v3__trust" aria-label={t.business.hero.trustLabel}>
            {t.business.hero.trust.map((label, index) => (
              <div key={label}>
>>>>>>> ac466258ee9b1d580606182141397f62a614839a
                <span>{String(index + 1).padStart(2, '0')}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="business-hero__actions">
          <PrimaryButton
            href={buildRegisterUrl({ lang, appendLang: appendLangToUrl })}
            rel="noreferrer"
            signupCta="hero"
          >
            {copy.cta} <span aria-hidden>→</span>
          </PrimaryButton>
          <SecondaryButton href="#pricing">
            {copy.ctaSecondary} <span aria-hidden>↗</span>
          </SecondaryButton>
        </div>

        <ul className="business-hero__trust" aria-label={copy.trustLabel}>
          {copy.trust.map((label) => <li key={label}>{label}</li>)}
        </ul>
      </div>
    </section>
  );
}
