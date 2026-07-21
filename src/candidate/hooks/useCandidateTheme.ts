'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

type ThemeMode = 'dark' | 'light';

// useLayoutEffect fires before paint so the saved theme is applied without a
// visible dark→light flash; falls back to useEffect during SSR.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Candidate-section theme hook. Shares the `moil-theme` localStorage key and
 * html[data-theme] attribute with the business/marketing sections so one
 * preference themes the whole site. Tailwind `dark:` variants key off the
 * same attribute (see darkMode in tailwind.config.js).
 */
export function useCandidateTheme() {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  const previousThemeRef = useRef<string | null>(null);

  useIsomorphicLayoutEffect(() => {
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

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}
