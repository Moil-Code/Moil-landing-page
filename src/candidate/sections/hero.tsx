"use client";

import React, { useEffect, useState } from "react";
import SearchComponent from "../components/search";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { openCandidateApp } from "../utils/urlBuilder";

interface CandidateHeroProps {
  onGetStarted?: () => void;
  refQuery?: string;
  lgQuery?: string;
}

export default function CandidateHero({ onGetStarted, refQuery, lgQuery }: CandidateHeroProps) {
  const [queryString, setQueryString] = useState("");
  
  // Automatically update queryString when refQuery or lgQuery change
  useEffect(() => {
    if (refQuery && lgQuery) {
      setQueryString(`?ref=${refQuery}&lg=${lgQuery}`);
    } else if (refQuery && !lgQuery) {
      setQueryString(`?ref=${refQuery}`);
    } else if (!refQuery && lgQuery) {
      setQueryString(`?lg=${lgQuery}`);
    } else {
      setQueryString(""); // No query parameters
    }
  }, [refQuery, lgQuery]); // Runs when refQuery or lgQuery changes

  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Set initial dimensions
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Floating job categories component
  const FloatingJob = ({ text, className }: { text: string; className: string }) => (
    <div className={`absolute px-3 py-1.5 md:px-4 md:py-2 bg-white/10 rounded-full text-xs md:text-sm text-white/60 backdrop-blur-sm border border-white/15 animate-pulse ${className}`}>
      {text}
    </div>
  );

  return (
    <div className="bg-cover bg-center bg-no-repeat min-h-screen relative overflow-hidden flex justify-center items-center pt-16 pb-8 md:pt-20 lg:pt-32 md:pb-12 lg:pb-24"
         style={{ backgroundImage: `url('/BackgroundWorkerDesktop.png')` }}>
      
      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'grid-float 20s ease-in-out infinite'
        }}
      />

      {/* Floating Job Categories - Blue Collar Jobs Only */}
      <FloatingJob text='HVAC Technician' className='top-[25%] left-[8%] hidden lg:block' />
      <FloatingJob text='Construction Worker' className='top-[20%] right-[12%] hidden lg:block' />
      <FloatingJob text='Electrician' className='bottom-[30%] left-[10%] hidden lg:block' />
      <FloatingJob text='Plumber' className='bottom-[25%] right-[15%] hidden lg:block' />
      <FloatingJob text='Warehouse Worker' className='top-[50%] left-[5%] hidden xl:block' />
      <FloatingJob text='Machine Operator' className='top-[45%] right-[8%] hidden xl:block' />

      <div className="flex w-full flex-col items-center gap-y-4 md:gap-y-6 lg:gap-y-8 justify-center max-w-[90vw] md:max-w-[85vw] relative z-10 px-4">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-white/15 rounded-full border border-white/20 backdrop-blur-sm text-xs md:text-sm font-medium text-white/90">
          <div className="text-[#FF6633]">
            <svg width="14" height="14" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <span className="hidden sm:inline">Join 50,000+ Job Seekers Finding Success</span>
          <span className="sm:hidden">50,000+ Success Stories</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-[1.2] text-center text-white">
          Your AI Career Assistant
        </h1>
        
        {/* Subtitle */}
        <p className="text-sm md:text-base font-medium md:font-semibold leading-relaxed text-center text-white max-w-2xl mx-auto">
          Beyond job matching — master interviews with voice coaching, build a resume in 5 minutes, and find your path with AI. Free, in English &amp; Spanish.
        </p>

        {/* Search Component */}
        <SearchComponent lgQuery={lgQuery || "en"} />

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center max-w-lg mx-auto">
          <button
            onClick={() => openCandidateApp({ ref: refQuery, lg: lgQuery })}
            className="w-full sm:w-auto px-6 py-2.5 md:px-8 md:py-3 bg-gradient-to-r from-[#FF6633] to-[#ea580c] text-white font-medium md:font-semibold text-xs md:text-sm rounded-full hover:from-[#ea580c] hover:to-[#FF6633] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            CREATE PERSONAL PROFILE
          </button>
          <button 
            onClick={() => openCandidateApp({ ref: refQuery, lg: lgQuery })}
            className="w-full sm:w-auto px-6 py-2.5 md:px-8 md:py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-medium md:font-semibold text-xs md:text-sm rounded-full hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105"
          >
            LOGIN TO YOUR PROFILE
          </button>
        </div>

        {/* AI Features - Mobile: Vertical Grid, Desktop: Horizontal */}
        <div className="w-full max-w-3xl mx-auto">
          {/* Mobile Layout: 2-column grid */}
          <div className="grid grid-cols-1 gap-3 sm:hidden">
            <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF6633] to-[#ea580c] rounded-full flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" className="text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9M15 10.5V19L13.5 17.5V10.5M10.5 10.5V17.5L9 19V10.5M9 9V7.5L3 7V9H9Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-white text-sm font-medium block">Voice Interview Coach</span>
                <span className="text-white/70 text-xs">Practice with AI feedback</span>
              </div>
            </div>
            
            <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF6633] to-[#ea580c] rounded-full flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" className="text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9,2A7,7 0 0,1 16,9C16,10.57 15.5,12 14.61,13.19L15.41,14H16L22,20L20,22L14,16V15.41L13.19,14.61C12,15.5 10.57,16 9,16A7,7 0 0,1 2,9A7,7 0 0,1 9,2M9,4A5,5 0 0,0 4,9A5,5 0 0,0 9,14A5,5 0 0,0 14,9A5,5 0 0,0 9,4Z" fill="currentColor"/>
                  <circle cx="9" cy="9" r="2" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-white text-sm font-medium block">Smart Job Matching</span>
                <span className="text-white/70 text-xs">AI-powered recommendations</span>
              </div>
            </div>
            
            <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF6633] to-[#ea580c] rounded-full flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" className="text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-white text-sm font-medium block">Voice & Bilingual</span>
                <span className="text-white/70 text-xs">Multilingual support</span>
              </div>
            </div>
          </div>

          {/* Desktop Layout: Horizontal badges */}
          <div className="hidden sm:flex flex-wrap justify-center gap-2 md:gap-3 lg:gap-4">
            <div className="group flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 md:px-4 md:py-2 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-[#FF6633] to-[#ea580c] rounded-full flex items-center justify-center">
                <svg width="12" height="12" className="md:w-4 md:h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9M15 10.5V19L13.5 17.5V10.5M10.5 10.5V17.5L9 19V10.5M9 9V7.5L3 7V9H9Z" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-white text-xs md:text-sm font-medium">Voice Interview Coach</span>
            </div>
            
            <div className="group flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 md:px-4 md:py-2 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-[#FF6633] to-[#ea580c] rounded-full flex items-center justify-center">
                <svg width="12" height="12" className="md:w-4 md:h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9,2A7,7 0 0,1 16,9C16,10.57 15.5,12 14.61,13.19L15.41,14H16L22,20L20,22L14,16V15.41L13.19,14.61C12,15.5 10.57,16 9,16A7,7 0 0,1 2,9A7,7 0 0,1 9,2M9,4A5,5 0 0,0 4,9A5,5 0 0,0 9,14A5,5 0 0,0 14,9A5,5 0 0,0 9,4Z" fill="currentColor"/>
                  <circle cx="9" cy="9" r="2" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-white text-xs md:text-sm font-medium">Smart Job Matching</span>
            </div>
            
            <div className="group flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 md:px-4 md:py-2 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-[#FF6633] to-[#ea580c] rounded-full flex items-center justify-center">
                <svg width="12" height="12" className="md:w-4 md:h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-white text-xs md:text-sm font-medium">Voice & Bilingual</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
