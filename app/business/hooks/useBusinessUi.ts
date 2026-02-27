'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type ThemeMode = 'dark' | 'light';

export function useBusinessUi() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const previousThemeRef = useRef<string | null>(null);

  useEffect(() => {
    previousThemeRef.current = document.documentElement.getAttribute('data-theme');
    const saved = window.localStorage.getItem('moil-theme');
    const nextTheme: ThemeMode = saved === 'light' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);

    return () => {
      const previousTheme = previousThemeRef.current;
      if (previousTheme) {
        document.documentElement.setAttribute('data-theme', previousTheme);
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('moil-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const cur = document.getElementById('cur');
    const curR = document.getElementById('curR');
    if (!cur || !curR || !window.matchMedia('(hover: hover)').matches) {
      return;
    }

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let raf = 0;

    const onMove = (event: MouseEvent) => {
      mx = event.clientX;
      my = event.clientY;
    };

    const enterHandler = () => {
      cur.style.transform = 'translate(-50%,-50%) scale(2.5)';
      curR.style.width = '52px';
      curR.style.height = '52px';
      curR.style.borderColor = 'rgba(124,58,237,0.7)';
    };

    const leaveHandler = () => {
      cur.style.transform = 'translate(-50%,-50%) scale(1)';
      curR.style.width = '34px';
      curR.style.height = '34px';
      curR.style.borderColor = 'rgba(124,58,237,0.45)';
    };

    const animate = () => {
      cur.style.left = `${mx}px`;
      cur.style.top = `${my}px`;
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      curR.style.left = `${rx}px`;
      curR.style.top = `${ry}px`;
      raf = window.requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove);
    raf = window.requestAnimationFrame(animate);

    const hoverTargets = Array.from(document.querySelectorAll('a,button,[onclick]'));
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', enterHandler);
      el.addEventListener('mouseleave', leaveHandler);
    });

    return () => {
      document.removeEventListener('mousemove', onMove);
      window.cancelAnimationFrame(raf);
      hoverTargets.forEach((el) => {
        el.removeEventListener('mouseenter', enterHandler);
        el.removeEventListener('mouseleave', leaveHandler);
      });
    };
  }, []);

  useEffect(() => {
    const revealTargets = Array.from(document.querySelectorAll('.rv'));
    if (!revealTargets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -28px 0px' }
    );

    revealTargets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-target]'));
    if (!targets.length) return;

    const intervals = new Set<number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = parseInt(el.dataset.target || '0', 10);
          const prefix = el.dataset.prefix || '';
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const step = target / 55;
          const timer = window.setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              window.clearInterval(timer);
              intervals.delete(timer);
            }
            el.textContent = `${prefix}${Math.floor(current).toLocaleString()}${suffix}`;
          }, 22);
          intervals.add(timer);
          observer.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );

    targets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      intervals.forEach((timer) => window.clearInterval(timer));
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return {
    theme,
    toggleTheme,
    menuOpen,
    setMenuOpen,
    scrolled,
  };
}
