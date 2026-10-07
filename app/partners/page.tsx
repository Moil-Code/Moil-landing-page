import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Check, MapPin } from 'lucide-react';
import { baseURL1 } from '../../src/common/constants/baseUrl';
import { jsonLd } from '../../src/common/seo/jsonLd';
import { faqPageJsonLd } from '../compare/aeoLocks';
import styles from '../showcase-pages.module.css';
import { PartnershipInquiryButton } from './PartnershipInquiryButton';
import {
  BUSINESS_GETS,
  COST_EXAMPLE,
  FAQS,
  LIMITS,
  PARTNER_ANSWER,
  PARTNER_LINKS,
  PARTNER_SUBJECT,
  PLAN_LINE,
  STEPS,
  USE_CASES,
  USE_CASE_NOTE,
  WHY_CARDS,
} from './partnerContent';

const PAGE_URL = `${baseURL1}/partners`;
const TITLE = 'Moil for EDCs and chambers: more owners, no new hires';
const DESCRIPTION =
  'Give the small businesses you support research, plans, documents and content in English and Spanish, without adding staff. For EDCs, chambers and associations.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `${TITLE} | Moil`,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'Moil',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-home.jpg', width: 1200, height: 630, alt: 'Moil, the AI co-founder for small business owners' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} | Moil`,
    description: DESCRIPTION,
    images: ['/og-home.jpg'],
  },
};

const edcPartners = [
  {
    number: '01',
    kind: 'CHAMBER PARTNER',
    name: 'Queen Creek Chamber of Commerce',
    location: 'Queen Creek, Arizona',
    copy: 'Queen Creek’s business community connector, bringing local organizations together through resources, advocacy, workforce support, and meaningful relationships.',
    href: 'https://queencreekchamber.com/',
    logo: '/partners/queen-creek-chamber-logo.png',
    logoAlt: 'Queen Creek Chamber of Commerce logo',
    brand: 'queenCreek',
  },
  {
    number: '02',
    kind: 'EDC PARTNER',
    name: 'Buda Economic Development Corporation',
    location: 'Buda, Texas',
    copy: 'Buda’s economic-development organization, championing carefully managed growth, entrepreneurship, and a business community rooted in people and place.',
    href: 'https://www.budaedc.com/',
    logo: '/partners/buda-edc-logo.svg',
    logoAlt: 'Buda Economic Development Corporation logo',
    brand: 'budaEdc',
  },
] as const;

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: `${TITLE} | Moil`,
      description: DESCRIPTION,
      inLanguage: 'en-US',
      isPartOf: { '@type': 'WebSite', name: 'Moil', url: baseURL1 },
      breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
      mainEntity: { '@id': `${PAGE_URL}#service` },
      mentions: edcPartners.map((p) => ({ '@type': 'Organization', name: p.name, url: p.href })),
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#partner-answer'] },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseURL1}/business` },
        { '@type': 'ListItem', position: 2, name: 'Partners', item: PAGE_URL },
      ],
    },
    {
      '@type': 'Service',
      '@id': `${PAGE_URL}#service`,
      name: 'Moil for economic development organizations and chambers of commerce',
      serviceType: 'Small-business support software for community organizations',
      description: PARTNER_ANSWER,
      url: PAGE_URL,
      provider: { '@type': 'Organization', name: 'Moil Enterprise Inc.', url: baseURL1 },
      audience: {
        '@type': 'Audience',
        audienceType: 'Economic development corporations, chambers of commerce, business associations and workforce boards',
      },
    },
  ],
};

