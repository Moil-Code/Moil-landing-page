"use client";

import { BusinessFaqSection } from "./components/BusinessFaqSection";
import { BusinessFinalCta } from "./components/BusinessFinalCta";
import { BusinessFooter } from "./components/BusinessFooter";
import { BusinessMobileMenu } from "./components/BusinessMobileMenu";
import { BusinessNav, type NavItem } from "./components/BusinessNav";
import { BusinessPricingSection } from "./components/BusinessPricingSection";
import { useBusinessUi } from "./hooks/useBusinessUi";

const navItems: NavItem[] = [
  { label: "Features", href: "#capabilities" },
  { label: "How It Works", href: "#journey" },
  { label: "Hiring", href: "#hiring" },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "https://blog.moilapp.com", external: true },
];

const mobileItems: NavItem[] = [
  { label: "What Is Moil", href: "#identity" },
  { label: "Features", href: "#capabilities" },
  { label: "How It Works", href: "#journey" },
  { label: "Smart Hiring", href: "#hiring" },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "https://blog.moilapp.com", external: true },
];

const tickerItems = [
  "Market Research",
  "Business Plan Generator",
  "Content360 — 30-Day Calendar",
  "AI Image Generation",
  "AI Video Generation",
  "Smart Hiring — 10+ Platforms",
  "Candidate AI Matching 95%",
  "24/7 AI Business Coach",
  "Document Creation",
  "Brand DNA System",
  "Bilingual EN/ES",
  "Investor-Ready Outputs",
];

const cofounderCapabilities = [
  {
    icon: "📊",
    title: "Market Research",
    sub: "21 questions → 20–30 pages of real market data",
    badge: "Instant",
    badgeClass: "badge-o",
  },
  {
    icon: "📋",
    title: "Business Plan",
    sub: "Investor-ready PDF with 5-year projections",
    badge: "1 Click",
    badgeClass: "badge-p",
  },
  {
    icon: "📅",
    title: "Content360",
    sub: "30-day calendar · AI images · AI video",
    badge: "Auto",
    badgeClass: "badge-o",
  },
  {
    icon: "🎯",
    title: "Smart Hiring",
    sub: "Post once → 10+ platforms → AI-matched candidates",
    badge: "95% Match",
    badgeClass: "badge-g",
  },
  {
    icon: "💬",
    title: "24/7 Business Coach",
    sub: "Strategy, cash flow, growth — always available",
    badge: "Always On",
    badgeClass: "badge-p",
  },
];

const capabilityCards = [
  {
    icon: "📊",
    title: "Market Research & Validation",
    desc: "Answer 21 strategic questions by voice or text — in English or Spanish. Deep market analysis from 8–10 real sources. TAM/SAM/SOM, competitive landscape, customer personas, opportunity scoring.",
    tags: [
      { label: "21 Questions", className: "tag-o" },
      { label: "Real Sources", className: "tag-b" },
      { label: "TAM/SAM/SOM", className: "tag-g" },
    ],
  },
  {
    icon: "📋",
    title: "Investor-Ready Business Plan",
    desc: "One click generates a polished PDF with executive summary, 5-year financial projections, revenue models, go-to-market strategy, operational roadmap, and funding requirements.",
    tags: [
      { label: "5-Year Projections", className: "tag-o" },
      { label: "PDF Export", className: "tag-b" },
      { label: "Investor-Ready", className: "tag-g" },
    ],
  },
  {
    icon: "🎨",
    title: "AI Image & Video Creation",
    desc: "Custom marketing visuals — not stock photos. Topic-specific AI images that show exactly what your post discusses. AI video auto-assigned to your highest-impact days. No camera, no designer.",
    tags: [
      { label: "30 Custom Images", className: "tag-o" },
      { label: "5+ Video Days", className: "tag-b" },
      { label: "Brand Aligned", className: "tag-g" },
    ],
  },
];

const journeySteps = [
  {
    number: "01",
    time: "5–10 Minutes",
    title: "21 Strategic Questions",
    desc: "Voice or text. English or Spanish. Your AI co-founder learns your business model, market, competitive gaps, goals, and strengths. The foundation for everything that follows.",
  },
  {
    number: "02",
    time: "Automated",
    title: "20–30 Pages Market Research",
    desc: "Real-time deep analysis. TAM/SAM/SOM calculations. Competitive landscape mapping. Customer personas. Opportunity scoring. 8–10 authoritative sources. Not guesses — data.",
  },
  {
    number: "03",
    time: "One Click",
    title: "Investor-Ready Business Plan",
    desc: "5-year projections, revenue models, go-to-market strategy, operational roadmap. Download a polished PDF ready for investors, banks, or partners. Minutes, not months.",
  },
  {
    number: "04",
    time: "⭐ Content360",
    title: "30-Day Content Marketing Engine",
    desc: "Complete calendar with researched topics, tested hooks, calibrated captions, CTAs, hashtags, 30 AI images, and AI video for your highest-impact days.",
  },
  {
    number: "05",
    time: "2 Minutes to Post",
    title: "Smart Hiring & Team Building",
    desc: "One job description → auto-posted to 10+ platforms. AI scores every candidate on skills, location, experience, and language fit. 95% match accuracy. 11-day average to hire.",
  },
  {
    number: "06",
    time: "24/7 — Always On",
    title: "Ongoing AI Business Coach",
    desc: "The more you use it, the better it knows your business. Cash flow guidance, marketing refinements, retention tactics, scaling strategy. An AI co-founder that never sleeps.",
  },
];

