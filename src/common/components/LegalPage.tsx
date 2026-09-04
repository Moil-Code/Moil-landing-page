import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./LegalPage.module.css";

export type LegalSection = {
  heading: string;
  /** Plain text or inline JSX. Newlines in strings are preserved. */
  text: ReactNode;
  /** Block content such as a wide table, rendered after the section copy. */
  block?: ReactNode;
};

export type LegalPageLabels = {
  back?: string;
  lastUpdated?: string;
};

type LegalPageProps = {
  title: string;
  lastUpdated?: string;
  page: string;
  intro?: ReactNode;
  sections?: LegalSection[];
  children?: ReactNode;
  labels?: LegalPageLabels;
};

export default function LegalPage({
  title,
  lastUpdated,
  page,
  intro,
  sections = [],
  children,
  labels,
}: LegalPageProps) {
  const backLabel = labels?.back ?? "Back to Moil";
  const lastUpdatedLabel = labels?.lastUpdated ?? "Last updated";
  const contents = sections.map((section, index) => ({
    id: `section-${index + 1}`,
    label: section.heading,
  }));

  return (
    <main className={styles.root} data-legal-page={page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <Link className={styles.backLink} href="/" aria-label={backLabel}>
            <span aria-hidden="true">←</span> {backLabel}
          </Link>
          <span className={styles.kicker}>LEGAL &amp; COMPLIANCE</span>
          <h1>{title}</h1>
          <div className={styles.heroMeta}>
            {lastUpdated && <span>{lastUpdatedLabel}: {lastUpdated}</span>}
            <span>Moil Enterprise Inc.</span>
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        {contents.length > 0 && (
          <aside className={styles.toc} aria-label="Policy contents">
            <span>ON THIS PAGE</span>
            <nav>
              {contents.map((item) => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}
            </nav>
          </aside>
        )}

        <article className={styles.article}>
          {contents.length > 0 && (
            <details className={styles.mobileToc}>
              <summary>View policy contents <span aria-hidden="true">＋</span></summary>
              <nav>
                {contents.map((item) => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}
              </nav>
            </details>
          )}

          {intro && <div className={styles.intro}>{intro}</div>}

          <div className={styles.sections}>
            {sections.map((section, index) => (
              <section id={`section-${index + 1}`} className={styles.section} key={section.heading}>
                <span className={styles.sectionNumber}>{String(index + 1).padStart(2, "0")}</span>
                <div className={styles.sectionBody}>
                  <h2>{section.heading.replace(/^\d+\.\s*/, "")}</h2>
                  <p>{section.text}</p>
                  {section.block && <div className={styles.block}>{section.block}</div>}
                </div>
              </section>
            ))}
          </div>

          {children && <footer className={styles.related}>{children}</footer>}
        </article>
      </div>
    </main>
  );
}
