'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface JourneyVisualProps {
  /** Alt for the "new chat / #1 question" start screen. */
  startAlt: string;
  /** Alt for the ongoing coach conversation screen. */
  chatAlt: string;
}

/**
 * Journey section visual. Two real coach screens are stacked so the right column
 * fills the full height of the steps column beside it — no dead space. Screen 1
 * (the "new chat" start) shows first; as the steps scroll past, screen 2 (the
 * ongoing conversation) rises and fades in to fill the space below, cued by a
 * down arrow between them.
 */
export function JourneyVisual({ startAlt, chatAlt }: JourneyVisualProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Soft intro lift for the first screen.
      gsap.from('.jv-frame-1', {
        opacity: 0,
        y: 34,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });

      // Screen 2 rises + fades in as the section scrolls, filling the space.
      gsap.fromTo(
        ['.jv-arrow', '.jv-frame-2'],
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          ease: 'none',
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: 'top 70%', end: 'center 40%', scrub: 1 },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div className="jv" ref={root}>
      <div className="jv-frame jv-frame-1">
        <div className="jv-bar">
          <span className="jv-dot" style={{ background: '#FF5F56' }} />
          <span className="jv-dot" style={{ background: '#FFBD2E' }} />
          <span className="jv-dot" style={{ background: '#27C93F' }} />
        </div>
        <div className="jv-stage">
          <Image
            className="jv-img jv-img-1"
            src="https://res.cloudinary.com/daudj5isi/image/upload/v1783393117/new_chat_business_coach_nfqhh2.jpg"
            alt={startAlt}
            fill
            sizes="(max-width: 900px) 100vw, 560px"
          />
        </div>
      </div>

      <div className="jv-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>

      <div className="jv-frame jv-frame-2">
        <div className="jv-bar">
          <span className="jv-dot" style={{ background: '#FF5F56' }} />
          <span className="jv-dot" style={{ background: '#FFBD2E' }} />
          <span className="jv-dot" style={{ background: '#27C93F' }} />
        </div>
        <div className="jv-stage">
          <Image
            className="jv-img jv-img-2"
            src="https://res.cloudinary.com/daudj5isi/image/upload/v1783393117/Business_coach_chat_pmmtbm.jpg"
            alt={chatAlt}
            fill
            sizes="(max-width: 900px) 100vw, 560px"
          />
        </div>
      </div>
    </div>
  );
}
