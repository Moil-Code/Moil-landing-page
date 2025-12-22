import { useState, useEffect } from "react";
import Link from "next/link";

// Local Imports
import CustomTranslateButton from "../../common/components/CustomTranslateButton";
import { businessBaseUrl, workerBaseUrl } from "../../common/constants/baseUrl";

interface BusinessNavigationProps {
  page: string;
  refQuery: any;
  lgQuery: any;
  setQueryLg: (lang: string) => void;
  setShowLanguageModal: (show: boolean) => void;
}

export default function BusinessNavigation({ page, refQuery, lgQuery, setQueryLg, setShowLanguageModal }: BusinessNavigationProps) {

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("hire");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const position = {
        x: window.scrollX,
        y: window.scrollY
      };
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  let [ queryString, setQueryString ] = useState("");
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




  const handleToggle = () => {
    setIsOpen(!isOpen);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    if (isOpen) {
      setIsOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLoginClick = () => {
    window.open(`${businessBaseUrl}/login${queryString}`, '_blank', 'noopener,noreferrer');
  };

  const handleGetStartedClick = () => {
    window.open(`${businessBaseUrl}/register${queryString}`, '_blank', 'noopener,noreferrer');
  };

  const deleteRefFromLocalStorage = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('ref');
      return true;
    } else {
      console.error('Local storage is not available in this environment');
      return false;
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16 lg:h-20">
          {/* Logo */}
          <Link href="/business" className="flex items-center">
            <img src='https://res.cloudinary.com/drlcisipo/image/upload/v1705704261/Website%20images/logo_gox0fw.png' alt="Moil Logo" className="w-12 h-6 md:w-16 md:h-8" />
          </Link>

          {/* Navigation Tabs - Desktop */}
          <nav className="hidden lg:flex items-center space-x-1 bg-gray-100/80 rounded-full p-1">
            <Link
              href={`/candidate${queryString}`}
              className="px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 text-gray-600 hover:text-[#5843BE] hover:bg-white/50"
            >
              Looking for jobs
            </Link>
            <button
              className="px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 bg-white text-[#5843BE] shadow-sm"
            >
              Want to hire
            </button>
          </nav>

          {/* Section Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            {page === "pricing" ? (
              <>
                <Link href={`/business${queryString}#services`} className="px-3 py-2 text-xs text-gray-600 hover:text-[#5843BE] rounded-full hover:bg-gray-100/50 transition-all">
                  Services
                </Link>
                <Link href={`/business${queryString}#features`} className="px-3 py-2 text-xs text-gray-600 hover:text-[#5843BE] rounded-full hover:bg-gray-100/50 transition-all">
                  Features
                </Link>
              </>
            ) : (
              <>
                <button onClick={() => handleScrollTo('services')} className="px-3 py-2 text-xs text-gray-600 hover:text-[#5843BE] rounded-full hover:bg-gray-100/50 transition-all">
                  Services
                </button>
                <button onClick={() => handleScrollTo('features')} className="px-3 py-2 text-xs text-gray-600 hover:text-[#5843BE] rounded-full hover:bg-gray-100/50 transition-all">
                  Features
                </button>
              </>
            )}
            <Link target="_blank" href="https://blog.moilapp.com" className="px-3 py-2 text-xs text-gray-600 hover:text-[#5843BE] rounded-full hover:bg-gray-100/50 transition-all">
              Blog
            </Link>
          </div>
        
          {/* Header Actions - Desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            <CustomTranslateButton 
              variant="business"
              setShowLanguageModal={setShowLanguageModal}
              setLgQuery={setQueryLg}
              lgQuery={lgQuery}
            />
            <Link 
              href={`/candidate${queryString}`}
              className="text-xs text-gray-600 hover:text-[#5843BE] transition-colors px-3 py-2 rounded-full hover:bg-gray-100/50"
            >
              Switch to Candidate
            </Link>
            <button
              onClick={() => handleLoginClick()}
              className="px-3 py-2 text-xs font-medium text-gray-700 hover:text-[#5843BE] transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => handleGetStartedClick()}
              className="px-4 py-2 bg-gradient-to-r from-[#5843BD] to-[#7c3aed] text-white text-xs font-medium rounded-full hover:from-[#7c3aed] hover:to-[#5843BD] transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile Translate Button */}
            <CustomTranslateButton 
              variant="business"
              setShowLanguageModal={setShowLanguageModal}
              setLgQuery={setQueryLg}
              lgQuery={lgQuery}
              iconOnly={false}
              showText={true}
              className="p-2 rounded-lg hover:bg-gray-100/50"
            />
            
            {/* Mobile Menu Button */}
            <button 
              onClick={handleToggle}
              className="p-2 text-gray-600 hover:text-[#5843BE] transition-colors rounded-lg hover:bg-gray-100/50" 
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-lg">
            <div className="px-4 py-4 space-y-1">
              {/* Mobile Navigation Tabs */}
              <div className="space-y-1 mb-4">
                <Link
                  href={`/candidate${queryString}`}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === "jobs"
                      ? "bg-[#5843BE] text-white"
                      : "text-gray-600 hover:bg-gray-100/50"
                    }`}
                  onClick={() => {
                    setActiveTab("jobs");
                    setIsMobileMenuOpen(false);
                    setIsOpen(false);
                  }}
                >
                  I am looking for jobs
                </Link>
                <button
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === "hire"
                      ? "bg-[#5843BE] text-white"
                      : "text-gray-600 hover:bg-gray-100/50"
                    }`}
                  onClick={() => {
                    setActiveTab("hire");
                    setIsMobileMenuOpen(false);
                    setIsOpen(false);
                  }}
                >
                  I want to hire workers
                </button>
              </div>


              {/* Mobile Actions */}
              <div className="pt-3 border-t border-gray-200/50 space-y-1">
                <CustomTranslateButton 
                  variant="business"
                  setShowLanguageModal={setShowLanguageModal}
                  setLgQuery={setQueryLg}
                  lgQuery={lgQuery}
                  showMobileText={true}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-600 hover:bg-gray-100/50 rounded-lg transition-all"
                />
                <Link 
                  href={`/candidate${queryString}`}
                  className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-100/50 rounded-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Switch to Candidate
                </Link>
                <button
                  onClick={() => {
                    handleLoginClick();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100/50 rounded-lg transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    handleGetStartedClick();
                    setIsOpen(false);
                  }}
                  className="block w-full mt-4 px-6 py-3 bg-gradient-to-r from-[#5843BD] to-[#7c3aed] text-white text-sm font-medium rounded-lg hover:from-[#7c3aed] hover:to-[#5843BD] transition-all duration-300 text-center"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}