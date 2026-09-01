'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { PreviewMagnet } from '../components/PreviewMagnet';
import gsap from 'gsap';
import { useLanguageContext } from '../../../src/common/components/I18nProvider';
import { appendLangToUrl } from '../utils/appendLangToUrl';
import { buildRegisterUrl } from '../preview/previewClient';
import { IconMap } from './iconMap';
import { PrimaryButton, SecondaryButton } from './ui';

/**
 * Hero — first fold. Fully Tailwind-styled (arbitrary values reference the theme
 * CSS vars so light/dark still work) with all motion driven by GSAP: a staggered
 * entrance timeline, floating background orbs, a slow background drift, and the
 * pulsing eyebrow dot. Replaces the old CSS `#hero`/`.hero-*` rules + keyframes.
 */
export function HeroSection() {
  const { t, lang } = useLanguageContext();
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Reduced-motion: leave everything in its natural (visible) resting state.
      if (reduce) return;

      // Staggered entrance for the stacked hero items. clearProps on finish so the
      // items settle to their natural CSS state and never stay stuck hidden.
      gsap.from('[data-hero-item]', {
        autoAlpha: 0,
        y: 30,
        duration: 0.9,
        ease: 'power2.out',
        stagger: 0.15,
        clearProps: 'opacity,visibility,transform',
      });

      // Floating orbs (orb 1 is centred, so drive its x + y together via GSAP).
      gsap.set('[data-orb="1"]', { xPercent: -50 });
      gsap.to('[data-orb="1"]', { y: -24, duration: 4.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to('[data-orb="2"]', { y: 28, duration: 5.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to('[data-orb="3"]', { y: -20, duration: 6.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });

      // Slow background drift.
      gsap.fromTo(
        '[data-hero-bg]',
        { scale: 1.04, xPercent: -1.6 },
        { scale: 1.11, xPercent: 1.6, duration: 22, ease: 'sine.inOut', yoyo: true, repeat: -1 },
      );

      // Pulsing eyebrow dot.
      gsap.to('[data-pulse]', {
        scale: 0.7,
        opacity: 0.4,
        duration: 1,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-[60px] pt-[100px] text-center max-[960px]:px-5 max-[960px]:pb-12 max-[960px]:pt-[88px]"
    >
      {/* Background wave image, masked to fade into the page at the top. */}
      <div
        data-hero-bg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[68%] [mask-image:linear-gradient(to_top,#000_60%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_top,#000_60%,transparent_100%)]"
      >
        <Image src="/hero_bg.jpg" alt="" fill priority sizes="100vw" className="hero-bg-dark object-cover object-[center_bottom]" />
        <Image
          src="https://res.cloudinary.com/daudj5isi/image/upload/f_auto,q_auto,w_1920/v1783442089/hero_bg_light_eeeazi.png"
          alt=""
          fill
          sizes="100vw"
          className="hero-bg-light object-cover object-[center_bottom]"
        />
      </div>

      {/* Faint grid overlay, radially masked to the centre. */}
      <div
        aria-hidden
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,black_0%,transparent_100%)]"
        style={{
          backgroundImage:
            'linear-gradient(var(--grid-a) 1px, transparent 1px), linear-gradient(90deg, var(--grid-a) 1px, transparent 1px), linear-gradient(var(--grid-b) 1px, transparent 1px), linear-gradient(90deg, var(--grid-b) 1px, transparent 1px)',
          backgroundSize: '80px 80px, 80px 80px, 20px 20px, 20px 20px',
        }}
      />

      {/* Ambient blurred orbs. */}
      <div
        data-orb="1"
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-150px] h-[min(700px,120vw)] w-[min(700px,120vw)] rounded-full blur-[110px]"
        style={{ background: 'radial-gradient(circle, rgba(255,92,26,0.13) 0%, transparent 70%)' }}
      />
      <div
        data-orb="2"
        aria-hidden
        className="pointer-events-none absolute bottom-[10%] right-[-5%] h-[min(450px,80vw)] w-[min(450px,80vw)] rounded-full blur-[110px]"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)' }}
      />
      <div
        data-orb="3"
        aria-hidden
        className="pointer-events-none absolute bottom-[20%] left-[-5%] h-[min(350px,70vw)] w-[min(350px,70vw)] rounded-full blur-[110px]"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)' }}
      />

      {/* Eyebrow */}
      <div
        data-hero-item
        className="relative z-[2] mb-[30px] inline-flex items-center gap-2 rounded-full border border-[rgba(255,92,26,0.22)] bg-[var(--orange-dim)] px-[18px] py-[7px] text-[10px] uppercase tracking-[1.5px] text-[var(--orange)]"
      >
        <span data-pulse className="h-1.5 w-1.5 rounded-full bg-[var(--orange)]" />
        <span className="mr-1.5 inline-flex items-center">{IconMap.rocket}</span> {t.business.hero.eyebrow}
      </div>

      <h1
        data-hero-item
        className="relative z-[2] mb-7 max-w-[1200px] text-[clamp(32px,5vw,64px)] font-bold leading-[1.1] tracking-[-0.03em] max-[960px]:text-[clamp(28px,6vw,46px)] max-[480px]:text-[clamp(24px,7.5vw,36px)]"
      >
        {t.business.hero.headline}
        {t.business.hero.headlineLine2 ? (
          <>
            <br />
            {t.business.hero.headlineLine2}
          </>
        ) : null}
        {t.business.hero.headlineHighlight ? (
          <>
            <br />
            <span className="text-[var(--orange)]">{t.business.hero.headlineHighlight}</span>
          </>
        ) : null}
      </h1>

      {/* Subheadline — the mechanism, including the continuity that drives retention. */}
      <p
        data-hero-item
        className="relative z-[2] mb-11 max-w-[780px] text-[clamp(14px,2vw,18px)] font-light leading-[1.55] text-[var(--text)]"
      >
        {t.business.hero.subheadline}
      </p>

      {/* CTAs — primary stays signup. Secondary jumps to Market Pro on #pricing. */}
      <div data-hero-item className="relative z-[2] mb-6 flex flex-wrap justify-center gap-3 max-[960px]:flex-col max-[960px]:items-center">
        <PrimaryButton href={buildRegisterUrl({ lang, appendLang: appendLangToUrl })} rel="noreferrer">
          {t.business.hero.cta} <span>→</span>
        </PrimaryButton>
        <SecondaryButton href="#pricing">
          <span className="mr-1.5 inline-flex items-center">{IconMap.play}</span> {t.business.hero.ctaSecondary}
        </SecondaryButton>
      </div>

      <div data-hero-item className="relative z-[2] mb-[48px] w-full">
        <PreviewMagnet />
      </div>

      {/* Trust strip — outcome claims only; nothing here asserts a number we cannot source. */}
      <div data-hero-item className="relative z-[2] flex flex-wrap items-center justify-center gap-8">
        {t.business.hero.trust.map((label, i) => (
          <div
            key={label}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[1px] text-[var(--text)]"
          >
            <span
              className="h-[5px] w-[5px] rounded-full"
              style={{ background: ['var(--green)', 'var(--orange)', 'var(--purple-light)', 'var(--green)'][i % 4] }}
            />{' '}
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}