export default function PartnersPage() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqPageJsonLd(FAQS)) }} />

      <section className={`${styles.hero} ${styles.partnerHero}`}>
        <div className={styles.heroInner}>
          <div>
            <span className={styles.eyebrow}>MOIL PARTNERSHIPS</span>
            <h1 className={styles.title}>Support more small businesses without adding to <span className={styles.titleAccent}>your team.</span></h1>
            <p className={styles.lede} id="partner-answer">{PARTNER_ANSWER}</p>
            <div className={styles.actions}>
              <PartnershipInquiryButton className={styles.primary} label="Start a partnership conversation" defaultSubject={PARTNER_SUBJECT} />
              <a className={styles.secondary} href="#how-it-works">See how it works</a>
            </div>
            <p className={styles.partnerProof}>Working with <a href="#current-partners">Queen Creek Chamber of Commerce and Buda EDC</a>.</p>
          </div>
          <div className={`${styles.heroImage} ${styles.partnerImage}`}><Image src="/page-heroes/partner-community-v2.png" alt="A small-business owner and community-development partners reviewing a growth plan" fill priority sizes="(max-width: 900px) 100vw, 45vw" /></div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.partnerSection}`} id="why-moil">
        <div className={styles.sectionHeader}>
          <div><span className={styles.eyebrow}>WHY PARTNERS USE MOIL</span><h2 className={styles.sectionHeading}>Serve more businesses without hiring more people.</h2></div>
          <p className={styles.sectionCopy}>Every business you support needs the same kinds of work: research, a plan, documents, marketing content. Doing that by hand for each one is why programs stall at the size of their staff.</p>
        </div>
        <div className={styles.pathGrid}>{WHY_CARDS.map((card) => <article key={card.title} className={styles.benefitCard}><h3>{card.title}</h3><p>{card.copy}</p></article>)}</div>
      </section>

      <section className={styles.section} id="what-businesses-get">
        <div className={styles.splitPanel}>
          <div>
            <span className={styles.eyebrow}>WHAT EACH BUSINESS GETS</span>
            <h2 className={styles.sectionHeading}>What does each business in your program get?</h2>
            <p className={styles.splitCopy}>Each owner gets a co-founder that knows their business. Depending on the plan, that includes:</p>
            <p className={styles.splitNote}>{PLAN_LINE} <Link href="/business/pricing">See plans and pricing</Link>.</p>
          </div>
          <ul className={styles.checkList}>{BUSINESS_GETS.map((item) => <li key={item}><Check size={17} aria-hidden="true" /><span>{item}</span></li>)}</ul>
        </div>
      </section>

      <section className={styles.section} id="program-fit">
        <div className={styles.sectionHeader}>
          <div><span className={styles.eyebrow}>TWO WAYS TO USE IT</span><h2 className={styles.sectionHeading}>How can Moil fit the programs you already run?</h2></div>
          <p className={styles.sectionCopy}>Use it as a resource you offer, as part of an incentive you already give, or both. {USE_CASE_NOTE}</p>
        </div>
        <div className={styles.useGrid}>{USE_CASES.map((useCase) => <article key={useCase.title} className={styles.useCard}>
          <span className={styles.pathNumber}>{useCase.kicker}</span>
          <h3>{useCase.title}</h3>
          <p>{useCase.copy}</p>
          <small>{useCase.fits}</small>
        </article>)}</div>
        <div className={styles.inlineCta}><PartnershipInquiryButton className={styles.primary} label="Tell us about your program" defaultSubject={PARTNER_SUBJECT} /></div>
      </section>

      <section className={styles.section} id="how-it-works">
        <div className={styles.sectionHeader}>
          <div><span className={styles.eyebrow}>HOW IT WORKS</span><h2 className={styles.sectionHeading}>What does getting started look like?</h2></div>
          <p className={styles.sectionCopy}>A short conversation, a clear agreement on who is covered, and a first group working with real output.</p>
        </div>
        <ol className={styles.stepGrid}>{STEPS.map(([number, title, copy]) => <li key={number} className={styles.stepCard}><span className={styles.pathNumber}>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      </section>

      <section className={styles.section} id="cost">
        <div className={styles.costPanel}>
          <div>
            <span className={styles.eyebrow}>THE COST CASE</span>
            <h2 className={styles.sectionHeading}>How does the cost compare with doing it by hand?</h2>
            <p className={styles.splitCopy}>Both figures below are monthly. List price is shown for scale. Partner pricing is set per program.</p>
          </div>
          <dl className={styles.costFigures}>
            <div><dt>One business, with an agency</dt><dd>{COST_EXAMPLE.agencyRange}</dd><small>The usual range for a small-business social and content retainer.</small></div>
            <div><dt>{COST_EXAMPLE.businesses} businesses, with Moil</dt><dd>{COST_EXAMPLE.total}</dd><small>At list price on Market Pro, the higher of the two plans.</small></div>
          </dl>
          <p className={styles.costNote}>An agency also gives judgement and accountability, which Moil does not. Read the <Link href="/compare/moil-vs-agency">full comparison with a marketing agency</Link>.</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.partnerSection}`} id="current-partners">
        <div className={styles.sectionHeader}>
          <div><span className={styles.eyebrow}>COMMUNITY PARTNERS</span><h2 className={styles.sectionHeading}>Who already partners with Moil?</h2></div>
          <p className={styles.sectionCopy}>Our community partners are already close to the business owners shaping their local economies. Moil helps make the next step more practical.</p>
        </div>
        <div className={styles.edcGrid}>
          {edcPartners.map((partner) => <article className={styles.edcCard} key={partner.name}>
            <a href={partner.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${partner.name}`}>
              <div className={styles.edcTopline}><span className={styles.edcNumber}>{partner.number}</span><span>{partner.kind}</span><ArrowUpRight size={18} aria-hidden="true" /></div>
              <div className={`${styles.edcBrand} ${partner.brand === 'queenCreek' ? styles.edcBrandQueenCreek : styles.edcBrandBuda}`}>
                <Image src={partner.logo} alt={partner.logoAlt} fill sizes="(max-width: 900px) 100vw, 45vw" />
              </div>
              <h3>{partner.name}</h3>
              <div className={styles.edcLocation}><MapPin size={15} aria-hidden="true" />{partner.location}</div>
              <p>{partner.copy}</p>
              <span className={styles.edcVisit}>Visit organization <ArrowUpRight size={15} aria-hidden="true" /></span>
            </a>
          </article>)}
        </div>
      </section>

      <section className={styles.section} id="limits">
        <div className={styles.splitPanel}>
          <div>
            <span className={styles.eyebrow}>HONEST LIMITS</span>
            <h2 className={styles.sectionHeading}>What does Moil not do?</h2>
            <p className={styles.splitCopy}>A partnership works best when you know where Moil stops.</p>
          </div>
          <ul className={styles.limitList}>{LIMITS.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>

      <section className={styles.section} id="faq">
        <div className={styles.sectionHeader}>
          <div><span className={styles.eyebrow}>QUESTIONS PARTNERS ASK</span><h2 className={styles.sectionHeading}>Direct answers for program leaders.</h2></div>
          <p className={styles.sectionCopy}>Not here? Send us the question and we will answer it plainly.</p>
        </div>
        <div className={styles.faqList}>{FAQS.map((item) => <details key={item.question} className={styles.faqItem}><summary><h3>{item.question}</h3></summary><p>{item.answer}</p></details>)}</div>
        <nav className={styles.relatedLinks} aria-label="Related pages">{PARTNER_LINKS.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>
      </section>

      <section className={styles.section}>
        <div className={styles.partnerPanel}><div><span className={styles.eyebrow}>LET&apos;S MAKE IT USEFUL</span><h2>Start with the owners you want to help most.</h2><p>Tell us about your community, the businesses you support, and the work that keeps getting stuck. We will explore whether a Moil partnership can make that work lighter.</p></div><PartnershipInquiryButton className={styles.primary} label="Talk to Moil" defaultSubject={PARTNER_SUBJECT} /></div>
      </section>
    </main>
  );
}
