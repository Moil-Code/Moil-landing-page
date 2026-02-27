import { useEffect, useRef, useState } from 'react';

import {
  comparisonRows,
  featureCards,
  heroDayData,
  journeySteps,
  pricingPlans,
  stats,
  terminalLines,
  testimonials,
} from '../data';

const heroTypeClass: Record<string, string> = {
  edu: 'type-edu',
  promo: 'type-promo',
  eng: 'type-eng',
  bts: 'type-bts',
  ent: 'type-ent',
};

const heroTypeLabel: Record<string, string> = {
  edu: 'Edu',
  promo: 'Promo',
  eng: 'Engage',
  bts: 'BTS',
  ent: 'Entmt',
};

export function HeroSection() {
  const [heroScore, setHeroScore] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHeroScore(94);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, []);

  const handleSecondaryClick = () => {
    document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openCta = () => {
    window.open('https://moilapp.com/business', '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="hero">
      <div className="hero-grid" />
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      <div className="hero-eyebrow">
        <span className="eyebrow-dot" />
        ⚡ Powered by Moil AI — Trusted by 500+ Businesses in Texas
      </div>

      <h1 className="hero-headline">
        Your Entire Month
        <br />
        of Marketing.
        <br />
        <span className="hl-orange">Built by AI.</span>
        <br />
        <span className="hl-purple">Ready in Minutes.</span>
      </h1>

      <p className="hero-sub">
        Stop guessing. Content360 researches your market, writes every post, generates your visuals, creates AI video — and
        assembles your complete 30-day content calendar automatically.
      </p>

      <div className="hero-ctas">
        <button className="btn-primary" type="button" onClick={openCta}>
          🚀 Get My Free Strategy <span>→</span>
        </button>
        <button className="btn-secondary" type="button" onClick={handleSecondaryClick}>
          ▶ See How It Works
        </button>
      </div>

      <div className="hero-dashboard">
        <div className="dashboard-frame">
          <div className="dashboard-bar">
            <span className="dot dot-r" />
            <span className="dot dot-y" />
            <span className="dot dot-g" />
            <span className="dashboard-title">CONTENT360 — 30-DAY STRATEGY ENGINE</span>
            <div className="dashboard-status">
              <span className="status-dot" /> LIVE
            </div>
          </div>
          <div className="dashboard-body">
            <div className="score-panel">
              <div className="score-label">STRATEGY SCORE</div>
              <div className="score-value">{heroScore}%</div>
              <div className="score-bar">
                <div className="score-fill" style={{ width: `${heroScore}%` }} />
              </div>
            </div>
            {heroDayData.map((day, index) => (
              <div
                key={`${day.type}-${index}`}
                className="day-card"
                style={{ animationDelay: `${index * 0.035}s` }}
              >
                <div className="day-num">{String(index + 1).padStart(2, '0')}</div>
                <div className={`day-type ${heroTypeClass[day.type]}`}>{heroTypeLabel[day.type]}</div>
                <div className="day-img">
                  {day.emoji}
                  {day.video ? <div className="day-video-badge">▶</div> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProblemSection() {
  return (
    <div id="problem">
      <div className="reveal">
        <div className="section-tag">The Reality</div>
        <h2 className="section-headline">
          You're Running
          <br />
          a Business.
          <br />
          Not an <span style={{ color: 'var(--orange)' }}>Agency.</span>
        </h2>
        <p className="problem-quote">
          "Every Monday you tell yourself this week will be different — then a customer calls, a job runs late, and{' '}
          <em>marketing falls through the cracks again.</em>"
        </p>
        <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.75 }}>
          You're posting inconsistently. Using recycled captions. Guessing at what works. While competitors with marketing
          teams show up every single day — building trust, building brand, building revenue.
        </p>
        <br />
        <div
          style={{
            height: 1,
            background: 'linear-gradient(90deg,var(--orange),transparent)',
            width: 72,
            marginBottom: 20,
            opacity: 0.6,
          }}
        />
        <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--orange)', letterSpacing: 2, textTransform: 'uppercase' }}>
          There is a better way →
        </p>
      </div>
      <div className="reveal reveal-delay-2">
        <div className="chaos-calendar">
          <div className="chaos-title">
            <span>YOUR CURRENT MONTH</span>
            <span style={{ color: '#EF4444', fontSize: 9 }}>● 8 missed days</span>
          </div>
          <div className="chaos-grid">
            <div className="chaos-day empty" />
            <div className="chaos-day done">
              <span>1</span>
              <span className="chaos-label">✓</span>
            </div>
            <div className="chaos-day missed">
              <span>2</span>
              <span className="chaos-x">✗</span>
            </div>
            <div className="chaos-day missed">
              <span>3</span>
              <span className="chaos-x">✗</span>
            </div>
            <div className="chaos-day late">
              <span>4</span>
              <span className="chaos-label" style={{ color: 'var(--purple-light)' }}>
                11pm
              </span>
            </div>
            <div className="chaos-day missed">
              <span>5</span>
              <span className="chaos-x">✗</span>
            </div>
            <div className="chaos-day missed">
              <span>6</span>
              <span className="chaos-x">✗</span>
            </div>
            <div className="chaos-day done">
              <span>7</span>
              <span className="chaos-label">✓</span>
            </div>
            <div className="chaos-day missed">
              <span>8</span>
              <span className="chaos-x">✗</span>
            </div>
            <div className="chaos-day late">
              <span>9</span>
              <span className="chaos-label" style={{ color: 'var(--purple-light)' }}>
                reused
              </span>
            </div>
            <div className="chaos-day done">
              <span>10</span>
              <span className="chaos-label">✓</span>
            </div>
            <div className="chaos-day missed">
              <span>11</span>
              <span className="chaos-x">✗</span>
            </div>
            <div className="chaos-day missed">
              <span>12</span>
              <span className="chaos-x">✗</span>
            </div>
            <div className="chaos-day missed">
              <span>13</span>
              <span className="chaos-x">✗</span>
            </div>
            <div className="chaos-day done">
              <span>14</span>
              <span className="chaos-label">✓</span>
            </div>
            <div className="chaos-day empty" />
            <div className="chaos-day empty" />
            <div className="chaos-day empty" />
            <div className="chaos-day empty" />
            <div className="chaos-day empty" />
          </div>
          <div className="chaos-note">⚠ Last post was 11 days ago. Engagement down 67%.</div>
        </div>
      </div>
    </div>
  );
}

export function SolutionSection() {
  const [activeLines, setActiveLines] = useState(0);
  const [progressActive, setProgressActive] = useState(false);
  const [progressScore, setProgressScore] = useState(0);
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const timeoutIds = useRef<number[]>([]);
  const intervalIds = useRef<number[]>([]);

  useEffect(() => {
    const ref = terminalRef.current;
    if (!ref) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          terminalLines.forEach((_, idx) => {
            const timer = window.setTimeout(() => {
              setActiveLines(idx + 1);
            }, idx * 380);
            timeoutIds.current.push(timer);
          });
          const progressDelay = terminalLines.length * 380 + 400;
          const progressTimer = window.setTimeout(() => {
            setProgressActive(true);
            let current = 0;
            const prTimer = window.setInterval(() => {
              current += 2;
              if (current >= 94) {
                current = 94;
                window.clearInterval(prTimer);
                intervalIds.current = intervalIds.current.filter((id) => id !== prTimer);
              }
              setProgressScore(current);
            }, 48);
            intervalIds.current.push(prTimer);
          }, progressDelay);
          timeoutIds.current.push(progressTimer);
          observer.disconnect();
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(ref);
    return () => {
      observer.disconnect();
      timeoutIds.current.forEach((timer) => window.clearTimeout(timer));
      intervalIds.current.forEach((timer) => window.clearInterval(timer));
      timeoutIds.current = [];
      intervalIds.current = [];
    };
  }, []);

  return (
    <section id="solution" style={{ textAlign: 'center' }}>
      <div className="reveal section-tag" style={{ justifyContent: 'center' }}>
        The Solution
      </div>
      <h2 className="section-headline reveal">
        Meet Your <span style={{ color: 'var(--orange)' }}>AI Marketing</span>
        <br />
        Department.
      </h2>
      <p className="section-sub reveal" style={{ margin: '0 auto', textAlign: 'center' }}>
        Watch Content360 assemble a real 30-day strategy — live — based on your actual business and real market data.
      </p>

      <div className="ai-terminal reveal" ref={terminalRef}>
        <div className="terminal-header">
          <span className="dot dot-r" />
          <span className="dot dot-y" />
          <span className="dot dot-g" />
          <span className="terminal-title">CONTENT360 VANGUARD ENGINE — STRATEGY ASSEMBLY IN PROGRESS</span>
        </div>
        <div className="terminal-body">
          {terminalLines.map((line, idx) => (
            <div key={line.key} className={`terminal-line ${activeLines > idx ? 'active' : ''}`}>
              <span className="t-prompt">▶</span>
              <span className="t-key">{line.key}</span>
              <span className="t-val">{line.value}</span>
              <span className={`t-status ${line.statusClass === 'running' ? 'running' : line.statusClass === 'accent' ? 'accent' : ''}`}>
                {line.status}
              </span>
            </div>
          ))}
          <div className={`progress-bar-wrap ${progressActive ? 'active' : ''}`}>
            <span className="progress-label">STRATEGY HEALTH</span>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: progressActive ? '94%' : 0 }} />
            </div>
            <span className="progress-score">{progressScore}%</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function JourneySection() {
  return (
    <section id="how">
      <div className="section-tag reveal">Your Journey</div>
      <h2 className="section-headline reveal">
        From 21 Questions
        <br />
        to <span style={{ color: 'var(--orange)' }}>Total Domination.</span>
      </h2>
      <p className="section-sub reveal">
        Every step automated. Every output professional. Every decision backed by real market data — not gut feelings.
      </p>

      <div className="steps-timeline">
        {journeySteps.map((step, idx) => (
          <div key={step.number} className={`step-item reveal ${idx ? 'reveal-delay-1' : ''}`}>
            <div className="step-num">{step.number}</div>
            <div>
              <span
                className="step-time"
                style={
                  step.badge
                    ? { background: 'var(--orange-dim)', color: 'var(--orange)', borderColor: 'rgba(255,92,26,0.4)' }
                    : undefined
                }
              >
                {step.time}
              </span>
              <div className="step-title">{step.title}</div>
              <p className="step-desc">{step.description}</p>
              <div className="step-outputs">
                {step.outputs.map((output) => (
                  <span key={output} className="output-chip">
                    {output}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const enPost =
  "🔧 <strong>The $200/Hour Technician</strong><br><br>Your HVAC tech isn't just fixing AC units — they're running a profit center on wheels.<br><br>Here's how top service businesses price their premium tier...<br><br>#HVAC #ServiceBusiness #Austin";
const esPost =
  '🔧 <strong>El Técnico de $200/Hora</strong><br><br>Tu técnico de HVAC no solo repara unidades de AC — está manejando un centro de ganancias sobre ruedas.<br><br>Así es como los negocios de servicio establecen su nivel premium...<br><br>#HVAC #NegociosDeServicio #Austin';

export function FeaturesSection() {
  const [lang, setLang] = useState<'en' | 'es'>('en');

  return (
    <section id="features">
      <div className="section-tag reveal">Content360 Deep Dive</div>
      <h2 className="section-headline reveal">
        Every Feature.
        <br />
        <span style={{ color: 'var(--orange)' }}>Done Right.</span>
      </h2>

      <div className="features-grid">
        {featureCards.map((card) => {
          if (card.variant === 'large') {
            return (
              <div key={card.title} className="feature-card large reveal">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'center' }}>
                  <div>
                    <div className="feature-icon">{card.icon}</div>
                    <div className="feature-title">{card.title}</div>
                    <p className="feature-desc">{card.description}</p>
                    <div className="feature-tags" style={{ marginTop: 14 }}>
                      {card.tags?.map((tag) => (
                        <span key={tag.label} className={tag.className}>
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                    <div
                      style={{
                        background: 'var(--border)',
                        padding: '9px 14px',
                        fontFamily: 'var(--mono)',
                        fontSize: 9,
                        color: 'var(--text3)',
                        textTransform: 'uppercase',
                        letterSpacing: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span>POST PREVIEW</span>
                      <div style={{ display: 'flex', gap: 3 }}>
                        <button
                          className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                          type="button"
                          onClick={() => setLang('en')}
                          style={{ cursor: 'pointer', borderRadius: 4 }}
                        >
                          EN
                        </button>
                        <button
                          className={`lang-btn ${lang === 'es' ? 'active' : ''}`}
                          type="button"
                          onClick={() => setLang('es')}
                          style={{ cursor: 'pointer', borderRadius: 4 }}
                        >
                          ES
                        </button>
                      </div>
                    </div>
                    <div style={{ padding: 16 }}>
                      <p
                        style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.65 }}
                        dangerouslySetInnerHTML={{ __html: lang === 'en' ? enPost : esPost }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={card.title} className="feature-card reveal">
              <div className="feature-icon">{card.icon}</div>
              <div className="feature-title">{card.title}</div>
              <p className="feature-desc">{card.description}</p>
              <div className="feature-tags">
                {card.tags?.map((tag) => (
                  <span key={tag.label} className={tag.className}>
                    {tag.label}
                  </span>
                ))}
              </div>
              {card.title === 'The 30-Day Calendar' ? (
                <div className="mini-calendar-demo">
                  {['Edu', 'Promo', 'Engage', 'BTS', 'Entmt'].map((label, idx) => (
                    <div key={label} className="mini-cal-card">
                      <div className="mcc-day">{String(idx + 1).padStart(2, '0')}</div>
                      <div
                        className="mcc-bar"
                        style={{
                          background:
                            label === 'Edu'
                              ? '#60A5FA'
                              : label === 'Promo'
                              ? 'linear-gradient(90deg, var(--orange), var(--purple))'
                              : label === 'Engage'
                              ? 'var(--green)'
                              : label === 'BTS'
                              ? 'var(--purple)'
                              : '#C084FC',
                        }}
                      />
                      <div
                        className="mcc-label"
                        style={{
                          color:
                            label === 'Edu'
                              ? '#60A5FA'
                              : label === 'Promo'
                              ? 'var(--orange)'
                              : label === 'Engage'
                              ? '#34D399'
                              : label === 'BTS'
                              ? 'var(--purple-light)'
                              : '#C084FC',
                        }}
                      >
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
              {card.title === 'AI Visuals + Video' ? (
                <div
                  style={{
                    marginTop: 18,
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    padding: 14,
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: 56,
                      borderRadius: 6,
                      background: 'linear-gradient(135deg,var(--orange-dim),var(--purple-dim))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                    }}
                  >
                    🔧
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>→</div>
                  <div
                    style={{
                      flex: 1,
                      height: 56,
                      borderRadius: 6,
                      background: 'linear-gradient(135deg,var(--blue-dim),rgba(16,185,129,0.15))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      color: 'var(--text2)',
                      fontFamily: 'var(--mono)',
                      textAlign: 'center',
                      padding: 4,
                    }}
                  >
                    AI VISUAL
                    <br />
                    GENERATED ✓
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function StatsSection() {
  return (
    <div id="stats">
      <div className="stats-inner">
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div className="section-tag reveal" style={{ justifyContent: 'center' }}>
            Proven Results
          </div>
          <h2 className="section-headline reveal" style={{ fontSize: 'clamp(32px,5vw,56px)' }}>
            Numbers Don't Lie.
          </h2>
        </div>
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={stat.label} className={`stat-item reveal ${idx ? `reveal-delay-${Math.min(idx, 4)}` : ''}`}>
              <div
                className="stat-value"
                data-target={stat.target}
                data-suffix={stat.suffix || ''}
                data-prefix={stat.prefix || ''}
              >
                0
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PricingSection() {
  return (
    <section id="pricing" style={{ textAlign: 'center' }}>
      <div className="section-tag reveal" style={{ justifyContent: 'center' }}>
        Simple Pricing
      </div>
      <h2 className="section-headline reveal">
        A Full Marketing Team.
        <br />
        <span style={{ color: 'var(--orange)' }}>For Less Than Netflix.</span>
      </h2>
      <p className="pricing-intro reveal">
        "A marketing agency, a business consultant, a recruiter, and a 24/7 AI coach — <strong>all in one platform</strong>,
        starting at fifteen dollars a month."
      </p>
      <div className="annual-badge reveal">✓ Save up to 25% with annual billing</div>

      <div className="pricing-grid">
        {pricingPlans.map((plan, idx) => (
          <div
            key={plan.tier}
            className={`price-card reveal ${plan.featured ? 'featured' : ''} ${idx ? `reveal-delay-${idx}` : ''}`}
          >
            {plan.featured ? <span className="featured-badge">⭐ BEST VALUE</span> : null}
            <div className="price-tier">{plan.tier}</div>
            <p className="price-tagline">{plan.tagline}</p>
            <div className="price-amount">
              <span className={`price-dollar ${plan.featured ? 'featured-price' : ''}`}>{plan.price}</span>
              <span className="price-period">{plan.period}</span>
            </div>
            <div className="price-divider" />
            <ul className="price-features">
              {plan.features.map((feature) => (
                <li key={feature.text}>
                  <span className={feature.icon === 'star' ? 'star' : 'check'}>
                    {feature.icon === 'star' ? '★' : '✓'}
                  </span>
                  {feature.text}
                </li>
              ))}
            </ul>
            <a
              href={plan.ctaHref}
              target="_blank"
              rel="noreferrer"
              className={`price-cta ${plan.ctaClass}`}
            >
              {plan.ctaLabel}
            </a>
          </div>
        ))}
      </div>

      <div className="trust-row" style={{ marginTop: 40 }}>
        {['30-Day Guarantee', 'No Setup Fees', 'Cancel Anytime', 'SOC 2 Compliant', 'Bilingual EN/ES'].map((item) => (
          <div key={item} className="trust-item">
            <span className="tick">✓</span> {item}
          </div>
        ))}
      </div>
    </section>
  );
}

export function ComparisonSection() {
  return (
    <section id="comparison">
      <div className="section-tag reveal">The Real Comparison</div>
      <h2 className="section-headline reveal">
        Moil vs.
        <br />
        <span style={{ color: 'var(--orange)' }}>Everything Else.</span>
      </h2>
      <p className="section-sub reveal">
        Traditional consultants and generic AI tools both fall short of what Moil delivers — for a fraction of the price.
      </p>
      <div className="table-wrap reveal">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th className="moil-col">
                <div className="compare-header-moil">
                  MOIL <span className="moil-best-badge">BEST</span>
                </div>
              </th>
              <th>Traditional Consultant</th>
              <th>Generic AI Tool</th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.feature}>
                <td>{row.feature}</td>
                <td className={`moil-col ${row.moilHighlight ? 'highlight' : ''}`}>
                  {row.moil === 'check' ? <span className="check-yes">✓</span> : row.moil}
                </td>
                <td>
                  {row.consultant.startsWith('check') ? (
                    <>
                      <span className="check-yes">✓</span>{' '}
                      <span style={{ fontSize: 10, color: 'var(--text3)' }}>
                        {row.consultant.replace('check ', '')}
                      </span>
                    </>
                  ) : row.consultant === 'x' ? (
                    <span className="check-no">✗</span>
                  ) : (
                    <span className="check-partial">{row.consultant}</span>
                  )}
                </td>
                <td>
                  {row.aiTool === 'check' ? (
                    <span className="check-yes">✓</span>
                  ) : row.aiTool === 'x' ? (
                    <span className="check-no">✗</span>
                  ) : (
                    <span className="check-partial">{row.aiTool}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" style={{ textAlign: 'center' }}>
      <div className="section-tag reveal" style={{ justifyContent: 'center' }}>
        Real Businesses. Real Results.
      </div>
      <h2 className="section-headline reveal">
        500+ Businesses
        <br />
        <span style={{ color: 'var(--orange)' }}>Can't Be Wrong.</span>
      </h2>

      <div className="testimonials-grid">
        {testimonials.map((testimonial, idx) => (
          <div key={testimonial.name} className={`testimonial-card reveal ${idx ? `reveal-delay-${idx}` : ''}`}>
            <span className="t-quote-mark">"</span>
            <div className="t-stars">★★★★★</div>
            <p className="t-text">{testimonial.text}</p>
            <div className="t-divider" />
            <div className="t-author">
              <div className="t-avatar" style={{ background: testimonial.gradient }}>
                {testimonial.avatar}
              </div>
              <div>
                <div className="t-name">{testimonial.name}</div>
                <div className="t-role">{testimonial.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FinalCtaSection() {
  const openCta = () => {
    window.open('https://moilapp.com/business', '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="final-cta"
      style={{
        maxWidth: '100%',
        padding: '100px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '90svh',
      }}
    >
      <div className="final-bg" />
      <div className="final-grid" />
      <p className="final-eyebrow reveal">While you're reading this...</p>
      <h2 className="final-headline reveal">
        Your Competitors
        <br />
        Are Posting
        <br />
        <span className="line-purple">Right Now.</span>
      </h2>
      <p className="final-sub reveal">
        Another business just got their 30-day strategy, their AI visuals, and their hiring pipeline — all in one session. Data-backed.
        Brand-aligned. Done.
      </p>
      <button className="final-cta-btn reveal" type="button" onClick={openCta}>
        🚀 Start Your AI Strategy — Free <span>→</span>
      </button>
      <div className="trust-row reveal reveal-delay-1">
        {['🔒 Secure', '30-Day Guarantee', 'No Setup Fees', 'Cancel Anytime'].map((item) => (
          <div key={item} className="trust-item">
            <span className="tick">✓</span> {item}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 60, position: 'relative', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8 }}>
          Trusted by 500+ businesses
        </div>
        <div style={{ color: 'var(--purple-light)', fontSize: 16, letterSpacing: 2 }}>★★★★★</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', marginTop: 6 }}>
          5,000+ jobs posted · 94% interview success
        </div>
      </div>
    </section>
  );
}
