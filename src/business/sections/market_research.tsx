"use client";

import { MessageSquare, Search, FileText, Palette, Users, TrendingUp } from "lucide-react";
import { openBusinessRegister } from "../utils/urlBuilder";

const journeySteps = [
  {
    id: 1,
    step: "STEP 1",
    title: "Answer 21 Strategic Questions",
    duration: "5-10 min",
    description: "Kickstart with our AI business coach via voice or text (English/Spanish).",
    valueDelivered: [
      "Deep understanding of your business model",
      "Clear gaps, strengths, and opportunities identified",
      "Strong foundation for research + personalized launch roadmap"
    ],
    tagline: "Start your AI-powered business journey effortlessly.",
    icon: <MessageSquare className="w-7 h-7" />,
    color: "from-[#5843BD] to-[#4a3ba0]"
  },
  {
    id: 2,
    step: "STEP 2",
    title: "Comprehensive Market Research",
    duration: "Automated",
    description: "Your AI business coach instantly runs deep automated market research using your answers—analyzing real data on size, competition, demographics, and validation.",
    valueDelivered: [
      "TAM/SAM/SOM calculations",
      "Competitive landscape mapping",
      "Detailed customer personas",
      "Opportunity scoring & validation"
    ],
    tagline: "",
    icon: <Search className="w-7 h-7" />,
    color: "from-[#FF6633] to-[#e55a2b]"
  },
  {
    id: 3,
    step: "STEP 3",
    title: "Generate Investor-Ready Business Plan",
    duration: "One Click",
    description: "Download a polished PDF ready for investors, banks, or partners—built fast and smart with AI for small business.",
    valueDelivered: [
      "Compelling executive summary",
      "5-year financial projections & revenue/cost models",
      "Go-to-market + marketing strategy",
      "Operational roadmap",
      "Funding requirements analysis"
    ],
    tagline: "",
    icon: <FileText className="w-7 h-7" />,
    color: "from-[#5843BD] to-[#FF6633]"
  },
  {
    id: 4,
    step: "STEP 4",
    title: "Launch Marketing & Build Presence",
    duration: "AI Tools",
    description: "Create professional marketing materials and establish your brand presence with AI-powered tools.",
    valueDelivered: [
      "Blog posts, social media, emails, ad copy",
      "Graphics, product images, posts",
      "Contracts, proposals, branding (logos, colors, messaging)",
      "SEO keyword research + website content"
    ],
    tagline: "",
    icon: <Palette className="w-7 h-7" />,
    color: "from-[#5843BD] to-[#4a3ba0]"
  },
  {
    id: 5,
    step: "STEP 5",
    title: "Smart Hiring & Team Building",
    duration: "2 min to post + ongoing",
    description: "Scale confidently with AI hiring tools that craft optimized job descriptions, auto-post to 10+ platforms (incl. local Facebook groups), and deliver 95% accurate candidate matching.",
    valueDelivered: [
      "Skills/location/experience scoring",
      "Interview questions generation",
      "Automated candidate screening"
    ],
    tagline: "",
    icon: <Users className="w-7 h-7" />,
    color: "from-[#FF6633] to-[#5843BD]"
  },
  {
    id: 6,
    step: "STEP 6",
    title: "Ongoing Growth Coaching",
    duration: "24/7 AI Partner",
    description: "The more you use it, the better it knows your business—your dedicated AI business coach for sustained growth.",
    valueDelivered: [
      "24/7 advice & troubleshooting",
      "Cash flow/financial guidance",
      "Marketing refinements",
      "Customer retention tactics",
      "Scaling + hiring recommendations",
      "Industry insights/alerts"
    ],
    tagline: "",
    icon: <TrendingUp className="w-7 h-7" />,
    color: "from-[#5843BD] to-[#4a3ba0]"
  }
];

interface MarketResearchProps {
  refQuery?: string;
  lgQuery?: string;
}

