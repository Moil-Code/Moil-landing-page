'use client';

import { ReactNode } from 'react';

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  type?: 'button';
};

/**
 * Tailwind reimplementation of the old `.btn-primary` — solid orange pill with a
 * diagonal shimmer sweep on hover (done with a child span + group-hover instead
 * of a ::before pseudo-element, which inline utilities can't express).
 */
export function PrimaryButton({ href, children, className = '', target, rel }: ButtonProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`group relative inline-flex items-center justify-center gap-[9px] overflow-hidden rounded-lg bg-[var(--orange)] px-[34px] py-[15px] text-[15px] font-bold tracking-[0.2px] text-white transition-all duration-[250ms] hover:-translate-y-0.5 hover:shadow-[0_14px_48px_var(--orange-glow)] hover:bg-[#FF7A40] ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(45deg,transparent_30%,rgba(255,255,255,0.15)_50%,transparent_70%)] transition-transform duration-[400ms] group-hover:translate-x-full"
      />
      <span className="relative inline-flex items-center gap-[9px]">{children}</span>
    </a>
  );
}

/**
 * Tailwind reimplementation of `.btn-secondary` — outline pill that turns purple
 * on hover.
 */
const secondaryClass =
  'inline-flex items-center justify-center gap-[9px] rounded-lg border border-[var(--border2)] bg-transparent px-[34px] py-[15px] text-[15px] font-medium tracking-[0.2px] text-[var(--text)] transition-all duration-[250ms] hover:-translate-y-0.5 hover:border-[var(--purple)] hover:bg-[var(--purple-dim)] hover:text-[var(--purple-light)]';

export function SecondaryButton({ href, onClick, children, className = '', target, rel, type = 'button' }: ButtonProps) {
  const cls = `${secondaryClass} ${className}`;
  if (href) {
    return (
      <a href={href} target={target} rel={rel} onClick={onClick} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
