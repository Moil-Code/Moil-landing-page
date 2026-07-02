'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import type { ProductShotSource } from '../productShots';

interface ProductShotProps {
  /** Slot config from app/business/productShots.ts. */
  source: ProductShotSource;
  /** Describes the screenshot for screen readers — pass a localized string. */
  alt: string;
  /** Current UI theme; selects the dark capture when one is provided. */
  theme?: string;
  /** Eager-load for LCP. Use ONLY on the hero shot; everything else stays lazy. */
  priority?: boolean;
  /** Caption shown in placeholder mode so it's obvious which screenshot belongs here. */
  placeholderLabel?: string;
  /**
   * Fallback rendered while no screenshot URL is set — typically the existing CSS
   * mockup. Rendered bare (it carries its own styling), so there's no visual change
   * until a real capture lands.
   */
  children?: ReactNode;
  /** Extra classes for the outer wrapper. */
  className?: string;
}

/**
 * Image slot that renders a real product screenshot when one is configured, and
 * falls back to a CSS-mockup placeholder until then. See app/business/productShots.ts.
 */
export function ProductShot({
  source,
  alt,
  theme,
  priority = false,
  placeholderLabel,
  children,
  className,
}: ProductShotProps) {
  const src =
    theme === 'dark' && source.srcDark ? source.srcDark : source.srcLight || source.srcDark;

  // No capture yet: show the existing mockup, or a labeled placeholder for slots
  // (like the hero) that don't have one.
  if (!src) {
    if (children) {
      return <>{children}</>;
    }
    return (
      <div className={`product-shot${className ? ` ${className}` : ''}`}>
        <div className="product-shot__bar">
          <span className="product-shot__dot" style={{ background: '#FF5F56' }} />
          <span className="product-shot__dot" style={{ background: '#FFBD2E' }} />
          <span className="product-shot__dot" style={{ background: '#27C93F' }} />
        </div>
        <div
          className="product-shot__placeholder"
          style={{ aspectRatio: `${source.width} / ${source.height}` }}
        >
          <span className="product-shot__placeholder-label">
            {placeholderLabel ?? 'Product screenshot'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`product-shot${className ? ` ${className}` : ''}`}>
      <div className="product-shot__bar">
        <span className="product-shot__dot" style={{ background: '#FF5F56' }} />
        <span className="product-shot__dot" style={{ background: '#FFBD2E' }} />
        <span className="product-shot__dot" style={{ background: '#27C93F' }} />
      </div>
      <Image
        src={src}
        alt={alt}
        width={source.width}
        height={source.height}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        sizes="(max-width: 768px) 100vw, 920px"
        className="product-shot__img"
      />
    </div>
  );
}
