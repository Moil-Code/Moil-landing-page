"use client";

import Link from "next/link";
import { Plus, ArrowUpRight } from "lucide-react";
import {
  SectionLabel,
  useCandidateCopy,
  styles,
} from "../components/landing/elements";

export default function FAQSection() {
  const copy = useCandidateCopy();
  const FAQ = [
    {
      question: "What is Moil?",
      answer:
        "Moil is a platform that connects skilled professionals — including tradespeople, service workers, hospitality staff, logistics workers, and more — with job opportunities. Our AI matches workers with roles that fit their skills, location, and experience, across a wide range of industries and small businesses.",
    },
    {
      question: "How does Moil work?",
      answer:
        "Moil leverages AI to match skilled professionals with job opportunities posted by individuals or businesses in need of services. Users can sign up, create profiles, and start connecting with job opportunities or service providers.",
    },
    {
      question: "How do I create a profile on Moil?",
      answer:
        "To create a profile, go to moilapp.com, sign up with your email or social media accounts, and fill in your details, including your skills, and your experience.",
    },
    {
      question: "How can I find job opportunities on Moil?",
      answer:
        "Once your profile is set up, you can browse through available job listings, apply for jobs that match your skills, and connect with potential employers.",
    },
    {
      question: "Is there a fee to use Moil as a job seeker?",
      answer:
        "Moil’s job search and career tools are free for candidates. You can search jobs, build your AI resume, practice interviews, and apply to positions at no cost.",
    },
    {
      question: "How secure is my data on Moil?",
      answer: (
        <span>
          For details about how Moil handles and protects your data, refer to
          our{" "}
          <Link href="/privacy" className={styles.inlineLink}>
            privacy policy
          </Link>
          .
        </span>
      ),
    },
    {
      question: "How do I report a problem or get support?",
      answer: (
        <span>
          If you encounter any issues or need support, you can contact our
          support team through the app or by emailing{" "}
          <a href="mailto:cs@moilapp.com" className={styles.inlineLink}>
            cs@moilapp.com
          </a>
          .
        </span>
      ),
    },
    {
      question: "How can I provide feedback or suggest improvements?",
      answer: (
        <span>
          We value your feedback! You can provide feedback or suggest
          improvements by emailing{" "}
          <a href="mailto:cs@moilapp.com" className={styles.inlineLink}>
            cs@moilapp.com
          </a>
          .
        </span>
      ),
    },
  ];
  const spanishFAQ = [
    {
      question: "¿Qué es Moil?",
      answer:
        "Moil conecta a profesionales de oficios, servicios, hospitalidad, logística y más con oportunidades de empleo. Nuestra IA relaciona tus habilidades, ubicación y experiencia con trabajos en una amplia variedad de industrias y pequeñas empresas.",
    },
    {
      question: "¿Cómo funciona Moil?",
      answer:
        "Moil usa IA para conectar a profesionales con oportunidades publicadas por personas o empresas. Regístrate, crea tu perfil y empieza a encontrar oportunidades de empleo.",
    },
    {
      question: "¿Cómo creo un perfil en Moil?",
      answer:
        "Ve a moilapp.com, regístrate con tu correo o tus redes sociales y completa tus datos, habilidades y experiencia.",
    },
    {
      question: "¿Cómo encuentro oportunidades de empleo?",
      answer:
        "Cuando tu perfil esté listo, podrás explorar las vacantes, postularte a trabajos que se ajusten a tus habilidades y conectar con empleadores.",
    },
    {
      question: "¿Hay algún costo para buscar empleo en Moil?",
      answer:
        "Las herramientas de búsqueda de empleo y carrera de Moil son gratis para candidatos. Puedes buscar empleos, crear tu currículum con IA, practicar entrevistas y postularte sin costo.",
    },
    {
      question: "¿Cómo protege Moil mis datos?",
      answer: (
        <span>
          Para saber cómo Moil maneja y protege tus datos, consulta nuestra{" "}
          <Link href="/privacy" className={styles.inlineLink}>
            política de privacidad
          </Link>
          .
        </span>
      ),
    },
    {
      question: "¿Cómo reporto un problema o solicito ayuda?",
      answer: (
        <span>
          Contacta a nuestro equipo desde la app o por correo a{" "}
          <a href="mailto:cs@moilapp.com" className={styles.inlineLink}>
            cs@moilapp.com
          </a>
          .
        </span>
      ),
    },
    {
      question: "¿Cómo puedo enviar comentarios o sugerencias?",
      answer: (
        <span>
          ¡Valoramos tu opinión! Envía tus comentarios y sugerencias a{" "}
          <a href="mailto:cs@moilapp.com" className={styles.inlineLink}>
            cs@moilapp.com
          </a>
          .
        </span>
      ),
    },
  ];
  const questions = copy("en", "es") === "es" ? spanishFAQ : FAQ;
  return (
    <section
      className={`${styles.section} ${styles.softSection}`}
      aria-labelledby="faq-heading"
    >
      <div className={styles.container}>
        <SectionLabel number="06">
          {copy("A little more clarity", "Resolvemos tus dudas")}
        </SectionLabel>
        <div className={styles.faqLayout}>
          <div>
            <h2 id="faq-heading">
              {copy("Frequently Asked Questions", "Preguntas frecuentes")}
            </h2>
            <p className={styles.intro}>
              {copy(
                "Find answers to common questions about Moil and how our platform works",
                "Encuentra respuestas a preguntas comunes sobre Moil y cómo funciona la plataforma",
              )}
            </p>
            <a className={styles.supportLink} href="mailto:cs@moilapp.com">
              <span>
                {copy("Still have questions?", "¿Tienes más preguntas?")}
                <strong>cs@moilapp.com</strong>
              </span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
          </div>
          <div className={styles.faqList}>
            {questions.map((faq, i) => (
              <details
                key={faq.question}
                name="candidate-faq"
                className={styles.faqItem}
              >
                <summary>
                  <span className={styles.faqIndex}>0{i + 1}</span>
                  <h3>{faq.question}</h3>
                  <Plus size={20} aria-hidden="true" />
                </summary>
                <div className={styles.faqAnswer}>{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
