"use client";

import { openCandidateApp } from "../utils/urlBuilder";

interface BilingualSectionProps {
  refQuery?: string;
  lgQuery?: string;
}

export default function BilingualSection({ refQuery, lgQuery }: BilingualSectionProps) {
  return (
    <section className="relative py-8 md:py-16 lg:py-24 xl:py-32 overflow-hidden bg-gradient-to-br from-white via-purple-50 to-[#5843BE]/20 dark:from-[#06080D] dark:via-[#0B0E18] dark:to-[#5843BE]/10" id="bilingual">
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
              <span className="text-[#5843BE] dark:text-[#A99BF0] font-medium md:font-semibold text-sm md:text-base">Bilingual Voice Platform</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-[#EEF2FF] leading-tight mb-4 md:mb-6">
              Speak Your Language, <br className="hidden sm:block" />
              <span className="text-[#5843BE] bg-gradient-to-r from-[#5843BE] to-[#4a3ba0] bg-clip-text text-transparent">Find Your Job</span>
            </h2>
            <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-[#8892AA] leading-relaxed max-w-3xl mx-auto">
              Navigate the entire platform using voice commands in English or Spanish. 
              Switch languages seamlessly and get personalized job recommendations in your preferred language.
            </p>
          </div>

          {/* Main Content - Linear Design */}
          <div className="grid lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-start">

            {/* Left Column - Voice Control Features */}
            <div className="bg-white/80 dark:bg-[#10141F]/80 backdrop-blur-lg rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl border border-white/50 dark:border-[#222840] h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-[#5843BE] to-[#4a3ba0] rounded-2xl flex items-center justify-center shadow-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-[#EEF2FF]">Voice Commands</h3>
                  <p className="text-gray-600 dark:text-[#8892AA]">Hands-free navigation</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#5843BE]">
                        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 9H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M8 13H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ),
                    title: "Voice Search",
                    desc: '"Find construction jobs near me"',
                    status: "Active"
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#5843BE]">
                        <path d="M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M8 14S9.5 16 12 16S16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ),
                    title: "Language Switch",
                    desc: '"Cambiar a español"',
                    status: "Ready"
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#5843BE]">
                        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    ),
                    title: "Apply by Voice",
                    desc: '"Apply to this job"',
                    status: "Available"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-[#0B0E18] rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-[#161C2B] rounded-lg flex items-center justify-center shadow-sm">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-[#EEF2FF]">{item.title}</h4>
                        <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 px-2 py-1 rounded-full">{item.status}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-[#8892AA] italic">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Language Support */}
            <div className="bg-white/80 dark:bg-[#10141F]/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50 dark:border-[#222840] h-full relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-[#5843BE] to-[#4a3ba0] rounded-2xl flex items-center justify-center shadow-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M5 8L3 14M9 8L7 14M13 8L11 14M17 8L15 14M21 8L19 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M1 4H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M1 20H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-[#EEF2FF]">Language Support</h3>
                  <p className="text-gray-600 dark:text-[#8892AA]">Bilingual experience</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Language Toggle */}
                <div className="bg-gray-50 dark:bg-[#0B0E18] rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-[#EEF2FF] mb-4">Active Languages</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-[#5843BE]/10 to-[#4a3ba0]/10 border border-[#5843BE]/20 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">🇺🇸</div>
                      <div className="text-[#5843BE] dark:text-[#A99BF0] font-semibold">English</div>
                      <div className="text-xs text-gray-600 dark:text-[#8892AA] mt-1">Primary</div>
                    </div>
                    <div className="bg-white dark:bg-[#10141F] border border-gray-200 dark:border-[#222840] rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-[#161C2B] cursor-pointer transition-colors">
                      <div className="text-2xl mb-2">🇪🇸</div>
                      <div className="text-gray-700 font-semibold dark:text-[#EEF2FF]">Español</div>
                      <div className="text-xs text-gray-500 mt-1 dark:text-[#8892AA]">Available</div>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-[#EEF2FF] mb-4">Bilingual Features</h4>
                  <div className="space-y-3">
                    {[
                      "Real-time language switching",
                      "Voice commands in both languages", 
                      "Translated job descriptions",
                      "Bilingual interview practice"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-[#5843BE] rounded-full flex items-center justify-center flex-shrink-0">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-[#8892AA] text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-[#5843BE] to-[#4a3ba0] rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-white text-lg">🌍</span>
              </div>
            </div>
          </div>

          {/* Bottom Section - CTA */}
          <div className="mt-16 bg-white/80 dark:bg-[#10141F]/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50 dark:border-[#222840]">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#5843BE]/10 rounded-full border border-[#5843BE]/20 mb-4">
                <div className="w-2 h-2 bg-[#5843BE] rounded-full animate-pulse"></div>
                <span className="text-[#5843BE] dark:text-[#A99BF0] text-sm font-medium">Try Voice Commands</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-[#EEF2FF] mb-3">Experience Bilingual Voice Control</h4>
              <p className="text-lg md:text-xl text-gray-600 dark:text-[#8892AA] max-w-2xl mx-auto mb-8">
                Start using voice commands in English or Spanish to navigate jobs, practice interviews, and apply to positions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={() => openCandidateApp({ ref: refQuery, lg: lgQuery })}
                  className="px-8 py-4 bg-gradient-to-r from-[#5843BE] to-[#4a3ba0] text-white font-semibold rounded-2xl hover:from-[#4a3ba0] hover:to-[#5843BE] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Try Voice Features
                </button>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-[#8892AA]">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>English & Spanish</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Instant Switching</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    );
}