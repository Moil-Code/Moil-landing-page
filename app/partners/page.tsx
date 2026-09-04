import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { baseURL1 } from '../../src/common/constants/baseUrl';
import styles from '../showcase-pages.module.css';
import { PartnershipInquiryButton } from './PartnershipInquiryButton';

export const metadata: Metadata = {
  title: 'Partner with Moil',
  description: 'Partner with Moil to give the small businesses in your community a more capable way to plan, market, and grow.',
  alternates: { canonical: `${baseURL1}/partners` },
};

const paths = [
  ['01', 'Bring a practical tool to your community', 'Give the owners you serve a focused place to build plans, make marketing decisions, and keep moving.'],
  ['02', 'Shape a program around the businesses you know', 'Start with the outcomes your organization is already working toward, then find the right way Moil can support them.'],
  ['03', 'Stay close to the work', 'Build a relationship around real business needs—not a handoff that leaves owners to figure it out alone.'],
] as const;

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

export default function PartnersPage() {
  return (
    <main className={styles.page}>
      <section className={`${styles.hero} ${styles.partnerHero}`}>
        <div className={styles.heroInner}>
          <div>
            <span className={styles.eyebrow}>MOIL PARTNERSHIPS</span>
            <h1 className={styles.title}>More capacity for the businesses your community <span className={styles.titleAccent}>depends on.</span></h1>
            <p className={styles.lede}>Moil partners with organizations that are already close to small-business owners—EDCs, chambers, associations, and community builders.</p>
            <div className={styles.actions}><PartnershipInquiryButton className={styles.primary} label="Start a partnership conversation" /></div>
          </div>
          <div className={`${styles.heroImage} ${styles.partnerImage}`}><Image src="/page-heroes/partner-community-v2.png" alt="A small-business owner and community-development partners reviewing a growth plan" fill priority sizes="(max-width: 900px) 100vw, 45vw" /></div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.partnerSection}`}>
        <div className={styles.sectionHeader}>
          <div><span className={styles.eyebrow}>COMMUNITY PARTNERS</span><h2 className={styles.sectionHeading}>Working alongside the people building stronger local economies.</h2></div>
          <p className={styles.sectionCopy}>Our community partners are already close to the business owners shaping their local economies. Moil helps make the next step more practical.</p>
        </div>
        <div className={styles.edcGrid}>
          {edcPartners.map((partner) => <article className={styles.edcCard} key={partner.name}>
            <a href={partner.href} target="_blank" rel="noreferrer" aria-label={`Visit ${partner.name}`}>
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

      <section className={styles.section}>
        <div className={styles.sectionHeader}><div><span className={styles.eyebrow}>A BETTER WAY TO SUPPORT OWNERS</span><h2 className={styles.sectionHeading}>Build on the trust you already have.</h2></div><p className={styles.sectionCopy}>The strongest partnership is not a logo exchange. It is a useful next step for the owner who walks through your door.</p></div>
        <div className={styles.pathGrid}>{paths.map(([number, title, copy]) => <article key={number} className={styles.pathCard}><span className={styles.pathNumber}>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className={styles.section}>
        <div className={styles.partnerPanel}><div><span className={styles.eyebrow}>LET&apos;S MAKE IT USEFUL</span><h2>Start with the owners you want to help most.</h2><p>Tell us about your community, the businesses you support, and the work that keeps getting stuck. We will explore whether a Moil partnership can make that work lighter.</p></div><PartnershipInquiryButton className={styles.primary} label="Talk to Moil" /></div>
      </section>
    </main>
  );
}
