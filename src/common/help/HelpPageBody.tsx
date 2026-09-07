import { helpContent, helpFaqItems } from './helpContent';
import { faqJsonLd } from '../utils/faqJsonLd';
import { jsonLd } from '../seo/jsonLd';

/** The shared body of /help and /es/ayuda: one question list, grouped, with FAQPage schema from the same list. */
export function HelpPageBody({ lang }: { lang: 'en' | 'es' }) {
  const page = helpContent[lang];
  const contactHref = '/contact';
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd(helpFaqItems(lang))) }} />
      <main className="help" lang={lang}>
        <header className="help__head">
          <p className="help__eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p className="help__lede">{page.lede}</p>
          <ul className="help__toc">
            {page.groups.map((g) => (
              <li key={g.id}><a href={`#${g.id}`}>{g.title}</a></li>
            ))}
          </ul>
        </header>
        {page.groups.map((g) => (
          <section key={g.id} id={g.id}>
            <h2>{g.title}</h2>
            <dl className="help__list">
              {g.items.map((item) => (
                <div key={item.question}>
                  <dt>{item.question}</dt>
                  <dd>{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
        <p className="help__contact">
          {page.contact} <a href={contactHref}>{lang === 'es' ? 'Contacto' : 'Contact'}</a>
        </p>
      </main>
    </>
  );
}
