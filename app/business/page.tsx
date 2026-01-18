"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import FAQSection from "../../src/business/sections/FAQ_section";
import SelectLanguage from "../../src/common/components/selectLanguage";
import FooterSection from "../../src/common/sections/footer";

// New Enhanced Business Components
import BusinessNavigation from "../../src/business/components/navigation";
import EnhancedHero from "../../src/business/sections/enhanced_hero";
import ServicesShowcase from "../../src/business/sections/services_showcase";
import MarketResearch from "../../src/business/sections/market_research";
import SmartHiring from "../../src/business/sections/smart_hiring";
import FinalCTA from "../../src/business/sections/final_cta";
import TestimonialsSection from "../../src/business/sections/testimonial_section";

export default function BusinessPage() {
  const [refQuery, setRefQuery] = useState<string | null>(null);
  const [queryLg, setQueryLg] = useState("");
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    // Get URL parameters on client side
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    setRefQuery(searchParams.get('ref'));
    
    // Get lg parameter from URL
    const lgParam = searchParams.get('lg');
    if (lgParam) {
      setQueryLg(lgParam);
    }

    const tlang = localStorage.getItem("tlang");
    if (tlang == null) {
      setTimeout(() => {
        setShowLanguageModal(true);
      }, 50);
    }
  }, []);

  const handleGetStarted = () => {
    // Scroll to pricing section or handle signup
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const showModal = showLanguageModal ? createPortal(
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="top-0 left-0 fixed bottom-0 right-0 z-50 h-screen flex justify-center items-center md:bg-black md:bg-opacity-70 backdrop-blur-[2px] sm:bg-white vsm:bg-white overflow-y-scroll ScrollOnly"
    >
      <SelectLanguage handleClick={() => setShowLanguageModal(false)} setQueryLg={setQueryLg} />
    </motion.div>, document.getElementById("modal")!
  ) : null;

  return (
    <>
      <div className="bg-white">
        {/* Enhanced Business Landing Page */}
        <BusinessNavigation
          page="home"
          refQuery={refQuery}
          lgQuery={queryLg}
          setQueryLg={setQueryLg}
          setShowLanguageModal={setShowLanguageModal}
        />
        <EnhancedHero onGetStarted={handleGetStarted} refQuery={refQuery || undefined} lgQuery={queryLg} />
        <div id="services">
          <ServicesShowcase refQuery={refQuery || undefined} lgQuery={queryLg} />
        </div>
        <div id="features">
          <MarketResearch refQuery={refQuery || undefined} lgQuery={queryLg} />
        </div>
        <SmartHiring refQuery={refQuery || undefined} lgQuery={queryLg} />
        <div id="testimonials">
          <TestimonialsSection refQuery={refQuery || undefined} lgQuery={queryLg} />
        </div>
        <FAQSection />
        <FinalCTA refQuery={refQuery || undefined} lgQuery={queryLg} />
        <FooterSection refQuery={refQuery} lgQuery={queryLg} />
        {showModal}
      </div>

      {/* Modal Container */}
      <div id="modal"></div>
    </>
  );
}