export default function MarketResearch({ refQuery, lgQuery }: MarketResearchProps) {
  return (
    <section className="relative py-8 md:py-16 lg:py-24 xl:py-32 overflow-hidden" id="research">
      {/* Sophisticated White to Purple Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-[#5843BD]/20"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#5843BD]/5 to-[#5843BD]/10"></div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 animate-pulse" style={{
          backgroundImage: `
            linear-gradient(rgba(88, 67, 189, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(88, 67, 189, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridMove 20s linear infinite'
        }}></div>
      </div>
      
      {/* Animated Illustration Background Elements */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-[#5843BD]/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/3 right-24 w-32 h-32 bg-gradient-to-br from-[#FF6633]/15 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-24 left-1/4 w-48 h-48 bg-gradient-to-br from-[#5843BD]/8 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      <div className="absolute bottom-20 right-20 w-36 h-36 bg-gradient-to-br from-[#FF6633]/12 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '6s' }}></div>
      
      {/* Floating Geometric Shapes */}
      <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-[#5843BD]/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-[#FF6633]/40 rounded-full animate-bounce" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-1/2 left-1/5 w-5 h-5 bg-[#5843BD]/25 rounded-full animate-bounce" style={{ animationDelay: '5s' }}></div>
      
      {/* Floating Icons */}
      <div className="absolute top-32 right-1/4 text-[#5843BD]/20 animate-bounce" style={{ animationDelay: '2s' }}>
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
        </svg>
      </div>
      <div className="absolute bottom-32 left-1/4 text-[#FF6633]/20 animate-bounce" style={{ animationDelay: '4s' }}>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
        </svg>
      </div>

      <div className="container relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16 xl:mb-20 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 md:px-6 bg-white border border-gray-200 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6 text-gray-700 shadow-sm">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#5843BD] rounded-full"></div>
            Your Business Journey
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 lg:mb-6 text-gray-900 leading-tight">
            From Questions to Growth:{" "}
            <span className="text-[#5843BD]">Your Complete Journey</span>
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your AI Business Coach guides you through every stage of building your business—from validating your
            idea to scaling with a team. Here&apos;s how it works.
          </p>
        </div>

                {/* 6-Step Journey Tree */}
        <div className="relative max-w-6xl mx-auto mt-12 md:mt-20 px-4">
          {/* Central Line (Desktop) / Left Line (Mobile) */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#5843BD] via-[#FF6633] to-[#5843BD] md:-translate-x-1/2 opacity-30"></div>

          {journeySteps.map((step, index) => {
            const isRight = index % 2 !== 0; // Index 0 (Left), Index 1 (Right)

            return (
              <div key={step.id} className={`relative flex items-center mb-16 last:mb-0 md:justify-between w-full ${isRight ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-4 border-[#5843BD] z-10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xs font-bold text-[#5843BD]">{step.id}</span>
                </div>

                {/* Connecting Line (Mobile Only - Horizontal) */}
                <div className="absolute left-12 w-8 h-0.5 bg-[#5843BD]/30 md:hidden"></div>

                {/* Content Card */}
                <div className={`w-full pl-20 md:pl-0 md:w-[calc(50%-40px)]`}>
                  <div className="group bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                    
                    {/* Hover Gradient Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                    {/* Step Header */}
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        {step.icon}
                      </div>
                      <div className="px-3 py-1.5 bg-gray-100 rounded-full text-xs md:text-sm font-medium text-gray-600">
                        {step.duration}
                      </div>
                    </div>

                    {/* Step Badge */}
                    <div className="inline-flex items-center gap-2 mb-3 relative z-10">
                      <span className="text-xs font-bold text-[#5843BD] bg-[#5843BD]/10 px-2 py-1 rounded">{step.step}</span>
                    </div>

                    {/* Title & Description */}
                    <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-[#5843BD] transition-colors relative z-10">
                      {step.title}
                    </h4>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 relative z-10">
                      {step.description}
                    </p>

                    {/* Value Delivered */}
                    <div className="mt-4 border-t border-gray-100 pt-4 relative z-10">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Key Outputs:</div>
                      <ul className="space-y-2">
                        {step.valueDelivered.map((value, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <div className="w-5 h-5 rounded-full bg-[#5843BD]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <svg className="w-3 h-3 text-[#5843BD]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                            </div>
                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tagline (if exists) */}
                    {step.tagline && (
                      <div className="mt-4 pt-4 border-t border-gray-100 relative z-10">
                        <p className="text-sm font-medium text-[#FF6633] italic flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6633]"></span>
                          {step.tagline}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clean CTA */}
        <div className="text-center mt-12 md:mt-16 lg:mt-20">
          <button  onClick={() => openBusinessRegister({ ref: refQuery, lg: lgQuery })} className="bg-[#5843BD] hover:bg-[#4a3ba0] text-white font-semibold py-4 px-8 rounded-xl transition-colors duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            Start Your AI-Powered Journey
          </button>
          <p className="text-gray-600 mt-4 text-sm md:text-base">From idea to growth—your complete business journey starts here</p>
        </div>
      </div>
    </section>
  );
}
