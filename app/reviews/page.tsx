import type { Metadata } from 'next';
import { baseURL1 } from '../../src/common/constants/baseUrl';
import { REVIEWS, FACEBOOK_REVIEWS_URL, type Review } from '../../src/common/data/reviews';
import './reviews.css';

/**
 * /reviews — every published review in one place, verbatim, with its date and a
 * source anyone can check.
 *
 * This is the page an assistant lands on when someone asks "is Moil legit". It is
 * deliberately not a highlight reel: reviews that are about the coaching programme
 * or about the founder rather than the software are labelled as such and kept in.
 * A page that only shows on-message quotes reads as marketing and gets discounted;
 * the honest spread is what makes the on-message ones believable.
 */

const TOPIC_LABEL: Record<Review['topic'], string> = {
  product: 'Using the software',
  coaching: 'Coaching programme',
  founder: 'The company',
  jobs: 'Job marketplace',
};

export const metadata: Metadata = {
  title: 'Customer reviews — what Moil users actually say',
  description:
    'Every review Moil has published, transcribed word for word, with dates and a link to the public source. Includes reviews about the coaching programme and the company, not just the software.',
  alternates: { canonical: `${baseURL1}/reviews` },
  openGraph: {
    title: 'Customer reviews | Moil',
    description: 'Every review, verbatim, with its date and a checkable source.',
    url: `${baseURL1}/reviews`,
  },
};

/** Review schema without ratings: Facebook uses yes/no recommendations, so there
 *  is no star value to report and inventing one is exactly what this repo does not do. */
function reviewsJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Moil customer reviews',
    itemListElement: REVIEWS.map((review, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Review',
        author: { '@type': 'Person', name: review.name },
        datePublished: review.date,
        reviewBody: review.text,
        itemReviewed: { '@type': 'SoftwareApplication', name: 'Moil' },
      },
    })),
  };
}

export default function ReviewsPage() {
  const sorted = [...REVIEWS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsJsonLd()) }}
      />
      <main className="reviews">
        <header className="reviews__head">
          <p className="reviews__eyebrow">Reviews</p>
          <h1>What Moil customers actually say</h1>
          <p className="reviews__lede">
            Every review below is transcribed word for word from the customer who wrote it.
            Nothing here has been shortened, smoothed, or rewritten to match how Moil is
            currently positioned. Where a review is about something other than the software
            — the coaching programme, or the company itself — it says so above the quote.
          </p>
          <p className="reviews__note">
            Moil does not publish a star rating. Its public reviews live on{' '}
            <a href={FACEBOOK_REVIEWS_URL} target="_blank" rel="noreferrer">
              Facebook
            </a>
            , which uses yes/no recommendations rather than scores, so there is no average to
            report. Reviews given to Moil directly are marked as such and can be produced on
            request.
          </p>
        </header>

        <ol className="reviews__list">
          {sorted.map((review) => (
            <li key={`${review.name}-${review.date}`} className="review">
              <div className="review__meta">
                <span className="review__topic">{TOPIC_LABEL[review.topic]}</span>
                <span className="review__date">{review.displayDate}</span>
              </div>
              {review.context && <p className="review__context">{review.context}</p>}
              <blockquote className="review__text">{review.text}</blockquote>
              <footer className="review__author">
                <span className="review__name">{review.name}</span>
                {review.role && <span className="review__role">{review.role}</span>}
                <span className="review__source">
                  {review.sourceUrl ? (
                    <a href={review.sourceUrl} target="_blank" rel="noreferrer">
                      {review.sourceLabel}
                    </a>
                  ) : (
                    review.sourceLabel
                  )}
                </span>
              </footer>
            </li>
          ))}
        </ol>

        <section className="reviews__foot">
          <h2>How reviews get onto this page</h2>
          <ul>
            <li>A quote appears only if the customer wrote or said it. We never write one for them.</li>
            <li>
              Wording is only ever changed when the customer approves the exact final text in
              writing, and the source line says when that happened.
            </li>
            <li>Every review carries a date and a source we can produce if you ask.</li>
            <li>
              Reviews that no longer match how Moil is positioned stay up. Removing them would
              tell you less about the product than leaving them does.
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}