const hiringSteps = [
  {
    num: "1",
    title: "Tell Your AI Co-Founder What You Need",
    desc: "Describe the role in plain language. AI generates a complete job description, requirements, skills assessment, salary recommendations, and platform-optimized posting copy.",
  },
  {
    num: "2",
    title: "Auto-Posted to 10+ Platforms in 2 Minutes",
    desc: "Indeed · ZipRecruiter · Austin Jobs · Round Rock Hiring · Cedar Park · Spanish Job Groups · Local Trade Networks · Facebook Groups · +3 more. All at once.",
  },
  {
    num: "3",
    title: "AI Scores Every Candidate Automatically",
    desc: "Skills match · Location proximity · Experience level · Language requirements (EN/ES). Every applicant ranked before you see them. 95% accuracy. No manual screening.",
  },
  {
    num: "4",
    title: "You Interview Only the Top Matches",
    desc: "Review ranked candidates, get AI-generated interview questions for each role, schedule, and hire with confidence. Your time goes to the best fits only.",
  },
];

const hiringStats = [
  { label: "Faster than Indeed", target: 5, suffix: "×" },
  { label: "Interview Success", target: 94, suffix: "%" },
  { label: "Retention 90 Days", target: 91, suffix: "%" },
  { label: "Avg Days to Hire", target: 11 },
  { label: "Avg Cost Per Hire", target: 850, prefix: "$" },
  { label: "Bilingual Reach", target: 58, suffix: "%" },
];

const candidates = [
  {
    initial: "J",
    name: "Jose M.",
    detail: "8 yrs experience · Austin · EN/ES ✓",
    score: "95%",
    scoreColor: "var(--green)",
    badgeGradient:
      "linear-gradient(135deg,var(--orange-dim),var(--purple-dim))",
    badgeColor: "var(--orange)",
  },
  {
    initial: "M",
    name: "Marcus T.",
    detail: "5 yrs experience · Round Rock · EN",
    score: "87%",
    scoreColor: "var(--orange)",
    badgeGradient: "linear-gradient(135deg,var(--purple-dim),var(--blue-dim))",
    badgeColor: "var(--purple-light)",
  },
  {
    initial: "A",
    name: "Ana R.",
    detail: "6 yrs experience · Cedar Park · EN/ES ✓",
    score: "82%",
    scoreColor: "var(--purple-light)",
    badgeGradient: "linear-gradient(135deg,var(--green-dim),var(--orange-dim))",
    badgeColor: "var(--green)",
  },
];

const stats = [
  { label: "Businesses Trusting Moil", target: 500, suffix: "+" },
  { label: "Jobs Posted Monthly", target: 5000, suffix: "+" },
  { label: "Interview Success Rate", target: 94, suffix: "%" },
  { label: "Avg Cost Per Hire", target: 850, prefix: "$" },
  { label: "Retention at 90 Days", target: 91, suffix: "%" },
  { label: "Starting Price / Month", target: 15, prefix: "$" },
];

const comparisonRows = [
  ["Market Research (20–30 pages)", "✓ Instant", "✓ $5,000+", "✗"],
  ["30-Day Content Calendar (Content360)", "✓ Automated", "✗", "Partial"],
  ["AI-Generated Images (30/month)", "✓ Included", "✗", "✗"],
  ["AI Video Generation", "✓ Included", "✗", "✗"],
  ["Investor-Ready Business Plan", "✓ One Click", "✓ $15,000+", "✗"],
  ["Smart Hiring (10+ Platforms)", "✓ Auto-post", "✗", "✗"],
  ["Candidate AI Matching (95%)", "✓ Instant", "✗", "✗"],
  ["24/7 Business Coaching", "✓ Always On", "✗", "Limited"],
  ["Brand DNA System", "✓ Built-in", "✗", "✗"],
  ["Bilingual English & Spanish", "✓ Full", "Rarely", "✗"],
  ["Document Creation", "✓ Unlimited", "✓ Expensive", "✗"],
  ["Monthly Price", "$15–$75/mo", "$5,000+/project", "$50–$200/mo"],
];

const bilingualHighlights = [
  {
    icon: "🌎",
    title: "58% More Bilingual Reach",
    desc: "vs. 22% industry average for candidate matching",
    badge: "Proven",
    badgeClass: "badge-g",
  },
  {
    icon: "🗣️",
    title: "Voice Input — English & Spanish",
    desc: "Answer 21 questions by voice in your preferred language",
    badge: "Both",
    badgeClass: "badge-o",
  },
  {
    icon: "📝",
    title: "Content360 in Both Languages",
    desc: "Every caption, hook, and hashtag — one-click translate",
    badge: "1 Click",
    badgeClass: "badge-p",
  },
];

const testimonials = [
  {
    quote:
      "I've used it to post a position and I am impressed with how easy, intuitive, and effective Moil is. Within hours, we connected with multiple great candidates. I definitely recommend it and will keep using it.",
    name: "Luis Vives",
    role: "Business Owner · Texas",
    initial: "L",
    avatarBg: "linear-gradient(135deg,var(--orange-dim),var(--purple-dim))",
  },
  {
    quote:
      "Excellent platform whether to look for a job or to look for workers. I recommend it 100%. The AI matching finds people that fit exactly what we need — the bilingual feature is incredible.",
    name: "Liliana Cervantes",
    role: "SMB Owner · Texas",
    initial: "L",
    avatarBg: "linear-gradient(135deg,var(--purple-dim),var(--blue-dim))",
  },
  {
    quote:
      "100% RECOMMENDABLE. This platform helps me find employees when I need that extra help. Fast, accurate, bilingual. It's like having a full HR department available 24/7 for the price of a coffee a day.",
    name: "Miguel Bustos",
    role: "Service Business · Texas",
    initial: "M",
    avatarBg: "linear-gradient(135deg,var(--orange-dim),var(--green-dim))",
  },
];

