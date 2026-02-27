"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import Link from "next/link";
import { nanoid } from "nanoid";
import BusinessNavigation from "../../../src/business/components/navigation";
import SelectLanguage from "../../../src/common/components/selectLanguage";
import { safeWindow } from "../../../utils/safe_window";
import { buildBusinessRegisterUrl } from "../../../src/business/utils/urlBuilder";

// ─── FAQ data (original text) ───────────────────────────────────────────────
const FAQ = [
  {
    q: "What is Moil?",
    a: "Moil is your AI Business Coach—an intelligent co-founder that guides you through every stage of building and growing your business. From answering 21 strategic questions to conducting market research, creating business plans, generating marketing content, designing graphics, and hiring your team—all in one platform. It works via natural conversation in English or Spanish, available 24/7. Think of it as having a business consultant, marketing agency, designer, and recruiter in your pocket for $15/month."
  },
  {
    q: "How does the AI Business Coach work?",
    a: "Your AI Coach works like an intelligent co-founder. Share your business idea through voice or text conversation. It asks strategic questions, researches your market, validates demand, creates your business plan, and identifies the roles you need to hire. Everything is connected - market insights inform your business plan, which informs your hiring strategy. You get personalized guidance at every step, all in one platform."
  },
  {
    q: "How do I get started with my AI Coach?",
    a: "Simply sign up and start a conversation with your AI Business Coach. Tell it about your business idea, current stage, or specific challenge. The AI asks intelligent questions and guides you through market research, business planning, or hiring - whatever you need. No technical knowledge required. Everything works via natural conversation in English or Spanish."
  },
  {
    q: "What can the AI Business Coach help me with?",
    a: "Your AI Coach handles the complete business journey: 📊 Research & Planning (market research, competitive analysis, business plans, financial projections) • 📝 Marketing & Content (social media, blogs, emails, ad copy, video scripts) • 🎨 Design & Visuals (marketing graphics, flyers, logos, product mockups) • 📄 Documents (contracts, proposals, invoices, SOPs) • 👥 Hiring (job descriptions, multi-platform posting, AI candidate matching) • 📈 Ongoing Growth (24/7 coaching, performance tracking, scaling guidance). All accessible through natural conversation in English or Spanish."
  },
  {
    q: "How does AI candidate matching work?",
    a: "Your AI Coach analyzes job requirements, then scans candidate profiles for skills, experience, location, and language match. It scores each candidate (75-95% match confidence) based on how well they fit your needs. The AI even suggests interview questions specific to each candidate. You see ranked recommendations with detailed explanations of why each person is a good fit."
  },
  {
    q: "Is there a fee to use the AI Business Coach?",
    a: "Moil costs $15/month (or $140/year) and includes everything: unlimited AI coaching conversations, market research reports, business plan generation, marketing content creation (social posts, blogs, ads), AI image creation and editing, document generation (contracts, proposals, etc.), smart hiring with candidate matching, and bilingual support (EN/ES). Your first conversation with the AI Coach is completely free—no credit card required."
  },
  {
    q: "How secure is my business data?",
    a: "SOC 2 compliant with bank-level encryption. Your conversations with the AI Coach, business plans, and hiring data are completely private. We use minimal data retention and role-based access controls. Your information is never shared or sold. We're trusted by Economic Development Corporations and 500+ businesses across Texas."
  },
  {
    q: "Can I use the AI Coach in Spanish?",
    a: "¡Sí! Your AI Business Coach is fully bilingual (English/Spanish). Have conversations in either language via voice or text. All market research, business plans, and job postings are available in both languages. This gives you access to the underserved bilingual market for hiring and customer acquisition."
  },
  {
    q: "How is this different from traditional consultants?",
    a: "Traditional consultants cost $5,000-15,000, take weeks, and provide one-time deliverables with limited revisions. Your AI Business Coach costs $15/month, responds instantly, and provides unlimited guidance. More importantly, it connects your market research, business planning, and hiring into one intelligent system - consultants work in silos. You get 24/7 access to strategic advice that evolves with your business."
  }
];

