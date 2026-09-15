"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  AudioLines,
  FileText,
} from "lucide-react";
import {
  CandidateCTA,
  SectionLabel,
  useCandidateCopy,
  styles,
  type CandidateSectionProps,
} from "../components/landing/elements";

export default function NewsletterSection(props: CandidateSectionProps) {
  const copy = useCandidateCopy();
  // The old email form only logged addresses and displayed a false success.
  // Direct candidates to the existing product and career resources instead.
  return (
    <section
      className={`${styles.section} ${styles.closingSection}`}
      aria-labelledby="updates-heading"
    >
      <div className={styles.container}>
        <SectionLabel number="07">
          {copy("Your next chapter", "Tu próximo capítulo")}
        </SectionLabel>
        <div className={styles.closingGrid}>
          <div>
            <h2 id="updates-heading">
              {copy("Job Opportunities &", "Oportunidades de empleo y")}{" "}
              <span>
                {copy(
                  "AI-Powered Career Insights",
                  "orientación profesional con IA",
                )}
              </span>
            </h2>
            <p className={styles.intro}>
              {copy(
                "Find your next opportunity with personalized job recommendations, interview practice, and career guidance. Start with your free Moil profile.",
                "Encuentra tu próxima oportunidad con recomendaciones de empleo, práctica de entrevistas y orientación profesional. Empieza con tu perfil gratis de Moil.",
              )}
            </p>
            <div className={styles.closingActions}>
              <CandidateCTA {...props} orange>
                {copy("Create Your Free Profile", "Crea tu perfil gratis")}
              </CandidateCTA>
              <Link href="https://blog.moilapp.com" className={styles.textLink}>
                {copy(
                  "Explore career insights",
                  "Explora consejos profesionales",
                )}
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <p className={styles.finePrint}>
              {copy(
                "No credit card required · English & Spanish",
                "Sin tarjeta de crédito · Inglés y español",
              )}
            </p>
          </div>
          <div className={styles.closingSteps}>
            {[
              {
                icon: FileText,
                title: copy("Build your resume", "Crea tu currículum"),
                description: copy(
                  "Your experience, professionally presented",
                  "Tu experiencia con una presentación profesional",
                ),
              },
              {
                icon: AudioLines,
                title: copy(
                  "Practice with confidence",
                  "Practica con confianza",
                ),
                description: copy(
                  "Personalized interview feedback and coaching",
                  "Comentarios y coaching personalizados para entrevistas",
                ),
              },
              {
                icon: Briefcase,
                title: copy(
                  "Find your next opportunity",
                  "Encuentra tu próxima oportunidad",
                ),
                description: copy(
                  "Job recommendations based on your skills and preferences",
                  "Recomendaciones según tus habilidades y preferencias",
                ),
              },
            ].map(({ icon: Icon, title, description }, i) => (
              <div className={styles.closingStep} key={title}>
                <span className={styles.stepIcon}>
                  <Icon size={23} aria-hidden="true" />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                <span className={styles.stepNumber}>0{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
