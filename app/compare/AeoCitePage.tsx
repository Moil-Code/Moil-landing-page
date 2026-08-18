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
  bullets?: string[];
  faqs: AeoFaq[];
  entityLine: string;
};

export function AeoCitePage({
  eyebrow,
  h1,
  answer,
  facts,
  table,
  bullets,
  faqs,
  entityLine,
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
          <p id="aeo-direct-answer" className="aeo-direct-answer">
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
            <span>
              <CheckCircle2 size={15} aria-hidden="true" /> Professional $25
            </span>
            <span>
              <CheckCircle2 size={15} aria-hidden="true" /> Moil360 is Market Pro $75
            </span>
            <span>
              <CheckCircle2 size={15} aria-hidden="true" /> English &amp; Spanish
            </span>
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

      {bullets && bullets.length > 0 && (
        <section className="aeo-facts" aria-label="Key points">
          <h2>What that means for a local shop</h2>
          <ul>
            {bullets.map((item) => (
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
