import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Gauge, Palette, Search } from 'lucide-react';
import { baseURL1 } from '../../src/common/constants/baseUrl';
import styles from '../showcase-pages.module.css';

export const metadata: Metadata = {
  title: 'Website design for small businesses',
  description: 'A closer look at the digital experiences Moil designs for small businesses that need to look credible, clear, and ready to grow.',
  alternates: { canonical: `${baseURL1}/work` },
};

const work = [
  {
    number: '01',
    name: 'Bluebonnet Bookkeeping',
    kind: 'Financial services · Buda, Texas',
    copy: 'A poised, high-trust digital presence that turns bookkeeping into a clear and confident next step.',
    image: '/work-sites/bluebonnet-bookkeeping.png',
    href: 'https://bluebonnetbookkeepingtx.com/',
  },
  {
    number: '02',
    name: 'Refinery Fitness of Buda',
    kind: 'Personal training · Buda, Texas',
    copy: 'A high-energy training site with a visual system built to move visitors directly toward an introduction.',
    image: '/work-sites/refinery-fitness.png',
    href: 'https://www.refineryfitness.biz/',
  },
  {
    number: '03',
    name: 'Meridian Buda',
    kind: 'Coffee, live music & community · Buda, Texas',
    copy: 'A warm, editorial home for a destination where hospitality, events, and atmosphere all matter.',
    image: '/work-sites/meridian-buda.png',
    href: 'https://www.meridianbuda.com/',
  },
  {
    number: '04',
    name: 'Barber Addy',
    kind: 'Personal grooming · South Austin, Texas',
    copy: 'An appointment-first experience that pairs refined service detail with an unmistakably personal point of view.',
    image: '/work-sites/barber-addy.png',
    href: 'https://www.barberaddy.com/',
  },
  {
    number: '05',
    name: 'Empowered Wellness with Inna',
    kind: 'Root-cause nutrition · Austin, Texas',
    copy: 'A reassuring, human site that makes a complex wellness journey feel understandable and approachable.',
    image: '/work-sites/empowered-within.png',
    href: 'https://www.empoweredwithinna.com/',
  },
  {
    number: '06',
    name: 'Connectex Solutions',
    kind: 'Technology advisory · Austin, Texas',
    copy: 'A focused technology brand built around clarity, credibility, and a strong reason to begin a conversation.',
    image: '/work-sites/connectex-solutions.png',
    href: 'https://www.connectex.net/',
  },
] as const;

export default function WorkPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <span className={styles.eyebrow}>SELECTED DIGITAL EXPERIENCES</span>
            <h1 className={styles.title}>A website should make a small business feel <span className={styles.titleAccent}>inevitable.</span></h1>
            <p className={styles.lede}>Moil designs clear, high-conviction websites for owners ready to look as established online as they are in real life.</p>
            <div className={styles.actions}>
              <a className={styles.primary} href="mailto:cs@moilapp.com?subject=Website%20project%20inquiry">Talk about a website <ArrowUpRight size={17} aria-hidden="true" /></a>
              <a className={styles.secondary} href="#work">See the approach <ArrowRight size={17} aria-hidden="true" /></a>
            </div>
          </div>
          <div className={styles.workHeroVisual}>
            <div className={styles.workHeroFrame}>
              <Image src="/work-sites/bluebonnet-bookkeeping.png" alt="Bluebonnet Bookkeeping website homepage" fill priority sizes="(max-width: 900px) 100vw, 48vw" />
            </div>
            <div className={styles.workHeroCaption}><span>SELECTED WORK</span><strong>Distinct brands, made unmistakable.</strong></div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="work">
        <div className={styles.sectionHeader}><div><span className={styles.eyebrow}>THE WORK</span><h2 className={styles.sectionHeading}>A few of the websites we&apos;ve made unmistakable and many more.</h2></div><p className={styles.sectionCopy}>Each site begins with the way its business actually earns trust,then gives people a clear reason to take the next step.</p></div>
        <div className={styles.showcaseGrid}>
          {work.map((item) => <article className={styles.showcaseCard} key={item.name}>
            <a href={item.href} target="_blank" rel="noreferrer" aria-label={`Visit ${item.name}`}>
              <div className={styles.casePreview}><Image src={item.image} alt={`${item.name} website homepage`} fill sizes="(max-width: 780px) 100vw, 50vw" /></div>
              <div className={styles.caseMeta}><span className={styles.caseNumber}>{item.number}</span><span className={styles.caseKind}>{item.kind}</span><ArrowUpRight size={18} aria-hidden="true" /></div>
              <div className={styles.caseCopy}><h3>{item.name}</h3><p>{item.copy}</p></div>
            </a>
          </article>)}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.principles}><div className={styles.principlesLead}><span className={styles.eyebrow}>DESIGNED TO WORK HARD</span><h2>Beautiful is the starting point, not the strategy.</h2></div><div className={styles.principleList}>
          <div className={styles.principle}><Search size={20} aria-hidden="true" /><h3>Easy to understand</h3><p>Every page earns its place by answering a customer question or making a useful next step obvious.</p></div>
          <div className={styles.principle}><Palette size={20} aria-hidden="true" /><h3>Specific to the business</h3><p>A visual identity should carry the texture and confidence of the people behind it—not a trend for its own sake.</p></div>
          <div className={styles.principle}><Gauge size={20} aria-hidden="true" /><h3>Ready to grow with</h3><p>Designed as a durable business asset: fast, usable on every device, and flexible enough for what comes next.</p></div>
        </div></div>
      </section>
    </main>
  );
}
