"use client";

import { openBusinessRegister } from "../utils/urlBuilder";

interface FinalCTAProps {
  refQuery?: string;
  lgQuery?: string;
}

export default function FinalCTA({ refQuery, lgQuery }: FinalCTAProps) {
  const handleStartTrial = () => {
    openBusinessRegister({ ref: refQuery, lg: lgQuery });
  };

  const handleSeeDemo = () => {
    // Link to video demo
    window.open('https://www.youtube.com/watch?v=demo', '_blank');
  };

  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-white via-orange-50 to-[#FF6633]/20">
      {/* Sophisticated Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#5843BD]/8 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#FF6633]/15 via-transparent to-transparent"></div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#5843BD08_1px,transparent_1px),linear-gradient(to_bottom,#FF663308_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      
      {/* Animated Orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-[#5843BD]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#FF6633]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#FF6633]/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="container relative z-10 px-4">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 md:px-6 bg-white/70 backdrop-blur-xl border border-[#5843BD]/20 rounded-full text-xs md:text-sm font-medium mb-6 md:mb-8 text-[#5843BD] shadow-lg">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
            </svg>
            Ready to Meet Your AI Co-Founder?
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-[#5843BD] via-purple-600 to-[#5843BD] bg-clip-text text-transparent">Start Building Your </span>
            <span className="bg-gradient-to-r from-[#FF6633] via-orange-500 to-[#FF6633] bg-clip-text text-transparent">Business Today</span>
          </h2>
          
          <p className="text-sm md:text-base lg:text-xl text-gray-700 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">
            Join 500+ Texas businesses that have their AI Business Coach guiding them from market research to
            marketing to hiring. Everything you need to start, grow, and scale—all in one intelligent platform.
          </p>
        </div>

        {/* Three Value Props */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 max-w-6xl mx-auto">
          <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/60 hover:border-[#5843BD]/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#5843BD]/0 via-[#5843BD]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-[#5843BD] rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-[#5843BD] mb-2 md:mb-3">Complete Business Support</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">Market research, business plans, marketing content, image creation, documents, and hiring—your AI Coach handles it all through natural conversation.</p>
            </div>
            
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#5843BD]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/60 hover:border-[#FF6633]/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6633]/0 via-[#FF6633]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-[#FF6633] to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-[#FF6633] mb-2 md:mb-3">Affordable Intelligence</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">Get a full business consultant, marketing agency, designer, and recruiter for $15/month. No setup fees, cancel anytime, 30-day money-back guarantee.</p>
            </div>
            
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#FF6633]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/60 hover:border-green-500/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-green-600 mb-2 md:mb-3">Proven Results</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">500+ businesses trust Moil • 5,000+ jobs posted • 94% interview success rate • 5x faster hiring • 91% employee retention at 90 days</p>
            </div>
            
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          </div>
        </div>

        {/* Main CTA Section */}
        <div className="relative max-w-5xl mx-auto mb-12 md:mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-[#5843BD]/10 via-transparent to-[#FF6633]/10 rounded-3xl blur-3xl"></div>
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#5843BD]/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#FF6633]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-3xl rounded-2xl md:rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#5843BD]/20 via-[#FF6633]/20 to-[#5843BD]/20 opacity-50 animate-pulse rounded-3xl"></div>
            
            <div className="relative z-10 p-6 md:p-10 lg:p-12 text-center">
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-8 md:mb-12">
                <button 
                  onClick={handleStartTrial}
                  className="group relative bg-[#5843BD] text-white font-bold py-4 px-8 md:py-5 md:px-12 rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <span className="relative flex items-center justify-center gap-2 md:gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                    </svg>
                    Get Started Today
                  </span>
                </button>

                <button 
                  onClick={handleSeeDemo}
                  className="group relative bg-white/80 backdrop-blur-sm border-2 border-[#FF6633]/30 hover:border-[#FF6633] text-[#FF6633] font-bold py-4 px-8 md:py-5 md:px-12 rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <span className="relative flex items-center justify-center gap-2 md:gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                    See Your AI Coach in Action
                  </span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 pt-6 md:pt-8 border-t border-gray-200/50">
                <div className="flex items-center gap-2 text-gray-600 text-xs md:text-sm">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>No Setup Fees</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-xs md:text-sm">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Cancel Anytime</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-xs md:text-sm">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>30-Day Money-Back Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-xs md:text-sm">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-xs md:text-sm">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Bilingual Support (EN/ES)</span>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-8 right-8 w-16 h-16 bg-gradient-to-br from-[#5843BD]/10 to-transparent rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-8 left-8 w-20 h-20 bg-gradient-to-br from-[#FF6633]/10 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Live Stats Dashboard Visual */}
        {/* <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/60 shadow-xl">
            <h4 className="text-center text-lg md:text-xl font-bold text-gray-900 mb-6">Platform Status</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 md:p-4 bg-green-50 rounded-xl">
                <div className="text-green-500 text-lg md:text-xl mb-1">✅</div>
                <div className="text-xs md:text-sm font-medium text-gray-700">Market Research</div>
                <div className="text-xs text-green-600">Active</div>
              </div>
              <div className="text-center p-3 md:p-4 bg-purple-50 rounded-xl">
                <div className="text-purple-500 text-lg md:text-xl mb-1">🧠</div>
                <div className="text-xs md:text-sm font-medium text-gray-700">AI Coach</div>
                <div className="text-xs text-purple-600">Online</div>
              </div>
              <div className="text-center p-3 md:p-4 bg-orange-50 rounded-xl">
                <div className="text-orange-500 text-lg md:text-xl mb-1">🎨</div>
                <div className="text-xs md:text-sm font-medium text-gray-700">Marketing Tools</div>
                <div className="text-xs text-orange-600">Ready</div>
              </div>
              <div className="text-center p-3 md:p-4 bg-blue-50 rounded-xl">
                <div className="text-blue-500 text-lg md:text-xl mb-1">📈</div>
                <div className="text-xs md:text-sm font-medium text-gray-700">Smart Hiring</div>
                <div className="text-xs text-blue-600">Live</div>
              </div>
              <div className="text-center p-3 md:p-4 bg-gray-50 rounded-xl col-span-2 md:col-span-1">
                <div className="text-gray-500 text-lg md:text-xl mb-1">📄</div>
                <div className="text-xs md:text-sm font-medium text-gray-700">Document Creation</div>
                <div className="text-xs text-gray-600">Available</div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
