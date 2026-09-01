"use client";

import { useEffect, useState } from "react";
import { effectiveConsent, hasGlobalPrivacyControl, writeConsent } from "../../src/common/consent";

/**
 * The opt-out control the CPRA "Do Not Sell or Share" page must actually have.
 *
 * The page used to describe an opt-out and offer only an email address. This
 * writes the same consent value the banner writes, through the same module
 * (`src/common/consent.ts`), so `<Analytics />` stops rendering the marketing
 * and analytics tags immediately — the opt-out is honoured on this page load,
 * not on the next one.
 */
export default function OptOutButton() {
  const [state, setState] = useState<"unknown" | "accepted" | "rejected" | "gpc">("unknown");

  useEffect(() => {
    if (hasGlobalPrivacyControl()) {
      setState("gpc");
      return;
    }
    const current = effectiveConsent();
    setState(current === "accepted" ? "accepted" : current === "rejected" ? "rejected" : "unknown");
  }, []);

  if (state === "gpc") {
    return (
      <p className="rounded-lg bg-[#EFF7F1] p-4 text-sm text-[#22263A]">
        Your browser is sending a Global Privacy Control signal, and we are honouring it. No
        analytics or marketing tools are loading on this device.
      </p>
    );
  }

  if (state === "rejected") {
    return (
      <p className="rounded-lg bg-[#EFF7F1] p-4 text-sm text-[#22263A]">
        You have opted out on this browser. Google Analytics, Microsoft Clarity, the Meta Pixel and
        Apollo are not loading. You can change this from the cookie banner if you clear your browser
        storage.
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <p className="mb-3 text-sm text-[#22263A]">
        Opting out stops Google Analytics, Microsoft Clarity, the Meta Pixel and Apollo from loading
        on this browser. It takes effect immediately and nothing on the site stops working.
      </p>
      <button
        type="button"
        onClick={() => {
          writeConsent("rejected");
          setState("rejected");
        }}
        className="rounded-lg bg-[#FF6633] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Do Not Sell or Share My Personal Information
      </button>
    </div>
  );
}
