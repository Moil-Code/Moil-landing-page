"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Quote } from "lucide-react";
import { useLanguageContext } from "../../common/components/I18nProvider";
import {
  SectionLabel,
  useCandidateCopy,
  styles,
} from "../components/landing/elements";

const testimonials = [
  {
    image:
      "https://res.cloudinary.com/drlcisipo/image/upload/v1721126417/Website%20images/image_1_abc62e.png",
    name: "Sierra Givhaan",
    quote:
      "This is a very straightforward and easy site to navigate when creating a quick and accurate resume using AI. Each step of the process is explained well, and from start to finish I was able to update my resume to a more detailed and professional version within minutes. It saved so much time and money... I highly recommend!",
  },
  {
    image:
      "https://res.cloudinary.com/drlcisipo/image/upload/v1721126418/Website%20images/Frame_427320687_wjdblt.png",
    name: "Carlos Zuluaga",
    quote:
      "The app is extremely easy to use and the amazing thing is that you will only write your job duties and the app will develop a well written paragraph about it. With only a few words the app will create a professional resume that will get you hired. I highly recommend using this app for your next job search, you won't be disappointed.",
  },
  {
    image:
      "https://res.cloudinary.com/drlcisipo/image/upload/v1721126418/Website%20images/Frame_427320687_1_lfowbv.png",
    name: "Contreras Ed",
    quote:
      "Easy to navigate app, simple format to search for all kinds of jobs currently hiring in your area. Recently quit my job and used Moil to update my resume. Impressed on how easy it was to create a new one. Definitely recommended Moil as I used other apps in the past and none compared to its effectiveness and user-friendly features 10/10.",
  },
  {
    image:
      "https://res.cloudinary.com/drlcisipo/image/upload/v1721126417/Website%20images/Frame_427320687_2_fnbgix.png",
    name: "Christian Jose Torres",
    quote:
      "Excellent tool to create your resume in a few steps, helped me get a job in Bixby, Oklahoma. Thanks. I recommend her 100%. What I liked most was that the app has AI assistance.",
  },
];

export default function TestimonialsSection() {
  const copy = useCandidateCopy();
  const { lang } = useLanguageContext();
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollFrame = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const lastIndex = Math.max(0, testimonials.length - slidesPerView);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 761px)");
    const syncSlidesPerView = () => setSlidesPerView(media.matches ? 2 : 1);

    syncSlidesPerView();
    media.addEventListener("change", syncSlidesPerView);
    return () => media.removeEventListener("change", syncSlidesPerView);
  }, []);

  useEffect(() => {
    if (activeIndex > lastIndex) {
      setActiveIndex(lastIndex);
    }
  }, [activeIndex, lastIndex]);

  useEffect(
    () => () => {
      if (scrollFrame.current !== null) {
        cancelAnimationFrame(scrollFrame.current);
      }
    },
    [],
  );

  const goTo = (index: number) => {
    const nextIndex = Math.min(Math.max(index, 0), lastIndex);
    const viewport = viewportRef.current;
    const slide = viewport?.children[0]?.children[nextIndex] as
      | HTMLElement
      | undefined;

    setActiveIndex(nextIndex);
    viewport?.scrollTo({ left: slide?.offsetLeft ?? 0, behavior: "smooth" });
  };

  const syncActiveSlide = () => {
    if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current);

    scrollFrame.current = requestAnimationFrame(() => {
      const viewport = viewportRef.current;
      const track = viewport?.children[0];
      if (!viewport || !track) return;

      const slides = Array.from(track.children) as HTMLElement[];
      const nearest = slides.reduce((best, slide, index) => {
        if (index > lastIndex) return best;
        return Math.abs(slide.offsetLeft - viewport.scrollLeft) <
          Math.abs(slides[best].offsetLeft - viewport.scrollLeft)
          ? index
          : best;
      }, 0);

      setActiveIndex(nearest);
    });
  };

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
            {copy("What our users", "Lo que dicen nuestros")}{" "}
            <span className={styles.accent}>
              {copy("are saying.", "usuarios.")}
            </span>
          </h2>
          <div>
            <p className={styles.intro}>
              {copy(
                "Real experiences from people using Moil to strengthen their resumes and move their job search forward.",
                "Experiencias reales de personas que usan Moil para mejorar sus currículums y avanzar en su búsqueda de empleo.",
              )}
            </p>
            <Link className={styles.textLink} href={lang === 'es' ? '/reviews?lg=es' : '/reviews'}>
              {copy("Visit the reviews page", "Visita la página de reseñas")}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div
          className={styles.testimonialViewport}
          ref={viewportRef}
          onScroll={syncActiveSlide}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={copy("Customer testimonials", "Testimonios de clientes")}
        >
          <div className={styles.testimonialTrack}>
            {testimonials.map((testimonial, index) => (
              <article
                className={styles.testimonialCard}
                key={testimonial.name}
                aria-label={`${index + 1} / ${testimonials.length}`}
              >
                <div className={styles.testimonialCardTop}>
                  <Image
                    src={testimonial.image}
                    alt={`${testimonial.name}, Moil customer`}
                    width={64}
                    height={64}
                    className={styles.testimonialPortrait}
                    sizes="64px"
                  />
                  <div>
                    <strong>{testimonial.name}</strong>
                    <span>{copy("Moil user", "Usuario de Moil")}</span>
                  </div>
                  <span className={styles.testimonialQuoteMark} aria-hidden="true">
                    <Quote size={24} strokeWidth={1.5} />
                  </span>
                </div>
                <blockquote lang="en">{testimonial.quote}</blockquote>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.testimonialControls}>
          <p className={styles.testimonialCounter} aria-live="polite">
            <span>{String(activeIndex + 1).padStart(2, "0")}</span>
            <span aria-hidden="true">—</span>
            <span>
              {String(
                Math.min(activeIndex + slidesPerView, testimonials.length),
              ).padStart(2, "0")}
            </span>
            <small>/ {String(testimonials.length).padStart(2, "0")}</small>
          </p>

          <div className={styles.testimonialDots} aria-hidden="true">
            {Array.from({ length: lastIndex + 1 }).map((_, index) => (
              <span
                className={styles.testimonialDot}
                data-active={activeIndex === index}
                key={index}
              />
            ))}
          </div>

          <div className={styles.testimonialArrows}>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label={copy("Previous testimonial", "Testimonio anterior")}
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex === lastIndex}
              aria-label={copy("Next testimonial", "Siguiente testimonio")}
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
