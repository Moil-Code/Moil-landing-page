"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  useCandidateCopy,
  styles,
  type CandidateSectionProps,
} from "./elements";

export default function CandidateFooter({
  refQuery,
  lgQuery,
}: CandidateSectionProps) {
  const copy = useCandidateCopy();
  const params = new URLSearchParams();
  if (refQuery) params.set("ref", refQuery);
  if (lgQuery) params.set("lg", lgQuery);
  const local = (path: string) => `${path}${params.size ? `?${params}` : ""}`;
  const groups = [
    {
      title: copy("For Job Seekers", "Para candidatos"),
      links: [
        [
          copy("Browse All Jobs", "Explora todos los empleos"),
          lgQuery === "es" ? "/candidate/searchjob?lg=es" : "/candidate/searchjob",
        ],
        [
          copy("Find Jobs", "Encuentra empleos"),
          `${local("/candidate")}#job-search`,
        ],
        [copy("AI Resume", "Currículum con IA"), "#ai-resume"],
        [copy("Voice Assistant", "Asistente de voz"), "#voice-assistant"],
        [copy("Bilingual Features", "Funciones bilingües"), "#bilingual"],
      ],
    },
    {
      title: copy("For Businesses", "Para empresas"),
      links: [
        ["Moil Business", lgQuery === "es" ? "/es/business" : "/business"],
        [
          copy("AI Business Tools", "Herramientas de IA"),
          `${lgQuery === "es" ? "/es/business" : "/business"}#capabilities`,
        ],
        [copy("Pricing Plans", "Planes y precios"), lgQuery === "es" ? "/es/business/pricing" : "/business/pricing"],
        [copy("Post a Job", "Publica un empleo"), lgQuery === "es" ? "/es/business" : "/business"],
      ],
    },
    {
      title: copy("Company", "Empresa"),
      links: [
        [copy("About Us", "Nosotros"), "/about"],
        [copy("Contact", "Contacto"), "/contact"],
        ["Blog", "https://blog.moilapp.com"],
        [copy("Customer reviews", "Reseñas de clientes"), "/reviews"],
      ],
    },
  ];
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <Link href={local("/candidate")} aria-label="Moil">
              <Image
                src="https://res.cloudinary.com/drlcisipo/image/upload/v1705704261/Website%20images/logo_gox0fw.png"
                alt="Moil"
                width={105}
                height={46}
              />
            </Link>
            <p>
              {copy(
                "Empowering businesses and workers with AI-powered tools for hiring, job search, and business growth.",
                "Impulsamos a empresas y trabajadores con herramientas de IA para contratar, buscar empleo y crecer.",
              )}
            </p>
            <span className={styles.footerLanguage}>
              EN / ES{" "}
              <span>{copy("Built for both.", "Hecho para ambos.")}</span>
            </span>
          </div>
          {groups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3>{group.title}</h3>
              {group.links.map(([title, href]) => (
                <Link key={title} href={href}>
                  {title}
                </Link>
              ))}
            </nav>
          ))}
        </div>
        <div className={styles.footerSocial}>
          {[
            ["LinkedIn", "https://www.linkedin.com/company/moilapp"],
            ["Facebook", "https://www.facebook.com/themoilapp"],
            ["Instagram", "https://instagram.com/themoilapp"],
            ["Threads", "https://www.threads.net/@themoilapp"],
          ].map(([label, href]) => (
            <a
              href={href}
              key={label}
              target="_blank"
              rel="noopener noreferrer"
            >
              {label}
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          ))}
        </div>
        <div className={styles.footerBottom}>
          <p>
            © {new Date().getFullYear()} Moil.{" "}
            {copy("All rights reserved.", "Todos los derechos reservados.")}
          </p>
          <nav
            aria-label={copy(
              "Legal and accessibility",
              "Información legal y accesibilidad",
            )}
          >
            {[
              [copy("Privacy Policy", "Privacidad"), "/privacy"],
              [copy("Terms of Service", "Términos"), "/terms"],
              [copy("Cookie Policy", "Cookies"), "/cookies"],
              [
                copy("Your Privacy Choices", "Opciones de privacidad"),
                "/privacy-choices",
              ],
              [copy("Subprocessors", "Subencargados"), "/subprocessors"],
              [copy("Accessibility", "Accesibilidad"), "/accessibility"],
            ].map(([title, href]) => (
              <Link key={href} href={href}>
                {title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