export default function BusinessPage() {
  const { theme, toggleTheme, menuOpen, setMenuOpen, scrolled } =
    useBusinessUi();

  return (
    <div>
      <div className="cursor" id="cur"></div>
      <div className="cursor-ring" id="curR"></div>

      <BusinessMobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onToggleTheme={toggleTheme}
        theme={theme}
        items={mobileItems}
      />
      <BusinessNav
        scrolled={scrolled}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((prev) => !prev)}
        onToggleTheme={toggleTheme}
        theme={theme}
        items={navItems}
      />

      {/* HERO */}
      <section id="hero">
        <div className="hero-grid"></div>
        <div className="hero-orb orb1"></div>
        <div className="hero-orb orb2"></div>
        <div className="hero-orb orb3"></div>

        <div className="hero-eyebrow">
          <span className="eyebrow-pulse"></span>
          🚀 Trusted by 500+ Businesses in Texas — AI-Powered from Day One
        </div>

        <h1 className="hero-headline">
          The AI <span className="hl-o">Co-Founder</span>
          <br />
          Every Small Business
          <br />
          <span className="hl-p">Deserves.</span>
        </h1>

        <p className="hero-sub">
          One platform. 21 questions. Market research, business plan, 30-day
          content marketing, AI images + video, smart hiring, and a 24/7
          business coach — all powered by AI that actually understands your
          business.
        </p>

        <div className="hero-ctas">
          <a
            className="btn-primary"
            href="https://business.moilapp.com/register"
            target="_blank"
            rel="noreferrer"
          >
            🚀 Start With Your AI Co-Founder <span>→</span>
          </a>
          <a
            className="btn-secondary"
            href="https://www.youtube.com/@MoilApp"
            target="_blank"
            rel="noreferrer"
          >
            ▶ See What It Does
          </a>
        </div>

        <div className="hero-trust">
          <div className="trust-pill">
            <span className="dot dot-g"></span> 500+ Businesses
          </div>
          <div className="trust-pill">
            <span className="dot dot-o"></span> 5,000+ Jobs Posted Monthly
          </div>
          <div className="trust-pill">
            <span className="dot dot-p"></span> 94% Interview Success Rate
          </div>
          <div className="trust-pill">
            <span className="dot dot-g"></span> Bilingual EN/ES
          </div>
          <div className="trust-pill">
            <span className="dot dot-o"></span> From $15/month
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="capabilities-bar">
        <div className="ticker-track">
          {tickerItems.concat(tickerItems).map((item, index) => (
            <div className="ticker-item" key={`${item}-${index}`}>
              <span className="ti-dot">·</span> {item}
            </div>
          ))}
        </div>
      </div>

      <div className="divider"></div>

      {/* IDENTITY */}
      <section id="identity">
        <div className="identity-grid">
          <div>
            <div className="section-tag rv">Your AI Co-Founder</div>
            <h2 className="section-headline rv">
              The Smartest Hire.
              <br />
              You&apos;ll{" "}
              <span style={{ color: "var(--orange)" }}>Never Pay</span>
              <br />
              <span style={{ color: "var(--purple-light)" }}>A Salary.</span>
            </h2>
            <p className="identity-quote rv">
              "Running a small business means wearing every hat — CEO, marketer,
              recruiter, strategist — all at once.
              <em>That ends today.</em>"
            </p>
            <p className="identity-body rv">
              Moil is the first AI platform that connects every critical
              function of a small business into a single intelligent ecosystem.
              Start a conversation, answer 21 strategic questions, and watch
              your AI co-founder build your market research, business plan,
              content strategy, visual assets, and hiring pipeline — all in one
              session.
            </p>
            <p
              className="rv"
              style={{
                fontFamily: "var(--mono)",
                fontSize: "11px",
                color: "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              Available in English &amp; Spanish · SOC 2 Compliant · No setup
              fees
            </p>
          </div>
          <div className="rv d2">
            <div className="cofounder-card">
              <div className="cf-header">
                <div className="cf-avatar">🤖</div>
                <div>
                  <div className="cf-title">Your AI Co-Founder</div>
                  <div className="cf-sub">
                    Moil Intelligence Platform · Always On
                  </div>
                </div>
              </div>
              <div className="cf-capabilities">
                {cofounderCapabilities.map((cap) => (
                  <div className="cf-cap" key={cap.title}>
                    <span className="cf-cap-icon">{cap.icon}</span>
                    <div className="cf-cap-text">
                      <div className="cf-cap-title">{cap.title}</div>
                      <div className="cf-cap-sub">{cap.sub}</div>
                    </div>
                    <span className={`cf-cap-badge ${cap.badgeClass}`}>
                      {cap.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* PROBLEM / VS */}
      <section id="problem">
        <div className="problem-inner">
          <div className="section-tag rv" style={{ justifyContent: "center" }}>
            The Old Way vs. The Moil Way
          </div>
          <h2
            className="section-headline rv"
            style={{
              textAlign: "center",
              maxWidth: "900px",
              margin: "0 auto 12px",
            }}
          >
            Stop Paying Consultant
            <br />
            Prices for <span style={{ color: "var(--orange)" }}>
              One-Size
            </span>{" "}
            Answers.
          </h2>
          <p
            className="rv"
            style={{
              textAlign: "center",
              fontSize: "16px",
              color: "var(--text2)",
              maxWidth: "580px",
              margin: "0 auto 60px",
              fontWeight: 300,
            }}
          >
            Traditional consultants charge $5,000+ per engagement and know
            nothing about your business. Moil&apos;s AI learns everything — and
            never forgets it.
          </p>

          <div
            className="vs-grid-wrap"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gap: "32px",
              alignItems: "stretch",
            }}
          >
            <div
              className="cost-card old rv"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div className="cost-badge old-b">Old Method</div>
              <div className="cost-title">Traditional Consultants</div>
              <div className="cost-price strike">$5,000+</div>
              <div className="cost-period">Per engagement · 2–4 weeks wait</div>
              <ul className="cost-list" style={{ flex: 1 }}>
                <li>
                  <span className="x">✗</span>2–4 weeks just to get started
                </li>
                <li>
                  <span className="x">✗</span>$5,000–$15,000 per project
                </li>
                <li>
                  <span className="x">✗</span>Generic templates, not your
                  business
                </li>
                <li>
                  <span className="x">✗</span>Limited revisions — pay more for
                  changes
                </li>
                <li>
                  <span className="x">✗</span>Separate tools for research,
                  planning, hiring
                </li>
                <li>
                  <span className="x">✗</span>Goes dark between engagements
                </li>
                <li>
                  <span className="x">✗</span>No content, no visuals, no hiring
                  help
                </li>
                <li>
                  <span className="x">✗</span>English only, mostly
                </li>
              </ul>
            </div>

            <div
              className="rv"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "12px",
                padding: "0 8px",
              }}
            >
              <div
                style={{
                  width: "1px",
                  flex: 1,
                  background:
                    "linear-gradient(180deg,transparent,var(--border2),transparent)",
                  minHeight: "60px",
                }}
              ></div>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg,var(--orange-dim),var(--purple-dim))",
                  border: "1px solid var(--border2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--display)",
                  fontSize: "20px",
                  color: "var(--orange)",
                  flexShrink: 0,
                }}
              >
                VS
              </div>
              <div
                style={{
                  width: "1px",
                  flex: 1,
                  background:
                    "linear-gradient(180deg,transparent,var(--border2),transparent)",
                  minHeight: "60px",
                }}
              ></div>
            </div>

            <div
              className="cost-card new rv d2"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div className="cost-badge new-b">⭐ Moil AI Co-Founder</div>
              <div className="cost-title">Your AI Co-Founder</div>
              <div className="cost-price moil-price">$15</div>
              <div className="cost-period">
                Per month · Instant access · No setup fees
              </div>
              <ul className="cost-list" style={{ flex: 1 }}>
                <li>
                  <span className="ok">✓</span>Instant AI coaching & insights —
                  now
                </li>
                <li>
                  <span className="ok">✓</span>Starts at just $15/month
                </li>
                <li>
                  <span className="ok">✓</span>Personalized to YOUR business,
                  always
                </li>
                <li>
                  <span className="ok">✓</span>Unlimited conversations &
                  revisions
                </li>
                <li>
                  <span className="ok">✓</span>Integrated: research → plan →
                  content → hiring
                </li>
                <li>
                  <span className="ok">✓</span>24/7 guidance — never goes dark
                </li>
                <li>
                  <span className="ok">✓</span>AI images, video, 30-day calendar
                  included
                </li>
                <li>
                  <span className="ok">✓</span>Bilingual English & Spanish
                </li>
              </ul>
              <div style={{ marginTop: "28px" }}>
                <a
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  href="https://business.moilapp.com/register"
                  target="_blank"
                  rel="noreferrer"
                >
                  Start With Your AI Co-Founder →
                </a>
                <p
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "9px",
                    color: "var(--text3)",
                    textAlign: "center",
                    marginTop: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  🔒 Secure · 30-day guarantee · No setup fees
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* CAPABILITIES */}
      <section id="capabilities">
        <div className="section-tag rv">Platform Capabilities</div>
        <h2 className="section-headline rv">
          Everything Your Business
          <br />
          Needs. <span style={{ color: "var(--orange)" }}>One Platform.</span>
        </h2>
        <p className="section-sub rv">
          Six powerful modules, woven into a single intelligent conversation.
          Each one feeds the next.
        </p>

        <div className="cap-row-1">
          {capabilityCards.map((card, index) => (
            <div
              key={card.title}
              className={`cap-card rv ${index === 1 ? "d1" : ""} ${index === 2 ? "d2" : ""}`}
            >
              <span className="cap-icon">{card.icon}</span>
              <div className="cap-title">{card.title}</div>
              <p className="cap-desc">{card.desc}</p>
              <div className="cap-tags">
                {card.tags.map((tag) => (
                  <span key={tag.label} className={`tag ${tag.className}`}>
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="cap-row-2">
          <div
            className="cap-card rv"
            style={{
              background:
                "linear-gradient(135deg,rgba(255,92,26,0.06),var(--purple-dim),var(--surface))",
              borderColor: "rgba(255,92,26,0.22)",
            }}
          >
            <div className="featured-inner">
              <div>
                <span className="cap-icon">📅</span>
                <div className="cap-title">
                  Content360 — Your 30-Day Marketing Engine
                </div>
                <p className="cap-desc">
                  Your complete monthly content department, built by AI. 30 days
                  of researched topics, tested hooks, full captions by type,
                  CTAs, hashtags, AI-generated images, and AI video for your
                  highest-impact days.
                </p>
                <div className="cap-tags" style={{ marginBottom: "20px" }}>
                  <span className="tag tag-o">30-Day Calendar</span>
                  <span className="tag tag-p">AI Images</span>
                  <span className="tag tag-b">AI Video</span>
                  <span className="tag tag-g">Brand DNA</span>
                </div>
                <a
                  className="btn-secondary"
                  style={{ fontSize: "13px", padding: "10px 22px" }}
                  href="https://business.moilapp.com/register"
                  target="_blank"
                  rel="noreferrer"
                >
                  Explore Content360 →
                </a>
              </div>
              <div>
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border2)",
                    borderRadius: "12px",
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "9px",
                      color: "var(--text3)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: "12px",
                      textAlign: "center",
                    }}
                  >
                    30-Day Preview
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(5,1fr)",
                      gap: "6px",
                    }}
                  >
                    {[
                      "01",
                      "02",
                      "03",
                      "04",
                      "05",
                      "06",
                      "07",
                      "08",
                      "09",
                      "10",
                    ].map((day, index) => (
                      <div className="cal-mini" key={day}>
                        <div className="cm-num">{day}</div>
                        <div
                          className={`cm-type ${["cm-edu", "cm-promo", "cm-eng", "cm-bts", "cm-edu", "cm-promo", "cm-eng", "cm-edu", "cm-bts", "cm-promo"][index]}`}
                        >
                          {
                            [
                              "Edu",
                              "Promo",
                              "Engage",
                              "BTS",
                              "Edu",
                              "Promo",
                              "Engage",
                              "Edu",
                              "BTS",
                              "Promo",
                            ][index]
                          }
                        </div>
                        <div className="cm-img">
                          {
                            [
                              "📊",
                              "⚡",
                              "💬",
                              "🔧",
                              "📈",
                              "🎯",
                              "🗣️",
                              "💡",
                              "👀",
                              "🔥",
                            ][index]
                          }
                          {(index === 1 || index === 5 || index === 9) && (
                            <div className="cm-vid">▶</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "8px",
                      color: "var(--text3)",
                      textAlign: "center",
                      marginTop: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    10 of 30 days shown · Every day complete
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="cap-card rv d1"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <span className="cap-icon">📄</span>
            <div className="cap-title">Document Creation</div>
            <p className="cap-desc" style={{ flex: 1 }}>
              Contracts, proposals, employee handbooks, invoices, terms of
              service, NDAs — any business document you need, in seconds.
              Professional and aligned to your business tone.
            </p>
            <div className="cap-tags">
              <span className="tag tag-p">Contracts</span>
              <span className="tag tag-o">Proposals</span>
              <span className="tag tag-b">Handbooks</span>
              <span className="tag tag-g">Invoices</span>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* JOURNEY */}
      <section id="journey">
        <div className="journey-inner">
          <div className="section-tag rv">Your Complete Journey</div>
          <h2 className="section-headline rv">
            From 21 Questions to
            <br />
            <span style={{ color: "var(--orange)" }}>Total Business</span>
            <br />
            <span style={{ color: "var(--purple-light)" }}>Command.</span>
          </h2>
          <p className="section-sub rv">
            Everything automated. Every output professional. Every decision
            grounded in real market data.
          </p>

          <div className="journey-inner-grid">
            <div className="journey-steps">
              {journeySteps.map((step, index) => {
                const delayClass =
                  index === 1 || index === 2
                    ? "d1"
                    : index === 3 || index === 4
                      ? "d2"
                      : index === 5
                        ? "d3"
                        : "";
                return (
                  <div key={step.number} className={`jstep rv ${delayClass}`}>
                    <div className="jnum">{step.number}</div>
                    <div className="jstep-body">
                      <div className="jstep-time">{step.time}</div>
                      <div className="jstep-title">{step.title}</div>
                      <p className="jstep-desc">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="ai-convo rv d2">
              <div className="convo-header">
                <div className="convo-dots">
                  <div
                    className="convo-dot"
                    style={{ background: "#FF5F56" }}
                  ></div>
                  <div
                    className="convo-dot"
                    style={{ background: "#FFBD2E" }}
                  ></div>
                  <div
                    className="convo-dot"
                    style={{ background: "#27C93F" }}
                  ></div>
                </div>
                <span className="convo-title">MOIL AI CO-FOUNDER</span>
                <div className="convo-status">
                  <div className="convo-blink"></div> ACTIVE
                </div>
              </div>
              <div className="convo-body">
                <div
                  className="msg msg-user"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="msg-bubble">
                    I run a residential HVAC company in Austin. Revenue around
                    $800K. I want to grow to $2M and hire 3 more techs.
                  </div>
                </div>
                <div className="msg msg-ai" style={{ animationDelay: "0.8s" }}>
                  <div className="msg-ai-label">⚡ MOIL AI CO-FOUNDER</div>
                  <div className="msg-bubble">
                    Got it. I&apos;ve analyzed your market position. Central
                    Texas HVAC is booming — demand up 34% YoY. Here&apos;s your
                    growth blueprint:
                  </div>
                  <div className="msg-result">
                    <div className="mr-title">✓ Market Research Complete</div>
                    <div className="mr-items">
                      <div className="mr-item">
                        <span className="mr-dot"></span>Market size: $2.4B TAM
                        in Texas
                      </div>
                      <div className="mr-item">
                        <span className="mr-dot"></span>Your SAM: $180M within
                        50 miles
                      </div>
                      <div className="mr-item">
                        <span className="mr-dot"></span>3 competitor gaps
                        identified
                      </div>
                      <div className="mr-item">
                        <span className="mr-dot"></span>Premium tier
                        opportunity: $12K ACV
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="msg msg-user"
                  style={{ animationDelay: "1.6s" }}
                >
                  <div className="msg-bubble">
                    Build me the 30-day content strategy and start the hiring
                    pipeline for 3 HVAC techs.
                  </div>
                </div>
                <div className="msg msg-ai" style={{ animationDelay: "2.4s" }}>
                  <div className="msg-ai-label">⚡ MOIL AI CO-FOUNDER</div>
                  <div className="msg-bubble">
                    On it. Building your Content360 calendar + opening hiring on
                    10+ platforms now.
                  </div>
                  <div className="msg-result">
                    <div className="mr-title">✓ All Systems Active</div>
                    <div className="mr-items">
                      <div className="mr-item">
                        <span className="mr-dot"></span>30-day calendar: done
                        (AI images included)
                      </div>
                      <div className="mr-item">
                        <span className="mr-dot"></span>Hiring posted to 10
                        platforms
                      </div>
                      <div className="mr-item">
                        <span className="mr-dot"></span>3 candidates matched —
                        95%+ fit
                      </div>
                      <div className="mr-item">
                        <span className="mr-dot"></span>Business plan PDF: ready
                        to download
                      </div>
                    </div>
                  </div>
                </div>
                <div className="msg msg-ai" style={{ animationDelay: "3.2s" }}>
                  <div className="msg-ai-label">⚡ MOIL AI CO-FOUNDER</div>
                  <div
                    className="msg-bubble"
                    style={{ background: "var(--surface3)" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "4px",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          width: "7px",
                          height: "7px",
                          background: "var(--text3)",
                          borderRadius: "50%",
                          animation: "td 1.4s infinite",
                        }}
                      ></span>
                      <span
                        style={{
                          display: "block",
                          width: "7px",
                          height: "7px",
                          background: "var(--text3)",
                          borderRadius: "50%",
                          animation: "td 1.4s 0.2s infinite",
                        }}
                      ></span>
                      <span
                        style={{
                          display: "block",
                          width: "7px",
                          height: "7px",
                          background: "var(--text3)",
                          borderRadius: "50%",
                          animation: "td 1.4s 0.4s infinite",
                        }}
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{ textAlign: "center", marginTop: "64px" }}
            className="rv"
          >
            <a
              className="btn-primary"
              href="https://business.moilapp.com/register"
              target="_blank"
              rel="noreferrer"
            >
              🚀 Start Your AI-Powered Journey →
            </a>
            <p
              style={{
                fontFamily: "var(--mono)",
                fontSize: "10px",
                color: "var(--text3)",
                marginTop: "14px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Free to start · No credit card required
            </p>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* HIRING */}
      <section id="hiring">
        <div className="section-tag rv">AI-Powered Hiring</div>
        <h2 className="section-headline rv">
          Build Your Team
          <br />
          <span style={{ color: "var(--orange)" }}>5× Faster</span> Than
          <br />
          <span style={{ color: "var(--purple-light)" }}>Anyone Else.</span>
        </h2>
        <p className="section-sub rv">
          Post once. Reach 10+ platforms automatically. Get AI-matched
          candidates with 95% accuracy. Average time to hire: 11 days.
        </p>

        <div className="hiring-inner-grid">
          <div>
            <div className="hiring-steps">
              {hiringSteps.map((step, index) => (
                <div
                  key={step.title}
                  className={`hstep rv ${index === 1 ? "d1" : ""} ${index === 2 ? "d2" : ""} ${index === 3 ? "d3" : ""}`}
                >
                  <div className="hnum">{step.num}</div>
                  <div>
                    <div className="hstep-title">{step.title}</div>
                    <div className="hstep-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hiring-stats rv">
              {hiringStats.map((stat) => (
                <div className="h-stat" key={stat.label}>
                  <div
                    className="h-stat-val"
                    data-target={stat.target}
                    data-prefix={stat.prefix}
                    data-suffix={stat.suffix}
                  >
                    0
                  </div>
                  <div className="h-stat-lbl">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rv d2">
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: "9px",
                color: "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "14px",
              }}
            >
              Top Matched Candidates — HVAC Tech · Austin TX
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {candidates.map((candidate) => (
                <div className="cand-card" key={candidate.name}>
                  <div
                    className="cand-avatar"
                    style={{
                      background: candidate.badgeGradient,
                      color: candidate.badgeColor,
                      fontFamily: "var(--display)",
                      fontSize: "20px",
                    }}
                  >
                    {candidate.initial}
                  </div>
                  <div className="cand-info">
                    <div className="cand-name">{candidate.name}</div>
                    <div className="cand-detail">{candidate.detail}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "24px",
                        fontWeight: 700,
                        color: candidate.scoreColor,
                      }}
                    >
                      {candidate.score}
                    </div>
                    <div
                      style={{
                        fontSize: "9px",
                        color: "var(--text3)",
                        fontFamily: "var(--mono)",
                        textTransform: "uppercase",
                      }}
                    >
                      Match
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "14px",
                padding: "16px",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "9px",
                  color: "var(--green)",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "10px",
                }}
              >
                ✓ Posted to 10+ Platforms
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {[
                  "Indeed",
                  "ZipRecruiter",
                  "Austin Jobs",
                  "Spanish Groups",
                  "Facebook Groups",
                  "+5 more",
                ].map((item, index) => (
                  <span
                    key={item}
                    className={`tag ${index < 2 ? "tag-o" : index < 4 ? "tag-p" : index === 4 ? "tag-b" : "tag-g"}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: "10px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  background: "var(--orange-dim)",
                  border: "1px solid rgba(255,92,26,0.2)",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "9px",
                    color: "var(--orange)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  With Moil
                </div>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "var(--orange)",
                  }}
                >
                  $850
                </div>
                <div style={{ fontSize: "10px", color: "var(--text3)" }}>
                  avg cost per hire
                </div>
              </div>
              <div
                style={{
                  padding: "16px",
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "9px",
                    color: "var(--text3)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Industry Avg
                </div>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "var(--text3)",
                    textDecoration: "line-through",
                  }}
                >
                  $2,400
                </div>
                <div style={{ fontSize: "10px", color: "var(--text3)" }}>
                  avg cost per hire
                </div>
              </div>
            </div>

            <a
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: "16px",
              }}
              href="https://business.moilapp.com/register"
              target="_blank"
              rel="noreferrer"
            >
              Start Hiring With AI →
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div id="stats">
        <div className="stats-inner">
          <div style={{ textAlign: "center", marginBottom: "44px" }}>
            <div
              className="section-tag rv"
              style={{ justifyContent: "center" }}
            >
              Proven at Scale
            </div>
            <h2
              className="section-headline rv"
              style={{ fontSize: "clamp(32px,5vw,60px)" }}
            >
              Numbers That Matter.
            </h2>
          </div>
          <div className="stats-grid-inner">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`stat-box rv ${index === 1 ? "d1" : ""} ${index === 2 ? "d2" : ""} ${index === 3 ? "d3" : ""} ${index === 4 ? "d4" : ""}`}
              >
                <div
                  className="stat-val"
                  data-target={stat.target}
                  data-prefix={stat.prefix}
                  data-suffix={stat.suffix}
                >
                  0
                </div>
                <div className="stat-lbl">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* COMPARISON */}
      <section id="compare" className="section-wrap">
        <div className="section-tag rv" style={{ justifyContent: "center" }}>
          Moil vs. Everything Else
        </div>
        <h2 className="section-headline rv" style={{ textAlign: "center" }}>
          One Platform.
          <br />
          <span style={{ color: "var(--orange)" }}>Every Tool</span> You Need.
          <br />
          <span style={{ color: "var(--purple-light)" }}>
            Nothing You Don&apos;t.
          </span>
        </h2>
        <p
          className="rv"
          style={{
            textAlign: "center",
            fontSize: "16px",
            color: "var(--text2)",
            maxWidth: "580px",
            margin: "16px auto 52px",
            fontWeight: 300,
          }}
        >
          See how Moil stacks up against paying a traditional consultant or
          cobbling together generic AI tools.
        </p>

        <div
          className="rv"
          style={{
            overflowX: "auto",
            borderRadius: "18px",
            border: "1px solid var(--border2)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
              minWidth: "640px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    padding: "20px 28px",
                    textAlign: "left",
                    fontFamily: "var(--mono)",
                    fontSize: "10px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "var(--text3)",
                    background: "var(--surface2)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  Feature
                </th>
                <th
                  style={{
                    padding: "20px 24px",
                    textAlign: "center",
                    fontFamily: "var(--display)",
                    fontSize: "20px",
                    letterSpacing: "2px",
                    background:
                      "linear-gradient(135deg,rgba(255,92,26,0.1),rgba(124,58,237,0.07))",
                    borderBottom: "2px solid var(--orange)",
                    color: "var(--orange)",
                    whiteSpace: "nowrap",
                  }}
                >
                  MOIL ⭐
                </th>
                <th
                  style={{
                    padding: "20px 24px",
                    textAlign: "center",
                    fontFamily: "var(--mono)",
                    fontSize: "10px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: "var(--text3)",
                    background: "var(--surface2)",
                    borderBottom: "1px solid var(--border)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Traditional Consultant
                </th>
                <th
                  style={{
                    padding: "20px 24px",
                    textAlign: "center",
                    fontFamily: "var(--mono)",
                    fontSize: "10px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: "var(--text3)",
                    background: "var(--surface2)",
                    borderBottom: "1px solid var(--border)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Generic AI Tools
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, index) => {
                const moilColor = row[1].startsWith("✓")
                  ? "var(--green)"
                  : row[1].startsWith("$15")
                    ? "var(--orange)"
                    : "var(--text)";
                const consColor =
                  row[2] === "✗" ? "var(--text3)" : "var(--text2)";
                const genColor =
                  row[3] === "✗" ? "var(--text3)" : "var(--text2)";
                return (
                  <tr
                    key={row[0]}
                    style={{
                      borderBottom:
                        index === comparisonRows.length - 1
                          ? "none"
                          : "1px solid var(--border)",
                      transition: "background 0.2s",
                    }}
                  >
                    <td
                      style={{
                        padding: "16px 28px",
                        color: "var(--text)",
                        fontWeight: 500,
                        fontSize: "13px",
                      }}
                    >
                      {row[0]}
                    </td>
                    <td
                      style={{
                        padding: "16px 24px",
                        textAlign: "center",
                        fontWeight: 700,
                        color: moilColor,
                        background:
                          "linear-gradient(135deg,rgba(255,92,26,0.04),rgba(124,58,237,0.02))",
                        fontSize: "13px",
                      }}
                    >
                      {row[1]}
                    </td>
                    <td
                      style={{
                        padding: "16px 24px",
                        textAlign: "center",
                        color: consColor,
                        fontSize: "13px",
                      }}
                    >
                      {row[2]}
                    </td>
                    <td
                      style={{
                        padding: "16px 24px",
                        textAlign: "center",
                        color: genColor,
                        fontSize: "13px",
                      }}
                    >
                      {row[3]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ textAlign: "center", marginTop: "44px" }} className="rv">
          <a
            className="btn-primary"
            href="https://business.moilapp.com/register"
            target="_blank"
            rel="noreferrer"
          >
            🚀 Start — Experience The Difference →
          </a>
        </div>
      </section>

      <div className="divider"></div>

      {/* BILINGUAL */}
      <section className="section-wrap">
        <div className="bilingual-grid">
          <div>
            <div className="section-tag rv">
              Built for the America That Exists
            </div>
            <h2 className="section-headline rv">
              Fully <span style={{ color: "var(--orange)" }}>Bilingual</span>
              <br />
              From Day{" "}
              <span style={{ color: "var(--purple-light)" }}>One.</span>
            </h2>
            <p
              className="rv"
              style={{
                fontSize: "16px",
                color: "var(--text2)",
                lineHeight: 1.8,
                margin: "20px 0 32px",
                fontWeight: 300,
              }}
            >
              Every feature, every output, every conversation — in English and
              Spanish. Because your customers and team speak both.
            </p>
            <div
              className="rv d1"
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {bilingualHighlights.map((item) => (
                <div className="bilingual-card" key={item.title}>
                  <span style={{ fontSize: "28px", flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "14px",
                        marginBottom: "3px",
                      }}
                    >
                      {item.title}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text3)" }}>
                      {item.desc}
                    </div>
                  </div>
                  <span className={`cf-cap-badge ${item.badgeClass}`}>
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rv d2">
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border2)",
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "var(--surface2)",
                  padding: "14px 20px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "9px",
                    color: "var(--orange)",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  Content360 Post Preview
                </span>
                <div
                  style={{ marginLeft: "auto", display: "flex", gap: "6px" }}
                >
                  <span className="tag tag-o">EN</span>
                  <span className="tag tag-p">ES</span>
                </div>
              </div>
              <div
                style={{
                  padding: "22px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "8px",
                      color: "var(--orange)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: "10px",
                    }}
                  >
                    🇺🇸 English
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--text)",
                      lineHeight: 1.6,
                      marginBottom: "10px",
                    }}
                  >
                    🔧 <strong>The $200/Hour Technician</strong>
                    <br />
                    <br />
                    Your HVAC tech isn&apos;t just fixing units — they&apos;re
                    running a profit center on wheels.
                  </div>
                  <div
                    style={{ fontSize: "11px", color: "var(--purple-light)" }}
                  >
                    #HVAC #ServiceBiz #Austin
                  </div>
                </div>
                <div
                  style={{
                    background: "var(--surface2)",
                    border: "1px solid rgba(124,58,237,0.2)",
                    borderRadius: "12px",
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "8px",
                      color: "var(--purple-light)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: "10px",
                    }}
                  >
                    🇲🇽 Español
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--text)",
                      lineHeight: 1.6,
                      marginBottom: "10px",
                    }}
                  >
                    🔧 <strong>El Técnico de $200/Hora</strong>
                    <br />
                    <br />
                    Tu técnico de HVAC no solo repara unidades — maneja un
                    centro de ganancias.
                  </div>
                  <div
                    style={{ fontSize: "11px", color: "var(--purple-light)" }}
                  >
                    #HVAC #NegocioDeServicio #Austin
                  </div>
                </div>
              </div>
              <div style={{ padding: "0 22px 18px" }}>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "9px",
                    color: "var(--green)",
                  }}
                >
                  ✓ Day 7 of 30 · Educational · AI Image Generated ·
                  Brand-Aligned
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <BusinessPricingSection />

      <div className="divider"></div>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ textAlign: "center" }}>
        <div className="section-tag rv" style={{ justifyContent: "center" }}>
          Real Businesses. Real Results.
        </div>
        <h2 className="section-headline rv">
          500+ Businesses Can&apos;t
          <br />
          <span style={{ color: "var(--orange)" }}>Be Wrong.</span>
        </h2>
        <div className="testi-inner-grid">
          {testimonials.map((t, index) => (
            <div
              className={`t-card rv ${index === 1 ? "d1" : ""} ${index === 2 ? "d2" : ""}`}
              key={t.name}
            >
              <span className="t-qmark">"</span>
              <div className="t-stars">★★★★★</div>
              <p className="t-text">{t.quote}</p>
              <div className="t-divider"></div>
              <div className="t-author">
                <div className="t-av" style={{ background: t.avatarBg }}>
                  {t.initial}
                </div>
                <div>
                  <div className="t-name">{t.name}</div>
                  <div className="t-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider"></div>

      <BusinessFaqSection />

      <div className="divider"></div>

      <BusinessFinalCta />

      <BusinessFooter theme={theme} onToggleTheme={toggleTheme} />
    </div>
  );
}
