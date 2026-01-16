import { useState } from "react";
import FAQItem from "../components/faq_item";
import Link from "next/link";
import { GridPattern } from "../components/interactive_bg";
import { cn } from "@/src/lib/utils";

export default function FAQSection() {

  const [active, setActive] = useState('');
  const FAQ = [
    {
      question: "What is Moil?",
      answer: "Moil is your AI Business Coach—an intelligent co-founder that guides you through every stage of building and growing your business. From answering 21 strategic questions to conducting market research, creating business plans, generating marketing content, designing graphics, and hiring your team—all in one platform. It works via natural conversation in English or Spanish, available 24/7. Think of it as having a business consultant, marketing agency, designer, and recruiter in your pocket for $15/month."
    },
    {
      question: "How does the AI Business Coach work?",
      answer: "Your AI Coach works like an intelligent co-founder. Share your business idea through voice or text conversation. It asks strategic questions, researches your market, validates demand, creates your business plan, and identifies the roles you need to hire. Everything is connected - market insights inform your business plan, which informs your hiring strategy. You get personalized guidance at every step, all in one platform."
    },
    {
      question: "How do I get started with my AI Coach?",
      answer: "Simply sign up and start a conversation with your AI Business Coach. Tell it about your business idea, current stage, or specific challenge. The AI asks intelligent questions and guides you through market research, business planning, or hiring - whatever you need. No technical knowledge required. Everything works via natural conversation in English or Spanish."
    },
    {
      question: "What can the AI Business Coach help me with?",
      answer: "Your AI Coach handles the complete business journey: 📊 Research & Planning (market research, competitive analysis, business plans, financial projections) • 📝 Marketing & Content (social media, blogs, emails, ad copy, video scripts) • 🎨 Design & Visuals (marketing graphics, flyers, logos, product mockups) • 📄 Documents (contracts, proposals, invoices, SOPs) • 👥 Hiring (job descriptions, multi-platform posting, AI candidate matching) • 📈 Ongoing Growth (24/7 coaching, performance tracking, scaling guidance). All accessible through natural conversation in English or Spanish."
    },
    {
      question: "How does AI candidate matching work?",
      answer: "Your AI Coach analyzes job requirements, then scans candidate profiles for skills, experience, location, and language match. It scores each candidate (75-95% match confidence) based on how well they fit your needs. The AI even suggests interview questions specific to each candidate. You see ranked recommendations with detailed explanations of why each person is a good fit."
    },
    {
      question: "Is there a fee to use the AI Business Coach?",
      answer: "Moil costs $15/month (or $140/year) and includes everything: unlimited AI coaching conversations, market research reports, business plan generation, marketing content creation (social posts, blogs, ads), AI image creation and editing, document generation (contracts, proposals, etc.), smart hiring with candidate matching, and bilingual support (EN/ES). Your first conversation with the AI Coach is completely free—no credit card required."
    },
    {
      question: "How secure is my business data?",
      answer: (
        <span>
          SOC 2 compliant with bank-level encryption. Your conversations with the AI Coach, business plans, and hiring data are completely private. We use minimal data retention and role-based access controls. Your information is never shared or sold. We&apos;re trusted by Economic Development Corporations and 500+ businesses across Texas. For more information, refer to our <Link href="/privacy" className="text-blue-500 underline">privacy policy</Link>.
        </span>
      )
    },
    {
      question: "Can I use the AI Coach in Spanish?",
      answer: "¡Sí! Your AI Business Coach is fully bilingual (English/Spanish). Have conversations in either language via voice or text. All market research, business plans, and job postings are available in both languages. This gives you access to the underserved bilingual market for hiring and customer acquisition."
    },
    {
      question: "How is this different from traditional consultants?",
      answer: "Traditional consultants cost $5,000-15,000, take weeks, and provide one-time deliverables with limited revisions. Your AI Business Coach costs $15/month, responds instantly, and provides unlimited guidance. More importantly, it connects your market research, business planning, and hiring into one intelligent system - consultants work in silos. You get 24/7 access to strategic advice that evolves with your business."
    }
  ];
  


  const onClick = (question: string) => {
    if (active !== question) {
      setActive(question);
    } else {
      setActive('');
    }
  }
  return (
    <div className="relative py-8 md:py-12 lg:py-20 bg-gradient-to-br from-slate-50 via-[#5843BE]/5 to-[#FF6633]/5 overflow-hidden">
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] opacity-50"
        )}
      />
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#5843BE]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FF6633]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#5843BE]/8 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#FF6633]/8 rounded-full blur-3xl"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex justify-center flex-col gap-y-6 md:gap-y-8 lg:gap-y-12">
        <div className="text-center space-y-3 md:space-y-4">
          <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-[#5843BE] px-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-700 text-sm md:text-base lg:text-lg xl:text-xl max-w-2xl mx-auto px-4">
            Find answers about Moil&apos;s AI Business Coach and how the platform works
          </p>
        </div>
        
        <div className="flex w-full px-4 md:px-6 lg:px-8 xl:px-0 self-center flex-col gap-y-3 md:gap-y-4 lg:gap-y-6 container xl:max-w-[950px] xtraxl:xl:max-w-[1152px]">
          {
            FAQ?.map((faq, i) => {
              return <FAQItem onClick={() => onClick(faq.question)} key={i} question={faq.question} answer={faq.answer} active={faq.question === active} />
            })
          }
        </div>
      </div>
    </div>
  )
}