"use client";

import { useState } from "react";
import { Languages, Search, ArrowRight, Mic } from "lucide-react";
import {
  CandidateCTA,
  Checklist,
  SectionLabel,
  useCandidateCopy,
  styles,
  type CandidateSectionProps,
} from "../components/landing/elements";

export default function BilingualSection(props: CandidateSectionProps) {
  const copy = useCandidateCopy();
  const [previewLanguage, setPreviewLanguage] = useState<"en" | "es">("en");
  const spanish = previewLanguage === "es";
  return (
    <section
      className={`${styles.section} ${styles.bilingualSection}`}
      aria-labelledby="bilingual-heading"
    >
      <div className={styles.container}>
        <SectionLabel number="03">
          {copy("Bilingual Voice Platform", "Plataforma bilingüe por voz")}
        </SectionLabel>
        <div className={styles.featureSplit}>
          <div className={styles.featureCopy}>
            <h2 id="bilingual-heading">
              {copy("Speak Your Language,", "Habla tu idioma,")}{" "}
              <span className={styles.accent}>
                {copy("Find Your Job", "encuentra tu trabajo")}
              </span>
            </h2>
            <p className={styles.intro}>
              {copy(
                "Navigate the entire platform using voice commands in English or Spanish. Switch languages seamlessly and get personalized job recommendations in your preferred language.",
                "Navega por la plataforma con comandos de voz en inglés o español. Cambia de idioma fácilmente y recibe recomendaciones de empleo en tu idioma preferido.",
              )}
            </p>
            <Checklist
              items={[
                copy(
                  "Real-time language switching",
                  "Cambio de idioma en tiempo real",
                ),
                copy(
                  "Voice commands in both languages",
                  "Comandos de voz en ambos idiomas",
                ),
                copy(
                  "Translated job descriptions",
                  "Descripciones de empleo traducidas",
                ),
                copy(
                  "Bilingual interview practice",
                  "Práctica de entrevistas bilingüe",
                ),
              ]}
            />
            <CandidateCTA {...props}>
              {copy("Try Voice Features", "Prueba las funciones de voz")}
            </CandidateCTA>
          </div>
          <figure className={styles.languageStage}>
            <figcaption className={styles.stageCaption}>
              <span>
                <Languages size={18} aria-hidden="true" />
                {copy(
                  "One platform. Both languages.",
                  "Una plataforma. Ambos idiomas.",
                )}
              </span>
            </figcaption>
            <div className={styles.languageTitle} aria-hidden="true">
              <span>EN</span>
              <ArrowRight size={32} />
              <span>ES</span>
            </div>
            <div
              className={styles.languageToggle}
              role="group"
              aria-label={copy("Preview language", "Idioma de la vista previa")}
            >
              <button
                type="button"
                aria-pressed={!spanish}
                onClick={() => setPreviewLanguage("en")}
              >
                English
              </button>
              <button
                type="button"
                aria-pressed={spanish}
                onClick={() => setPreviewLanguage("es")}
              >
                Español
              </button>
            </div>
            <div
              className={styles.languageExample}
              lang={previewLanguage}
              aria-live="polite"
            >
              <span className={styles.smallLabel}>
                {spanish ? "BÚSQUEDA POR VOZ" : "VOICE SEARCH"}
              </span>
              <div className={styles.searchExample}>
                <Search size={20} aria-hidden="true" />
                <p>
                  {spanish
                    ? "Encuentra trabajos de construcción cerca de mí"
                    : "Find construction jobs near me"}
                </p>
                <Mic size={20} aria-hidden="true" />
              </div>
              <div className={styles.exampleRow}>
                <span>
                  {spanish ? "Práctica de entrevistas" : "Interview practice"}
                </span>
                <span>{spanish ? "En español" : "In English"}</span>
              </div>
              <div className={styles.exampleRow}>
                <span>{spanish ? "Tu currículum" : "Your resume"}</span>
                <span>{spanish ? "En español" : "In English"}</span>
              </div>
            </div>
            <p className={styles.previewNote}>
              {copy(
                "Try the language preview above.",
                "Prueba la vista previa de idiomas.",
              )}
            </p>
          </figure>
        </div>
      </div>
    </section>
  );
}
