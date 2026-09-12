"use client";

import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Quote } from "lucide-react";
import {
  FACEBOOK_RECOMMENDATION_COUNT,
  REVIEWS,
} from "../../common/data/reviews";
import { useLanguageContext } from "../../common/components/I18nProvider";
import {
  SectionLabel,
  useCandidateCopy,
  styles,
} from "../components/landing/elements";

// Candidate testimonials must remain verbatim and sourced. The job-marketplace
// review is the only published review specifically about the candidate tools.
const candidateReview = REVIEWS.find((review) => review.topic === "jobs");

export default function TestimonialsSection() {
  const copy = useCandidateCopy();
  const { lang } = useLanguageContext();

  if (!candidateReview) return null;

  return (
    <section
      className={`${styles.section} ${styles.testimonialSection}`}
      aria-labelledby="testimonials-heading"
    >
      <div className={styles.container}>
        <SectionLabel number="05">
          {copy("Testimonials", "Testimonios")}
        </SectionLabel>

        <div className={styles.testimonialHeading}>
          <h2 id="testimonials-heading">
            {copy("Real progress,", "Progreso real,")}{" "}
            <span className={styles.accent}>
              {copy("in their own words.", "en sus propias palabras.")}
            </span>
          </h2>
          <div>
            <p className={styles.intro}>
              {copy(
                "A story from the Moil community, published exactly as it was shared.",
                "Una historia de la comunidad Moil, publicada exactamente como fue compartida.",
              )}
            </p>
            <Link className={styles.textLink} href={`/reviews?lg=${lang}`}>
              {copy(
                "Read every review, with sources",
                "Lee todas las reseñas y sus fuentes",
              )}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <figure className={styles.testimonialCard}>
          <div className={styles.testimonialQuote}>
            <Quote size={42} strokeWidth={1.15} aria-hidden="true" />
            <blockquote lang="en">
              {candidateReview.text.split("\n\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </blockquote>
            <figcaption>
              <span className={styles.avatar} aria-hidden="true">
                HL
              </span>
              <div>
                <strong>{candidateReview.name}</strong>
                <span>{candidateReview.displayDate[lang]}</span>
              </div>
              {candidateReview.sourceUrl && (
                <a
                  href={candidateReview.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {candidateReview.sourceLabel[lang]}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              )}
            </figcaption>
          </div>

          <aside className={styles.testimonialProof}>
            <span className={styles.proofIcon}>
              <BadgeCheck size={23} aria-hidden="true" />
            </span>
            <p className={styles.proofEyebrow}>
              {copy("VERIFIABLE CUSTOMER WORDS", "PALABRAS VERIFICABLES")}
            </p>
            <h3>
              {copy(
                "Trust comes from the full story.",
                "La confianza nace de la historia completa.",
              )}
            </h3>
            <p>
              {copy(
                "We keep the original wording, date, context, and public source together. We do not invent star ratings.",
                "Conservamos juntos el texto original, la fecha, el contexto y la fuente pública. No inventamos calificaciones.",
              )}
            </p>
            <div className={styles.proofStats}>
              <div>
                <strong>{FACEBOOK_RECOMMENDATION_COUNT}</strong>
                <span>
                  {copy(
                    "Facebook recommendations",
                    "recomendaciones en Facebook",
                  )}
                </span>
              </div>
              <div>
                <strong>100%</strong>
                <span>{copy("original wording", "texto original")}</span>
              </div>
            </div>
          </aside>
        </figure>
      </div>
    </section>
  );
}
