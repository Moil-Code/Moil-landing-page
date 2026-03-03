'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type ThemeMode = 'dark' | 'light';

export function useContent360Ui() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  const previousThemeRef = useRef<string | null>(null);

  useEffect(() => {
    previousThemeRef.current = document.documentElement.getAttribute('data-theme');
    const saved = window.localStorage.getItem('moil-theme');
    const nextTheme: ThemeMode = saved === 'light' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    document.body.classList.add('content360-active');

    return () => {
      const previousTheme = previousThemeRef.current;
      if (previousTheme) {
        document.documentElement.setAttribute('data-theme', previousTheme);
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      document.body.classList.remove('content360-active');
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
      setNavScrolled(window.scrollY > 60);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    if (!cursor || !ring || !window.matchMedia('(hover: hover)').matches) {
      return;
    }

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let raf = 0;

    const handleMove = (event: MouseEvent) => {
      mx = event.clientX;
      my = event.clientY;
    };

    const enter = () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
      ring.style.width = '54px';
      ring.style.height = '54px';
      ring.style.borderColor = 'rgba(124,58,237,0.7)';
    };
    const leave = () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(124,58,237,0.5)';
    };

    const animate = () => {
      cursor.style.left = `${mx}px`;
      cursor.style.top = `${my}px`;
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      raf = window.requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMove);
    raf = window.requestAnimationFrame(animate);

    const hoverables = Array.from(document.querySelectorAll('a,button,[data-hoverable]'));
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
    });

    return () => {
      document.removeEventListener('mousemove', handleMove);
      window.cancelAnimationFrame(raf);
      hoverables.forEach((el) => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      });
    };
  }, []);

  useEffect(() => {
    const revealTargets = Array.from(document.querySelectorAll('.reveal'));
    if (!revealTargets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
    );

    revealTargets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const statTargets = Array.from(document.querySelectorAll<HTMLElement>('.stat-value[data-target]'));
    if (!statTargets.length) return;

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

    statTargets.forEach((el) => observer.observe(el));
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
    navScrolled,
  };
}
