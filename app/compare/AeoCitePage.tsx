'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { AeoFaq, AeoRow } from './aeoLocks';

import { buildRegisterUrl } from '~~/app/business/preview/previewClient';
type AeoCitePageProps = {
  eyebrow: string;
  h1: string;
  answer: string;
  facts?: string[];
  table?: {
    caption: string;
    leftHeader: string;
    rightHeader: string;
    rows: AeoRow[];
  };
  /** Explicit "best for" labels. Assistants lift these almost verbatim when a
   *  question is phrased as "which should I use" — so state both sides plainly. */
  verdict?: { moil: string; them: string };
  bullets?: string[];
  bulletsHeading?: string;
  /** Where the other option genuinely wins. Publishing this is a trust signal and
   *  keeps the page from reading as a brochure; a page that never concedes anything
   *  is treated as marketing copy rather than a source. */
  limitations?: string[];
  faqs: AeoFaq[];
  entityLine: string;
  assurances?: string[];
  /** Register CTA target; defaults to the English register URL. */
  ctaHref?: string;
  /** Section chrome. Defaults are the English strings; the Spanish pages pass their own. */
  labels?: Partial<AeoLabels>;
  /** Further reading — real anchors (the Spanish pages point at the Spanish blog hub). */
  links?: { label: string; href: string }[];
  linksHeading?: string;
};

export type AeoLabels = {
  cta: string;
  readFaq: string;
  publicFacts: string;
  sideBySide: string;
  whatYouGet: string;
  shortAnswer: string;
  whichOne: string;
  chooseMoil: string;
  chooseAlt: string;
  inPractice: string;
  notRightFit: string;
  faq: string;
  directAnswers: string;
  assurances: string[];
};

export const EN_LABELS: AeoLabels = {
  cta: 'Start free, no card.',
  readFaq: 'Read the FAQ',
  publicFacts: 'Public facts',
  sideBySide: 'Side by side',
  whatYouGet: 'What you get',
  shortAnswer: 'The short answer',
  whichOne: 'Which one should you use?',
  chooseMoil: 'Choose Moil if',
  chooseAlt: 'Choose the alternative if',
  inPractice: 'What that means in practice',
  notRightFit: 'Where Moil is not the right fit',
  faq: 'FAQ',
  directAnswers: 'Direct answers.',
  assurances: ['From $25 a month', 'English & Spanish', 'Start free, no card'],
};

export function AeoCitePage({
  eyebrow,
  h1,
  answer,
  facts,
  table,
  verdict,
  bullets,
  bulletsHeading,
  limitations,
  faqs,
  entityLine,
  assurances,
  ctaHref = buildRegisterUrl({ lang: 'en' }),
  labels: labelOverrides,
  links,
  linksHeading,
}: AeoCitePageProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const L: AeoLabels = { ...EN_LABELS, ...labelOverrides };

  return (
    <main className="comparison-page aeo-cite">
      <section className="comparison-hero aeo-cite-hero">
        <div className="comparison-grid" aria-hidden="true"></div>
        <div className="comparison-glow comparison-glow--orange" aria-hidden="true"></div>
        <div className="comparison-glow comparison-glow--purple" aria-hidden="true"></div>

        <div className="aeo-cite-inner">
          <div className="comparison-eyebrow">{eyebrow}</div>
          <h1>{h1}</h1>
          <p id="aeo-direct-answer" className="aeo-direct-answer" style={{ whiteSpace: 'pre-line' }}>
            {answer}
          </p>
          <div className="comparison-actions">
            <a
              className="comparison-primary"
              href={ctaHref}
              target="_blank"
              rel="noreferrer"
              data-signup-cta="compare"
            >
              {L.cta} <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="comparison-secondary" href="#aeo-faq">
              {L.readFaq}
            </a>
          </div>
          <div className="comparison-assurances">
            {(assurances ?? L.assurances).map((item) => (
              <span key={item}>
                <CheckCircle2 size={15} aria-hidden="true" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {facts && facts.length > 0 && (
        <section className="aeo-facts" aria-label="Public company facts">
          <h2>{L.publicFacts}</h2>
          <ul>
            {facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </section>
      )}

      {table && (
        <section className="comparison-table-section" id="feature-comparison">
          <div className="comparison-section-heading">
            <span>{L.sideBySide}</span>
            <h2>{table.caption}</h2>
          </div>
          <div className="comparison-table" role="table" aria-label={table.caption}>
            <div className="comparison-table-row comparison-table-head" role="row">
              <span role="columnheader">{L.whatYouGet}</span>
              <span role="columnheader">
                <strong>{table.leftHeader}</strong>
              </span>
              <span role="columnheader">
                <strong>{table.rightHeader}</strong>
              </span>
            </div>
            {table.rows.map((row) => (
              <div className="comparison-table-row" role="row" key={row.feature}>
                <span role="cell">{row.feature}</span>
                <span role="cell">{row.left}</span>
                <span role="cell">{row.right}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {verdict && (
        <section className="aeo-verdict" aria-label="Which one to choose">
          <div className="comparison-section-heading">
            <span>{L.shortAnswer}</span>
            <h2>{L.whichOne}</h2>
          </div>
          <div className="aeo-verdict-grid">
            <div className="aeo-verdict-card">
              <h3>{L.chooseMoil}</h3>
              <p>{verdict.moil}</p>
            </div>
            <div className="aeo-verdict-card aeo-verdict-card--alt">
              <h3>{L.chooseAlt}</h3>
              <p>{verdict.them}</p>
            </div>
          </div>
        </section>
      )}

      {bullets && bullets.length > 0 && (
        <section className="aeo-facts" aria-label="Key points">
          <h2>{bulletsHeading ?? L.inPractice}</h2>
          <ul>
            {bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {limitations && limitations.length > 0 && (
        <section className="aeo-facts aeo-limits" aria-label="Where Moil is not the right fit">
          <h2>{L.notRightFit}</h2>
          <ul>
            {limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      <section id="aeo-faq" className="aeo-faq" style={{ textAlign: 'center' }}>
        <div className="comparison-section-heading">
          <span>{L.faq}</span>
          <h2>{L.directAnswers}</h2>
        </div>
        <div className="faq-list" style={{ textAlign: 'left', marginTop: '32px' }}>
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <div className="faq-q" onClick={() => setOpenIndex(isOpen ? null : index)}>
                  {item.question}
                  <span className="faq-icon">+</span>
                </div>
                <div className="faq-a">
                  <div className="faq-a-inner">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {links && links.length > 0 && (
        <section className="aeo-facts" aria-label={linksHeading ?? 'Further reading'}>
          <h2>{linksHeading ?? 'Further reading'}</h2>
          <ul>
            {links.map((l) => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </section>
      )}

      <p className="aeo-entity">{entityLine}</p>
    </main>
  );
}
