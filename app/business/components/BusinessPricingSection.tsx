'use client';

import { useState } from 'react';
import { appendLangToUrl } from '../utils/appendLangToUrl';
import { useLanguageContext } from '../../../src/common/components/I18nProvider';

export function BusinessPricingSection() {
  const { t, lang } = useLanguageContext();
  const pricingPage = typeof window !== 'undefined' && window.location.pathname.includes('/pricing');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'starter',
      tier: t.business.pricing.starter.name,
      tagline: t.business.pricing.starter.tagline,
      price: billingCycle === 'monthly' ? t.business.pricing.starter.monthlyPrice : t.business.pricing.starter.annualPrice,
      originalPrice: billingCycle === 'annual' ? t.business.pricing.starter.annualOriginalPrice : undefined,
      per: billingCycle === 'monthly' ? t.business.pricing.perMonth : t.business.pricing.perYear,
      features: t.business.pricing.starter.features,
      cta: t.business.pricing.starter.cta,
      ctaClass: 'pbtn-sec',
    },
    {
      id: 'professional',
      tier: t.business.pricing.professional.name,
      tagline: t.business.pricing.professional.tagline,
      price: billingCycle === 'monthly' ? t.business.pricing.professional.monthlyPrice : t.business.pricing.professional.annualPrice,
      originalPrice: billingCycle === 'annual' ? t.business.pricing.professional.annualOriginalPrice : undefined,
      per: billingCycle === 'monthly' ? t.business.pricing.perMonth : t.business.pricing.perYear,
      features: t.business.pricing.professional.features,
      cta: t.business.pricing.professional.cta,
      ctaClass: 'pbtn-sec',
    },
    {
      id: 'marketPro',
      tier: t.business.pricing.marketPro.name,
      tagline: t.business.pricing.marketPro.tagline,
      price: billingCycle === 'monthly' ? t.business.pricing.marketPro.monthlyPrice : t.business.pricing.marketPro.annualPrice,
      originalPrice: billingCycle === 'annual' ? t.business.pricing.marketPro.annualOriginalPrice : undefined,
      per: billingCycle === 'monthly' ? t.business.pricing.perMonth : t.business.pricing.perYear,
      features: t.business.pricing.marketPro.features,
      cta: t.business.pricing.marketPro.cta,
      ctaClass: 'pbtn-pri',
      featured: true,
      badge: t.business.pricing.marketPro.badge,
    },
  ];

  const trustItems = [
    t.business.pricing.trust.guarantee,
    t.business.pricing.trust.noSetupFees,
    t.business.pricing.trust.cancelAnytime,
    t.business.pricing.trust.soc2,
    t.business.pricing.trust.bilingual,
  ];

  // Feature keys that should be highlighted in the Market Pro plan
  const highlightFeatures = [t.business.pricing.marketPro.features[3], t.business.pricing.marketPro.features[4]];

  return (
    <section id="pricing">
      <div className="section-tag rv" style={{ justifyContent: 'center' }}>
        {t.business.pricing.tag}
      </div>
      <h2 className="section-headline rv">
        {t.business.pricing.headline}<br />{t.business.pricing.headlineLine2} <span style={{ color: 'var(--orange)' }}>{t.business.pricing.headlineHighlight}</span>
      </h2>
      <p className="pricing-sub rv">
        {t.business.pricing.subheadline}{' '}
        <strong>{t.business.pricing.subheadlineEmphasis}</strong>&rdquo;
      </p>
      
      {/* Billing Cycle Toggle */}
      <div className="rv" style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
        <div
          style={{
            display: 'inline-flex',
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: '100px',
            padding: '4px',
          }}
        >
          <button
            onClick={() => setBillingCycle('monthly')}
            style={{
              padding: '10px 24px',
              borderRadius: '100px',
              border: 'none',
              background: billingCycle === 'monthly' ? 'var(--orange)' : 'transparent',
              color: billingCycle === 'monthly' ? 'white' : 'var(--text2)',
              fontFamily: 'var(--mono)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {t.business.pricing.monthly}
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            style={{
              padding: '10px 24px',
              borderRadius: '100px',
              border: 'none',
              background: billingCycle === 'annual' ? 'var(--purple)' : 'transparent',
              color: billingCycle === 'annual' ? 'white' : 'var(--text2)',
              fontFamily: 'var(--mono)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {t.business.pricing.annual}
          </button>
        </div>
      </div>
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
        {t.business.pricing.annualSaving}
      </div>

      <div className="pricing-inner-grid">
        {plans.map((plan, index) => (
          <div key={plan.id} className={`price-card rv ${plan.featured ? 'star' : ''} ${index === 1 ? 'd1' : ''} ${index === 2 ? 'd2' : ''}`}>
            {plan.featured && plan.badge && <span className="price-badge">{plan.badge}</span>}
            <div className="price-tier">{plan.tier}</div>
            <p className="price-tagline">{plan.tagline}</p>
            <div className="price-amt">
              {plan.originalPrice && (
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ 
                    fontSize: '18px', 
                    color: 'var(--text3)', 
                    textDecoration: 'line-through',
                    fontFamily: 'var(--mono)',
                  }}>
                    {plan.originalPrice}
                  </span>
                </div>
              )}
              <span className={`price-num ${plan.featured ? 'featured' : ''}`}>{plan.price}</span>
              <span className="price-per">{plan.per}</span>
              {billingCycle === 'annual' && (
                <div style={{ 
                  fontSize: '11px', 
                  color: 'var(--text3)', 
                  marginTop: '6px',
                  fontFamily: 'var(--mono)',
                }}>
                  {t.business.pricing.billedAnnually}
                </div>
              )}
            </div>
            <div className="p-divider"></div>
            <ul className="price-list">
              {plan.features.map((feature, featureIndex) => (
                <li key={`${plan.id}-feature-${featureIndex}`}>
                  <span className={plan.featured ? 'li-star' : 'li-check'}>{plan.featured ? '★' : '✓'}</span>
                  {plan.featured && highlightFeatures.includes(feature) ? (
                    <strong style={{ color: 'var(--orange)' }}>{feature}</strong>
                  ) : (
                    feature
                  )}
                </li>
              ))}
            </ul>
            <a
              href={appendLangToUrl("https://business.moilapp.com/register", lang)}
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
        {trustItems.map((item, index) => (
          <div className="pt-item" key={`trust-${index}`}>
            <span className="g">✓</span> {item}
          </div>
        ))}
      </div>


      {!pricingPage && (<div style={{ textAlign: 'center', marginTop: '40px' }} className="rv">
        <a
          href={`/business/pricing?lg=${lang}`}
          className="btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          {t.business.pricing.seeDetailed}
        </a>
      </div>)}
    </section>
  );
}
