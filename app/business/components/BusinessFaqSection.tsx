'use client';

import { useState } from 'react';

const faqItems = [
  {
    question: "What exactly is Moil's AI Co-Founder?",
    answer:
      "Moil's AI Co-Founder is an intelligent platform that integrates market research, business planning, content marketing, AI image and video generation, smart hiring, and 24/7 business coaching into a single conversation. Unlike generic AI tools, it learns your specific business through 21 strategic questions and personalizes everything to your goals, market, and brand.",
  },
  {
    question: 'How does Content360 work?',
    answer:
      'Content360 generates a complete 30-day social media content calendar based on your business, market research, and Brand DNA profile. Each day includes a researched topic, optimized hook, full caption calibrated to content type (Educational 250–400 words, Promotional 100–200, Engagement 150–300), CTA, hashtags, AI-generated topic-specific image, and AI video for your 5 highest-impact days. Available in the Market Pro plan.',
  },
  {
    question: 'How accurate is AI candidate matching?',
    answer:
      "Moil's AI scoring achieves 95% accuracy across skills match, location proximity, experience level, and language requirements. Our average time to hire is 11 days vs. the 32-day industry average. Businesses report a 94% interview success rate and 91% employee retention at 90 days.",
  },
  {
    question: 'Can I use Moil in Spanish?',
    answer:
      'Yes. Everything in Moil is fully bilingual — English and Spanish. The AI co-founder onboarding, market research, business plan, content calendar, captions, and hiring pipeline all support both languages. Our bilingual hiring network reaches 58% more bilingual candidates than the industry average.',
  },
  {
    question: 'How is this different from ChatGPT or other AI tools?',
    answer:
      'Generic AI tools are blank slates. Moil is purpose-built for small business owners. It learns your specific business through structured onboarding, maintains context across sessions, integrates real market data, generates actual AI visuals and videos, connects to 10+ hiring platforms, and delivers outputs ready to use — not rough drafts to edit.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      "You can talk to your AI Co-Founder completely free — no credit card required to get started. We offer a 30-day money-back guarantee on all plans. If you don't get actionable business insights and hiring results within 30 days, you receive a full refund.",
  },
  {
    question: 'Is my business data secure?',
    answer:
      'Yes. Moil is SOC 2 compliant with bank-level encryption. Your business data, market research, and candidate information are protected and never shared with third parties. Trusted by growing businesses and Economic Development Corporations across Texas.',
  },
];

export function BusinessFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" style={{ textAlign: 'center' }}>
      <div className="section-tag rv" style={{ justifyContent: 'center' }}>
        Got Questions
      </div>
      <h2 className="section-headline rv">
        Frequently Asked<br />
        <span style={{ color: 'var(--orange)' }}>Questions.</span>
      </h2>
      <div className="faq-list rv" style={{ textAlign: 'left', marginTop: '52px' }}>
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.question} className={`faq-item ${isOpen ? 'open' : ''}`}>
              <div className="faq-q" onClick={() => setOpenIndex(isOpen ? null : index)}>
                {item.question}
                <span className="faq-icon">+</span>
              </div>
              <div className="faq-a">
                <div className="faq-a-inner">{item.answer}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
