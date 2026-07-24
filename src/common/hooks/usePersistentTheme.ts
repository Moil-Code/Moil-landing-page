'use client';

import { useCallback, useEffect, useLayoutEffect, useSyncExternalStore } from 'react';

export type ThemeMode = 'dark' | 'light';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function getDocumentTheme(): ThemeMode {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

const themeListeners = new Set<() => void>();

function applyTheme(nextTheme: ThemeMode, persist = true) {
  document.documentElement.setAttribute('data-theme', nextTheme);

  if (persist) {
    try {
      window.localStorage.setItem('moil-theme', nextTheme);
    } catch {
      // The document theme still works when storage is unavailable.
    }
  }

  themeListeners.forEach((listener) => listener());
}

function subscribeToTheme(listener: () => void) {
  themeListeners.add(listener);

  const syncFromAnotherTab = (event: StorageEvent) => {
    if (event.key !== 'moil-theme') return;
    applyTheme(event.newValue === 'dark' ? 'dark' : 'light', false);
  };

  window.addEventListener('storage', syncFromAnotherTab);

  return () => {
    themeListeners.delete(listener);
    window.removeEventListener('storage', syncFromAnotherTab);
  };
}

/**
 * One persistent theme source for every themed section.
 *
 * The root layout restores `html[data-theme]` before first paint. This hook
 * starts from that already-restored value, keeps the shared localStorage
 * preference in sync, and deliberately does not reset the theme on unmount so
 * route transitions cannot flash back to a section's old default.
 */
export function usePersistentTheme() {
  const theme = useSyncExternalStore<ThemeMode>(
    subscribeToTheme,
    getDocumentTheme,
    (): ThemeMode => 'light',
  );

  useIsomorphicLayoutEffect(() => {
    let nextTheme: ThemeMode = 'light';

    try {
      nextTheme = window.localStorage.getItem('moil-theme') === 'dark' ? 'dark' : 'light';
    } catch {
      // Storage can be unavailable in privacy-restricted contexts. The
      // application still has a stable light default in that case.
    }

    applyTheme(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme]);

  return { theme, toggleTheme };
}
