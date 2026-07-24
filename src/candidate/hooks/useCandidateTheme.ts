'use client';

import { usePersistentTheme } from '../../common/hooks/usePersistentTheme';

/**
 * Candidate-section theme hook. Shares the `moil-theme` localStorage key and
 * html[data-theme] attribute with the business/marketing sections so one
 * preference themes the whole site. Tailwind `dark:` variants key off the
 * same attribute (see darkMode in tailwind.config.js).
 */
export function useCandidateTheme() {
  return usePersistentTheme();
}
