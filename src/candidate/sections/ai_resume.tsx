"use client";

import {
  AudioLines,
  FileCheck2,
  Languages,
  Zap,
  FileText,
  Check,
} from "lucide-react";
import {
  CandidateCTA,
  SectionLabel,
  useCandidateCopy,
  styles,
  type CandidateSectionProps,
} from "../components/landing/elements";

export default function AIResumeSection(props: CandidateSectionProps) {
  const copy = useCandidateCopy();
  const features = [
    {
      icon: AudioLines,
      title: copy("Voice Input", "Entrada por voz"),
      description: copy(
        "Speak your experience naturally",
        "Cuenta tu experiencia con naturalidad",
      ),
    },
    {
      icon: FileCheck2,
      title: copy("ATS Optimized", "Optimizado para ATS"),
      description: copy(
        "An employer-friendly format",
        "Un formato fácil de leer para empleadores",
      ),
    },
    {
      icon: Zap,
      title: copy("Lightning Fast", "En pocos minutos"),
      description: copy(
        "Complete in under 5 minutes",
        "Termina en menos de 5 minutos",
      ),
    },
    {
      icon: Languages,
      title: copy("Multi-Language", "Multilingüe"),
      description: copy("English & Spanish", "Inglés y español"),
    },
  ];
  return (
    <section
      className={`${styles.section} ${styles.resumeSection}`}
      aria-labelledby="resume-heading"
    >
      <div className={styles.container}>
        <SectionLabel number="01">
          {copy("AI-Powered Resume Builder", "Creador de currículums con IA")}
        </SectionLabel>
        <div className={styles.featureSplit}>
          <div className={styles.featureCopy}>
            <h2 id="resume-heading">
              {copy("Professional Resumes in", "Currículums profesionales en")}{" "}
              <span className={styles.accent}>
                {copy("5 Minutes", "5 minutos")}
              </span>
            </h2>
            <p className={styles.intro}>
              {copy(
                "Transform your career with AI-generated resumes. Use voice input or text to create ATS-optimized, professional resumes that get you noticed by employers.",
                "Transforma tu carrera con currículums creados con IA. Usa tu voz o escribe para crear un currículum profesional, optimizado para ATS, que destaque ante los empleadores.",
              )}
            </p>
            <div className={styles.featureGrid}>
              {features.map(({ icon: Icon, title, description }) => (
                <div className={styles.feature} key={title}>
                  <Icon size={21} aria-hidden="true" />
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </div>
              ))}
            </div>
            <CandidateCTA {...props}>
              {copy("Start Building Now", "Crea tu currículum")}
            </CandidateCTA>
            <p className={styles.finePrint}>
              {copy(
                "No credit card required · Free to start",
                "Sin tarjeta de crédito · Empieza gratis",
              )}
            </p>
          </div>
          <figure className={styles.resumeStage}>
            <figcaption className={styles.stageCaption}>
              <span>
                <FileText size={16} aria-hidden="true" />
                {copy(
                  "Your experience. Professionally presented.",
                  "Tu experiencia. Una presentación profesional.",
                )}
              </span>
              <span>{copy("Example", "Ejemplo")}</span>
            </figcaption>
            <div className={styles.resumePaper}>
              <div className={styles.paperTop}>
                <span className={styles.monogram}>SJ</span>
                <span className={styles.paperTag}>
                  {copy("PROFESSIONAL PROFILE", "PERFIL PROFESIONAL")}
                </span>
              </div>
              <h3>Sarah Johnson</h3>
              <p className={styles.paperRole}>
                {copy("Software Developer", "Desarrolladora de software")}
              </p>
              <div className={styles.paperRule} />
              <h4>{copy("Experience", "Experiencia")}</h4>
              <strong>
                {copy(
                  "Frontend Developer · Tech Corp",
                  "Desarrolladora frontend · Tech Corp",
                )}
              </strong>
              <p>{copy("2022 – Present", "2022 – Actualidad")}</p>
              <div className={styles.documentLines} aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <h4>{copy("Skills", "Habilidades")}</h4>
              <div className={styles.skillTags}>
                {["React", "JavaScript", "TypeScript", "CSS"].map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
              <div className={styles.paperFooter}>
                <Check size={15} aria-hidden="true" />
                {copy("ATS-friendly format", "Formato compatible con ATS")}
                <span>01</span>
              </div>
            </div>
            <div className={styles.voiceNote}>
              <span className={styles.voiceIcon}>
                <AudioLines size={24} aria-hidden="true" />
              </span>
              <div>
                <strong>
                  {copy("Start with your voice", "Empieza con tu voz")}
                </strong>
                <p>
                  {copy(
                    "Moil takes care of the words.",
                    "Moil se encarga de las palabras.",
                  )}
                </p>
              </div>
              <span className={styles.miniWave} aria-hidden="true">
                {[12, 22, 16, 30, 20, 12, 25, 16].map((height, i) => (
                  <i key={i} style={{ height }} />
                ))}
              </span>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
