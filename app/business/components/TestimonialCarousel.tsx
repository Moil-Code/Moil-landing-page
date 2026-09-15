'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pause, Play } from 'lucide-react';

/** Two equal groups make a continuous loop; only the original is accessible. */
export function TestimonialCarousel({ children, lang }: { children: ReactNode; lang: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [inactive, setInactive] = useState(true);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let visible = false;
    const sync = () => setInactive(!visible || document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return (
    <div ref={root} className="review-carousel" data-paused={paused || inactive}>
      <div className="review-carousel__viewport" tabIndex={0}
        role="region" aria-roledescription={lang === 'es' ? 'carrusel' : 'carousel'}
        aria-label={lang === 'es' ? 'Opiniones de clientes' : 'Customer reviews'}>
        <div className="review-carousel__track">
          <div className="review-carousel__group">{children}</div>
          <div className="review-carousel__group review-carousel__clone" aria-hidden="true" inert>{children}</div>
        </div>
      </div>
      <button type="button" className="review-carousel__pause" aria-pressed={paused}
        onClick={() => setPaused(value => !value)}>
        {paused ? <Play size={14} aria-hidden /> : <Pause size={14} aria-hidden />}
        {lang === 'es' ? (paused ? 'Reanudar carrusel' : 'Pausar carrusel') : (paused ? 'Resume carousel' : 'Pause carousel')}
      </button>
    </div>
  );
}