// ─── Pricing data ────────────────────────────────────────────────────────────
const pricingPlans = [
  {
    plan: "STARTER",
    price: { monthly: 15, annually: 150 },
    originalPrice: { monthly: 15, annually: 180 },
    limitedOffer: "May 1st",
    cta: "Purchase",
    featured: false,
    flowId: { monthly: nanoid() + nanoid() + '_starter_monthly', annually: nanoid() + nanoid() + '_starter_yearly' }
  },
  {
    plan: "PROFESSIONAL",
    price: { monthly: 25, annually: 240 },
    originalPrice: { monthly: 25, annually: 300 },
    cta: "Purchase",
    featured: true,
    badge: "⭐ BEST VALUE",
    flowId: { monthly: nanoid() + nanoid() + '_professional_monthly', annually: nanoid() + nanoid() + '_professional_yearly' }
  },
  {
    plan: "MARKETING PRO",
    price: { monthly: 75, annually: 720 },
    originalPrice: { monthly: 75, annually: 900 },
    cta: "Purchase",
    featured: false,
    flowId: { monthly: nanoid() + nanoid() + '_marketing_pro_monthly', annually: nanoid() + nanoid() + '_marketing_pro_yearly' }
  }
];

const pricingDetails = [
  { label: "AI Business Coach", values: ["✓ Unlimited", "✓ Unlimited", "✓ Unlimited"] },
  { label: "Market Research", values: ["✓", "✓", "✓"] },
  { label: "Business Planning", values: ["✓", "✓", "✓"] },
  { label: "AI Images/month", values: ["75", "200", "Unlimited"] },
  { label: "Audio Creation", values: ["30s clips (5 min)", "60s clips (15 min)", "2 min clips (30 min)"] },
  { label: "Video Creation", values: ["X", "3/month (30s)", "15/month (60s)"] },
  { label: "Job Postings", values: ["3", "10", "Unlimited"] },
  { label: "Moil 360 Marketing Calendar", values: ["X", "X", "✓ 30-day automated"] },
  { label: "Social Media Content", values: ["X", "X", "✓ Full month generated"] },
  { label: "AI Image Editing", values: ["X", "X", "✓ Unlimited"] },
  { label: "Candidate Matching", values: ["X", "X", "✓ AI-powered"] },
  { label: "Email Templates", values: ["X", "10", "Unlimited"] },
  { label: "Blog Posts", values: ["X", "X", "4"] },
  { label: "Support", values: ["Email", "24hr email", "Same-day + Phone"] }
];

