'use client';

import { useState } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { appendLangToUrl } from '../utils/appendLangToUrl';
import { getRegisterUrl } from '../preview/previewClient';
import { useLanguageContext } from '../../../src/common/components/I18nProvider';

type Props = {
  detailed?: boolean;
};

export function BusinessPricingSection({ detailed = false }: Props) {
  const { t, lang } = useLanguageContext();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
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
      featured: false,
      badge: undefined,
    },
  ];

  const trustItems = [
    t.business.pricing.trust.guarantee,
    t.business.pricing.trust.noSetupFees,
    t.business.pricing.trust.cancelAnytime,
    t.business.pricing.trust.startFree,
    t.business.pricing.trust.bilingual,
  ];

  const highlightFeatures = [t.business.pricing.marketPro.features[3], t.business.pricing.marketPro.features[4]];
  const registerHref = appendLangToUrl(getRegisterUrl(), lang);

  return (
    <section id="pricing" className="pricing-section-v2">
      <header className="pricing-section-v2__intro">
        <div className="section-tag rv" style={{ justifyContent: 'center' }}>
          {t.business.pricing.tag}
        </div>
        <h2 className="section-headline rv">
          {t.business.pricing.headline}
          {t.business.pricing.headlineLine2 ? (
            <>
              <br />
              {t.business.pricing.headlineLine2}{' '}
            </>
          ) : null}
          {t.business.pricing.headlineHighlight ? (
            <span className="pricing-section-v2__highlight">{t.business.pricing.headlineHighlight}</span>
          ) : null}
        </h2>
        <p className="pricing-sub rv">
          {t.business.pricing.subheadline}{' '}
          <strong>{t.business.pricing.subheadlineEmphasis}</strong>
          {/^[“"]/.test(t.business.pricing.subheadline) ? '\u201d' : ''}
        </p>
      </header>

      <div className="pricing-billing-bar rv">
        <div className="pricing-billing-toggle" role="group" aria-label={t.business.pricing.billed}>
          <button
            type="button"
            className={billingCycle === 'monthly' ? 'is-active' : ''}
            aria-pressed={billingCycle === 'monthly'}
            onClick={() => setBillingCycle('monthly')}
          >
            {t.business.pricing.monthly}
          </button>
          <button
            type="button"
            className={billingCycle === 'annual' ? 'is-active' : ''}
            aria-pressed={billingCycle === 'annual'}
            onClick={() => setBillingCycle('annual')}
          >
            {t.business.pricing.annual}
          </button>
        </div>
        <div className="pricing-saving-note">
          <Check size={14} strokeWidth={2.5} aria-hidden="true" />
          {t.business.pricing.annualSaving}
        </div>
      </div>

      <div className="pricing-plan-stage">
        {plans.map((plan, index) => (
          <article
            key={plan.id}
            className={`price-card pricing-plan-card rv ${plan.featured ? 'star pricing-plan-card--featured' : ''} ${index === 1 ? 'd1' : ''}`}
          >
            <div className="pricing-plan-card__topline">
              <span className="pricing-plan-card__index">0{index + 1}</span>
              {plan.featured && plan.badge ? (
                <span className="price-badge">
                  <Sparkles size={12} aria-hidden="true" />
                  {plan.badge}
                </span>
              ) : (
                <span className="pricing-plan-card__tier-note">{t.business.pricing.monthly}</span>
              )}
            </div>

            <div className="pricing-plan-card__header">
              <div>
                <h3 className="price-tier">{plan.tier}</h3>
                <p className="price-tagline">{plan.tagline}</p>
              </div>
              <div className="price-amt">
                {plan.originalPrice ? <span className="price-original">{plan.originalPrice}</span> : null}
                <div>
                  <span className={`price-num ${plan.featured ? 'featured' : ''}`}>{plan.price}</span>
                  <span className="price-per">{plan.per}</span>
                </div>
                {billingCycle === 'annual' ? (
                  <span className="price-billed">{t.business.pricing.billedAnnually}</span>
                ) : null}
              </div>
            </div>

            <a
              href={registerHref}
              target="_blank"
              rel="noreferrer"
              data-signup-cta={`pricing-${plan.ctaClass}`}
              className={`price-btn ${plan.ctaClass}`}
            >
              <span>{plan.cta}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </a>

            <div className="p-divider" />

            <ul className="price-list">
              {plan.features.map((feature, featureIndex) => (
                <li key={`${plan.id}-feature-${featureIndex}`}>
                  <span className={plan.featured ? 'li-star' : 'li-check'}>
                    {plan.featured ? <Sparkles size={14} aria-hidden="true" /> : <Check size={15} aria-hidden="true" />}
                  </span>
                  {plan.featured && highlightFeatures.includes(feature) ? <strong>{feature}</strong> : feature}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="price-trust rv">
        {trustItems.map((item, index) => (
          <div className="pt-item" key={`trust-${index}`}>
            <span className="g"><Check size={14} aria-hidden="true" /></span>
            {item}
          </div>
        ))}
      </div>

      {!detailed ? (
        <div className="pricing-detail-link rv">
          <a href={lang === 'es' ? '/es/business/pricing' : '/business/pricing'} className="btn-secondary">
            {t.business.pricing.seeDetailed} <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      ) : null}
    </section>
  );
}
