"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { openCandidateApp, buildCandidateUrl, openCandidateRegister } from "../utils/urlBuilder";
import CustomTranslateButton from "../../common/components/CustomTranslateButton";

interface CandidateNavigationProps {
  page: string;
  refQuery: string | null;
  lgQuery: string;
  setQueryLg: (query: string) => void;
  setShowLanguageModal: (show: boolean) => void;
}

export default function CandidateNavigation({
  page,
  refQuery,
  lgQuery,
  setQueryLg,
  setShowLanguageModal,
}: CandidateNavigationProps) {
  const [activeTab, setActiveTab] = useState("jobs");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();


  const handleLoginClick = () => {
    const loginUrl = buildCandidateUrl({ ref: refQuery || undefined, lg: lgQuery });
    window.open(loginUrl, '_blank', 'noopener,noreferrer');
  };

  const handleGetStartedClick = () => {
    openCandidateRegister({ ref: refQuery || undefined, lg: lgQuery });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16 lg:h-20">
          {/* Logo */}
          <Link href="/candidate" className="flex items-center">
            <img src='https://res.cloudinary.com/drlcisipo/image/upload/v1705704261/Website%20images/logo_gox0fw.png' alt="Moil Logo" className="w-12 h-6 md:w-16 md:h-8" />
          </Link>

          {/* Navigation Tabs - Desktop */}
          <nav className="hidden lg:flex items-center space-x-1 bg-gray-100/80 rounded-full p-1">
            <button
              className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 ${activeTab === "jobs"
                  ? "bg-white text-[#5843BE] shadow-sm"
                  : "text-gray-600 hover:text-[#5843BE] hover:bg-white/50"
                }`}
              onClick={() => setActiveTab("jobs")}
            >
              Looking for jobs
            </button>
            <Link
              href={`/business?lg=${lgQuery}`}
              className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 ${activeTab === "hire"
                  ? "bg-white text-[#5843BE] shadow-sm"
                  : "text-gray-600 hover:text-[#5843BE] hover:bg-white/50"
                }`}
            >
              Want to hire
            </Link>
          </nav>

          {/* Section Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            <a href="#ai-resume" className="px-3 py-2 text-xs text-gray-600 hover:text-[#5843BE] rounded-full hover:bg-gray-100/50 transition-all">
              AI Resume
            </a>
            <a href="#voice-assistant" className="px-3 py-2 text-xs text-gray-600 hover:text-[#5843BE] rounded-full hover:bg-gray-100/50 transition-all">
              Voice Assistant
            </a>
            <a href="#bilingual" className="px-3 py-2 text-xs text-gray-600 hover:text-[#5843BE] rounded-full hover:bg-gray-100/50 transition-all">
              Bilingual
            </a>
          </div>

          {/* Header Actions - Desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            <CustomTranslateButton
              variant="candidate"
              setShowLanguageModal={setShowLanguageModal}
              setLgQuery={setQueryLg}
              lgQuery={lgQuery}
            />
            <Link
              href={`/business?lg=${lgQuery}`}
              className="text-xs text-gray-600 hover:text-[#5843BE] transition-colors px-3 py-2 rounded-full hover:bg-gray-100/50"
            >
              Switch to Business
            </Link>
            <button
              onClick={handleLoginClick}
              className="px-3 py-2 text-xs font-medium text-gray-700 hover:text-[#5843BE] transition-colors"
            >
              Login
            </button>
            <button
              onClick={handleGetStartedClick}
              className="px-4 py-2 bg-gradient-to-r from-[#FF6633] to-[#ea580c] text-white text-xs font-medium rounded-full hover:from-[#ea580c] hover:to-[#FF6633] transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile Translate Button */}
            <CustomTranslateButton
              variant="candidate"
              setShowLanguageModal={setShowLanguageModal}
              setLgQuery={setQueryLg}
              lgQuery={lgQuery}
              iconOnly={false}
              showText={true}
              className="p-2 rounded-lg hover:bg-gray-100/50"
            />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-[#5843BE] transition-colors rounded-lg hover:bg-gray-100/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-lg">
            <div className="px-4 py-4 space-y-1">
              {/* Mobile Navigation Tabs */}
              <div className="space-y-1 mb-4">
                <button
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === "jobs"
                      ? "bg-[#5843BE] text-white"
                      : "text-gray-600 hover:bg-gray-100/50"
                    }`}
                  onClick={() => {
                    setActiveTab("jobs");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  I am looking for jobs
                </button>
                <Link
                  href={`/business?lg=${lgQuery}`}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === "hire"
                      ? "bg-[#5843BE] text-white"
                      : "text-gray-600 hover:bg-gray-100/50"
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  I want to hire workers
                </Link>
              </div>

              {/* Mobile Section Links */}
              <div className="space-y-1 mb-4">
                <a href="#ai-resume" className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-100/50 rounded-lg transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                  AI Resume Builder
                </a>
                <a href="#voice-assistant" className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-100/50 rounded-lg transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                  Voice Assistant
                </a>
                <a href="#bilingual" className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-100/50 rounded-lg transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                  Bilingual Support
                </a>
              </div>

              {/* Mobile Actions */}
              <div className="pt-3 border-t border-gray-200/50 space-y-1">
                <CustomTranslateButton
                  variant="candidate"
                  setShowLanguageModal={setShowLanguageModal}
                  setLgQuery={setQueryLg}
                  lgQuery={lgQuery}
                  showMobileText={true}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-600 hover:bg-gray-100/50 rounded-lg transition-all"
                />
                <Link
                  href={`/business?lg=${lgQuery}`}
                  className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-100/50 rounded-lg transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Switch to Business
                </Link>
                <button
                  onClick={() => {
                    handleLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100/50 rounded-lg transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    handleGetStartedClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full mt-4 px-6 py-3 bg-gradient-to-r from-[#FF6633] to-[#ea580c] text-white text-sm font-medium rounded-lg hover:from-[#ea580c] hover:to-[#FF6633] transition-all duration-300 text-center"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
