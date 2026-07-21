"use client";

import { openCandidateApp } from "../utils/urlBuilder";

interface VoiceAssistantSectionProps {
  refQuery?: string;
  lgQuery?: string;
}

export default function VoiceAssistantSection({ refQuery, lgQuery }: VoiceAssistantSectionProps) {
  return (
    <section className="relative py-8 md:py-16 lg:py-24 xl:py-32 overflow-hidden bg-gradient-to-br from-white via-orange-50 to-[#FF6633]/20 dark:from-[#06080D] dark:via-[#0B0E18] dark:to-[#FF6633]/10" id="voice-assistant">
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
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-white/80 dark:bg-[#10141F]/80 backdrop-blur-lg rounded-full border border-[#FF6633]/20 dark:border-[#222840] shadow-lg mb-4 md:mb-6">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-[#FF6633] rounded-full animate-pulse"></div>
            <span className="text-[#FF6633] font-medium md:font-semibold text-sm md:text-base">AI Voice Interview Coach</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-[#EEF2FF] leading-tight mb-4 md:mb-6">
            Master Interviews with <br className="hidden sm:block" />
            <span className="text-[#FF6633] bg-gradient-to-r from-[#FF6633] to-[#ea580c] bg-clip-text text-transparent">Voice AI Coaching</span>
          </h2>
          <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-[#8892AA] leading-relaxed max-w-3xl mx-auto">
            Transform your interview performance with real-time AI analysis of your speech patterns,
            confidence levels, and answer quality. Get personalized feedback to land your dream job.
          </p>
        </div>

        {/* Main Content - Linear Design */}
        <div className="grid lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-start">

          {/* Left Column - Analysis Features */}
          <div className="bg-white/80 dark:bg-[#10141F]/80 backdrop-blur-lg rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl border border-white/50 dark:border-[#222840] h-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-[#FF6633] to-[#ea580c] rounded-2xl flex items-center justify-center shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-[#EEF2FF]">Voice Analysis</h3>
                <p className="text-gray-600 dark:text-[#8892AA]">Real-time speech insights</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#FF6633]">
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  ),
                  title: "Speech Clarity",
                  desc: "Analyze pronunciation and articulation",
                  score: "92%"
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#FF6633]">
                      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  title: "Pace & Rhythm",
                  desc: "Optimize speaking speed and flow",
                  score: "88%"
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#FF6633]">
                      <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  title: "Confidence Level",
                  desc: "Measure vocal confidence indicators",
                  score: "95%"
                }
              ].map((feature, index) => (
                <div key={index} className="p-4 rounded-xl hover:bg-gray-50/50 dark:hover:bg-[#161C2B]/50 transition-colors border border-gray-100 dark:border-[#1A1F30]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#FF6633]/10 to-[#ea580c]/10 rounded-xl flex items-center justify-center border border-[#FF6633]/20">
                        {feature.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-[#EEF2FF]">{feature.title}</div>
                        <div className="text-sm text-gray-600 dark:text-[#8892AA]">{feature.desc}</div>
                      </div>
                    </div>
                    <div className="text-[#FF6633] font-bold text-lg">{feature.score}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center Column - Live Coaching */}
          <div className="bg-white/80 dark:bg-[#10141F]/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50 dark:border-[#222840] h-full relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-[#FF6633] to-[#ea580c] rounded-2xl flex items-center justify-center shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-[#EEF2FF]">Live Coaching</h3>
                <p className="text-gray-600 dark:text-[#8892AA]">Interactive practice sessions</p>
              </div>
            </div>

            {/* Interview Simulation */}
            <div className="bg-gray-50 dark:bg-[#161C2B] rounded-2xl p-6 space-y-4 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#FF6633] rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-[#8892AA]">Recording Interview Response...</div>
              </div>

              <div className="space-y-3">
                <div className="bg-white dark:bg-[#10141F] rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-[#EEF2FF] mb-1">Current Question:</div>
                  <div className="text-sm text-gray-600 dark:text-[#8892AA]">"Tell me about your greatest professional achievement."</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-[#10141F] rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-[#FF6633]">2:34</div>
                    <div className="text-xs text-gray-600 dark:text-[#8892AA]">Response Time</div>
                  </div>
                  <div className="bg-white dark:bg-[#10141F] rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-[#FF6633]">A+</div>
                    <div className="text-xs text-gray-600 dark:text-[#8892AA]">Current Grade</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Feedback */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-[#EEF2FF]">Real-time Feedback</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-[#8892AA]">Great eye contact and posture</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-[#8892AA]">Try speaking slightly slower</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-[#8892AA]">Excellent use of specific examples</span>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-[#FF6633] to-[#ea580c] rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-white text-lg">🎯</span>
            </div>
          </div>
        </div>

        {/* Bottom Section - Blue Collar Job Coaching CTA */}
        <div className="mt-16 bg-white/80 dark:bg-[#10141F]/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50 dark:border-[#222840]">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6633]/10 rounded-full border border-[#FF6633]/20 mb-4">
              <div className="w-2 h-2 bg-[#FF6633] rounded-full animate-pulse"></div>
              <span className="text-[#FF6633] text-sm font-medium">Ready to Get Hired?</span>
            </div>
            <h4 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-[#EEF2FF] mb-3">Land Your Next Blue Collar Job</h4>
            <p className="text-lg md:text-xl text-gray-600 dark:text-[#8892AA] max-w-2xl mx-auto">
              Practice interviews for skilled trades and blue collar positions with AI-powered coaching
            </p>
          </div>

          {/* Stats and Testimonial Section */}
          <div className="grid lg:grid-cols-2 gap-8 items-start mb-8">
            
            {/* Left - Success Stats & Job Types */}
            <div className="space-y-6">
              {/* Success Stats */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FF6633] to-[#ea580c] rounded-xl flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-[#EEF2FF]">Proven Success</h5>
                    <p className="text-sm text-gray-600 dark:text-[#8892AA]">Real workers, real results</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-gradient-to-br from-[#FF6633]/10 to-[#ea580c]/10 rounded-xl border border-[#FF6633]/20">
                    <div className="text-xl font-bold text-[#FF6633] mb-1">89%</div>
                    <div className="text-xs text-gray-600 dark:text-[#8892AA]">Job Success</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-[#FF6633]/10 to-[#ea580c]/10 rounded-xl border border-[#FF6633]/20">
                    <div className="text-xl font-bold text-[#FF6633] mb-1">15K+</div>
                    <div className="text-xs text-gray-600 dark:text-[#8892AA]">Workers</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-[#FF6633]/10 to-[#ea580c]/10 rounded-xl border border-[#FF6633]/20">
                    <div className="text-xl font-bold text-[#FF6633] mb-1">4.7★</div>
                    <div className="text-xs text-gray-600 dark:text-[#8892AA]">Rating</div>
                  </div>
                </div>
              </div>

              {/* Job Types */}
              <div>
                <h5 className="font-semibold text-gray-900 dark:text-[#EEF2FF] mb-3">Industries We Cover</h5>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { 
                      icon: (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#FF6633]">
                          <path d="M12 3L13.09 8.26L18 9L13.09 9.74L12 15L10.91 9.74L6 9L10.91 8.26L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19 12L20.09 17.26L25 18L20.09 18.74L19 24L17.91 18.74L13 18L17.91 17.26L19 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5 6L6.09 11.26L11 12L6.09 12.74L5 18L3.91 12.74L-1 12L3.91 11.26L5 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ), 
                      text: "Construction" 
                    },
                    { 
                      icon: (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#FF6633]">
                          <path d="M7 17L17 7H13L17 3L21 7V11L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 17L7 13V17H11L7 21L3 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <rect x="5" y="11" width="14" height="6" rx="2" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="8" cy="14" r="1" fill="currentColor"/>
                          <circle cx="12" cy="14" r="1" fill="currentColor"/>
                          <circle cx="16" cy="14" r="1" fill="currentColor"/>
                        </svg>
                      ), 
                      text: "Transportation" 
                    },
                    { 
                      icon: (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#FF6633]">
                          <path d="M2 20H22V22H2V20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M3 20V4H21V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7 8H17V16H7V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 8V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M14 8V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <circle cx="9" cy="12" r="1" fill="currentColor"/>
                          <circle cx="15" cy="12" r="1" fill="currentColor"/>
                        </svg>
                      ), 
                      text: "Manufacturing" 
                    },
                    { 
                      icon: (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#FF6633]">
                          <path d="M14.7 6.3L16.1 7.7L12.4 11.4L11 10L14.7 6.3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 12L16 4L20 8L12 16L8 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7 21L3 21L3 17L7 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5 19L19 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                          <circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      ), 
                      text: "Maintenance" 
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-[#161C2B] rounded-lg">
                      <div className="flex-shrink-0">{item.icon}</div>
                      <span className="text-sm text-gray-700 dark:text-[#8892AA] font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Testimonial & Benefits */}
            <div className="space-y-6">
              {/* Testimonial */}
              <div className="bg-gradient-to-r from-[#FF6633]/5 to-[#ea580c]/5 rounded-xl p-6 border border-[#FF6633]/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-[#FF6633] text-lg">
                    {"★".repeat(5)}
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-[#EEF2FF]">4.7/5</span>
                </div>
                <div className="text-base text-gray-700 dark:text-[#8892AA] italic mb-3">
                  "Got hired as a foreman after practicing with the AI coach. It helped me speak with confidence about my experience and handle tough questions."
                </div>
                <div className="text-sm text-gray-500 dark:text-[#8892AA]">- Mike R., Construction Foreman</div>
              </div>

              {/* What You'll Learn */}
              <div>
                <h5 className="font-semibold text-gray-900 dark:text-[#EEF2FF] mb-3">What You'll Master</h5>
                <div className="space-y-2">
                  {[
                    "Answer behavioral questions confidently",
                    "Highlight your hands-on experience",
                    "Discuss safety protocols effectively",
                    "Negotiate salary and benefits"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#FF6633] rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 dark:text-[#8892AA]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-gray-50 to-[#FF6633]/5 dark:from-[#161C2B] dark:to-[#FF6633]/10 rounded-2xl p-6 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <button 
                onClick={() => openCandidateApp({ ref: refQuery, lg: lgQuery })}
                className="w-full px-8 py-4 bg-gradient-to-r from-[#FF6633] to-[#ea580c] text-white font-semibold rounded-2xl hover:from-[#ea580c] hover:to-[#FF6633] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Interview Practice Now
              </button>
              
              <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 dark:text-[#8892AA]">
                <div className="flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Practice Common Blue Collar Questions</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Build Confidence Speaking About Your Skills</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Get Instant AI Feedback & Coaching</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}