'use client';

const plans = [
  {
    tier: 'Starter',
    tagline: 'Full AI toolbox for businesses just getting started.',
    price: '$15',
    per: '/month',
    features: [
      'AI Business Coach & Market Research',
      'Up to 3 job postings/month',
      '75 AI-generated images',
      '75 AI image edits',
      '5 min audio generation',
      'Full Moil AI toolbox',
      'Bilingual: English & Spanish',
      'Advanced analytics',
    ],
    cta: 'Get Started →',
    ctaClass: 'pbtn-sec',
  },
  {
    tier: 'Professional',
    tagline: 'More capacity for growing businesses with active hiring and content needs.',
    price: '$25',
    per: '/month',
    features: [
      '10 job postings/month',
      '200 AI-generated images',
      '200 AI image edits',
      '15 min audio generation',
      'AI Business Coach & Research',
      'Premium analytics + tracking',
      'Priority email & phone support',
    ],
    cta: 'Get Started →',
    ctaClass: 'pbtn-sec',
  },
  {
    tier: 'Market Pro',
    tagline: 'Unlimited power. Full Content360 access. Maximum AI.',
    price: '$75',
    per: '/month',
    features: [
      'Unlimited job postings',
      'Unlimited AI images & edits',
      '30 min audio generation',
      '15 video credits/month',
      'Content360 Full Access',
      'Market Pro suite',
      'AI Coach & deep market research',
      'Dedicated account support',
    ],
    cta: 'Start Market Pro →',
    ctaClass: 'pbtn-pri',
    featured: true,
  },
];

export function BusinessPricingSection() {
  return (
    <section id="pricing">
      <div className="section-tag rv" style={{ justifyContent: 'center' }}>
        Simple Pricing
      </div>
      <h2 className="section-headline rv">
        A Consultant, Agency,<br />Recruiter &amp; Coach. <span style={{ color: 'var(--orange)' }}>One Price.</span>
      </h2>
      <p className="pricing-sub rv">
        "Traditional consultants charge more for a single meeting than Moil costs for an entire year.{' '}
        <strong>That&apos;s not a discount. That&apos;s a revolution.</strong>"
      </p>
      <div
        className="rv"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--green-dim)',
          border: '1px solid rgba(16,185,129,0.2)',
          padding: '7px 18px',
          borderRadius: '100px',
          fontFamily: 'var(--mono)',
          fontSize: '10px',
          color: 'var(--green)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: '52px',
        }}
      >
        ✓ Save up to 25% with annual billing
      </div>

      <div className="pricing-inner-grid">
        {plans.map((plan, index) => (
          <div key={plan.tier} className={`price-card rv ${plan.featured ? 'star' : ''} ${index === 1 ? 'd1' : ''} ${index === 2 ? 'd2' : ''}`}>
            {plan.featured && <span className="price-badge">⭐ BEST VALUE</span>}
            <div className="price-tier">{plan.tier}</div>
            <p className="price-tagline">{plan.tagline}</p>
            <div className="price-amt">
              <span className={`price-num ${plan.featured ? 'featured' : ''}`}>{plan.price}</span>
              <span className="price-per">{plan.per}</span>
            </div>
            <div className="p-divider"></div>
            <ul className="price-list">
              {plan.features.map((feature) => (
                <li key={feature}>
                  <span className={plan.featured ? 'li-star' : 'li-check'}>{plan.featured ? '★' : '✓'}</span>
                  {plan.featured && (feature === '15 video credits/month' || feature === 'Content360 Full Access') ? (
                    <strong style={{ color: 'var(--orange)' }}>{feature}</strong>
                  ) : (
                    feature
                  )}
                </li>
              ))}
            </ul>
            <a
              href="https://business.moilapp.com/register"
              target="_blank"
              rel="noreferrer"
              className={`price-btn ${plan.ctaClass}`}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>

      <div className="price-trust rv">
        {['30-Day Guarantee', 'No Setup Fees', 'Cancel Anytime', 'SOC 2 Compliant', 'Bilingual EN/ES'].map((item) => (
          <div className="pt-item" key={item}>
            <span className="g">✓</span> {item}
          </div>
        ))}
      </div>
    </section>
  );
}
