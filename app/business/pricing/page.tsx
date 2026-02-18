"use client";

import DetailedPricinSection from "../../../src/business/sections/detailed_pricing_section";
import BusinessNavigation from "../../../src/business/components/navigation";
import FAQSection from "../../../src/business/sections/FAQ_section";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import FooterSection from "../../../src/common/sections/footer";
import SelectLanguage from "../../../src/common/components/selectLanguage";

export default function BusinessPricingPage() {

  const [allShow, setAllShow] = useState("monthly");
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
  }, []);

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
			<BusinessNavigation refQuery={refQuery} page="pricing" lgQuery={queryLg} setQueryLg={setQueryLg} setShowLanguageModal={setShowLanguageModal} />
			<div className="relative min-h-screen bg-white overflow-hidden">
				{/* Grid Pattern Background */}
				<div className="absolute inset-0 opacity-10">
					<div className="absolute inset-0" style={{
						backgroundImage: `
							linear-gradient(rgba(255, 102, 51, 0.35) 1px, transparent 1px),
							linear-gradient(90deg, rgba(255, 102, 51, 0.35) 1px, transparent 1px)
						`,
						backgroundSize: '50px 50px'
					}} />
				</div>

				{/* Decorative Gradient Orbs */}
				<div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />
				<div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/15 rounded-full blur-3xl" />
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-orange-200/20 to-orange-400/10 rounded-full blur-3xl" />

				<div className="relative flex pt-24 md:pt-32 lg:pt-36 pb-16 flex-col gap-y-8">
					<div className="px-6 sm:px-8 md:px-0">
						<p className="font-[800] text-[32px] md:text-[40px] lg:text-[48px] leading-tight text-center text-[#252430]">Choose the Right Plan for Your Business</p>
						<p className="text-base md:text-lg leading-normal text-center text-[#6B7280] mt-4 max-w-3xl mx-auto">Flexible plans designed to help you grow your business with AI-powered tools and smart hiring solutions.</p>
					</div>

					<div className="px-6 sm:px-8 md:px-0 flex flex-col gap-y-2">
						<div className="flex item-center justify-center gap-x-4">
							<button onClick={() => setAllShow("monthly")}
								className={`${allShow === "monthly" ? "bg-[#FF6633] text-white" : "bg-white border-2 border-[#E5E7EB] text-[#374151]"} py-[10px] px-[20px] rounded-[22px] text-center leading-normal text-base font-medium transition-all duration-300 hover:scale-105 shadow-sm`}>Monthly Plans</button>
							<button onClick={() => setAllShow("annually")}
								className={`${allShow === "annually" ? "bg-[#FF6633] text-white" : "bg-white border-2 border-[#E5E7EB] text-[#374151]"} py-[10px] px-[20px] rounded-[24px] text-center leading-normal text-base font-medium transition-all duration-300 hover:scale-105 shadow-sm`}>See Annual Plans</button>
						</div>
						<p className="text-[#FF6633] text-sm leading-normal font-medium text-center bg-orange-50 rounded-full py-2 px-4 inline-block mx-auto border border-orange-200">Save up to 25% when you purchase an annual plan.</p>
					</div>

					<div className="px-6 sm:px-8 md:px-0 flex justify-center">
						<DetailedPricinSection refQuery={refQuery} lgQuery={queryLg} allShow={allShow} />
					</div>
				</div>
			</div>
			<FAQSection />
			<FooterSection refQuery={refQuery} lgQuery={queryLg} />
			{showModal}

			{/* Modal Container */}
			<div id="modal"></div>
		</>
	)
}
