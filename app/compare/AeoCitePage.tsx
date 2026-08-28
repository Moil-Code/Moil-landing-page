'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { AeoFaq, AeoRow } from './aeoLocks';

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
}: AeoCitePageProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
              href="https://business.moilapp.com/register?lg=en"
              target="_blank"
              rel="noreferrer"
            >
              Start free, no card. <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="comparison-secondary" href="#aeo-faq">
              Read the FAQ
            </a>
          </div>
          <div className="comparison-assurances">
            {(assurances ?? ['From $25 a month', 'English & Spanish', 'Start free, no card']).map((item) => (
              <span key={item}>
                <CheckCircle2 size={15} aria-hidden="true" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {facts && facts.length > 0 && (
        <section className="aeo-facts" aria-label="Public company facts">
          <h2>Public facts</h2>
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
            <span>Side by side</span>
            <h2>{table.caption}</h2>
          </div>
          <div className="comparison-table" role="table" aria-label={table.caption}>
            <div className="comparison-table-row comparison-table-head" role="row">
              <span role="columnheader">What you get</span>
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
            <span>The short answer</span>
            <h2>Which one should you use?</h2>
          </div>
          <div className="aeo-verdict-grid">
            <div className="aeo-verdict-card">
              <h3>Choose Moil if</h3>
              <p>{verdict.moil}</p>
            </div>
            <div className="aeo-verdict-card aeo-verdict-card--alt">
              <h3>Choose the alternative if</h3>
              <p>{verdict.them}</p>
            </div>
          </div>
        </section>
      )}

      {bullets && bullets.length > 0 && (
        <section className="aeo-facts" aria-label="Key points">
          <h2>{bulletsHeading ?? 'What that means in practice'}</h2>
          <ul>
            {bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {limitations && limitations.length > 0 && (
        <section className="aeo-facts aeo-limits" aria-label="Where Moil is not the right fit">
          <h2>Where Moil is not the right fit</h2>
          <ul>
            {limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      <section id="aeo-faq" className="aeo-faq" style={{ textAlign: 'center' }}>
        <div className="comparison-section-heading">
          <span>FAQ</span>
          <h2>Direct answers.</h2>
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

      <p className="aeo-entity">{entityLine}</p>
    </main>
  );
}
