"use client";

import { AudioLines, Mic, Check, MessageSquare } from "lucide-react";
import {
  CandidateCTA,
  Checklist,
  SectionLabel,
  useCandidateCopy,
  styles,
  type CandidateSectionProps,
} from "../components/landing/elements";

export default function VoiceAssistantSection(props: CandidateSectionProps) {
  const copy = useCandidateCopy();
  return (
    <section
      className={`${styles.section} ${styles.softSection} ${styles.voiceSection}`}
      aria-labelledby="voice-heading"
    >
      <div className={styles.container}>
        <SectionLabel number="02">
          {copy(
            "AI Voice Interview Coach",
            "Coach de entrevistas por voz con IA",
          )}
        </SectionLabel>
        <div className={styles.sectionHeading}>
          <h2 id="voice-heading">
            {copy("Master Interviews with", "Domina las entrevistas con")}{" "}
            <span className={styles.accent}>
              {copy("Voice AI Coaching", "coaching de voz con IA")}
            </span>
          </h2>
          <p className={styles.intro}>
            {copy(
              "Transform your interview performance with real-time AI analysis of your speech patterns, confidence levels, and answer quality. Get personalized feedback to land your dream job.",
              "Mejora tus entrevistas con análisis de IA en tiempo real de tu forma de hablar, confianza y calidad de las respuestas. Recibe comentarios personalizados para conseguir tu trabajo ideal.",
            )}
          </p>
        </div>
        <div className={styles.coachGrid}>
          <figure className={styles.coachStage}>
            <figcaption className={styles.coachCaption}>
              <span>
                <AudioLines size={18} aria-hidden="true" />
                {copy("Interview studio", "Estudio de entrevistas")}
              </span>
              <span>{copy("Illustrative preview", "Vista ilustrativa")}</span>
            </figcaption>
            <div className={styles.coachSession}>
              <span className={styles.coachEyebrow}>
                {copy("PRACTICE AT YOUR OWN PACE", "PRACTICA A TU RITMO")}
              </span>
              <div className={styles.micOrb}>
                <Mic size={33} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <p className={styles.question}>
                “
                {copy(
                  "Tell me about your greatest professional achievement.",
                  "Cuéntame sobre tu mayor logro profesional.",
                )}
                ”
              </p>
              <div className={styles.waveform} aria-hidden="true">
                {[
                  8, 14, 24, 12, 32, 44, 25, 50, 34, 20, 43, 56, 32, 45, 25, 52,
                  38, 18, 30, 46, 24, 14, 28, 10, 18,
                ].map((height, i) => (
                  <i key={i} style={{ height }} />
                ))}
              </div>
              <span className={styles.coachHint}>
                {copy(
                  "Your experience. Your words. More confidence.",
                  "Tu experiencia. Tus palabras. Más confianza.",
                )}
              </span>
            </div>
            <div className={styles.feedback}>
              <MessageSquare size={19} aria-hidden="true" />
              <div>
                <strong>
                  {copy("Personalized feedback", "Comentarios personalizados")}
                </strong>
                <p>
                  {copy(
                    "Speech clarity · Pace & rhythm · Confidence",
                    "Claridad · Ritmo al hablar · Confianza",
                  )}
                </p>
              </div>
              <Check size={18} aria-hidden="true" />
            </div>
          </figure>
          <div className={styles.coachCopy}>
            <span className={styles.smallLabel}>
              {copy("READY TO GET HIRED?", "¿LISTO PARA TU PRÓXIMO EMPLEO?")}
            </span>
            <h3>
              {copy(
                "Land Your Next Blue Collar Job",
                "Consigue tu próximo trabajo de oficio",
              )}
            </h3>
            <p>
              {copy(
                "Practice interviews for skilled trades and blue collar positions with AI-powered coaching.",
                "Practica entrevistas para oficios y trabajos manuales con coaching impulsado por IA.",
              )}
            </p>
            <Checklist
              items={[
                copy(
                  "Answer behavioral questions confidently",
                  "Responde con confianza a preguntas de comportamiento",
                ),
                copy(
                  "Highlight your hands-on experience",
                  "Destaca tu experiencia práctica",
                ),
                copy(
                  "Discuss safety protocols effectively",
                  "Explica los protocolos de seguridad",
                ),
                copy(
                  "Negotiate salary and benefits",
                  "Negocia el salario y los beneficios",
                ),
              ]}
            />
            <div className={styles.industryTags}>
              {[
                copy("Construction", "Construcción"),
                copy("Transportation", "Transporte"),
                copy("Manufacturing", "Manufactura"),
                copy("Maintenance", "Mantenimiento"),
              ].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <CandidateCTA {...props} orange>
              {copy(
                "Start Interview Practice Now",
                "Empieza a practicar entrevistas",
              )}
            </CandidateCTA>
            <p className={styles.finePrint}>
              {copy(
                "Free to practice · English & Spanish",
                "Práctica gratis · Inglés y español",
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