export default function BusinessPricingPage() {
  const [allShow, setAllShow] = useState("monthly");
  const [refQuery, setRefQuery] = useState<string | null>(null);
  const [queryLg, setQueryLg] = useState("");
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set());

  useEffect(() => {
    const url = new URL(window.location.href);
    const p = new URLSearchParams(url.search);
    setRefQuery(p.get('ref'));
    const lg = p.get('lg');
    if (lg) setQueryLg(lg);
  }, []);

  // Scroll-reveal
  useEffect(() => {
    const els = document.querySelectorAll(".bp-rv");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const toggleFaq = (i: number) => {
    setOpenFaqs((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const handlePurchase = (flowId: string) => {
    const url = buildBusinessRegisterUrl({ ref: refQuery ?? undefined, lg: queryLg, flowId });
    safeWindow?.open(url, '_blank');
  };

  let queryString = "";
  if (refQuery && queryLg) queryString = `?ref=${refQuery}&lg=${queryLg}`;
  else if (refQuery) queryString = `?ref=${refQuery}`;
  else if (queryLg) queryString = `?lg=${queryLg}`;

  const showModal = showLanguageModal ? createPortal(
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="top-0 left-0 fixed bottom-0 right-0 z-50 h-screen flex justify-center items-center md:bg-black md:bg-opacity-70 backdrop-blur-[2px] sm:bg-white vsm:bg-white overflow-y-scroll ScrollOnly"
    >
      <SelectLanguage handleClick={() => setShowLanguageModal(false)} setQueryLg={setQueryLg} />
    </motion.div>, document.getElementById("bp-modal")!
  ) : null;

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;600;700&display=swap');

    .bp-wrap {
      --orange: #FF5C1A;
      --orange-dim: rgba(255,92,26,0.12);
      --orange-glow: rgba(255,92,26,0.32);
      --purple: #7C3AED;
      --purple-light: #9D6EF8;
      --purple-dim: rgba(124,58,237,0.14);
      --green: #10B981;
      --green-dim: rgba(16,185,129,0.12);
      --blue: #3B82F6;
      --blue-dim: rgba(59,130,246,0.12);
      --mono: 'JetBrains Mono', monospace;
      --display: 'Bebas Neue', sans-serif;
      --body: 'DM Sans', sans-serif;
      --bg: #06080D;
      --surface: #0B0E18;
      --surface2: #10141F;
      --surface3: #161C2B;
      --border: #1A1F30;
      --border2: #222840;
      --text: #EEF2FF;
      --text2: #8892AA;
      --text3: #4A5368;
      --text4: #2C3245;
      --shadow: 0 24px 80px rgba(0,0,0,0.6);
      --grid-a: rgba(255,92,26,0.04);
      --card-border-hover: rgba(255,92,26,0.2);
    }
    .bp-wrap { background: var(--bg); color: var(--text); font-family: var(--body); }
    .bp-wrap *, .bp-wrap *::before, .bp-wrap *::after { box-sizing: border-box; }

    /* hero grid bg */
    .bp-hero-grid { position: absolute; inset: 0; background-image: linear-gradient(var(--grid-a) 1px, transparent 1px), linear-gradient(90deg, var(--grid-a) 1px, transparent 1px); background-size: 50px 50px; mask-image: radial-gradient(ellipse 90% 80% at 50% 0%, black 0%, transparent 100%); pointer-events: none; }
    .bp-orb { position: absolute; border-radius: 50%; filter: blur(110px); pointer-events: none; }

    /* section tag */
    .bp-section-tag { font-family: var(--mono); font-size: 10px; color: var(--orange); text-transform: uppercase; letter-spacing: 3px; margin-bottom: 18px; display: flex; align-items: center; gap: 10px; }
    .bp-section-tag::before { content:''; display:block; width:18px; height:1px; background:var(--orange); flex-shrink:0; }
    .bp-section-headline { font-family: var(--display); font-size: clamp(38px,5.5vw,80px); line-height: 0.93; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 18px; }

    /* scroll reveal */
    .bp-rv { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .bp-rv.in { opacity: 1; transform: none; }
    .d1 { transition-delay: 0.1s; } .d2 { transition-delay: 0.2s; } .d3 { transition-delay: 0.3s; }

    /* toggle pill */
    .bp-toggle-pill { display: inline-flex; align-items: center; gap: 4px; background: var(--surface); border: 1px solid var(--border2); border-radius: 100px; padding: 5px; }
    .bp-toggle-btn { font-family: var(--body); font-size: 13px; font-weight: 500; padding: 8px 22px; border-radius: 100px; border: none; cursor: pointer; transition: all 0.25s; }
    .bp-toggle-btn.active { background: var(--orange); color: #fff; }
    .bp-toggle-btn.inactive { background: transparent; color: var(--text2); }
    .bp-toggle-btn.inactive:hover { color: var(--text); }
    .bp-save-badge { font-family: var(--mono); font-size: 9px; color: var(--orange); background: var(--orange-dim); border: 1px solid rgba(255,92,26,0.25); padding: 4px 12px; border-radius: 100px; text-transform: uppercase; letter-spacing: 1px; display: inline-block; }

    /* pricing cards */
    .bp-price-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 22px; padding: 38px; position: relative; overflow: hidden; transition: all 0.4s; }
    .bp-price-card:hover { transform: translateY(-7px); box-shadow: var(--shadow); }
    .bp-price-card.featured { border-color: var(--orange); background: linear-gradient(135deg, rgba(255,92,26,0.05), rgba(124,58,237,0.04), var(--surface)); box-shadow: 0 0 0 1px rgba(255,92,26,0.2), 0 32px 80px rgba(255,92,26,0.06); }
    .bp-price-badge { position: absolute; top: 22px; right: 22px; background: var(--orange); color: white; font-family: var(--mono); font-size: 8px; font-weight: 700; padding: 3px 10px; border-radius: 4px; letter-spacing: 1px; text-transform: uppercase; }
    .bp-price-tier { font-family: var(--display); font-size: 34px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 6px; }
    .bp-price-num { font-family: var(--display); font-size: clamp(52px,6vw,68px); line-height: 1; color: var(--text); }
    .bp-price-num.featured { color: var(--orange); }
    .bp-price-per { font-family: var(--mono); font-size: 12px; color: var(--text3); }
    .bp-price-strike { font-family: var(--mono); font-size: 11px; color: var(--text3); text-decoration: line-through; margin-bottom: 2px; }
    .bp-price-offer { font-family: var(--mono); font-size: 9px; color: var(--orange); letter-spacing: 1px; margin-top: 4px; }
    .bp-p-divider { height: 1px; background: var(--border); margin: 24px 0; }
    .bp-price-btn { display: block; width: 100%; padding: 13px; border-radius: 8px; font-family: var(--body); font-size: 14px; font-weight: 700; text-align: center; margin-top: 28px; cursor: pointer; transition: all 0.25s; border: none; }
    .bp-pbtn-sec { background: transparent; color: var(--text2); border: 1px solid var(--border2) !important; }
    .bp-pbtn-sec:hover { border-color: var(--purple) !important; color: var(--purple-light); background: var(--purple-dim); }
    .bp-pbtn-pri { background: var(--orange); color: white; }
    .bp-pbtn-pri:hover { background: #FF7A40; transform: translateY(-2px); box-shadow: 0 8px 32px var(--orange-glow); }
    .bp-pt-item { display: flex; align-items: center; gap: 7px; font-family: var(--mono); font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; }
    .bp-pt-item .g { color: var(--green); }

    /* compare table */
    .bp-compare-wrap { overflow-x: auto; border-radius: 18px; border: 1px solid var(--border2); }
    .bp-compare-table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 640px; }
    .bp-compare-table th { padding: 20px 24px; border-bottom: 1px solid var(--border); font-family: var(--display); font-size: 20px; letter-spacing: 1px; text-transform: uppercase; }
    .bp-compare-table th:first-child { text-align: left; font-family: var(--body); font-size: 16px; font-weight: 700; text-transform: none; letter-spacing: 0; }
    .bp-compare-table td { padding: 14px 24px; border-bottom: 1px solid var(--border); font-size: 13px; color: var(--text2); }
    .bp-compare-table td:first-child { color: var(--text); font-weight: 500; }
    .bp-compare-table tr:last-child td { border-bottom: none; }
    .bp-compare-table tr:hover td { background: var(--surface2); }
    .bp-col-featured { background: rgba(255,92,26,0.04); }
    .bp-col-featured-head { background: rgba(255,92,26,0.06); border-top: 2px solid var(--orange); }
    .bp-check { color: var(--green); }
    .bp-x { color: var(--text3); }
    .bp-partial { color: var(--orange); }

    /* partnership cards */
    .bp-partner-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 20px; padding: 36px; position: relative; overflow: hidden; }
    .bp-partner-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; }
    .bp-partner-card.indigo::before { background: linear-gradient(90deg, #6366F1, rgba(99,102,241,0.3)); }
    .bp-partner-card.purple::before { background: linear-gradient(90deg, #8B5CF6, rgba(139,92,246,0.3)); }

    /* FAQ */
    .bp-faq-item { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; transition: border-color 0.3s; margin-bottom: 8px; }
    .bp-faq-item:hover { border-color: var(--card-border-hover); }
    .bp-faq-q { padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; gap: 12px; cursor: pointer; font-size: 15px; font-weight: 500; user-select: none; color: var(--text); }
    .bp-faq-icon { font-size: 20px; color: var(--text3); transition: transform 0.3s, color 0.3s; flex-shrink: 0; }
    .bp-faq-item.open .bp-faq-icon { transform: rotate(45deg); color: var(--orange); }
    .bp-faq-a { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1); }
    .bp-faq-item.open .bp-faq-a { max-height: 400px; }
    .bp-faq-a-inner { padding: 0 24px 20px; font-size: 14px; color: var(--text2); line-height: 1.75; }

    /* footer */
    .bp-footer { background: var(--surface); border-top: 1px solid var(--border); }
    .bp-footer-col-title { font-family: var(--mono); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--orange); margin-bottom: 16px; }
    .bp-footer-links { display: flex; flex-direction: column; gap: 9px; }
    .bp-footer-links a { font-size: 13px; color: var(--text3); text-decoration: none; transition: color 0.2s; }
    .bp-footer-links a:hover { color: var(--orange); }
    .bp-footer-brand-logo { font-family: var(--display); font-size: 36px; letter-spacing: 3px; color: var(--text); text-decoration: none; margin-bottom: 12px; display: block; }
    .bp-footer-brand-logo span { color: var(--orange); }
    .bp-footer-tagline { font-size: 13px; color: var(--text3); line-height: 1.7; max-width: 280px; margin-bottom: 24px; }
    .bp-f-badge { font-family: var(--mono); font-size: 9px; padding: 3px 9px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; display: inline-block; }
    .fb-g { background: var(--green-dim); color: var(--green); border: 1px solid rgba(16,185,129,0.18); }
    .fb-p { background: var(--purple-dim); color: var(--purple-light); border: 1px solid rgba(124,58,237,0.18); }
    .fb-o { background: var(--orange-dim); color: var(--orange); border: 1px solid rgba(255,92,26,0.18); }
    .bp-footer-copy { font-family: var(--mono); font-size: 10px; color: var(--text3); letter-spacing: 1px; }
    .bp-divider { width: 100%; height: 1px; background: var(--border); }

    /* final CTA */
    .bp-final { position: relative; overflow: hidden; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px 24px; }
    .bp-final-btn { background: var(--orange); color: white; border: none; padding: 18px 54px; border-radius: 10px; font-family: var(--body); font-size: clamp(14px,2vw,17px); font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 12px; transition: all 0.3s; animation: bpfpulse 3s ease-in-out infinite; }
    @keyframes bpfpulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,92,26,0.25);} 50%{box-shadow:0 0 0 18px rgba(255,92,26,0);} }
    .bp-final-btn:hover { background:#FF7A40; transform:translateY(-3px) scale(1.02); box-shadow:0 18px 64px var(--orange-glow); }

    @media (max-width: 1024px) {
      .bp-price-cards { grid-template-columns: 1fr !important; }
    }
    @media (max-width: 768px) {
      .bp-partner-grid { grid-template-columns: 1fr !important; }
      .bp-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px; }
      .bp-final { padding: 72px 20px; }
    }
    @media (max-width: 480px) {
      .bp-footer-grid { grid-template-columns: 1fr !important; }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <BusinessNavigation refQuery={refQuery} page="pricing" lgQuery={queryLg} setQueryLg={setQueryLg} setShowLanguageModal={setShowLanguageModal} />

      <div className="bp-wrap">

        {/* ── HERO / HEADER ─────────────────────────────────────────────── */}
        <section style={{ position: "relative", paddingTop: 120, paddingBottom: 80, textAlign: "center", overflow: "hidden" }}>
          <div className="bp-hero-grid" />
          <div className="bp-orb" style={{ width: "min(700px,120vw)", height: "min(500px,80vw)", background: "radial-gradient(circle, rgba(255,92,26,0.10) 0%, transparent 70%)", top: -100, left: "50%", transform: "translateX(-50%)" }} />
          <div className="bp-orb" style={{ width: "min(400px,70vw)", height: "min(400px,70vw)", background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)", bottom: 0, right: "-5%" }} />

          <div style={{ position: "relative", maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
            <div className="bp-section-tag bp-rv" style={{ justifyContent: "center" }}>Plans & Pricing</div>
            <h1 className="bp-section-headline bp-rv" style={{ color: "var(--text)" }}>
              Choose the Right Plan<br /><span style={{ color: "var(--orange)" }}>For Your Business</span>
            </h1>
            <p className="bp-rv" style={{ fontSize: "clamp(15px,2vw,18px)", color: "var(--text2)", fontWeight: 300, lineHeight: 1.75, marginBottom: 44 }}>
              Flexible plans designed to help you grow your business with AI-powered tools and smart hiring solutions.
            </p>

            {/* Toggle */}
            <div className="bp-rv" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div className="bp-toggle-pill">
                <button className={`bp-toggle-btn ${allShow === "monthly" ? "active" : "inactive"}`} onClick={() => setAllShow("monthly")}>Monthly Plans</button>
                <button className={`bp-toggle-btn ${allShow === "annually" ? "active" : "inactive"}`} onClick={() => setAllShow("annually")}>See Annual Plans</button>
              </div>
              <span className="bp-save-badge">Save up to 25% when you purchase an annual plan.</span>
            </div>
          </div>
        </section>

        {/* ── PRICING CARDS ─────────────────────────────────────────────── */}
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px" }}>
          <div className="bp-price-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {pricingPlans.map((plan, idx) => {
              const currentPrice = allShow === "monthly" ? plan.price.monthly : plan.price.annually;
              const originalPrice = allShow === "monthly" ? plan.originalPrice.monthly : plan.originalPrice.annually;
              const period = allShow === "monthly" ? "Month" : "Year";
              const hasDiscount = originalPrice > currentPrice;
              return (
                <div key={idx} className={`bp-price-card bp-rv ${plan.featured ? "featured" : ""} ${idx === 1 ? "d1" : idx === 2 ? "d2" : ""}`}>
                  {plan.badge && <span className="bp-price-badge">{plan.badge}</span>}
                  <div className="bp-price-tier">{plan.plan}</div>
                  {hasDiscount && (
                    <div className="bp-price-strike">${originalPrice}/{period}</div>
                  )}
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                    <span className={`bp-price-num ${plan.featured ? "featured" : ""}`}>${currentPrice}</span>
                    <span className="bp-price-per">/{period.toLowerCase()}</span>
                  </div>
                  {allShow === "annually" && plan.limitedOffer && (
                    <div className="bp-price-offer">Limited offer until {plan.limitedOffer}</div>
                  )}
                  <div className="bp-p-divider" />
                  <button
                    className={`bp-price-btn ${plan.featured ? "bp-pbtn-pri" : "bp-pbtn-sec"}`}
                    onClick={() => handlePurchase(plan.flowId[allShow as "monthly" | "annually"])}
                  >{plan.cta} →</button>
                </div>
              );
            })}
          </div>

          {/* Trust badges */}
          <div className="bp-rv" style={{ display: "flex", alignItems: "center", gap: 24, justifyContent: "center", marginTop: 44, flexWrap: "wrap" }}>
            {["30-Day Guarantee", "No Setup Fees", "Cancel Anytime", "SOC 2 Compliant", "Bilingual EN/ES"].map(item => (
              <div className="bp-pt-item" key={item}><span className="g">✓</span>{item}</div>
            ))}
          </div>
        </section>

        <div className="bp-divider" />

        {/* ── COMPARISON TABLE ──────────────────────────────────────────── */}
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
          <div className="bp-section-tag bp-rv">Full Feature Breakdown</div>
          <h2 className="bp-section-headline bp-rv">Compare<br /><span style={{ color: "var(--purple-light)" }}>All Plans.</span></h2>

          {/* Desktop table */}
          <div className="bp-compare-wrap bp-rv" style={{ display: "none" }} id="bp-table-desktop">
            <table className="bp-compare-table">
              <thead>
                <tr style={{ background: "var(--surface)" }}>
                  <th style={{ textAlign: "left", color: "var(--text)" }}>Features</th>
                  {pricingPlans.map((plan, i) => (
                    <th key={i} className={i === 1 ? "bp-col-featured-head" : ""} style={{ color: i === 1 ? "var(--orange)" : "var(--text)", textAlign: "center" }}>
                      {plan.plan}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricingDetails.map((row, ri) => (
                  <tr key={ri}>
                    <td style={{ color: "var(--text)", fontWeight: 500 }}>{row.label}</td>
                    {row.values.map((val, vi) => (
                      <td key={vi} className={vi === 1 ? "bp-col-featured" : ""} style={{ textAlign: "center" }}>
                        <span className={val === "X" ? "bp-x" : vi === 1 ? "bp-partial" : "bp-check"}>{val}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Responsive table always visible */}
          <div className="bp-rv" style={{ overflowX: "auto", borderRadius: 18, border: "1px solid var(--border2)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 560 }}>
              <thead>
                <tr style={{ background: "var(--surface)" }}>
                  <th style={{ textAlign: "left", padding: "20px 24px", borderBottom: "1px solid var(--border)", color: "var(--text)", fontFamily: "var(--body)", fontSize: 16, fontWeight: 700 }}>Features</th>
                  {pricingPlans.map((plan, i) => (
                    <th key={i} style={{
                      padding: "20px 24px",
                      borderBottom: "1px solid var(--border)",
                      fontFamily: "var(--display)",
                      fontSize: 20,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      color: i === 1 ? "var(--orange)" : "var(--text)",
                      background: i === 1 ? "rgba(255,92,26,0.06)" : "var(--surface)",
                      borderTop: i === 1 ? "2px solid var(--orange)" : "none",
                      textAlign: "center"
                    }}>{plan.plan}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricingDetails.map((row, ri) => (
                  <tr key={ri} style={{ transition: "background 0.2s" }}>
                    <td style={{ padding: "14px 24px", borderBottom: ri < pricingDetails.length - 1 ? "1px solid var(--border)" : "none", color: "var(--text)", fontWeight: 500 }}>{row.label}</td>
                    {row.values.map((val, vi) => (
                      <td key={vi} style={{
                        padding: "14px 24px",
                        borderBottom: ri < pricingDetails.length - 1 ? "1px solid var(--border)" : "none",
                        background: vi === 1 ? "rgba(255,92,26,0.04)" : "transparent",
                        textAlign: "center",
                        color: val === "X" ? "var(--text3)" : vi === 1 ? "var(--orange)" : "var(--green)",
                        fontWeight: val !== "X" ? 500 : 400
                      }}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="bp-divider" />

        {/* ── PARTNERSHIP PROGRAMS ──────────────────────────────────────── */}
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div className="bp-section-tag bp-rv" style={{ justifyContent: "center" }}>Enterprise & Community</div>
            <h2 className="bp-section-headline bp-rv">Partnership<br /><span style={{ color: "var(--purple-light)" }}>Programs.</span></h2>
            <p className="bp-rv" style={{ fontSize: 16, color: "var(--text2)", fontWeight: 300, lineHeight: 1.8, maxWidth: 560, margin: "0 auto" }}>
              Empower your community with Moil's AI-powered business tools through our comprehensive partnership programs.
            </p>
          </div>

          <div className="bp-partner-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Community Partner */}
            <div className="bp-partner-card indigo bp-rv">
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.121M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--display)", fontSize: 26, letterSpacing: 1, textTransform: "uppercase", color: "var(--text)", marginBottom: 4 }}>Community Partner Program</h3>
                  <p style={{ fontSize: 13, color: "var(--text2)" }}>For chambers, associations, and nonprofits supporting 10–49 businesses</p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
                <div>
                  <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--green)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>What Your Organization Gets</p>
                  {["Member portal (semi-white label)", "License management dashboard", "Staff training and rollout support", "Quarterly usage & impact summaries"].map(item => (
                    <div key={item} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13, color: "var(--text2)", alignItems: "flex-start" }}>
                      <span style={{ color: "var(--green)", flexShrink: 0, marginTop: 2 }}>✓</span>{item}
                    </div>
                  ))}
                </div>
                <div>
                  <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--blue)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>What Your Members Get</p>
                  {["AI market research & business coaching", "3 job postings per month", "Up to 50 AI-generated images per month", "Full AI toolbox access", "Bilingual support (English & Spanish)"].map(item => (
                    <div key={item} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13, color: "var(--text2)", alignItems: "flex-start" }}>
                      <span style={{ color: "#60A5FA", flexShrink: 0, marginTop: 2 }}>✓</span>{item}
                    </div>
                  ))}
                </div>
              </div>
              <a href="https://calendly.com/andresmoil/moil-demo" target="_blank" rel="noopener noreferrer">
                <button className="bp-price-btn" style={{ background: "#6366F1", color: "white", marginTop: 0 }}>Talk About a Community Program →</button>
              </a>
            </div>

            {/* Economic & Workforce */}
            <div className="bp-partner-card purple bp-rv d1">
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--display)", fontSize: 26, letterSpacing: 1, textTransform: "uppercase", color: "var(--text)", marginBottom: 4 }}>Economic & Workforce Development Partnership</h3>
                  <p style={{ fontSize: 13, color: "var(--text2)" }}>For EDCs, workforce boards, and city or regional initiatives supporting 50+ businesses</p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
                <div>
                  <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--purple-light)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Program Benefits</p>
                  {["Private, white-labeled portal for your community", "Admin dashboard to assign and track licenses", "Training and ongoing support for your team", "Reporting on usage, hiring activity, and engagement", "Priority partner status for pilots and new features"].map(item => (
                    <div key={item} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13, color: "var(--text2)", alignItems: "flex-start" }}>
                      <span style={{ color: "#8B5CF6", flexShrink: 0, marginTop: 2 }}>✓</span>{item}
                    </div>
                  ))}
                </div>
                <div>
                  <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#F59E0B", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>What Businesses Get</p>
                  {["AI market research & coaching", "3 job postings per month", "Up to 50 AI-generated images per month", "Full Moil AI toolbox", "Bilingual access"].map(item => (
                    <div key={item} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13, color: "var(--text2)", alignItems: "flex-start" }}>
                      <span style={{ color: "#F59E0B", flexShrink: 0, marginTop: 2 }}>✓</span>{item}
                    </div>
                  ))}
                </div>
              </div>
              <a href="https://calendly.com/andresmoil/moil-demo" target="_blank" rel="noopener noreferrer">
                <button className="bp-price-btn" style={{ background: "#8B5CF6", color: "white", marginTop: 0 }}>Schedule a Partnership Call →</button>
              </a>
              <p style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", textAlign: "center", marginTop: 12 }}>Custom pricing available based on community size and needs</p>
            </div>
          </div>
        </section>

        <div className="bp-divider" />

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div className="bp-section-tag bp-rv" style={{ justifyContent: "center" }}>Got Questions</div>
          <h2 className="bp-section-headline bp-rv">Frequently Asked<br /><span style={{ color: "var(--orange)" }}>Questions.</span></h2>
          <p className="bp-rv" style={{ fontSize: 16, color: "var(--text2)", fontWeight: 300, lineHeight: 1.8, marginBottom: 52 }}>
            Find answers about Moil&apos;s AI Business Coach and how the platform works
          </p>
          <div style={{ textAlign: "left" }} className="bp-rv">
            {FAQ.map((faq, i) => (
              <div className={`bp-faq-item ${openFaqs.has(i) ? "open" : ""}`} key={i}>
                <div className="bp-faq-q" onClick={() => toggleFaq(i)}>
                  {faq.q}<span className="bp-faq-icon">+</span>
                </div>
                <div className="bp-faq-a"><div className="bp-faq-a-inner">{faq.a}</div></div>
              </div>
            ))}
          </div>
        </section>

        <div className="bp-divider" />

        {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
        <section className="bp-final">
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 65% 55% at 30% 50%, rgba(255,92,26,0.06), transparent 70%), radial-gradient(ellipse 65% 55% at 70% 50%, rgba(124,58,237,0.06), transparent 70%)" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(var(--purple-dim) 1px, transparent 1px), linear-gradient(90deg, var(--purple-dim) 1px, transparent 1px)", backgroundSize: "44px 44px", maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)" }} />
          <p style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 28, position: "relative" }} className="bp-rv">Your Competitors Are Using AI Right Now</p>
          <h2 style={{ fontFamily: "var(--display)", fontSize: "clamp(52px,9vw,120px)", lineHeight: 0.9, letterSpacing: 2, textTransform: "uppercase", marginBottom: 28, position: "relative" }} className="bp-rv">
            Stop Running<br />Your Business<br /><span style={{ color: "var(--purple-light)" }}>Alone.</span>
          </h2>
          <p style={{ fontSize: "clamp(15px,2vw,18px)", color: "var(--text2)", fontWeight: 300, maxWidth: 560, margin: "0 auto 52px", lineHeight: 1.75, position: "relative" }} className="bp-rv">
            Join 500+ Texas businesses with an AI co-founder in their corner. Market research, business plan, 30-day content strategy, AI visuals, and smart hiring — all in one conversation. Starting at $15/month.
          </p>
          <button className="bp-final-btn bp-rv" onClick={() => safeWindow?.open("https://business.moilapp.com/register", "_blank")}>
            🚀 Meet Your AI Co-Founder — Free <span>→</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 28, justifyContent: "center", marginTop: 36, flexWrap: "wrap", position: "relative" }} className="bp-rv">
            {["Free to start", "30-Day Guarantee", "No Credit Card Needed", "SOC 2 Compliant", "Bilingual EN/ES"].map(item => (
              <div style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }} key={item}>
                <span style={{ color: "var(--green)" }}>✓</span>{item}
              </div>
            ))}
          </div>
          <div style={{ position: "relative", marginTop: 56, textAlign: "center" }} className="bp-rv">
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>Trusted by 500+ businesses</div>
            <div style={{ color: "var(--purple-light)", fontSize: 18, letterSpacing: 3 }}>★★★★★</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginTop: 6 }}>5,000+ jobs posted · 94% interview success · $850 avg cost per hire</div>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────────── */}
        <footer className="bp-footer" style={{ padding: "52px 24px" }}>
          <div className="bp-footer-grid" style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <span className="bp-footer-brand-logo">MO<span>I</span>L</span>
              <p className="bp-footer-tagline">The AI Co-Founder for small businesses. Market research, business planning, content marketing, AI visuals, smart hiring, and 24/7 coaching — one platform.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="bp-f-badge fb-g">SOC 2 Compliant</span>
                <span className="bp-f-badge fb-p">Bilingual EN/ES</span>
                <span className="bp-f-badge fb-o">500+ Businesses</span>
              </div>
            </div>
            <div>
              <div className="bp-footer-col-title">For Businesses</div>
              <div className="bp-footer-links">
                <Link href={`/business${queryString}`}>Hire Employees</Link>
                <Link href={`/business${queryString}#services`}>AI Business Tools</Link>
                <Link href={`/business/pricing${queryString}`}>Pricing Plans</Link>
                <Link href={`/business${queryString}`}>Post a Job</Link>
              </div>
            </div>
            <div>
              <div className="bp-footer-col-title">For Job Seekers</div>
              <div className="bp-footer-links">
                <Link href={`/${queryString}`}>Find Jobs</Link>
                <Link href={`/${queryString}#how-it-works`}>How It Works</Link>
                <Link href={`/${queryString}`}>Browse Opportunities</Link>
                <Link href={`/${queryString}`}>Career Resources</Link>
              </div>
            </div>
            <div>
              <div className="bp-footer-col-title">Company</div>
              <div className="bp-footer-links">
                <a href="https://blog.moilapp.com" target="_blank" rel="noopener noreferrer">Blog</a>
                <Link href={`/business${queryString}`}>About Us</Link>
                <Link href={`/business${queryString}`}>Contact</Link>
                <Link href="/privacy">Privacy Policy</Link>
              </div>
            </div>
          </div>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
            <span className="bp-footer-copy">© {new Date().getFullYear()} MOIL. ALL RIGHTS RESERVED. · TEXAS-BORN. AI-POWERED.</span>
            <div style={{ display: "flex", gap: 8 }}>
              <span className="bp-f-badge fb-g">SOC 2</span>
              <span className="bp-f-badge fb-p">EN/ES</span>
              <span className="bp-f-badge fb-o">30-Day Guarantee</span>
            </div>
          </div>
        </footer>

      </div>

      {showModal}
      <div id="bp-modal" />
    </>
  );
}
