"use client";

import {
  CandidateCTA,
  SectionLabel,
  useCandidateCopy,
  styles,
  type CandidateSectionProps,
} from "../components/landing/elements";

export default function StatsSection(props: CandidateSectionProps) {
  const copy = useCandidateCopy();
  const benefits = [
    [
      copy("Free", "Gratis"),
      copy("To Create a Profile", "Crear un perfil"),
      copy(
        "No cost to build a profile and apply",
        "Crea un perfil y postúlate sin costo",
      ),
    ],
    [
      copy("Voice", "Voz"),
      copy("Or Type", "O escribe"),
      copy(
        "Build a resume by speaking, in either language",
        "Crea un currículum hablando, en cualquiera de los dos idiomas",
      ),
    ],
    [
      "EN/ES",
      copy("Fully Bilingual", "Totalmente bilingüe"),
      copy(
        "Every feature in English and Spanish",
        "Todas las funciones en inglés y español",
      ),
    ],
    [
      copy("Open", "Abierto"),
      copy("To Every Trade", "A todos los oficios"),
      copy(
        "Skilled trades, services, hospitality and more",
        "Oficios, servicios, hospitalidad y más",
      ),
    ],
  ];
  return (
    <section
      className={`${styles.section} ${styles.benefitsSection}`}
      aria-labelledby="benefits-heading"
    >
      <div className={styles.container}>
        <SectionLabel number="04">
          {copy("Built around you", "Diseñado para ti")}
        </SectionLabel>
        <div className={styles.benefitsHeading}>
          <h2 id="benefits-heading">
            {copy("Ready to Transform", "¿Listo para transformar")}
            <br />
            {copy("Your Career?", "tu carrera?")}
          </h2>
          <CandidateCTA {...props} orange>
            {copy("Start Your Journey Today", "Empieza tu camino hoy")}
          </CandidateCTA>
        </div>
        <div className={styles.benefitGrid}>
          {benefits.map(([value, title, description], i) => (
            <div className={styles.benefit} key={title}>
              <span className={styles.benefitNumber}>0{i + 1}</span>
              <strong>{value}</strong>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
