"use client";

import { openBusinessRegister, buildBusinessUrl } from "../utils/urlBuilder";
import { 
  Search, 
  FileText, 
  Palette, 
  Image, 
  Files, 
  Users,
  Zap,
  Brain,
  Target,
  Shield,
  Lock,
  MessageCircle
} from "lucide-react";

// Capabilities for the AI Coach
const capabilities = [
  {
    id: "market-research",
    title: "Market Research & Validation",
    description: "Answer 21 strategic questions and get comprehensive market analysis, TAM/SAM/SOM calculations, competitive insights, and customer personas—all investor-ready.",
    icon: <Search className="w-6 h-6" />,
    color: "from-[#5843BD] to-[#4a3ba0]"
  },
  {
    id: "business-planning",
    title: "Business Plan Generation",
    description: "Create complete business plans with financial projections, revenue models, go-to-market strategies, and funding requirements in minutes, not months.",
    icon: <FileText className="w-6 h-6" />,
    color: "from-[#FF6633] to-[#e55a2b]"
  },
  {
    id: "marketing-content",
    title: "Marketing Content Creation",
    description: "Generate social media posts, blog articles, email campaigns, ad copy, and landing page content—all optimized for your brand voice and audience.",
    icon: <Palette className="w-6 h-6" />,
    color: "from-[#5843BD] to-[#4a3ba0]"
  },
  {
    id: "ai-images",
    title: "AI Image Creation & Editing",
    description: "Create custom marketing images, product mockups, social media graphics, and promotional materials without hiring a designer.",
    icon: <Image className="w-6 h-6" />,
    color: "from-[#FF6633] to-[#e55a2b]"
  },
  {
    id: "document-creation",
    title: "Document Creation",
    description: "Draft contracts, proposals, employee handbooks, invoices, terms of service, and any business document you need—instantly.",
    icon: <Files className="w-6 h-6" />,
    color: "from-[#5843BD] to-[#4a3ba0]"
  },
  {
    id: "smart-hiring",
    title: "Smart Hiring & Matching",
    description: "Post jobs to 10+ platforms automatically, get AI-matched candidates with 95% accuracy, and streamline your entire hiring process.",
    icon: <Users className="w-6 h-6" />,
    color: "from-[#FF6633] to-[#e55a2b]"
  }
];

interface ServicesShowcaseProps {
  refQuery?: string;
  lgQuery?: string;
}

