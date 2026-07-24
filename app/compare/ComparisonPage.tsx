import Image from 'next/image';
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  FileOutput,
  Languages,
  MessageSquareText,
  Sparkles,
  Workflow,
  X,
  Zap,
} from 'lucide-react';

export type ComparisonRow = {
  feature: string;
  moil: boolean;
  competitor: boolean;
};

type ComparisonPageProps = {
  competitor: string;
  competitorCategory: string;
  bannerSrc: string;
  bannerAlt: string;
  rows: ComparisonRow[];
};

function Availability({ available }: { available: boolean }) {
  const Icon = available ? Check : X;

  return (
    <span className={`comparison-status ${available ? 'is-available' : 'is-unavailable'}`}>
      <Icon size={17} strokeWidth={2.5} aria-hidden="true" />
      <span className="sr-only">{available ? 'Included' : 'Not included'}</span>
    </span>
  );
}

export function ComparisonPage({
  competitor,
  competitorCategory,
  bannerSrc,
  bannerAlt,
  rows,
}: ComparisonPageProps) {
  return (
    <main className="comparison-page">
      <section className="comparison-hero">
        <div className="comparison-grid" aria-hidden="true"></div>
        <div className="comparison-glow comparison-glow--orange" aria-hidden="true"></div>
        <div className="comparison-glow comparison-glow--purple" aria-hidden="true"></div>

        <div className="comparison-hero-inner">
          <div className="comparison-hero-copy">
            <div className="comparison-eyebrow">
              <Sparkles size={15} aria-hidden="true" />
              Small-business AI, compared
            </div>
            <h1>
              Your AI can answer questions.
              <span> Or help run the business.</span>
            </h1>
            <p>
              {competitor} is a capable {competitorCategory}. Moil is a connected AI co-founder built to move a small
              business from idea to execution — with research, planning, content, and hiring in one workspace.
            </p>
            <div className="comparison-actions">
              <a className="comparison-primary" href="https://business.moilapp.com/register?lg=en" target="_blank" rel="noreferrer">
                Start with Moil <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a className="comparison-secondary" href="#feature-comparison">
                See the full comparison
              </a>
            </div>
            <div className="comparison-assurances">
              <span><CheckCircle2 size={15} aria-hidden="true" /> Free to start</span>
              <span><CheckCircle2 size={15} aria-hidden="true" /> No credit card</span>
              <span><CheckCircle2 size={15} aria-hidden="true" /> Bilingual EN/ES</span>
            </div>
          </div>

          <div className="comparison-visual">
            <div className="comparison-visual-bar">
              <span><i></i><i></i><i></i></span>
              <strong>Decision brief</strong>
              <span className="comparison-live"><i></i> Live</span>
            </div>
            <div className="comparison-image-wrap">
              <Image src={bannerSrc} alt={bannerAlt} fill priority sizes="(max-width: 960px) 100vw, 48vw" />
            </div>
            <div className="comparison-visual-foot">
              <span><Workflow size={15} aria-hidden="true" /> One connected workflow</span>
              <span>Moil vs {competitor}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="comparison-snapshot" aria-label="Comparison summary">
        <article>
          <span className="comparison-snapshot-icon"><MessageSquareText size={20} aria-hidden="true" /></span>
          <div>
            <small>{competitor}</small>
            <strong>Starts with a prompt</strong>
            <p>Flexible conversation for broad, general-purpose tasks.</p>
          </div>
        </article>
        <article className="is-featured">
          <span className="comparison-snapshot-icon"><Zap size={20} aria-hidden="true" /></span>
          <div>
            <small>Moil</small>
            <strong>Starts with your business</strong>
            <p>Structured workflows that carry your context into finished work.</p>
          </div>
        </article>
        <article>
          <span className="comparison-snapshot-icon"><FileOutput size={20} aria-hidden="true" /></span>
          <div>
            <small>The practical difference</small>
            <strong>Advice vs. execution</strong>
            <p>Moil connects the answer to the next business action.</p>
          </div>
        </article>
      </section>

      <section className="comparison-table-section" id="feature-comparison">
        <div className="comparison-section-heading">
          <span>Capability matrix</span>
          <h2>What each platform is built to deliver.</h2>
          <p>
            A focused look at the workflows small-business owners need most — from validating the market to hiring the
            people who help serve it.
          </p>
        </div>

        <div className="comparison-table" role="table" aria-label={`Moil and ${competitor} feature comparison`}>
          <div className="comparison-table-row comparison-table-head" role="row">
            <span role="columnheader">Business capability</span>
            <span role="columnheader"><strong>Moil</strong><small>AI co-founder</small></span>
            <span role="columnheader"><strong>{competitor}</strong><small>{competitorCategory}</small></span>
          </div>
          {rows.map((row) => (
            <div className="comparison-table-row" role="row" key={row.feature}>
              <span role="cell">{row.feature}</span>
              <span role="cell"><Availability available={row.moil} /></span>
              <span role="cell"><Availability available={row.competitor} /></span>
            </div>
          ))}
        </div>
      </section>

      <section className="comparison-difference">
        <div className="comparison-section-heading">
          <span>The deciding difference</span>
          <h2>Moil is designed around the work after the answer.</h2>
        </div>
        <div className="comparison-difference-grid">
          <article>
            <div className="comparison-card-top">
              <span><MessageSquareText size={20} aria-hidden="true" /></span>
              <small>{competitor}</small>
            </div>
            <h3>A smart conversation</h3>
            <p>You shape the prompt, organize the output, and move it into the other tools that run your business.</p>
            <ul>
              <li><Check size={16} aria-hidden="true" /> Broad general knowledge</li>
              <li><Check size={16} aria-hidden="true" /> Flexible drafting and ideation</li>
              <li><X size={16} aria-hidden="true" /> You assemble the operating workflow</li>
            </ul>
          </article>
          <article className="is-moil">
            <div className="comparison-card-top">
              <span><Sparkles size={20} aria-hidden="true" /></span>
              <small>Moil</small>
            </div>
            <h3>A connected business system</h3>
            <p>Your business context carries from research into plans, assets, content, financials, and hiring.</p>
            <ul>
              <li><BarChart3 size={16} aria-hidden="true" /> Research grounded in real sources</li>
              <li><Workflow size={16} aria-hidden="true" /> Purpose-built, repeatable workflows</li>
              <li><Languages size={16} aria-hidden="true" /> English and Spanish from day one</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="comparison-cta">
        <div>
          <span className="comparison-eyebrow"><Sparkles size={15} aria-hidden="true" /> Built for owners who execute</span>
          <h2>Keep the conversation. Add the operating system.</h2>
          <p>Start turning your business context into research, strategy, content, and a stronger team.</p>
        </div>
        <a href="https://business.moilapp.com/register?lg=en" target="_blank" rel="noreferrer">
          Start free <ArrowRight size={19} aria-hidden="true" />
        </a>
      </section>
    </main>
  );
}
