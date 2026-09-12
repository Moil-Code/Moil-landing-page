"use client";

import type { ReactNode } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { useLanguageContext } from "../../../common/components/I18nProvider";
import { buildCandidateUrl } from "../../utils/urlBuilder";
import styles from "./landing.module.css";

export { styles };
export type CandidateSectionProps = { refQuery?: string; lgQuery?: string };
export function useCandidateCopy() {
  const { lang } = useLanguageContext();
  return (en: string, es: string) => (lang === "es" ? es : en);
}
export function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.label}>
      <span>{number}</span>
      <span>{children}</span>
    </div>
  );
}
export function CandidateCTA({
  children,
  refQuery,
  lgQuery,
  orange = false,
}: CandidateSectionProps & { children: ReactNode; orange?: boolean }) {
  return (
    <a
      className={`${styles.button} ${orange ? styles.orangeButton : ""}`}
      href={buildCandidateUrl({ ref: refQuery, lg: lgQuery })}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </a>
  );
}
export function Checklist({ items }: { items: string[] }) {
  return (
    <ul className={styles.checklist}>
      {items.map((item) => (
        <li key={item}>
          <Check size={17} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
