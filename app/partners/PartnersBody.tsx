import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Check, MapPin } from 'lucide-react';
import { baseURL1 } from '../../src/common/constants/baseUrl';
import { jsonLd } from '../../src/common/seo/jsonLd';
import { faqPageJsonLd } from '../compare/aeoLocks';
import styles from '../showcase-pages.module.css';
import { PARTNER_ORGS, type PartnerCopy } from './partnerCopy';
import { PartnershipInquiryButton } from './PartnershipInquiryButton';

/**
 * The whole partners page, for either language. /partners and /es/aliados are
 * thin wrappers that pass their own PartnerCopy; layout, schema and structure
 * live here once.
 */
export function PartnersBody({ copy }: { copy: PartnerCopy }) {
  const pageUrl = `${baseURL1}${copy.path}`;
  const { lang } = copy;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${copy.meta.title} | Moil`,
        description: copy.meta.description,
        inLanguage: copy.inLanguage,
        isPartOf: { '@type': 'WebSite', name: 'Moil', url: baseURL1 },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        mainEntity: { '@id': `${pageUrl}#service` },
        mentions: PARTNER_ORGS.map((p) => ({ '@type': 'Organization', name: p.name, url: p.href })),
        speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#partner-answer'] },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: copy.breadcrumb.home, item: `${baseURL1}${lang === 'es' ? '/es/business' : '/business'}` },
          { '@type': 'ListItem', position: 2, name: copy.breadcrumb.page, item: pageUrl },
        ],
      },
      {
        '@type': 'Service',
        '@id': `${pageUrl}#service`,
        name: copy.service.name,
        serviceType: copy.service.serviceType,
        description: copy.hero.answer,
        url: pageUrl,
        provider: { '@type': 'Organization', name: 'Moil Enterprise Inc.', url: baseURL1 },
        audience: { '@type': 'Audience', audienceType: copy.service.audienceType },
      },
    ],
  };

  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqPageJsonLd(copy.faq.items)) }} />

      <section className={`${styles.hero} ${styles.partnerHero}`}>
        <div className={styles.heroInner}>
          <div>
            <span className={styles.eyebrow}>{copy.hero.eyebrow}</span>
            <h1 className={styles.title}>{copy.hero.titleLead}<span className={styles.titleAccent}>{copy.hero.titleAccent}</span></h1>
            <p className={styles.lede} id="partner-answer">{copy.hero.answer}</p>
            <div className={styles.actions}>
              <PartnershipInquiryButton className={styles.primary} label={copy.hero.cta} defaultSubject={copy.inquirySubject} lang={lang} />
              <a className={styles.secondary} href="#how-it-works">{copy.hero.secondary}</a>
            </div>
            <p className={styles.partnerProof}>{copy.hero.proofLead}<a href="#current-partners">{copy.hero.proofLink}</a>.</p>
          </div>
          <div className={`${styles.heroImage} ${styles.partnerImage}`}><Image src="/page-heroes/partner-community-v2.png" alt={copy.hero.imageAlt} fill priority sizes="(max-width: 900px) 100vw, 45vw" /></div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.partnerSection}`} id="why-moil">
        <div className={styles.sectionHeader}>
          <div><span className={styles.eyebrow}>{copy.why.eyebrow}</span><h2 className={styles.sectionHeading}>{copy.why.heading}</h2></div>
          <p className={styles.sectionCopy}>{copy.why.copy}</p>
        </div>
        <div className={styles.pathGrid}>{copy.why.cards.map((card) => <article key={card.title} className={styles.benefitCard}><h3>{card.title}</h3><p>{card.copy}</p></article>)}</div>
      </section>

      <section className={styles.section} id="what-businesses-get">
        <div className={styles.splitPanel}>
          <div>
            <span className={styles.eyebrow}>{copy.gets.eyebrow}</span>
            <h2 className={styles.sectionHeading}>{copy.gets.heading}</h2>
            <p className={styles.splitCopy}>{copy.gets.lead}</p>
            <p className={styles.splitNote}>{copy.gets.planLine} <Link href={copy.gets.pricingHref}>{copy.gets.pricingLabel}</Link>.</p>
          </div>
          <ul className={styles.checkList}>{copy.gets.items.map((item) => <li key={item}><Check size={17} aria-hidden="true" /><span>{item}</span></li>)}</ul>
        </div>
      </section>

      <section className={styles.section} id="program-fit">
        <div className={styles.sectionHeader}>
          <div><span className={styles.eyebrow}>{copy.fit.eyebrow}</span><h2 className={styles.sectionHeading}>{copy.fit.heading}</h2></div>
          <p className={styles.sectionCopy}>{copy.fit.copy}</p>
        </div>
        <div className={styles.useGrid}>{copy.fit.cases.map((useCase) => <article key={useCase.title} className={styles.useCard}>
          <span className={styles.pathNumber}>{useCase.kicker}</span>
          <h3>{useCase.title}</h3>
          <p>{useCase.copy}</p>
          <small>{useCase.fits}</small>
        </article>)}</div>
        <div className={styles.inlineCta}><PartnershipInquiryButton className={styles.primary} label={copy.fit.cta} defaultSubject={copy.inquirySubject} lang={lang} /></div>
      </section>

      <section className={styles.section} id="how-it-works">
        <div className={styles.sectionHeader}>
          <div><span className={styles.eyebrow}>{copy.steps.eyebrow}</span><h2 className={styles.sectionHeading}>{copy.steps.heading}</h2></div>
          <p className={styles.sectionCopy}>{copy.steps.copy}</p>
        </div>
        <ol className={styles.stepGrid}>{copy.steps.items.map(([number, title, text]) => <li key={number} className={styles.stepCard}><span className={styles.pathNumber}>{number}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
      </section>

      <section className={styles.section} id="cost">
        <div className={styles.costPanel}>
          <div>
            <span className={styles.eyebrow}>{copy.cost.eyebrow}</span>
            <h2 className={styles.sectionHeading}>{copy.cost.heading}</h2>
            <p className={styles.splitCopy}>{copy.cost.lead}</p>
          </div>
          <dl className={styles.costFigures}>
            <div><dt>{copy.cost.agencyLabel}</dt><dd>{copy.cost.agencyRange}</dd><small>{copy.cost.agencyNote}</small></div>
            <div><dt>{copy.cost.moilLabel}</dt><dd>{copy.cost.moilTotal}</dd><small>{copy.cost.moilNote}</small></div>
          </dl>
          <p className={styles.costNote}>{copy.cost.noteBefore}<Link href={copy.cost.compareHref}>{copy.cost.compareLabel}</Link>.</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.partnerSection}`} id="current-partners">
        <div className={styles.sectionHeader}>
          <div><span className={styles.eyebrow}>{copy.partners.eyebrow}</span><h2 className={styles.sectionHeading}>{copy.partners.heading}</h2></div>
          <p className={styles.sectionCopy}>{copy.partners.copy}</p>
        </div>
        <div className={styles.edcGrid}>
          {PARTNER_ORGS.map((org, i) => {
            const text = copy.partners.cards[i];
            return <article className={styles.edcCard} key={org.name}>
              <a href={org.href} target="_blank" rel="noopener noreferrer" aria-label={`${copy.partners.visitAriaPrefix} ${org.name}`}>
                <div className={styles.edcTopline}><span className={styles.edcNumber}>{org.number}</span><span>{text.kind}</span><ArrowUpRight size={18} aria-hidden="true" /></div>
                <div className={`${styles.edcBrand} ${org.brand === 'queenCreek' ? styles.edcBrandQueenCreek : styles.edcBrandBuda}`}>
                  <Image src={org.logo} alt={text.logoAlt} fill sizes="(max-width: 900px) 100vw, 45vw" />
                </div>
                <h3>{org.name}</h3>
                <div className={styles.edcLocation}><MapPin size={15} aria-hidden="true" />{text.location}</div>
                <p>{text.copy}</p>
                <span className={styles.edcVisit}>{copy.partners.visitLabel} <ArrowUpRight size={15} aria-hidden="true" /></span>
              </a>
            </article>;
          })}
        </div>
      </section>

      <section className={styles.section} id="limits">
        <div className={styles.splitPanel}>
          <div>
            <span className={styles.eyebrow}>{copy.limits.eyebrow}</span>
            <h2 className={styles.sectionHeading}>{copy.limits.heading}</h2>
            <p className={styles.splitCopy}>{copy.limits.lead}</p>
          </div>
          <ul className={styles.limitList}>{copy.limits.items.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>

      <section className={styles.section} id="faq">
        <div className={styles.sectionHeader}>
          <div><span className={styles.eyebrow}>{copy.faq.eyebrow}</span><h2 className={styles.sectionHeading}>{copy.faq.heading}</h2></div>
          <p className={styles.sectionCopy}>{copy.faq.copy}</p>
        </div>
        <div className={styles.faqList}>{copy.faq.items.map((item) => <details key={item.question} className={styles.faqItem}><summary><h3>{item.question}</h3></summary><p>{item.answer}</p></details>)}</div>
        <nav className={styles.relatedLinks} aria-label={copy.relatedLabel}>{copy.links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>
      </section>

      <section className={styles.section}>
        <div className={styles.partnerPanel}><div><span className={styles.eyebrow}>{copy.final.eyebrow}</span><h2>{copy.final.heading}</h2><p>{copy.final.copy}</p></div><PartnershipInquiryButton className={styles.primary} label={copy.final.cta} defaultSubject={copy.inquirySubject} lang={lang} /></div>
      </section>
    </main>
  );
}
