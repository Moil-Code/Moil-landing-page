import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight, Gauge, Palette, Search } from 'lucide-react';
import { baseURL1 } from '../../src/common/constants/baseUrl';
import styles from '../showcase-pages.module.css';

export const metadata: Metadata = {
  title: 'Website design for small businesses',
  description: 'A closer look at the digital experiences Moil designs for small businesses that need to look credible, clear, and ready to grow.',
  alternates: { canonical: `${baseURL1}/work` },
};

const work = [
  { kind: 'Restaurant & hospitality', name: 'A considered first impression', copy: 'Clear next steps, useful booking paths, and a visual identity that feels as thoughtful as the service.', tone: 'Restaurant' },
  { kind: 'Beauty & wellness', name: 'Confidence before the appointment', copy: 'A calm, polished service experience that makes it easier for new customers to understand, choose, and book.', tone: 'Studio' },
  { kind: 'Trades & home services', name: 'Proof that earns the call', copy: 'A dependable digital front door built around service areas, trust signals, and simple ways to request help.', tone: 'Trades' },
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
          <div className={styles.browser} aria-label="Illustrative small-business website preview">
            <div className={styles.browserTop}><span className={styles.dots}><i /><i /><i /></span><span>LOCAL BUSINESS / ONLINE</span><span>MENU&nbsp;&nbsp; STORY&nbsp;&nbsp; CONTACT</span></div>
            <div className={styles.browserVisual}><div className={styles.browserContent}><span className={styles.browserLabel}>YOUR BUSINESS, CLEARLY</span><div className={styles.browserHeading}>Built to be remembered.</div><div className={styles.browserLine} /><div className={styles.browserLine} /><span className={styles.browserButton}>Start here</span></div></div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="work">
        <div className={styles.sectionHeader}><div><span className={styles.eyebrow}>THE WORK</span><h2 className={styles.sectionHeading}>Distinct businesses. One standard: make the next decision easier.</h2></div><p className={styles.sectionCopy}>These preview directions show how a thoughtful structure and a specific point of view can do more work than a generic template.</p></div>
        <div className={styles.workGrid}>
          {work.map((item, index) => <article className={styles.workCard} key={item.kind}>
            <div className={`${styles.workVisual} ${index === 0 ? styles.workVisualRestaurant : index === 1 ? styles.workVisualStudio : styles.workVisualTrades}`}><div className={styles.workMiniNav}><span className={styles.workWordmark}>{index === 0 ? 'EMBER' : index === 1 ? 'HALO' : 'BUILT RIGHT'}</span><span>ABOUT&nbsp;&nbsp; SERVICES&nbsp;&nbsp; CONTACT</span></div><div className={styles.workVisualTitle}>{item.tone === 'Restaurant' ? 'A table worth booking.' : item.tone === 'Studio' ? 'Care, made clear.' : 'Work you can count on.'}</div></div>
            <div className={styles.workMeta}><span>{item.kind}</span><h3>{item.name}</h3><p>{item.copy}</p></div>
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
