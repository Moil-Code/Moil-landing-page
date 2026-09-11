import { helpContent, helpFaqItems } from './helpContent';
import { faqJsonLd } from '../utils/faqJsonLd';
import { jsonLd } from '../seo/jsonLd';
import {
  ArrowUpRight,
  BookOpen,
  CircleDollarSign,
  Database,
  Mail,
  PlugZap,
  Rocket,
  Sparkles,
} from 'lucide-react';

const GROUP_ICONS = [Rocket, CircleDollarSign, PlugZap, BookOpen, Database];

/** The shared body of /help and /es/ayuda: one question list, grouped, with FAQPage schema from the same list. */
export function HelpPageBody({ lang }: { lang: 'en' | 'es' }) {
  const page = helpContent[lang];
  const contactHref = '/contact';
  const topicLabel = lang === 'es' ? 'Explora por tema' : 'Browse by topic';
  const answerLabel = lang === 'es' ? 'Respuestas claras' : 'Clear answers';
  const questionCount = page.groups.reduce((total, group) => total + group.items.length, 0);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd(helpFaqItems(lang))) }} />
      <main className="help" lang={lang}>
        <header className="help__hero">
          <div className="help__grid" aria-hidden="true" />
          <div className="help__glow help__glow--orange" aria-hidden="true" />
          <div className="help__glow help__glow--purple" aria-hidden="true" />
          <div className="help__hero-inner">
            <div className="help__intro">
              <p className="help__eyebrow"><Sparkles size={13} aria-hidden="true" /> {page.eyebrow}</p>
              <h1>{page.title}</h1>
              <p className="help__lede">{page.lede}</p>
              <div className="help__meta" aria-label={lang === 'es' ? 'Resumen del centro de ayuda' : 'Help center summary'}>
                <span><strong>{questionCount}</strong>{lang === 'es' ? 'respuestas' : 'answers'}</span>
                <span><strong>{page.groups.length}</strong>{lang === 'es' ? 'temas' : 'topics'}</span>
                <span><strong>EN / ES</strong>{lang === 'es' ? 'ayuda bilingüe' : 'bilingual help'}</span>
              </div>
            </div>

            <div className="help__topic-card" role="navigation" aria-label={topicLabel}>
              <p>{topicLabel}</p>
              <ul className="help__toc">
                {page.groups.map((group, index) => {
                  const Icon = GROUP_ICONS[index] ?? BookOpen;
                  return (
                    <li key={group.id}>
                      <a href={`#${group.id}`}>
                        <span className="help__topic-icon"><Icon size={17} aria-hidden="true" /></span>
                        <span><small>{String(index + 1).padStart(2, '0')}</small>{group.title}</span>
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </header>

        <div className="help__content">
          <div className="help__content-heading">
            <p>{answerLabel}</p>
            <h2>{lang === 'es' ? 'Todo lo esencial, sin rodeos.' : 'Everything essential, without the runaround.'}</h2>
          </div>

          <div className="help__groups">
            {page.groups.map((group, groupIndex) => {
              const Icon = GROUP_ICONS[groupIndex] ?? BookOpen;
              return (
                <section className="help__group" key={group.id} id={group.id}>
                  <div className="help__group-head">
                    <span className="help__group-icon"><Icon size={20} aria-hidden="true" /></span>
                    <div>
                      <p>{String(groupIndex + 1).padStart(2, '0')}</p>
                      <h2>{group.title}</h2>
                    </div>
                  </div>
                  <dl className="help__list">
                    {group.items.map((item, itemIndex) => (
                      <div key={item.question}>
                        <dt><span>{String(itemIndex + 1).padStart(2, '0')}</span>{item.question}</dt>
                        <dd>{item.answer}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              );
            })}
          </div>

          <aside className="help__contact">
            <span className="help__contact-icon"><Mail size={22} aria-hidden="true" /></span>
            <div>
              <p>{lang === 'es' ? '¿Aún necesitas ayuda?' : 'Still need a hand?'}</p>
              <h2>{page.contact}</h2>
            </div>
            <a href={contactHref}>
              {lang === 'es' ? 'Habla con nosotros' : 'Talk to us'} <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </aside>
        </div>
      </main>
    </>
  );
}
