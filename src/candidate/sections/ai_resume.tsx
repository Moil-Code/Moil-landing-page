"use client";

import { openCandidateApp } from "../utils/urlBuilder";

interface AIResumeSectionProps {
  refQuery?: string;
  lgQuery?: string;
}

export default function AIResumeSection({ refQuery, lgQuery }: AIResumeSectionProps) {
  return (
    <section className="relative py-8 md:py-16 lg:py-24 xl:py-32 overflow-hidden bg-gradient-to-br from-white via-purple-50 to-[#5843BE]/20 dark:from-[#06080D] dark:via-[#0B0E18] dark:to-[#5843BE]/10" id="ai-resume">
      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(88,67,190,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(88,67,190,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'grid-float 20s ease-in-out infinite'
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-white/80 dark:bg-[#10141F]/80 backdrop-blur-lg rounded-full border border-[#5843BE]/20 dark:border-[#222840] shadow-lg mb-4 md:mb-6">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-[#5843BE] rounded-full animate-pulse"></div>
            <span className="text-[#5843BE] dark:text-[#A99BF0] font-medium md:font-semibold text-sm md:text-base">AI-Powered Resume Builder</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-[#EEF2FF] leading-tight mb-4 md:mb-6">
            Professional Resumes in <br className="hidden sm:block" />
            <span className="text-[#5843BE] bg-gradient-to-r from-[#5843BE] to-[#4a3ba0] bg-clip-text text-transparent">5 Minutes</span>
          </h2>
          <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-[#8892AA] leading-relaxed max-w-3xl mx-auto">
            Transform your career with AI-generated resumes. Use voice input or text to create ATS-optimized, 
            professional resumes that get you noticed by employers.
          </p>
        </div>

        {/* Main Content - Linear Design */}
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 items-start">
          
          {/* Left Column - Features */}
          <div className="bg-white/80 dark:bg-[#10141F]/80 backdrop-blur-lg rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl border border-white/50 dark:border-[#222840] h-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-[#5843BE] to-[#4a3ba0] rounded-2xl flex items-center justify-center shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-[#EEF2FF]">Smart Features</h3>
                <p className="text-gray-600 dark:text-[#8892AA]">Advanced AI capabilities</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { 
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#5843BE]">
                      <path d="M12 1C11.4477 1 11 1.44772 11 2V3C11 3.55228 11.4477 4 12 4C12.5523 4 13 3.55228 13 3V2C13 1.44772 12.5523 1 12 1Z" fill="currentColor"/>
                      <path d="M12 20C11.4477 20 11 20.4477 11 21V22C11 22.5523 11.4477 23 12 23C12.5523 23 13 22.5523 13 22V21C13 20.4477 12.5523 20 12 20Z" fill="currentColor"/>
                      <path d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12Z" fill="currentColor"/>
                      <circle cx="12" cy="12" r="3" fill="white"/>
                    </svg>
                  ), 
                  title: "Voice Input", 
                  desc: "Speak your experience naturally" 
                },
                { 
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#5843BE]">
                      <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                      <path d="M12 12L13.5 16.5L18 18L13.5 19.5L12 24L10.5 19.5L6 18L10.5 16.5L12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                  ), 
                  title: "ATS Optimized", 
                  desc: "Pass applicant tracking systems" 
                },
                { 
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#5843BE]">
                      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ), 
                  title: "Lightning Fast", 
                  desc: "Complete in under 5 minutes" 
                },
                { 
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#5843BE]">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  ), 
                  title: "Multi-Language", 
                  desc: "Support for 20+ languages" 
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50/50 dark:hover:bg-[#161C2B]/50 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#5843BE]/10 to-[#4a3ba0]/10 rounded-xl flex items-center justify-center border border-[#5843BE]/20 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-[#EEF2FF]">{feature.title}</div>
                    <div className="text-sm text-gray-600 dark:text-[#8892AA]">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center Column - Preview */}
          <div className="bg-white/80 dark:bg-[#10141F]/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50 dark:border-[#222840] h-full relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-[#5843BE] to-[#4a3ba0] rounded-2xl flex items-center justify-center shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-[#EEF2FF]">Live Preview</h3>
                <p className="text-gray-600 dark:text-[#8892AA]">See your resume in real-time</p>
              </div>
            </div>

            {/* Resume Preview Mockup */}
            <div className="bg-white dark:bg-[#10141F] rounded-2xl p-6 space-y-3 shadow-sm border dark:border-[#222840]">
              <div className="text-center border-b dark:border-[#222840] pb-3">
                <h3 className="text-lg font-bold text-gray-800 dark:text-[#EEF2FF]">Sarah Johnson</h3>
                <p className="text-sm text-gray-600 dark:text-[#8892AA]">Software Developer</p>
                <p className="text-xs text-gray-500 dark:text-[#8892AA]">sarah.johnson@email.com | (555) 123-4567</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-[#5843BE] dark:text-[#A99BF0] mb-1">Experience</h4>
                <div className="text-xs text-gray-700 dark:text-[#8892AA]">
                  <p className="font-medium">Frontend Developer - Tech Corp</p>
                  <p className="text-gray-600 dark:text-[#8892AA]">2022 - Present</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-[#5843BE] dark:text-[#A99BF0] mb-1">Skills</h4>
                <p className="text-xs text-gray-700 dark:text-[#8892AA]">React, JavaScript, TypeScript, CSS</p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="mt-6 p-4 bg-gradient-to-r from-[#5843BE]/10 to-[#4a3ba0]/10 rounded-xl border border-[#5843BE]/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 dark:text-[#8892AA] font-medium">Completion</span>
                <span className="text-[#5843BE] dark:text-[#A99BF0] font-bold">85%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-[#222840] rounded-full overflow-hidden">
                <div className="w-4/5 h-full bg-gradient-to-r from-[#5843BE] to-[#4a3ba0] rounded-full transition-all duration-1000"></div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-[#5843BE] to-[#4a3ba0] rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-white text-lg">✨</span>
            </div>
          </div>

          {/* Right Column - Stats & CTA */}
          <div className="bg-white/80 dark:bg-[#10141F]/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50 dark:border-[#222840] h-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-[#5843BE] to-[#4a3ba0] rounded-2xl flex items-center justify-center shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-[#EEF2FF]">Success Metrics</h3>
                <p className="text-gray-600 dark:text-[#8892AA]">Proven results</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="text-center p-4 bg-gradient-to-br from-[#5843BE]/10 to-[#4a3ba0]/10 rounded-xl border border-[#5843BE]/20">
                <div className="text-3xl font-bold text-[#5843BE] dark:text-[#A99BF0] mb-1">98%</div>
                <div className="text-sm text-gray-600 dark:text-[#8892AA]">ATS Pass Rate</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-[#5843BE]/10 to-[#4a3ba0]/10 rounded-xl border border-[#5843BE]/20">
                <div className="text-3xl font-bold text-[#5843BE] dark:text-[#A99BF0] mb-1">5min</div>
                <div className="text-sm text-gray-600 dark:text-[#8892AA]">Avg. Time</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-[#5843BE]/10 to-[#4a3ba0]/10 rounded-xl border border-[#5843BE]/20">
                <div className="text-3xl font-bold text-[#5843BE] dark:text-[#A99BF0] mb-1">50K+</div>
                <div className="text-sm text-gray-600 dark:text-[#8892AA]">Resumes Created</div>
              </div>
            </div>

            {/* Testimonial removed Aug 2026: "Sarah M., Software Engineer" was
                placeholder copy, not a real endorsement. Publishing invented quotes
                under invented names is the failure this repo already had once on
                /business. Real reviews live in src/common/data/reviews.ts and on
                /reviews; add one here only from that array. */}

            {/* CTA Button */}
            <button 
              onClick={() => openCandidateApp({ ref: refQuery, lg: lgQuery })}
              className="w-full px-6 py-4 bg-gradient-to-r from-[#5843BE] to-[#4a3ba0] text-white font-semibold rounded-2xl hover:from-[#4a3ba0] hover:to-[#5843BE] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Building Now
            </button>
            
            <p className="text-xs text-gray-500 dark:text-[#8892AA] text-center mt-3">
              No credit card required • Free to start
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
