"use client";

import { useState } from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { buildCandidateUrl, openCandidateRegister } from "../utils/urlBuilder";
import CustomTranslateButton from "../../common/components/CustomTranslateButton";

interface CandidateNavigationProps {
  page: string;
  refQuery: string | null;
  lgQuery: string;
  setQueryLg: (query: string) => void;
  setShowLanguageModal: (show: boolean) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export default function CandidateNavigation({
  refQuery,
  lgQuery,
  setQueryLg,
  setShowLanguageModal,
  theme = 'light',
  onToggleTheme,
}: CandidateNavigationProps) {
  const [activeTab, setActiveTab] = useState("jobs");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const handleLoginClick = () => {
    const loginUrl = buildCandidateUrl({ ref: refQuery || undefined, lg: lgQuery });
    window.open(loginUrl, '_blank', 'noopener,noreferrer');
  };

  const handleGetStartedClick = () => {
    openCandidateRegister({ ref: refQuery || undefined, lg: lgQuery });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#06080D]/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-[#222840]/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16 lg:h-20">
          {/* Logo */}
          <Link href="/candidate" className="flex items-center">
            <img src='https://res.cloudinary.com/drlcisipo/image/upload/v1705704261/Website%20images/logo_gox0fw.png' alt="Moil Logo" className="w-12 h-6 md:w-16 md:h-8 dark:brightness-0 dark:invert" />
          </Link>

          {/* Navigation Tabs - Desktop */}
          <nav className="hidden lg:flex items-center bg-gray-100 dark:bg-[#10141F] rounded-full p-1.5 border border-gray-200 dark:border-[#222840] shadow-sm">
            <button
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === "jobs"
                  ? "bg-white dark:bg-[#161C2B] text-[#5843BE] dark:text-[#A99BF0] shadow-md ring-1 ring-[#5843BE]/20"
                  : "text-gray-500 dark:text-[#8892AA] hover:text-[#5843BE] dark:hover:text-[#A99BF0] hover:bg-white/70 dark:hover:bg-[#161C2B]/70"
                }`}
              onClick={() => setActiveTab("jobs")}
            >
              👤 For Job Seekers
            </button>
            <Link
              href={`/business?lg=${lgQuery}`}
              className={`for-businesses-tab px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === "hire"
                  ? "bg-white text-[#5843BE] shadow-md ring-1 ring-[#5843BE]/20"
                  : "text-[#FF6633] bg-orange-50 border border-[#FF6633]/40 hover:bg-orange-100 hover:border-[#FF6633]/70 hover:scale-105"
                }`}
            >
              🏢 For Businesses
            </Link>
          </nav>

          {/* Section Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            <a href="#ai-resume" className="px-3 py-2 text-xs text-gray-600 dark:text-[#8892AA] hover:text-[#5843BE] dark:hover:text-[#A99BF0] rounded-full hover:bg-gray-100/50 dark:hover:bg-[#10141F]/60 transition-all">
              AI Resume
            </a>
            <a href="#voice-assistant" className="px-3 py-2 text-xs text-gray-600 dark:text-[#8892AA] hover:text-[#5843BE] dark:hover:text-[#A99BF0] rounded-full hover:bg-gray-100/50 dark:hover:bg-[#10141F]/60 transition-all">
              Voice Assistant
            </a>
            <a target="_blank" href="https://blog.moilapp.com" className="px-3 py-2 text-xs text-gray-600 dark:text-[#8892AA] hover:text-[#5843BE] dark:hover:text-[#A99BF0] rounded-full hover:bg-gray-100/50 dark:hover:bg-[#10141F]/60 transition-all">
              Blog
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
              className="text-xs text-gray-600 dark:text-[#8892AA] hover:text-[#5843BE] dark:hover:text-[#A99BF0] transition-colors px-3 py-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-[#10141F]/60"
            >
              Switch to Business
            </Link>
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                aria-label="Toggle theme"
                className="p-2 text-gray-600 dark:text-[#8892AA] hover:text-[#5843BE] dark:hover:text-[#A99BF0] rounded-full hover:bg-gray-100/50 dark:hover:bg-[#10141F]/60 transition-all"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
            <button
              onClick={handleLoginClick}
              className="px-3 py-2 text-xs font-medium text-gray-700 dark:text-[#EEF2FF] hover:text-[#5843BE] dark:hover:text-[#A99BF0] transition-colors"
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

            {/* Mobile Theme Toggle */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                aria-label="Toggle theme"
                className="p-2 text-gray-600 dark:text-[#8892AA] hover:text-[#5843BE] dark:hover:text-[#A99BF0] transition-colors rounded-lg hover:bg-gray-100/50 dark:hover:bg-[#10141F]/60"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-[#8892AA] hover:text-[#5843BE] dark:hover:text-[#A99BF0] transition-colors rounded-lg hover:bg-gray-100/50 dark:hover:bg-[#10141F]/60"
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
          <div className="lg:hidden border-t border-gray-200/50 dark:border-[#222840]/60 bg-white/95 dark:bg-[#06080D]/95 backdrop-blur-lg">
            <div className="px-4 py-4 space-y-1">
              {/* Mobile Navigation Tabs */}
              <div className="space-y-2 mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-[#4A5368] px-1 mb-2">Switch Page</p>
                <button
                  className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === "jobs"
                      ? "bg-[#5843BE] text-white shadow-md"
                      : "text-gray-600 dark:text-[#8892AA] bg-gray-50 dark:bg-[#10141F] hover:bg-gray-100 dark:hover:bg-[#161C2B] border border-gray-200 dark:border-[#222840]"
                    }`}
                  onClick={() => {
                    setActiveTab("jobs");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span>👤</span> For Job Seekers
                </button>
                <Link
                  href={`/business?lg=${lgQuery}`}
                  className={`flex items-center gap-2 w-full text-left px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === "hire"
                      ? "bg-[#5843BE] text-white shadow-md"
                      : "text-gray-600 dark:text-[#8892AA] bg-gray-50 dark:bg-[#10141F] hover:bg-gray-100 dark:hover:bg-[#161C2B] border border-gray-200 dark:border-[#222840]"
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>🏢</span> For Businesses
                </Link>
              </div>


              {/* Mobile Actions */}
              <div className="pt-3 border-t border-gray-200/50 dark:border-[#222840]/60 space-y-1">
                <CustomTranslateButton
                  variant="candidate"
                  setShowLanguageModal={setShowLanguageModal}
                  setLgQuery={setQueryLg}
                  lgQuery={lgQuery}
                  showMobileText={true}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-600 dark:text-[#8892AA] hover:bg-gray-100/50 dark:hover:bg-[#10141F]/60 rounded-lg transition-all"
                />
                <Link
                  href={`/business?lg=${lgQuery}`}
                  className="block px-4 py-3 text-sm text-gray-600 dark:text-[#8892AA] hover:bg-gray-100/50 dark:hover:bg-[#10141F]/60 rounded-lg transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Switch to Business
                </Link>
                <button
                  onClick={() => {
                    handleLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-[#EEF2FF] hover:bg-gray-100/50 dark:hover:bg-[#10141F]/60 rounded-lg transition-all"
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
