"use client";

import { openBusinessRegister } from "../utils/urlBuilder";
import { MessageSquare, FileText, Share2, Users, UserCheck } from "lucide-react";

const hiringSteps = [
  {
    step: "1",
    title: "Tell Your AI Coach What You Need",
    example: '"I need to hire a skilled plumber for residential work in Austin"',
    icon: <MessageSquare className="w-6 h-6" />,
    gradient: "from-[#5843BD] to-purple-600"
  },
  {
    step: "2",
    title: "AI Generates Everything",
    outputs: [
      "Complete job description with requirements",
      "Skills assessment and screening questions",
      "Competitive salary recommendations",
      "Optimized posting copy for maximum reach"
    ],
    icon: <FileText className="w-6 h-6" />,
    gradient: "from-[#FF6633] to-orange-600"
  },
  {
    step: "3",
    title: "Auto-Posts to 10+ Platforms",
    platforms: "Austin Jobs • Round Rock Hiring • Cedar Park Opportunities • Spanish Job Groups • Local Trade Networks • 5+ more targeted groups",
    distribution: [
      { day: "Monday", action: "Initial post with AI-optimized copy" },
      { day: "Wednesday", action: "Skills highlight and benefits" },
      { day: "Friday", action: "Application deadline reminder" }
    ],
    icon: <Share2 className="w-6 h-6" />,
    gradient: "from-[#5843BD] to-purple-600"
  },
  {
    step: "4",
    title: "AI Matches & Scores Candidates",
    scoring: [
      "Skills match analysis",
      "Location proximity scoring",
      "Experience level matching",
      "Language requirements (EN/ES)"
    ],
    matchRatings: [
      { percent: "95%", label: "Perfect fit—interview immediately" },
      { percent: "85%", label: "Strong candidate—review priority" },
      { percent: "75%", label: "Worth considering" }
    ],
    icon: <Users className="w-6 h-6" />,
    gradient: "from-green-500 to-teal-600"
  },
  {
    step: "5",
    title: "You Interview Top Matches",
    description: "Review ranked candidates, schedule interviews, and hire with confidence.",
    icon: <UserCheck className="w-6 h-6" />,
    gradient: "from-[#FF6633] to-orange-600"
  }
];

const stats = [
  { number: "5x", label: "Faster than Indeed" },
  { number: "94%", label: "Interview success rate" },
  { number: "91%", label: "Retention at 90 days" },
  { number: "58%", label: "Bilingual candidates (vs. 22% avg)" },
  { number: "$850", label: "Avg cost per hire (vs. $2,400)" },
  { number: "11 days", label: "Avg time to hire (vs. 32 days)" },
  { number: "5,000+", label: "Jobs posted monthly" },
  { number: "500+", label: "Businesses hiring with confidence" }
];

interface SmartHiringProps {
  refQuery?: string;
  lgQuery?: string;
}

export default function SmartHiring({ refQuery, lgQuery }: SmartHiringProps) {
  const handleGenerateBusinessPlan = () => {
    openBusinessRegister({ ref: refQuery, lg: lgQuery });
  };
  return (
    <section className="relative py-12 md:py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-white via-orange-50 to-[#FF6633]/20" id="hiring">
      {/* Sophisticated Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#5843BD]/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#FF6633]/15 via-transparent to-transparent"></div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#5843BD08_1px,transparent_1px),linear-gradient(to_bottom,#5843BD08_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      
      {/* Animated Orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-[#5843BD]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#FF6633]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#5843BD]/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 md:px-6 bg-white/70 backdrop-blur-xl border border-[#5843BD]/20 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6 lg:mb-8 text-[#5843BD] shadow-lg">
            <div className="w-2 h-2 bg-[#FF6633] rounded-full animate-pulse"></div>
            AI-Powered Hiring
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 lg:mb-8 leading-tight">
            <span className="bg-gradient-to-r from-[#5843BD] via-purple-600 to-[#5843BD] bg-clip-text text-transparent">Build Your Team </span>
            <span className="bg-gradient-to-r from-[#FF6633] via-orange-500 to-[#FF6633] bg-clip-text text-transparent">5x Faster</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4">
            Your AI Coach doesn&apos;t just plan your business—it helps you build your team. Post once,
            reach 10+ platforms, and get matched with qualified candidates automatically.
          </p>
        </div>

        {/* How AI-Powered Hiring Works - Section Title */}
        <div className="text-center mb-8 md:mb-12">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#5843BD]">How AI-Powered Hiring Works</h3>
        </div>

        {/* 5-Step Hiring Process */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-16 lg:mb-20 space-y-6 md:space-y-8">
          {hiringSteps.map((step, index) => (
            <div key={index} className="group relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/60 hover:border-[#5843BD]/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4 md:gap-6">
                {/* Step Number & Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-xs font-bold text-[#5843BD] bg-[#5843BD]/10 px-2 py-1 rounded">Step {step.step}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-[#5843BD] transition-colors">
                    {step.title}
                  </h4>

                  {/* Step 1: Example quote */}
                  {step.example && (
                    <div className="bg-[#5843BD]/5 border-l-4 border-[#5843BD] p-4 rounded-r-lg italic text-gray-700">
                      {step.example}
                    </div>
                  )}

                  {/* Step 2: Outputs list */}
                  {step.outputs && (
                    <ul className="space-y-2">
                      {step.outputs.map((output, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-[#FF6633] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          <span>{output}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Step 3: Platforms & Distribution */}
                  {step.platforms && (
                    <div className="space-y-4">
                      <p className="text-gray-600 text-sm md:text-base">
                        <span className="font-semibold text-gray-900">Your job reaches:</span> {step.platforms}
                      </p>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Distribution Strategy:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {step.distribution?.map((dist, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#5843BD] bg-[#5843BD]/10 px-2 py-1 rounded">{dist.day}</span>
                              <span className="text-xs text-gray-600">{dist.action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Scoring & Match Ratings */}
                  {step.scoring && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-2">Every applicant gets scored on:</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {step.scoring.map((score, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-gray-700 text-sm">
                              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                              <span>{score}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Match Ratings:</p>
                        <div className="space-y-2">
                          {step.matchRatings?.map((rating, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded min-w-[50px] text-center">{rating.percent}</span>
                              <span className="text-sm text-gray-700">{rating.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Description */}
                  {step.description && (
                    <p className="text-gray-600 text-sm md:text-base">{step.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section - Hiring Results */}
        <div className="max-w-6xl mx-auto mb-12 md:mb-16 lg:mb-20">
          <div className="text-center mb-8 md:mb-12">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#5843BD]">Hiring Results That Speak for Themselves</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="group relative bg-white/90 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/60 hover:border-[#5843BD]/30 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#5843BD] mb-1 md:mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-xs md:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-[#5843BD]/10 via-transparent to-[#FF6633]/10 rounded-3xl blur-3xl"></div>
          
          <div className="relative bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/50 shadow-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-[#5843BD] to-[#FF6633] bg-clip-text text-transparent">
                Start Hiring with Your AI Coach
              </span>
            </h3>
            <p className="text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
              Join 500+ businesses that have transformed their hiring process with AI-powered candidate matching.
            </p>
            <button 
              onClick={handleGenerateBusinessPlan}
              className="group relative bg-[#5843BD] text-white font-bold py-4 px-8 md:py-5 md:px-10 rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              <span className="flex items-center justify-center gap-2">
                Start Hiring with Your AI Coach
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}