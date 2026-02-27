'use client';

export function BusinessFinalCta() {
  return (
    <section id="final">
      <div className="final-bg"></div>
      <div className="final-grid-lines"></div>
      <p className="final-tag rv">Your Competitors Are Using AI Right Now</p>
      <h2 className="final-headline rv">
        Stop Running<br />Your Business<br />
        <span className="fl-p">Alone.</span>
      </h2>
      <p className="final-sub rv">
        Join 500+ Texas businesses with an AI co-founder in their corner. Market research, business plan, 30-day content
        strategy, AI visuals, and smart hiring — all in one conversation. Starting at $15/month.
      </p>
      <a className="final-btn rv" href="https://business.moilapp.com/register" target="_blank" rel="noreferrer">
        🚀 Meet Your AI Co-Founder — Free <span>→</span>
      </a>
      <div className="final-trust rv">
        {['Free to start', '30-Day Guarantee', 'No Credit Card Needed', 'SOC 2 Compliant', 'Bilingual EN/ES'].map((item) => (
          <div className="ft-item" key={item}>
            <span className="gc">✓</span> {item}
          </div>
        ))}
      </div>
      <div style={{ position: 'relative', marginTop: '64px', textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '10px',
            color: 'var(--text3)',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '8px',
          }}
        >
          Trusted by 500+ businesses
        </div>
        <div style={{ color: 'var(--purple-light)', fontSize: '18px', letterSpacing: '3px' }}>★★★★★</div>
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '10px',
            color: 'var(--text3)',
            marginTop: '6px',
          }}
        >
          5,000+ jobs posted · 94% interview success · $850 avg cost per hire
        </div>
      </div>
    </section>
  );
}
