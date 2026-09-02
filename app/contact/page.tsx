import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { baseURL1 } from '../../src/common/constants/baseUrl';
import { COMPANY_ADDRESS, COMPANY_NAME, CONTACT_EMAIL } from '../../src/common/constants/company';
import styles from '../showcase-pages.module.css';

export const metadata: Metadata = {
  title: 'Contact Moil',
  description: 'Talk to Moil about support, partnerships, privacy requests, or a new small-business website.',
  alternates: { canonical: `${baseURL1}/contact` },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return <main className={styles.page}>
    <section className={`${styles.hero} ${styles.simpleHero}`}>
      <div className={styles.heroInner}>
        <div>
          <span className={styles.eyebrow}>CONTACT MOIL</span>
          <h1 className={styles.title}>Let&apos;s make the next move <span className={styles.titleAccent}>useful.</span></h1>
          <p className={styles.lede}>Whether you need help, want to explore a partnership, or have a project in mind, send us a note. We will point you to the right next step.</p>
        </div>
        <div className={styles.heroImage}><Image src="/page-heroes/contact-conversation.png" alt="Two people having a thoughtful business conversation" fill priority sizes="(max-width: 900px) 100vw, 45vw" /></div>
      </div>
    </section>
    <section className={styles.section}>
      <div className={styles.contactGrid}>
        <div className={styles.contactCard}>
          <span className={styles.eyebrow}>START A CONVERSATION</span>
          <h2>What can we help with?</h2>
          <div className={styles.contactLinks}>
            <a className={styles.contactLink} href={`mailto:${CONTACT_EMAIL}?subject=General%20question`}>General questions & support <ArrowUpRight size={18} /></a>
            <a className={styles.contactLink} href={`mailto:${CONTACT_EMAIL}?subject=Moil%20partnership%20inquiry`}>Partnerships & community programs <ArrowUpRight size={18} /></a>
            <a className={styles.contactLink} href={`mailto:${CONTACT_EMAIL}?subject=Website%20project%20inquiry`}>Small-business website projects <ArrowUpRight size={18} /></a>
            <a className={styles.contactLink} href={`mailto:${CONTACT_EMAIL}?subject=Privacy%20Request`}>Privacy requests <ArrowUpRight size={18} /></a>
            <a className={styles.contactLink} href={`mailto:${CONTACT_EMAIL}?subject=DMCA%20Notice`}>Copyright &amp; DMCA notices <ArrowUpRight size={18} /></a>
            <a className={styles.contactLink} href={`mailto:${CONTACT_EMAIL}?subject=Security%20Report`}>Report a security issue <ArrowUpRight size={18} /></a>
          </div>
          <p className={styles.contactNote}>
            For a privacy request we confirm receipt within 10 business days and respond within 45
            days, extendable once by a further 45 days where the request is complex — we will tell
            you if that happens. We verify your identity first, an authorized agent may submit on
            your behalf with written permission, and we will never charge you or give you a lesser
            standard of service for exercising a right. See{' '}
            <Link href="/privacy-choices">Your Privacy Choices</Link>,{' '}
            <Link href="/privacy">Privacy Policy</Link> and{' '}
            <Link href="/dmca">Copyright &amp; DMCA Policy</Link>.
          </p>
        </div>
        <aside className={`${styles.contactCard} ${styles.contactAside}`}>
          <div>
            <span className={styles.eyebrow}>MOIL ENTERPRISE INC.</span>
            <h2>One place to start, even if you do not have all the answers yet.</h2>
            <p>Tell us what is on your plate. We will help you find the most useful way forward.</p>
          </div>
          <div className={styles.contactDetails}>
            <div><span>EMAIL</span><strong>{CONTACT_EMAIL}</strong></div>
            <div><span>LOCATION</span><strong>{COMPANY_ADDRESS}</strong></div>
            <div><span>COMPANY</span><strong>{COMPANY_NAME}</strong></div>
          </div>
        </aside>
      </div>
    </section>
  </main>;
}
