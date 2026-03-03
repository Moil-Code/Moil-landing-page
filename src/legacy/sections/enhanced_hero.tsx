"use client";

import Image from "next/image";
import { openBusinessRegister } from "../utils/urlBuilder";
import { 
  Bot, 
  Search, 
  Palette, 
  Users, 
  FileText, 
  Files 
} from "lucide-react";

interface EnhancedHeroProps {
  onGetStarted?: () => void;
  refQuery?: string;
  lgQuery?: string;
}

export default function EnhancedHero({ onGetStarted, refQuery, lgQuery }: EnhancedHeroProps) {
  const handleGetStarted = () => {
    openBusinessRegister({ ref: refQuery, lg: lgQuery });
  };

  const handleSeeDemo = () => {
    // Scroll to the interactive demo section (services section)
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: <Bot className="w-5 h-5" />,
      title: "AI Business Coach",
      subtitle: "Your Co-Founder",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: <Search className="w-5 h-5" />,
      title: "Market Research",
      subtitle: "21 Questions to Insights",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Marketing Content",
      subtitle: "Images, Posts, Documents",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Smart Hiring",
      subtitle: "Automated Matching",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Business Plans",
      subtitle: "Investor-Ready",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: <Files className="w-5 h-5" />,
      title: "Document Creation",
      subtitle: "Contracts, Proposals, More",
      color: "from-cyan-500 to-blue-600"
    }
  ];

  return (
    <section className="hero-redesigned">
      {/* Animated Illustration Background */}
      <div className="animated-bg"></div>
      <div className="dots-pattern"></div>
      
      {/* Geometric Shapes */}
      <div className="animated-shape shape-1"></div>
      <div className="animated-shape shape-2"></div>
      <div className="animated-shape shape-3"></div>
      <div className="animated-shape shape-4"></div>
      
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 md:gap-x-12 lg:gap-x-16 gap-y-8 md:gap-y-12 lg:gap-y-2 items-center relative z-10 min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh]">
          <div className="text-center lg:text-left px-4 sm:px-0">
          <div className="inline-block px-3 py-2 md:px-4 bg-white/10 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6 backdrop-blur-sm border border-white/20">
              🚀 Trusted by 500+ Businesses in Texas
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium font-black mb-4 md:mb-6 lg:mb-8 leading-tight">
              <span className="text-white">
              AI Business Coach for Small Business Owners
              </span>
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 md:mb-8 lg:mb-10 max-w-2xl leading-relaxed">
             Meet your intelligent co-founder that guides you from market research to hiring to growth.
Get business plans, marketing content, and smart hiring—all powered by AI that understands your
business.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mb-8 md:mb-10 lg:mb-12">
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r font-medium from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 md:py-4 md:px-6 lg:px-8 rounded-full text-sm md:text-base lg:text-md transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-orange-500/25"
              >
                Get Started Today
              </button>
              <button 
                onClick={handleSeeDemo}
                className="border-2 font-medium border-white/30 text-white hover:bg-white/10 font-semibold py-3 px-6 md:py-4 md:px-6 lg:px-8 rounded-full text-sm md:text-base lg:text-md transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                See Your AI Coach in Action
              </button>
            </div>

            {/* Key Features */}
          </div>
          
          <div className="relative px-4 sm:px-0">
            {/* Main Hero Image with Floating Cards at Corners */}
            <div className="relative mb-8 md:mb-12 lg:mb-16">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-orange-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl md:rounded-3xl p-2 md:p-3 lg:p-5 border border-white/20">
                <Image
                  src="/hero.png"
                  alt="Moil Business Growth Platform"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-xl md:rounded-2xl shadow-2xl"
                  priority
                />
              </div>
              
              {/* Floating Feature Cards positioned at corners of hero image */}
              <div className="absolute -top-12 -left-6 glass-card p-4 animate-float hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Market Research</div>
                    <div className="text-white/60 text-xs">AI-Powered</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-12 -right-6 glass-card p-4 animate-float hidden lg:block" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Smart Hiring</div>
                    <div className="text-white/60 text-xs">Automated</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-12 -left-6 glass-card p-4 animate-float hidden lg:block" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Growth Analytics</div>
                    <div className="text-white/60 text-xs">Real-time</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-12 -right-6 glass-card p-4 animate-float hidden lg:block" style={{ animationDelay: '3s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Business Planning</div>
                    <div className="text-white/60 text-xs">Strategic</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Badges - Bottom Grid */}
        <div className="mt-8 lg:mt-12 w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 w-full">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 transition-all duration-300 group text-center lg:text-left flex flex-col items-center lg:items-start h-full"
              >
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-white font-semibold text-xs md:text-sm mb-0.5 md:mb-1 leading-tight">{feature.title}</h3>
                <p className="text-white/50 text-[10px] md:text-xs leading-tight">{feature.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}