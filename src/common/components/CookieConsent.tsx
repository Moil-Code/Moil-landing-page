"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CONSENT_STORAGE_KEY as STORAGE_KEY,
  type ConsentValue,
  hasGlobalPrivacyControl,
  writeConsent,
} from "../consent";

/**
 * Lightweight cookie-consent banner.
 *
 * Records the choice through `src/common/consent.ts` — the ONE writer — and
 * `<Analytics />` reads it through the same module, so "Reject non-essential"
 * actually keeps GA4 / Clarity / the FB pixel / Apollo off the page. A browser
 * sending Global Privacy Control is treated as an existing refusal, so the
 * banner is not shown at all. Renders nothing until mounted to avoid SSR/CSR
 * hydration mismatches, and nothing once a choice is recorded.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (hasGlobalPrivacyControl()) return;
      const existing = window.localStorage.getItem(STORAGE_KEY);
      if (!existing) setVisible(true);
    } catch {
      // localStorage unavailable (private mode, etc.) — show the banner anyway.
      setVisible(true);
    }
  }, []);

  const record = (value: ConsentValue) => {
    writeConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p className="text-sm leading-relaxed text-[#22263A]">
          We use essential cookies to run the site. Analytics and marketing
          tools (Google Analytics, Microsoft Clarity, Meta Pixel, Apollo) load
          only if you click &ldquo;Accept all&rdquo;. See our{" "}
          <Link href="/cookies" className="font-semibold text-[#5843BE] underline">
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-semibold text-[#5843BE] underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => record("rejected")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-[#22263A] transition-colors hover:bg-gray-50"
          >
            Reject non-essential
          </button>
          <button
            type="button"
            onClick={() => record("accepted")}
            className="rounded-lg bg-[#FF6633] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