export default function ServicesShowcase({ refQuery, lgQuery }: ServicesShowcaseProps) {
  return (
    <section className="relative overflow-hidden py-12 md:py-16 lg:py-24" id="services">
      {/* Illustrated Background with Brand Colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#FF6633]/5 to-white"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-[#5843BD]/3 via-transparent to-[#FF6633]/3"></div>

      {/* Geometric Background Elements */}
      <div className="absolute top-16 left-16 w-40 h-40 bg-gradient-to-br from-[#5843BD]/8 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/3 right-24 w-32 h-32 bg-gradient-to-br from-[#FF6633]/10 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-24 left-1/4 w-48 h-48 bg-gradient-to-br from-[#5843BD]/6 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      <div className="absolute bottom-16 right-16 w-36 h-36 bg-gradient-to-br from-[#FF6633]/8 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '6s' }}></div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-[#5843BD]/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-[#FF6633]/25 rounded-full animate-bounce" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-1/2 left-[20%] w-5 h-5 bg-[#5843BD]/15 rounded-full animate-bounce" style={{ animationDelay: '5s' }}></div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        {/* SECTION 1: WHAT YOUR AI COACH CAN DO */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 md:px-6 lg:px-8 md:py-3 lg:py-4 bg-white/90 backdrop-blur-sm border-2 border-[#5843BD]/20 rounded-full text-xs md:text-sm font-medium md:font-bold mb-4 md:mb-6 lg:mb-8 text-[#5843BD] shadow-xl">
            <div className="w-2 h-2 bg-[#FF6633] rounded-full animate-pulse"></div>
            What Your AI Coach Can Do
          </div>
          <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold md:font-black mb-4 md:mb-6 lg:mb-8 leading-tight">
            Your AI Co-Founder{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5843BD] to-[#FF6633]">
              Does It All
            </span>
          </h2>
          <p className="text-md md:text-lg lg:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-normal md:font-medium px-4">
            From market research to marketing materials, your AI Business Coach handles the heavy
            lifting so you can focus on running your business.
          </p>
        </div>

        {/* 6-Card Capabilities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20 lg:mb-24">
          {capabilities.map((capability, index) => (
            <div
              key={capability.id}
              className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 border-2 border-gray-200/50 hover:border-[#5843BD]/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-r ${capability.color} flex items-center justify-center text-white mb-5 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {capability.icon}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">
                {capability.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {capability.description}
              </p>
            </div>
          ))}
        </div>

        {/* TRUST BADGES SECTION REMOVED - Moved to bottom */}
        {/* PRICING COMPARISON SECTION */}
        <div className="relative bg-gradient-to-br from-[#5843BD] via-[#4a3ba0] to-[#3d2f85] rounded-[2rem] overflow-hidden shadow-2xl mb-16 md:mb-20 lg:mb-24">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
              <div className="absolute top-1/3 right-20 w-48 h-48 bg-[#FF6633]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
              <div className="absolute bottom-20 left-1/4 w-56 h-56 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
            </div>
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          <div className="relative z-10 p-4 md:p-8 lg:p-16">
            {/* Header with Badge */}
            <div className="text-center mb-8 md:mb-12 lg:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-2 md:px-4 lg:px-6 md:py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs md:text-sm font-medium md:font-bold mb-4 md:mb-6 lg:mb-8 text-white shadow-lg">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#FF6633] rounded-full animate-pulse"></div>
                <span>Premium AI Business Ecosystem</span>
                <div className="px-2 py-1 md:px-3 bg-[#FF6633] rounded-full text-xs">97% Accuracy</div>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold md:font-black text-white mb-3 md:mb-4 lg:mb-6 leading-tight px-4">
                Your AI Co-Founder vs<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF6633] to-white">
                  Traditional Consultants
                </span>
              </h3>
              <p className="text-sm md:text-base lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
                Perfect for entrepreneurs and business owners who need intelligent guidance from idea to execution
              </p>
            </div>

            {/* Pricing Comparison - Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto mb-8 md:mb-12 lg:mb-16">
              {/* Traditional Consultants */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl md:rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-10 border border-white/20 h-full flex flex-col">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-red-500/20 rounded-full text-xs font-medium md:font-bold text-red-200 mb-3 md:mb-4 lg:mb-6">
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                      </svg>
                      OLD METHOD
                    </div>
                    <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-3 md:mb-4 lg:mb-6">Traditional<br />Business Consultants</h4>
                    <div className="space-y-2 md:space-y-3 lg:space-y-4 mb-3 md:mb-4 lg:mb-6">
                      <div className="flex items-start gap-2 md:gap-3 text-white/70">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-red-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs md:text-sm">2-4 weeks waiting time</span>
                      </div>
                      <div className="flex items-start gap-2 md:gap-3 text-white/70">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-red-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs md:text-sm">$5,000-$15,000 per engagement</span>
                      </div>
                      <div className="flex items-start gap-2 md:gap-3 text-white/70">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-red-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs md:text-sm">Limited revisions</span>
                      </div>
                      <div className="flex items-start gap-2 md:gap-3 text-white/70">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-red-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs md:text-sm">Generic templates</span>
                      </div>
                      <div className="flex items-start gap-2 md:gap-3 text-white/70">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-red-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs md:text-sm">Separate tools for research, planning, hiring</span>
                      </div>
                      <div className="flex items-start gap-2 md:gap-3 text-white/70">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-red-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs md:text-sm">No ongoing coaching</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 md:pt-4 lg:pt-6 border-t border-white/10">
                    <div className="text-2xl md:text-3xl lg:text-5xl font-bold md:font-black text-red-300 mb-1 md:mb-2">$5,000<span className="text-lg md:text-xl lg:text-2xl">+</span></div>
                    <p className="text-white/60 text-xs md:text-sm font-medium">Per project</p>
                  </div>
                </div>
              </div>

              {/* VS Divider */}
              <div className="flex items-center justify-center lg:px-4 order-none">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6633] to-[#5843BD] rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-full w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center border-2 border-white/30 shadow-2xl">
                    <span className="text-xl md:text-2xl lg:text-3xl font-bold md:font-black text-white">VS</span>
                  </div>
                </div>
              </div>

              {/* Moil AI Business Coach */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6633] to-[#e55a2b] rounded-2xl md:rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity animate-pulse" style={{ animationDuration: '3s' }}></div>
                <div className="relative bg-gradient-to-br from-[#FF6633] to-[#e55a2b] rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-10 border-2 border-white/30 shadow-2xl h-full flex flex-col transform hover:scale-105 transition-all duration-300">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/20 rounded-full text-xs font-medium md:font-bold text-white mb-3 md:mb-4 lg:mb-6">
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      AI-POWERED
                    </div>
                    <h4 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold md:font-black text-white mb-3 md:mb-4 lg:mb-6">Moil AI<br />Business Coach</h4>
                    <div className="space-y-2 md:space-y-3 lg:space-y-4 mb-3 md:mb-4 lg:mb-6">
                      <div className="flex items-start gap-2 md:gap-3 text-white">
                        <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs md:text-sm font-medium md:font-semibold">Instant AI coaching & insights</span>
                      </div>
                      <div className="flex items-start gap-2 md:gap-3 text-white">
                        <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs md:text-sm font-medium md:font-semibold">Unlimited conversations & revisions</span>
                      </div>
                      <div className="flex items-start gap-2 md:gap-3 text-white">
                        <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs md:text-sm font-medium md:font-semibold">Personalized to your business</span>
                      </div>
                      <div className="flex items-start gap-2 md:gap-3 text-white">
                        <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs md:text-sm font-medium md:font-semibold">Investor-ready outputs</span>
                      </div>
                      <div className="flex items-start gap-2 md:gap-3 text-white">
                        <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs md:text-sm font-medium md:font-semibold">Integrated ecosystem: research → planning → hiring</span>
                      </div>
                      <div className="flex items-start gap-2 md:gap-3 text-white">
                        <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs md:text-sm font-medium md:font-semibold">24/7 intelligent guidance</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 md:pt-4 lg:pt-6 border-t border-white/20">
                    <div className="flex items-baseline gap-2 mb-2 md:mb-3 lg:mb-4">
                      <div className="text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold md:font-black text-white">$15</div>
                      <div className="text-white/80 text-sm font-medium">/ month</div>
                    </div>
                    <button
                      className="w-full bg-white text-[#FF6633] py-3 px-3 md:py-4 md:px-4  rounded-xl md:rounded-2xl font-bold md:font-black text-sm md:text-base hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105 flex items-center justify-center gap-2 md:gap-3 group"
                      onClick={() => openBusinessRegister({ ref: refQuery, lg: lgQuery })}
                    >
                      <span>Start Coaching with Your AI</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <p className="text-white/70 text-xs text-center mt-4">🔒 Secure payment • 30-day money-back guarantee</p>
                  </div>
                </div>
              </div>
            </div>

            {/* THREE PILLARS - REDESIGNED WITH TRUST CONTENT */}
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto items-stretch">
              <div className="group relative h-full flex">
                <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all flex flex-col h-full w-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h5 className="text-white font-bold text-lg mb-3">30-Day Guarantee</h5>
                  <p className="text-white/80 text-sm leading-relaxed flex-grow">Get actionable business insights and hiring results within 30 days or receive a full refund</p>
                </div>
              </div>

              <div className="group relative h-full flex">
                <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all flex flex-col h-full w-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h5 className="text-white font-bold text-lg mb-3">Enterprise Security</h5>
                  <p className="text-white/80 text-sm leading-relaxed flex-grow">SOC 2 compliant with bank-level encryption. Trusted by growing businesses and EDCs across Texas</p>
                </div>
              </div>

              <div className="group relative h-full flex">
                <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all flex flex-col h-full w-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h5 className="text-white font-bold text-lg mb-3">Free Consultation</h5>
                  <p className="text-white/80 text-sm leading-relaxed flex-grow">Talk to your AI Business Coach completely free. No credit card required to start</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
