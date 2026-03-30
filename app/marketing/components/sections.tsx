import { useEffect, useRef, useState } from 'react';

import { useContent360Translation } from '../hooks/useContent360Translation';

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

// Platform assignment per day (IG-heavy, realistic distribution)
const DAY_PLATFORMS = ['IG','IG','FB','LI','IG','LI','IG','FB','LI','IG','LI','FB','FB','IG','IG','FB','IG','LI','LI','FB','IG','FB','LI','IG','IG','FB','LI','IG','LI','IG'];

export function HeroSection() {
  const { t, lang, data } = useContent360Translation();
  const h = t.hero;
  const [heroScore, setHeroScore] = useState(0);
  const [activePost, setActivePost] = useState(0);

  // Rebuild featured posts when language changes
  const featuredPosts = [
    { day: 7,  type: 'promo', emoji: '🎯', platform: lang === 'es' ? 'Instagram' : 'Instagram',
      handle: h.postHandle, caption: h.post1Caption, tags: h.post1Tags, likes: '847',  comments: '32' },
    { day: 10, type: 'promo', emoji: '🔥', platform: 'LinkedIn',
      handle: h.postHandle, caption: h.post2Caption, tags: h.post2Tags, likes: '1.2K', comments: '67' },
    { day: 15, type: 'ent',   emoji: '🎉', platform: 'Instagram',
      handle: h.postHandle, caption: h.post3Caption, tags: h.post3Tags, likes: '2.1K', comments: '94' },
    { day: 21, type: 'promo', emoji: '🚀', platform: 'LinkedIn',
      handle: h.postHandle, caption: h.post4Caption, tags: h.post4Tags, likes: '934',  comments: '45' },
  ];

  useEffect(() => {
    const timer = window.setTimeout(() => setHeroScore(94), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActivePost((p) => (p + 1) % featuredPosts.length);
    }, 3500);
    return () => window.clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const handleSecondaryClick = () => {
    document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openCta = () => {
    window.open('https://moilapp.com/business', '_blank', 'noopener,noreferrer');
  };

  const post = featuredPosts[activePost];

  return (
    <section id="hero">
      <div className="hero-grid" />
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      <div className="hero-eyebrow">
        <span className="eyebrow-dot" />
        {h.eyebrow}
      </div>

      <h1 className="hero-headline">
        {h.line1}
        <br />
        {h.line2}
        <br />
        <span className="hl-orange">{h.line3}</span>
        <br />
        <span className="hl-purple">{h.line4}</span>
      </h1>

      <p className="hero-sub">{h.sub}</p>

      <div className="hero-ctas">
        <button className="btn-primary" type="button" onClick={openCta}>
          {h.cta} <span>→</span>
        </button>
        <button className="btn-secondary" type="button" onClick={handleSecondaryClick}>
          {h.ctaSecondary}
        </button>
      </div>

      <div className="hero-dashboard">
        <div className="dashboard-frame">
          {/* Bar: traffic-light dots · title · content-type legend · LIVE badge */}
          <div className="dashboard-bar">
            <span className="dot dot-r" />
            <span className="dot dot-y" />
            <span className="dot dot-g" />
            <span className="dashboard-title">{h.dashboardTitle}</span>
            <div className="dashboard-bar-tags">
              <span className="bar-tag type-edu">EDU</span>
              <span className="bar-tag type-promo">PROMO</span>
              <span className="bar-tag type-eng">ENGAGE</span>
              <span className="bar-tag type-bts">BTS</span>
              <span className="bar-tag type-ent">ENTMT</span>
            </div>
            <div className="dashboard-status">
              <span className="status-dot" /> LIVE
            </div>
          </div>

          <div className="dashboard-body">
            {/* Score + Live Post Preview — spans 2 cols × 2 rows */}
            <div className="score-panel">
              {/* Top: strategy score */}
              <div className="score-left">
                <div className="score-label">{h.scoreLabel}</div>
                <div className="score-value">{heroScore}%</div>
                <div className="score-bar">
                  <div className="score-fill" style={{ width: `${heroScore}%` }} />
                </div>
                <div className="score-chips">
                  <span className="score-chip">{h.chip30Posts}</span>
                  <span className="score-chip">{h.chipLang}</span>
                  <span className="score-chip">{h.chip6Types}</span>
                </div>
              </div>

              {/* Bottom: rotating live post preview */}
              <div className="post-preview">
                <div key={activePost} className="post-preview-inner">
                  <div className="post-preview-top">
                    <div className="post-avatar" />
                    <div className="post-meta">
                      <span className="post-handle">{post.handle}</span>
                      <span className="post-platform-label">{post.platform}</span>
                    </div>
                    <span className="post-day-badge">{h.dayBadgePrefix} {post.day}</span>
                  </div>
                  <div className={`post-img post-img-${post.type}`}>
                    <span className="post-big-emoji">{post.emoji}</span>
                    <span className="post-img-corner">{post.type.toUpperCase()}</span>
                  </div>
                  <p className="post-caption-text">{post.caption}</p>
                  <p className="post-tags-text">{post.tags}</p>
                  <div className="post-stats">
                    <span className="post-stat">
                      <span className="post-stat-icon">♥</span>
                      <span className="post-stat-val">{post.likes}</span>
                    </span>
                    <span className="post-stat">
                      <span className="post-stat-icon">💬</span>
                      <span className="post-stat-val">{post.comments}</span>
                    </span>
                  </div>
                </div>
                <div className="post-dots">
                  {featuredPosts.map((_, i) => (
                    <span key={i} className={`post-dot${i === activePost ? ' active' : ''}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* 30 enhanced day-card thumbnails */}
            {data.heroDayData.map((day, index) => {
              const plat = DAY_PLATFORMS[index] || 'IG';
              return (
                <div
                  key={`${day.type}-${index}`}
                  className="day-card"
                  style={{ animationDelay: `${index * 0.035}s` }}
                >
                  <div className="day-card-top">
                    <span className="day-num">{String(index + 1).padStart(2, '0')}</span>
                    <span className={`day-plat day-plat-${plat.toLowerCase()}`}>{plat}</span>
                  </div>
                  <div className={`day-type ${heroTypeClass[day.type]}`}>{heroTypeLabel[day.type]}</div>
                  <div className={`day-img day-img-${day.type}`}>
                    <span className="day-emoji">{day.emoji}</span>
                    {day.video && <div className="day-video-badge">▶</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProblemSection() {
  const { t } = useContent360Translation();
  const p = t.problem;

  return (
    <div id="problem">
      <div className="reveal">
        <div className="section-tag">{p.sectionTag}</div>
        <h2 className="section-headline">
          {p.headLine1}
          <br />
          {p.headLine2}
          <br />
          {p.headLine3} <span style={{ color: 'var(--orange)' }}>{p.headLine3Highlight}</span>
        </h2>
        <p className="problem-quote">
          &ldquo;{p.quoteBody}{' '}
          <em>{p.quoteEmphasis}</em>&rdquo;
        </p>
        <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.75 }}>
          {p.body}
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
          {p.betterWay}
        </p>
      </div>
      <div className="reveal reveal-delay-2">
        <div className="chaos-calendar">
          <div className="chaos-title">
            <span>{p.calendarTitle}</span>
            <span style={{ color: '#EF4444', fontSize: 9 }}>{p.missedDays}</span>
          </div>
          <div className="chaos-grid">
            <div className="chaos-day empty" />
            <div className="chaos-day done"><span>1</span><span className="chaos-label">✓</span></div>
            <div className="chaos-day missed"><span>2</span><span className="chaos-x">✗</span></div>
            <div className="chaos-day missed"><span>3</span><span className="chaos-x">✗</span></div>
            <div className="chaos-day late">
              <span>4</span>
              <span className="chaos-label" style={{ color: 'var(--purple-light)' }}>11pm</span>
            </div>
            <div className="chaos-day missed"><span>5</span><span className="chaos-x">✗</span></div>
            <div className="chaos-day missed"><span>6</span><span className="chaos-x">✗</span></div>
            <div className="chaos-day done"><span>7</span><span className="chaos-label">✓</span></div>
            <div className="chaos-day missed"><span>8</span><span className="chaos-x">✗</span></div>
            <div className="chaos-day late">
              <span>9</span>
              <span className="chaos-label" style={{ color: 'var(--purple-light)' }}>{p.reuseLabel}</span>
            </div>
            <div className="chaos-day done"><span>10</span><span className="chaos-label">✓</span></div>
            <div className="chaos-day missed"><span>11</span><span className="chaos-x">✗</span></div>
            <div className="chaos-day missed"><span>12</span><span className="chaos-x">✗</span></div>
            <div className="chaos-day missed"><span>13</span><span className="chaos-x">✗</span></div>
            <div className="chaos-day done"><span>14</span><span className="chaos-label">✓</span></div>
            <div className="chaos-day empty" />
            <div className="chaos-day empty" />
            <div className="chaos-day empty" />
            <div className="chaos-day empty" />
            <div className="chaos-day empty" />
          </div>
          <div className="chaos-note">{p.calendarNote}</div>
        </div>
      </div>
    </div>
  );
}

export function SolutionSection() {
  const { t, data } = useContent360Translation();
  const s = t.solution;
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
          data.terminalLines.forEach((_, idx) => {
            const timer = window.setTimeout(() => {
              setActiveLines(idx + 1);
            }, idx * 380);
            timeoutIds.current.push(timer);
          });
          const progressDelay = data.terminalLines.length * 380 + 400;
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="solution" style={{ textAlign: 'center' }}>
      <div className="reveal section-tag" style={{ justifyContent: 'center' }}>
        {s.sectionTag}
      </div>
      <h2 className="section-headline reveal">
        {s.headLine1} <span style={{ color: 'var(--orange)' }}>{s.headLine1Highlight}</span>
        <br />
        {s.headLine2}
      </h2>
      <p className="section-sub reveal" style={{ margin: '0 auto', textAlign: 'center' }}>
        {s.sub}
      </p>

      <div className="ai-terminal reveal" ref={terminalRef}>
        <div className="terminal-header">
          <span className="dot dot-r" />
          <span className="dot dot-y" />
          <span className="dot dot-g" />
          <span className="terminal-title">{s.terminalTitle}</span>
        </div>
        <div className="terminal-body">
          {data.terminalLines.map((line, idx) => (
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
            <span className="progress-label">{s.progressLabel}</span>
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
  const { t, data } = useContent360Translation();
  const j = t.journey;

  return (
    <section id="how">
      <div className="section-tag reveal">{j.sectionTag}</div>
      <h2 className="section-headline reveal">
        {j.headLine1}
        <br />
        {j.headLine2} <span style={{ color: 'var(--orange)' }}>{j.headLine2Highlight}</span>
      </h2>
      <p className="section-sub reveal">{j.sub}</p>

      <div className="steps-timeline">
        {data.journeySteps.map((step, idx) => (
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
  const { t, lang, data } = useContent360Translation();
  const f = t.features;
  const [postLang, setPostLang] = useState<'en' | 'es'>('en');

  // Sync the post preview lang with the global lang when it changes
  useEffect(() => {
    setPostLang(lang as 'en' | 'es');
  }, [lang]);

  return (
    <section id="features">
      <div className="section-tag reveal">{f.sectionTag}</div>
      <h2 className="section-headline reveal">
        {f.headLine1}
        <br />
        <span style={{ color: 'var(--orange)' }}>{f.headLine1Highlight}</span>
      </h2>

      <div className="features-grid">
        {data.featureCards.map((card) => {
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
                      <span>{f.postPreviewLabel}</span>
                      <div style={{ display: 'flex', gap: 3 }}>
                        <button
                          className={`lang-btn ${postLang === 'en' ? 'active' : ''}`}
                          type="button"
                          onClick={() => setPostLang('en')}
                          style={{ cursor: 'pointer', borderRadius: 4 }}
                        >
                          EN
                        </button>
                        <button
                          className={`lang-btn ${postLang === 'es' ? 'active' : ''}`}
                          type="button"
                          onClick={() => setPostLang('es')}
                          style={{ cursor: 'pointer', borderRadius: 4 }}
                        >
                          ES
                        </button>
                      </div>
                    </div>
                    <div style={{ padding: 16 }}>
                      <p
                        style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.65 }}
                        dangerouslySetInnerHTML={{ __html: postLang === 'en' ? enPost : esPost }}
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
              {card.title === data.featureCards[0].title ? (
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
              {card.icon === '🎨' ? (
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
                      flex: 1, height: 56, borderRadius: 6,
                      background: 'linear-gradient(135deg,var(--orange-dim),var(--purple-dim))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                    }}
                  >
                    🔧
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>→</div>
                  <div
                    style={{
                      flex: 1, height: 56, borderRadius: 6,
                      background: 'linear-gradient(135deg,var(--blue-dim),rgba(16,185,129,0.15))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: 'var(--text2)', fontFamily: 'var(--mono)', textAlign: 'center', padding: 4,
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
  const { t, data } = useContent360Translation();
  const s = t.stats;

  return (
    <div id="stats">
      <div className="stats-inner">
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div className="section-tag reveal" style={{ justifyContent: 'center' }}>
            {s.sectionTag}
          </div>
          <h2 className="section-headline reveal" style={{ fontSize: 'clamp(32px,5vw,56px)' }}>
            {s.headLine}
          </h2>
        </div>
        <div className="stats-grid">
          {data.stats.map((stat, idx) => (
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
  const { t, data } = useContent360Translation();
  const p = t.pricing;

  return (
    <section id="pricing" style={{ textAlign: 'center' }}>
      <div className="section-tag reveal" style={{ justifyContent: 'center' }}>
        {p.sectionTag}
      </div>
      <h2 className="section-headline reveal">
        {p.headLine1}
        <br />
        <span style={{ color: 'var(--orange)' }}>{p.headLine1Highlight}</span>
      </h2>
      <p className="pricing-intro reveal">
        <strong dangerouslySetInnerHTML={{ __html: p.intro }} />
      </p>
      <div className="annual-badge reveal">{p.annualBadge}</div>

      <div className="pricing-grid">
        {data.pricingPlans.map((plan, idx) => (
          <div
            key={plan.tier}
            className={`price-card reveal ${plan.featured ? 'featured' : ''} ${idx ? `reveal-delay-${idx}` : ''}`}
          >
            {plan.featured ? <span className="featured-badge">{p.featuredBadge}</span> : null}
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
            <a href={plan.ctaHref} target="_blank" rel="noreferrer" className={`price-cta ${plan.ctaClass}`}>
              {plan.ctaLabel}
            </a>
          </div>
        ))}
      </div>

      <div className="trust-row" style={{ marginTop: 40 }}>
        {p.trust.map((item) => (
          <div key={item} className="trust-item">
            <span className="tick">✓</span> {item}
          </div>
        ))}
      </div>
    </section>
  );
}

export function ComparisonSection() {
  const { t, data } = useContent360Translation();
  const c = t.comparison;

  return (
    <section id="comparison">
      <div className="section-tag reveal">{c.sectionTag}</div>
      <h2 className="section-headline reveal">
        {c.headLine1}
        <br />
        <span style={{ color: 'var(--orange)' }}>{c.headLine1Highlight}</span>
      </h2>
      <p className="section-sub reveal">{c.sub}</p>
      <div className="table-wrap reveal">
        <table className="compare-table">
          <thead>
            <tr>
              <th>{c.colFeature}</th>
              <th className="moil-col">
                <div className="compare-header-moil">
                  {c.colMoil} <span className="moil-best-badge">{c.moilBest}</span>
                </div>
              </th>
              <th>{c.colConsultant}</th>
              <th>{c.colAiTool}</th>
            </tr>
          </thead>
          <tbody>
            {data.comparisonRows.map((row) => (
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
  const { t, data } = useContent360Translation();
  const ts = t.testimonials;

  return (
    <section id="testimonials" style={{ textAlign: 'center' }}>
      <div className="section-tag reveal" style={{ justifyContent: 'center' }}>
        {ts.sectionTag}
      </div>
      <h2 className="section-headline reveal">
        {ts.headLine1}
        <br />
        <span style={{ color: 'var(--orange)' }}>{ts.headLine1Highlight}</span>
      </h2>

      <div className="testimonials-grid">
        {data.testimonials.map((testimonial, idx) => (
          <div key={testimonial.name} className={`testimonial-card reveal ${idx ? `reveal-delay-${idx}` : ''}`}>
            <span className="t-quote-mark">&ldquo;</span>
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
  const { t } = useContent360Translation();
  const f = t.finalCta;

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
      <p className="final-eyebrow reveal">{f.eyebrow}</p>
      <h2 className="final-headline reveal">
        {f.headLine1}
        <br />
        {f.headLine2}
        <br />
        <span className="line-purple">{f.headLine2Highlight}</span>
      </h2>
      <p className="final-sub reveal">{f.sub}</p>
      <button className="final-cta-btn reveal" type="button" onClick={openCta}>
        {f.cta}
      </button>
      <div className="trust-row reveal reveal-delay-1">
        {f.trust.map((item) => (
          <div key={item} className="trust-item">
            <span className="tick">✓</span> {item}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 60, position: 'relative', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8 }}>
          {f.trustedBy}
        </div>
        <div style={{ color: 'var(--purple-light)', fontSize: 16, letterSpacing: 2 }}>★★★★★</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', marginTop: 6 }}>
          {f.statsLine}
        </div>
      </div>
    </section>
  );
}
