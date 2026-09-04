import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Bug, Copyright, HeartHandshake, Mail, PanelsTopLeft, ShieldCheck } from 'lucide-react';
import { baseURL1 } from '../../src/common/constants/baseUrl';
import { COMPANY_ADDRESS, COMPANY_NAME, CONTACT_EMAIL } from '../../src/common/constants/company';
import styles from '../showcase-pages.module.css';
import { PartnershipInquiryButton } from '../partners/PartnershipInquiryButton';

const contactRoutes = [
  { number: '01', title: 'General questions & support', copy: 'Account questions, product guidance, or help finding the right place to start.', subject: 'General question', icon: Mail },
  { number: '02', title: 'Partnerships & community programs', copy: 'Programs for chambers, EDCs, associations, and organizations supporting local owners.', subject: 'Moil partnership inquiry', icon: HeartHandshake },
  { number: '03', title: 'Small-business website projects', copy: 'Talk with us about a clearer, more credible digital home for your business.', subject: 'Website project inquiry', icon: PanelsTopLeft },
  { number: '04', title: 'Privacy requests', copy: 'Access, correct, delete, or ask questions about the personal information we hold.', subject: 'Privacy Request', icon: ShieldCheck },
  { number: '05', title: 'Copyright & DMCA notices', copy: 'Report copyrighted material or send a formal notice to our designated contact.', subject: 'DMCA Notice', icon: Copyright },
  { number: '06', title: 'Report a security issue', copy: 'Let us know privately about a potential vulnerability or security concern.', subject: 'Security Report', icon: Bug },
] as const;

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
        <div className={`${styles.contactCard} ${styles.contactPrimary}`}>
          <div className={styles.contactIntro}>
            <div><span className={styles.eyebrow}>START A CONVERSATION</span><h2>Choose the right starting point.</h2></div>
            <p>Pick the route closest to what you need. Your message will reach the team best placed to help.</p>
          </div>
          <div className={styles.contactLinks}>
            {contactRoutes.map((route) => {
              const Icon = route.icon;
              const content = <><span className={styles.contactLinkTop}><span className={styles.contactIcon}><Icon size={18} aria-hidden="true" /></span><span>{route.number}</span></span><strong>{route.title}</strong><small>{route.copy}</small><span className={styles.contactLinkAction}>Start here <ArrowUpRight size={14} aria-hidden="true" /></span></>;

              return <PartnershipInquiryButton key={route.number} className={styles.contactLink} label={route.title} defaultSubject={route.subject} destination="contact">{content}</PartnershipInquiryButton>;
            })}
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
