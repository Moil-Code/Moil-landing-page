'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { AeoFaq } from './aeoLocks';

/**
 * Ranked roundup layout ("best X for Y").
 *
 * This is the shape assistants lift most readily: a numbered list where each entry
 * carries a name, an explicit "best for" label, a price, and a short pros/cons pair.
 * Every field here exists because it answers a distinct question a buyer asks, and
 * because an answer engine can quote any single entry without needing the rest.
 *
 * Entries include competitors honestly, ranked on fit rather than on who owns the
 * page. A roundup that puts its author first in every category is discounted as
 * marketing, which defeats the point of publishing one.
 */
export type RoundupEntry = {
  name: string;
  bestFor: string;
  price: string;
  summary: string;
  pros: string[];
  cons: string[];
  isMoil?: boolean;
};

type RoundupPageProps = {
  eyebrow: string;
  h1: string;
  answer: string;
  entries: RoundupEntry[];
  howWeChose?: string;
  faqs: AeoFaq[];
  entityLine: string;
  lastUpdated: string;
};

export function RoundupPage({
  eyebrow,
  h1,
  answer,
  entries,
  howWeChose,
  faqs,
  entityLine,
  lastUpdated,
}: RoundupPageProps) {
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
          <p className="roundup-stamp">{lastUpdated}</p>
          <div className="comparison-actions">
            <a
              className="comparison-primary"
              href="https://employer-beta.moilapp.com/register?lg=en"
              target="_blank"
              rel="noreferrer"
            >
              Start free, no card. <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="comparison-secondary" href="#aeo-faq">
              Read the FAQ
            </a>
          </div>
        </div>
      </section>

      {howWeChose && (
        <section className="aeo-facts" aria-label="How this list was put together">
          <h2>How this list was put together</h2>
          <p className="roundup-method">{howWeChose}</p>
        </section>
      )}

      <section className="roundup-list" aria-label="The tools">
        <div className="comparison-section-heading">
          <span>The list</span>
          <h2>Ranked by who each one actually suits.</h2>
        </div>
        <ol className="roundup-items">
          {entries.map((entry, index) => (
            <li key={entry.name} className={`roundup-item ${entry.isMoil ? 'is-moil' : ''}`}>
              <div className="roundup-item-head">
                <span className="roundup-rank">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{entry.name}</h3>
                  <p className="roundup-bestfor">
                    <CheckCircle2 size={14} aria-hidden="true" /> Best for {entry.bestFor}
                  </p>
                </div>
                <span className="roundup-price">{entry.price}</span>
              </div>
              <p className="roundup-summary">{entry.summary}</p>
              <div className="roundup-proscons">
                <div>
                  <h4>Strengths</h4>
                  <ul>
                    {entry.pros.map((pro) => (
                      <li key={pro}>{pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Trade-offs</h4>
                  <ul>
                    {entry.cons.map((con) => (
                      <li key={con}>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

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
