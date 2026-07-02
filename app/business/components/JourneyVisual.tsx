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
 * Sticky coach visual for the journey section. As the steps scroll past, a GSAP
 * ScrollTrigger scrub crossfades the two real screens: the "new chat" start
 * screen → the ongoing AI coach conversation.
 */
export function JourneyVisual({ startAlt, chatAlt }: JourneyVisualProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Scrub crossfade start → conversation across the section's scroll.
      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: 'top 72%', end: 'bottom 45%', scrub: 1 },
        })
        .to('.jv-img-1', { opacity: 0, scale: 0.97, ease: 'none' })
        .to('.jv-img-2', { opacity: 1, scale: 1, ease: 'none' }, '<');

      // Soft intro lift.
      gsap.from('.jv-frame', {
        opacity: 0,
        y: 34,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div className="jv" ref={root}>
      <div className="jv-frame">
        <div className="jv-bar">
          <span className="jv-dot" style={{ background: '#FF5F56' }} />
          <span className="jv-dot" style={{ background: '#FFBD2E' }} />
          <span className="jv-dot" style={{ background: '#27C93F' }} />
        </div>
        <div className="jv-stage">
          <Image
            className="jv-img jv-img-1"
            src="/new_chat_business_coach.jpg"
            alt={startAlt}
            fill
            sizes="(max-width: 900px) 100vw, 560px"
          />
          <Image
            className="jv-img jv-img-2"
            src="/Business_coach_chat.jpg"
            alt={chatAlt}
            fill
            sizes="(max-width: 900px) 100vw, 560px"
          />
        </div>
      </div>
    </div>
  );
}
