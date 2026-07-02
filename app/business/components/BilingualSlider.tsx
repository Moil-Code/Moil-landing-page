'use client';

import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

interface BilingualSliderProps {
  /** Left / "before" capture (revealed on the left of the divider). */
  beforeSrc: string;
  /** Right / "after" capture (the base layer, revealed on the right). */
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  /** Corner chips, e.g. "EN" / "ES". */
  beforeLabel: string;
  afterLabel: string;
  /** Intrinsic capture size — both shots must share the same dimensions. */
  width: number;
  height: number;
  /** Small mono hint under the frame, e.g. "Drag to compare". */
  hint?: string;
}

const clamp = (n: number) => Math.min(100, Math.max(0, n));

/**
 * Draggable before/after comparison slider. The two captures are the same Moil
 * screen in English and Spanish, so dragging the divider wipes between languages.
 * Supports pointer (mouse + touch) and keyboard (arrow / home / end).
 */
export function BilingualSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  beforeLabel,
  afterLabel,
  width,
  height,
  hint,
}: BilingualSliderProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [pos, setPos] = useState(50);

  const setFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true;
      frameRef.current?.setPointerCapture(e.pointerId);
      setFromClientX(e.clientX);
    },
    [setFromClientX],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      setFromClientX(e.clientX);
    },
    [setFromClientX],
  );

  const stopDrag = useCallback((e: React.PointerEvent) => {
    dragging.current = false;
    frameRef.current?.releasePointerCapture(e.pointerId);
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft') setPos((p) => clamp(p - step));
    else if (e.key === 'ArrowRight') setPos((p) => clamp(p + step));
    else if (e.key === 'Home') setPos(0);
    else if (e.key === 'End') setPos(100);
    else return;
    e.preventDefault();
  }, []);

  return (
    <div className="bislider-wrap">
      <div
        ref={frameRef}
        className="bislider"
        style={{ aspectRatio: `${width} / ${height}` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
      >
        {/* Base layer — "after" (Spanish) */}
        <div className="bislider__layer">
          <Image
            src={afterSrc}
            alt={afterAlt}
            fill
            sizes="(max-width: 900px) 100vw, 600px"
            className="bislider__img"
            draggable={false}
          />
        </div>

        {/* Top layer — "before" (English), clipped to the left of the divider */}
        <div
          className="bislider__layer bislider__layer--top"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            sizes="(max-width: 900px) 100vw, 600px"
            className="bislider__img"
            draggable={false}
          />
        </div>

        <span className="bislider__chip bislider__chip--l" style={{ opacity: pos > 14 ? 1 : 0 }}>
          {beforeLabel}
        </span>
        <span className="bislider__chip bislider__chip--r" style={{ opacity: pos < 86 ? 1 : 0 }}>
          {afterLabel}
        </span>

        <div className="bislider__divider" style={{ left: `${pos}%` }}>
          <button
            type="button"
            className="bislider__handle"
            role="slider"
            aria-label={`Slide to compare ${beforeLabel} and ${afterLabel}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            onKeyDown={onKeyDown}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l-4 6 4 6M15 6l4 6-4 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      {hint ? <p className="bislider__hint">{hint}</p> : null}
    </div>
  );
}
