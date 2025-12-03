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
    }
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
    <header className={`w-full ${scrollPosition.y >= 100 && isOpen ? 'fixed z-[1000]' : scrollPosition.y >= 100 ? `fixed z-[1000]` : scrollPosition.y < 100 && isOpen ? 'absolute z-[1000]' : ''} top-0 bg-white/95 backdrop-blur-lg border-b border-gray-200/20 shadow-sm flex justify-center`}>
      <nav className={`max-w-[1200px] w-full py-3 md:py-4 px-4 md:px-6 lg:px-8 flex justify-between items-center`}>
        <Link href="/business" className="flex items-center">
          <img src='https://res.cloudinary.com/drlcisipo/image/upload/v1705704261/Website%20images/logo_gox0fw.png' alt="Moil Logo" className="w-12 h-6 md:w-16 md:h-8" />
        </Link>

        <div className="hidden lg:flex items-center space-x-1 bg-gray-100/80 rounded-full p-1">
          <CustomTranslateButton 
            variant="business"
            className="bg-transparent"
            textClassName="font-medium text-[#1A1433] text-xs"
            setShowLanguageModal={setShowLanguageModal}
            setLgQuery={setQueryLg}
            lgQuery={lgQuery}
          />

          {page === "pricing" ? (
            <>
              <Link href={`/business${queryString}#services`} className="px-3 py-2 text-[#1A1433] text-xs rounded-full hover:bg-white/50 transition-all">
                Services
              </Link>
              <Link href={`/business${queryString}#features`} className="px-3 py-2 text-[#1A1433] text-xs rounded-full hover:bg-white/50 transition-all">
                Features
              </Link>
              <Link href={`/business${queryString}#testimonials`} className="px-3 py-2 text-[#1A1433] text-xs rounded-full hover:bg-white/50 transition-all">
                Testimonials
              </Link>
            </>
          ) : (
            <>
              <button onClick={() => handleScrollTo('services')} className="px-3 py-2 text-[#1A1433] text-xs rounded-full hover:bg-white/50 transition-all">
                Services
              </button>
              <button onClick={() => handleScrollTo('features')} className="px-3 py-2 text-[#1A1433] text-xs rounded-full hover:bg-white/50 transition-all">
                Features
              </button>
              <button onClick={() => handleScrollTo('testimonials')} className="px-3 py-2 text-[#1A1433] text-xs rounded-full hover:bg-white/50 transition-all">
                Testimonials
              </button>
            </>
          )}


        </div>
        
        <div className="hidden lg:flex items-center space-x-3">
          <Link 
            href={`/candidate${queryString}`}
            className="px-3 py-2 text-[#1A1433] text-xs hover:text-[#5843BE] transition-colors"
          >
            Switch to Candidate
          </Link>

          <Link className="px-3 py-2 text-[#1A1433] text-xs hover:text-[#5843BE] transition-colors" href={`/business/pricing${queryString}`} >
            Pricing
          </Link>

          <Link className="px-3 py-2 text-[#1A1433] text-xs hover:text-[#5843BE] transition-colors" href={`${businessBaseUrl}/login${queryString}`} >
            Login
          </Link>
          <Link className="bg-gradient-to-r from-[#5843BD] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#5843BD] px-4 py-2 text-white text-xs rounded-full transition-all duration-300 hover:scale-105 shadow-md" href={`${businessBaseUrl}/register${queryString}`} >
            Get started
          </Link>
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
            className="p-2 text-gray-600 hover:text-[#5843BE] transition-colors rounded-lg hover:bg-gray-100/50" 
            onClick={handleToggle} 
            aria-label="Toggle Navigation"
          >
            {!isOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </nav>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-lg">
          <div className="max-w-[1200px] mx-auto px-4 py-6 space-y-1">

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
            
            <div className="pt-3 border-t border-gray-200/50 space-y-1">
              {/* Mobile Translate Button */}
              <CustomTranslateButton 
                variant="business"
                className="w-full px-4 py-3 text-sm text-[#1A1433] hover:bg-gray-100/50 rounded-lg transition-all justify-start"
                textClassName="font-medium text-[#1A1433] text-sm"
                setShowLanguageModal={setShowLanguageModal}
                setLgQuery={setQueryLg}
                lgQuery={lgQuery}
                showText={true}
                showIcon={true}
                showMobileText={true}
              />
              
              <Link 
                href={`/candidate${queryString}`}
                className="block px-4 py-3 text-sm text-[#1A1433] hover:bg-gray-100/50 rounded-lg transition-all"
                onClick={() => setIsOpen(false)}
              >
                Switch to Candidate
              </Link>

              <Link className="block px-4 py-3 text-sm text-[#1A1433] hover:bg-gray-100/50 rounded-lg transition-all" href={`/business/pricing${queryString}`} onClick={() => setIsOpen(false)}>
                Pricing
              </Link>

              <Link className="block px-4 py-3 text-sm text-[#1A1433] hover:bg-gray-100/50 rounded-lg transition-all" href={`${businessBaseUrl}/login${queryString}`} onClick={() => setIsOpen(false)}>
                Login
              </Link>
              
              <Link className="block w-full mt-4 px-6 py-3 bg-gradient-to-r from-[#5843BD] to-[#7c3aed] text-white text-sm font-medium rounded-lg text-center transition-all duration-300 hover:scale-105 shadow-md" href={`${businessBaseUrl}/register${queryString}`} onClick={() => setIsOpen(false)}>
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}