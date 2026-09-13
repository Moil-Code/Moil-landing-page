'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLanguageContext } from '../../../src/common/components/I18nProvider';
import { PreviewMagnet } from '../components/PreviewMagnet';
import { buildRegisterUrl } from '../preview/previewClient';
import { appendLangToUrl } from '../utils/appendLangToUrl';
import { IconMap } from './iconMap';
import { PrimaryButton, SecondaryButton } from './ui';

/**
 * Business hero — an editorial introduction paired with the real preview flow.
 * The interaction is unchanged; its framing now explains the three things Moil
 * does before asking a visitor to submit their business.
 */
export function HeroSection() {
  const { t, lang } = useLanguageContext();
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduce) return;

      gsap.from('[data-hero-item]', {
        autoAlpha: 0,
        y: 26,
        duration: 0.85,
        ease: 'power2.out',
        stagger: 0.12,
        clearProps: 'opacity,visibility,transform',
      });

      gsap.set('[data-orb="1"]', { xPercent: -50 });
      gsap.to('[data-orb="1"]', { y: -18, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to('[data-orb="2"]', { y: 22, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to('[data-orb="3"]', { y: -16, duration: 7, ease: 'sine.inOut', yoyo: true, repeat: -1 });

      gsap.fromTo(
        '[data-hero-bg]',
        { scale: 1.03, xPercent: -1.2 },
        { scale: 1.08, xPercent: 1.2, duration: 24, ease: 'sine.inOut', yoyo: true, repeat: -1 },
      );

      gsap.to('[data-pulse]', {
        scale: 0.72,
        opacity: 0.45,
        duration: 1.1,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const previewSteps = [
    t.business.hero.previewStep1,
    t.business.hero.previewStep2,
    t.business.hero.previewStep3,
  ];

  return (
    <section ref={root} className="business-hero-v3" aria-labelledby="business-hero-heading">
      <div data-hero-bg aria-hidden className="business-hero-v3__backdrop">
        <Image src="/hero_bg.jpg" alt="" fill priority sizes="100vw" className="hero-bg-dark" />
        <Image
          src="https://res.cloudinary.com/daudj5isi/image/upload/f_auto,q_auto,w_1920/v1783442089/hero_bg_light_eeeazi.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-bg-light"
        />
      </div>

      <div aria-hidden className="business-hero-v3__grid" />
      <div data-orb="1" aria-hidden className="business-hero-v3__orb business-hero-v3__orb--one" />
      <div data-orb="2" aria-hidden className="business-hero-v3__orb business-hero-v3__orb--two" />
      <div data-orb="3" aria-hidden className="business-hero-v3__orb business-hero-v3__orb--three" />

      <div className="business-hero-v3__shell">
        <div className="business-hero-v3__copy">
          <div data-hero-item className="business-hero-v3__eyebrow">
            <span data-pulse aria-hidden className="business-hero-v3__pulse" />
            <span aria-hidden className="business-hero-v3__eyebrow-icon">{IconMap.rocket}</span>
            {t.business.hero.eyebrow}
          </div>

          <h1 data-hero-item id="business-hero-heading">
            <span>{t.business.hero.headline}</span>{' '}
            <strong>{t.business.hero.headlineHighlight}</strong>
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
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{label}</p>
              </div>
            ))}
          </div>
        </div>

        <aside data-hero-item className="business-hero-v3__workbench" aria-labelledby="business-preview-heading">
          <div className="business-hero-v3__workbench-bar">
            <span>
              <i aria-hidden />
              {t.business.hero.previewKicker}
            </span>
            <strong>{t.business.hero.previewStatus}</strong>
          </div>

          <div className="business-hero-v3__workbench-copy">
            <span>{t.business.hero.previewEyebrow}</span>
            <h2 id="business-preview-heading">{t.business.hero.previewTitle}</h2>
            <p>{t.business.hero.previewDescription}</p>
          </div>

          <PreviewMagnet />

          <div className="business-hero-v3__preview-steps" aria-label={t.business.hero.previewStepsLabel}>
            {previewSteps.map((step, index) => (
              <div key={step}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <i aria-hidden />
                <p>{step}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div aria-hidden className="business-hero-v3__edge-label">
        <span>MOIL / BUSINESS</span>
        <i />
        <span>01</span>
      </div>
    </section>
  );
}
