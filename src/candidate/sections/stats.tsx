"use client";

import { openCandidateApp } from "../utils/urlBuilder";

interface StatsSectionProps {
  refQuery?: string;
  lgQuery?: string;
}

export default function StatsSection({ refQuery, lgQuery }: StatsSectionProps) {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-white via-orange-50 to-[#FF6633]/20 dark:from-[#06080D] dark:via-[#0B0E18] dark:to-[#FF6633]/10">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#FF6633]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-200/30 dark:bg-[#FF6633]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FF6633]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,102,51,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,102,51,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'grid-float 20s ease-in-out infinite'
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-[#10141F]/80 backdrop-blur-lg rounded-full border border-[#FF6633]/20 dark:border-[#222840] shadow-lg mb-6">
            <div className="w-3 h-3 bg-[#FF6633] rounded-full animate-pulse"></div>
            <span className="text-[#FF6633] font-semibold">Platform Statistics</span>
          </div>
          <h2 className="text-3xl lg:text-6xl font-bold text-gray-900 dark:text-[#EEF2FF] leading-tight mb-6">
            Proven Results That <br />
            <span className="text-[#FF6633] bg-gradient-to-r from-[#FF6633] to-[#ea580c] bg-clip-text text-transparent">Speak for Themselves</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 dark:text-[#8892AA] leading-relaxed max-w-3xl mx-auto">
            Join thousands of professionals who have transformed their careers with our AI-powered platform and advanced coaching tools
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              number: "94%",
              title: "Interview Success Rate",
              desc: "Users who practiced with our AI coach"
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21L12 19L16 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M10 10H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ),
              number: "25K+",
              title: "Job Placements",
              desc: "Successful career transitions made"
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M12 2L13.09 8.26L18 9L13.09 9.74L12 15L10.91 9.74L6 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 12L20.09 17.26L25 18L20.09 18.74L19 24L17.91 18.74L13 18L17.91 17.26L19 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 6L6.09 11.26L11 12L6.09 12.74L5 18L3.91 12.74L-1 12L3.91 11.26L5 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              // Was an invented average satisfaction score — one of three different
              // star figures shown across the candidate pages, which is how you can
              // tell none of them came from data. Replaced with something true.
              number: "EN/ES",
              title: "Fully Bilingual",
              desc: "Every feature in English and Spanish"
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M12 2C13.1046 2 14 2.89543 14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 9V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 11L12 15L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ),
              number: "150+",
              title: "Companies Hiring",
              desc: "Partner organizations actively recruiting"
            }
          ].map((stat, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6633]/20 to-orange-200/10 dark:to-[#FF6633]/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/80 dark:bg-[#10141F]/80 backdrop-blur-lg rounded-3xl p-8 border border-white/50 dark:border-[#222840] hover:border-[#FF6633]/30 dark:hover:border-[#FF6633]/30 transition-all duration-300 hover:transform hover:scale-105 shadow-2xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FF6633] to-[#ea580c] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-[#EEF2FF] mb-2">{stat.number}</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-[#EEF2FF] mb-2">{stat.title}</div>
                  <div className="text-sm text-gray-600 dark:text-[#8892AA]">
                    {stat.desc}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6633]/10 rounded-full border border-[#FF6633]/20 mb-6">
            <div className="w-2 h-2 bg-[#FF6633] rounded-full animate-pulse"></div>
            <span className="text-[#FF6633] text-sm font-medium">Join the Success</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-[#EEF2FF] mb-4">Ready to Transform Your Career?</h3>
          <p className="text-gray-600 dark:text-[#8892AA] mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already accelerated their careers with our AI-powered platform
          </p>
          <button 
            onClick={() => openCandidateApp({ ref: refQuery, lg: lgQuery })}
            className="px-8 py-4 bg-gradient-to-r from-[#FF6633] to-[#ea580c] text-white font-semibold rounded-2xl hover:from-[#ea580c] hover:to-[#FF6633] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Your Journey Today
          </button>
        </div>
      </div>
    </section>
  );
}
