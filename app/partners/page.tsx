import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { baseURL1 } from '../../src/common/constants/baseUrl';
import styles from '../showcase-pages.module.css';

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

export default function PartnersPage() {
  return (
    <main className={styles.page}>
      <section className={`${styles.hero} ${styles.partnerHero}`}>
        <div className={styles.heroInner}>
          <div>
            <span className={styles.eyebrow}>MOIL PARTNERSHIPS</span>
            <h1 className={styles.title}>More capacity for the businesses your community <span className={styles.titleAccent}>depends on.</span></h1>
            <p className={styles.lede}>Moil partners with organizations that are already close to small-business owners—ADC partners, economic-development groups, chambers, and community builders.</p>
            <div className={styles.actions}><a className={styles.primary} href="mailto:cs@moilapp.com?subject=Moil%20partnership%20inquiry">Start a partnership conversation <ArrowUpRight size={17} aria-hidden="true" /></a></div>
          </div>
          <div className={`${styles.heroImage} ${styles.partnerImage}`}><Image src="/page-heroes/partner-community.png" alt="A small-business owner and community partner planning together" fill priority sizes="(max-width: 900px) 100vw, 45vw" /></div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><div><span className={styles.eyebrow}>A BETTER WAY TO SUPPORT OWNERS</span><h2 className={styles.sectionHeading}>Build on the trust you already have.</h2></div><p className={styles.sectionCopy}>The strongest partnership is not a logo exchange. It is a useful next step for the owner who walks through your door.</p></div>
        <div className={styles.pathGrid}>{paths.map(([number, title, copy]) => <article key={number} className={styles.pathCard}><span className={styles.pathNumber}>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className={styles.section}>
        <div className={styles.partnerPanel}><div><span className={styles.eyebrow}>LET&apos;S MAKE IT USEFUL</span><h2>Start with the owners you want to help most.</h2><p>Tell us about your community, the businesses you support, and the work that keeps getting stuck. We will explore whether a Moil partnership can make that work lighter.</p></div><a className={styles.primary} href="mailto:cs@moilapp.com?subject=Moil%20partnership%20inquiry">Talk to Moil <ArrowUpRight size={17} aria-hidden="true" /></a></div>
      </section>
    </main>
  );
}
