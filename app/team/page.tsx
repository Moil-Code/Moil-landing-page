import type { Metadata } from 'next';
import Image from 'next/image';
import { baseURL1 } from '../../src/common/constants/baseUrl';
import styles from '../showcase-pages.module.css';

export const metadata: Metadata = {
  title: 'The team behind Moil',
  description: 'Meet the people building a more useful operating partner for small-business owners.',
  alternates: { canonical: `${baseURL1}/team` },
};

const principles = [
  ['START WITH THE REAL JOB', 'We pay attention to the work owners have to finish after the customer leaves, not only the work that looks good in a product demo.'],
  ['MAKE THE NEXT STEP CLEAR', 'A good tool reduces the number of decisions an owner needs to make before useful work can begin.'],
  ['RESPECT THE PERSON USING IT', 'Clarity, honest limits, and bilingual access are not polish. They are part of whether a tool is genuinely useful.'],
] as const;

export default function TeamPage() {
  return <main className={styles.page}>
    <section className={`${styles.hero} ${styles.simpleHero}`}><div className={styles.heroInner}><div><span className={styles.eyebrow}>THE PEOPLE BEHIND MOIL</span><h1 className={styles.title}>Built for owners who cannot afford another thing to <span className={styles.titleAccent}>manage.</span></h1><p className={styles.lede}>Moil is a small team building a more capable co-founder for the businesses that keep communities moving.</p></div><div className={styles.heroImage}><Image src="/page-heroes/team-owners.png" alt="Small-business owners collaborating in their bakery" fill priority sizes="(max-width: 900px) 100vw, 45vw" /></div></div></section>
    <section className={styles.section}><div className={styles.sectionHeader}><div><span className={styles.eyebrow}>HOW WE WORK</span><h2 className={styles.sectionHeading}>The standard we hold ourselves to.</h2></div><p className={styles.sectionCopy}>We are designing for the moment after an owner closes this tab: the work should be clearer, lighter, and more possible than it was before.</p></div><div className={styles.teamGrid}>{principles.map(([label, copy]) => <article className={styles.teamCard} key={label}><span>{label}</span><h3>{label === 'START WITH THE REAL JOB' ? 'Useful beats impressive.' : label === 'MAKE THE NEXT STEP CLEAR' ? 'Complexity is not a feature.' : 'Trust is built in the details.'}</h3><p>{copy}</p></article>)}</div></section>
  </main>;
}
