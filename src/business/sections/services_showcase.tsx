"use client";

import { useState } from "react";
import { businessBaseUrl } from "../../common/constants/baseUrl";
import { openBusinessRegister, buildBusinessUrl } from "../utils/urlBuilder";
// Removed markdown import since we're using HTML directly from Gemini

// Helper function to clean HTML from code block markers
const cleanHtmlContent = (htmlString: string): string => {
  if (!htmlString) return '';

  return htmlString
    .replace(/```html\s*/gi, '') // Remove opening ```html
    .replace(/```\s*$/gi, '')    // Remove closing ```
    .replace(/^\s*```\s*/gi, '') // Remove any leading ```
    .trim();
};

const services = [
  {
    id: "market-research",
    title: "AI Market Research",
    description: "Get deep insights into your market, competitors, and opportunities with our AI-powered research tools.",
    features: ["Competitor Analysis", "Market Trends", "Customer Insights", "Opportunity Mapping"],
    color: "from-[#5843BD] to-[#4a3ba0]",
    bgColor: "bg-[#5843BD]",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    id: "business-planning",
    title: "Smart Business Planning",
    description: "Create comprehensive business plans with AI assistance, financial projections, and strategic roadmaps.",
    features: ["Business Model Canvas", "Financial Projections", "Strategic Planning", "Risk Assessment"],
    color: "from-[#FF6633] to-[#e55a2b]",
    bgColor: "bg-[#FF6633]",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    id: "hiring-tools",
    title: "Intelligent Hiring",
    description: "Streamline your recruitment process with AI-powered candidate matching and assessment tools.",
    features: ["Resume Screening", "Skill Assessment", "Interview Scheduling", "Candidate Matching"],
    color: "from-[#5843BD] to-[#4a3ba0]",
    bgColor: "bg-[#5843BD]",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
      </svg>
    )
  },
  {
    id: "growth-analytics",
    title: "Growth Analytics",
    description: "Track your business performance with advanced analytics and predictive insights.",
    features: ["Performance Dashboards", "Predictive Analytics", "Growth Metrics", "ROI Tracking"],
    color: "from-[#FF6633] to-[#e55a2b]",
    bgColor: "bg-[#FF6633]",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
      </svg>
    )
  }
];

interface MarketInsights {
  business: string;
  location: string;
  locData: {
    population: string;
    growth: string;
    avgIncome: string;
  };
  mktData: {
    size: string;
    spending: string;
    behavior: string;
  };
  bizData: {
    marketSize: string;
    growth: string;
    avgRevenue: string;
  };
  projectedRevenue: number;
}

const demoSections = [
  {
    id: "business-model",
    title: "Business Model",
    description: "Design and validate your business model with AI-powered canvas generation and analysis.",
    features: ["Value Proposition Design", "Revenue Streams", "Key Partnerships", "Cost Structure"],
    color: "#5843BD",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
      </svg>
    )
  },
  {
    id: "market-overview",
    title: "Market Overview",
    description: "Analyze your market size, competition, and opportunities with AI-powered research tools.",
    features: ["Market Size Analysis", "Customer Demographics", "Growth Trends", "Market Opportunities"],
    color: "#FF6633",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    )
  },
  {
    id: "competitive-analysis",
    title: "Competitive Analysis",
    description: "Identify competitors and analyze their strengths, weaknesses, and market positioning.",
    features: ["Competitor Identification", "SWOT Analysis", "Market Gaps", "Pricing Strategy"],
    color: "#5843BD",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
      </svg>
    )
  },
  {
    id: "financial-projections",
    title: "Financial Projections",
    description: "Calculate revenue, costs, and profitability forecasts with intelligent financial modeling.",
    features: ["Revenue Forecasting", "Cost Analysis", "Break-even Calculation", "ROI Projections"],
    color: "#FF6633",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
      </svg>
    )
  },
  {
    id: "business-plan",
    title: "Business Plan Generator",
    description: "Create comprehensive business plans with AI assistance, financial projections, and strategic roadmaps.",
    features: ["Executive Summary", "Market Strategy", "Financial Projections", "Action Plan"],
    color: "#FF6633",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8s0 0 0 0l-6-6zM16 18H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
      </svg>
    )
  },
  {
    id: "market-audience",
    title: "Market & Audience",
    description: "Define your target audience and develop customer acquisition strategies.",
    features: ["Target Segmentation", "Customer Personas", "Acquisition Channels", "Marketing Mix"],
    color: "#5843BD",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.5 7H17c-.8 0-1.5.7-1.5 1.5v6c0 .8.7 1.5 1.5 1.5h1v6h2zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h1.5v7h4zm7.5-2v-4h1v-4c0-.8-.7-1.5-1.5-1.5h-2c-.8 0-1.5.7-1.5 1.5v4h1v4h3z" />
      </svg>
    )
  }
];

interface ServicesShowcaseProps {
  refQuery?: string;
  lgQuery?: string;
}

export default function ServicesShowcase({ refQuery, lgQuery }: ServicesShowcaseProps) {
  const [activeTab, setActiveTab] = useState("demo");
  const [activeService, setActiveService] = useState("market-research");
  const [activeDemoSection, setActiveDemoSection] = useState("business-model");
  const [businessType, setBusinessType] = useState("");
  const [location, setLocation] = useState("austin");
  const [targetMarket, setTargetMarket] = useState("young-professionals");
  const [showResults, setShowResults] = useState(false);
  const [insights, setInsights] = useState<MarketInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [demoResults, setDemoResults] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [financialProjections, setFinancialProjections] = useState<any>(null);
  const [audienceAnalysis, setAudienceAnalysis] = useState<any>(null);
  const [isGeneratingFinancials, setIsGeneratingFinancials] = useState(false);
  const [isGeneratingAudience, setIsGeneratingAudience] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);
  const [modalTitle, setModalTitle] = useState('');

  const generateMarketInsights = (business: string, location: string, market: string): MarketInsights => {
    const locationData: Record<string, any> = {
      'austin': { population: '2.3M', growth: '15%', avgIncome: '$85K' },
      'dallas': { population: '7.8M', growth: '14%', avgIncome: '$70K' },
      'houston': { population: '7.1M', growth: '12%', avgIncome: '$68K' },
      'sanantonio': { population: '2.6M', growth: '10%', avgIncome: '$60K' },
      'other': { population: '1.2M', growth: '8%', avgIncome: '$65K' }
    };

    const marketData: Record<string, any> = {
      'young-professionals': { size: '340K', spending: '$45K/year', behavior: 'values convenience and quality' },
      'families': { size: '180K', spending: '$65K/year', behavior: 'price-conscious but quality-focused' },
      'seniors': { size: '120K', spending: '$35K/year', behavior: 'values personal service' },
      'students': { size: '85K', spending: '$15K/year', behavior: 'highly price-sensitive' },
      'businesses': { size: '25K', spending: '$150K/year', behavior: 'seeks efficiency and ROI' },
      'tourists': { size: '2.5M/year', spending: '$800/visit', behavior: 'experience-focused' }
    };

    const businessTypes: Record<string, any> = {
      'coffee': { marketSize: '$2.8B', growth: '7%', avgRevenue: '$85K' },
      'food': { marketSize: '$127M', growth: '18%', avgRevenue: '$180K' },
      'salon': { marketSize: '$890M', growth: '5%', avgRevenue: '$95K' },
      'tech': { marketSize: '$15.2B', growth: '23%', avgRevenue: '$250K' },
      'construction': { marketSize: '$45.3B', growth: '12%', avgRevenue: '$320K' },
      'retail': { marketSize: '$1.2B', growth: '8%', avgRevenue: '$120K' }
    };

    let businessCategory = 'retail';
    const businessLower = business.toLowerCase();
    if (businessLower.includes('coffee')) businessCategory = 'coffee';
    else if (businessLower.includes('food') || businessLower.includes('restaurant')) businessCategory = 'food';
    else if (businessLower.includes('salon') || businessLower.includes('beauty')) businessCategory = 'salon';
    else if (businessLower.includes('tech') || businessLower.includes('software')) businessCategory = 'tech';
    else if (businessLower.includes('construction') || businessLower.includes('contractor')) businessCategory = 'construction';

    const locData = locationData[location] || locationData['austin'];
    const mktData = marketData[market] || marketData['young-professionals'];
    const bizData = businessTypes[businessCategory];

    const projectedRevenue = Math.floor(parseInt(bizData.avgRevenue.replace('$', '').replace('K', '')) * (0.8 + Math.random() * 0.4));

    return { business, location, locData, mktData, bizData, projectedRevenue };
  };

  // API Integration Functions
  const handleBusinessModelDemo = async (data: any) => {
    setIsLoading(true);
    setDemoResults(null);

    try {
      const response = await fetch('/api/demo/business-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        setDemoResults(result);
        setShowResults(true);
      } else {
        console.error('Demo failed:', result.error);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarketResearchDemo = async (data: any) => {
    setIsLoading(true);
    setDemoResults(null);

    try {
      const response = await fetch('/api/demo/market-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        setDemoResults(result);
        setShowResults(true);
      } else {
        console.error('Demo failed:', result.error);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompetitorAnalysisDemo = async (data: any) => {
    setIsLoading(true);
    setDemoResults(null);

    try {
      const response = await fetch('/api/demo/competitor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        setDemoResults(result);
        setShowResults(true);
      } else {
        console.error('Demo failed:', result.error);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusinessPlanDemo = async (data: any) => {
    setIsLoading(true);
    setDemoResults(null);

    try {
      const response = await fetch('/api/demo/business-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        setDemoResults(result);
        setShowResults(true);
      } else {
        console.error('Demo failed:', result.error);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Financial Projections API
  const handleFinancialProjections = async (data: any) => {
    // Validation
    if (!data.finBusinessName || !data.finIndustry || !data.finBudget || !data.finTargetRevenue) {
      alert('Please fill in all required fields for financial projections.');
      return;
    }

    setIsGeneratingFinancials(true);
    setFinancialProjections(null);

    try {
      const response = await fetch('/api/demo/financial-projections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: data.finBusinessName,
          industry: data.finIndustry,
          location: location || 'Austin, TX',
          budget: data.finBudget,
          targetRevenue: data.finTargetRevenue
        })
      });

      const result = await response.json();

      if (result.success) {
        setFinancialProjections(result);
      } else {
        console.error('Financial projections failed:', result.error);
        alert('Failed to generate financial projections. Please try again.');
      }
    } catch (error) {
      console.error('API Error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsGeneratingFinancials(false);
    }
  };

  // Audience Analysis API
  const handleAudienceAnalysis = async (data: any) => {
    // Validation
    if (!data.audBusinessType || !data.audLocation || !data.audIndustry) {
      alert('Please fill in all required fields for audience analysis.');
      return;
    }

    setIsGeneratingAudience(true);
    setAudienceAnalysis(null);

    try {
      const response = await fetch('/api/demo/audience-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessType: data.audBusinessType,
          location: data.audLocation,
          industry: data.audIndustry
        })
      });

      const result = await response.json();

      if (result.success) {
        setAudienceAnalysis(result);
      } else {
        console.error('Audience analysis failed:', result.error);
        alert('Failed to generate audience analysis. Please try again.');
      }
    } catch (error) {
      console.error('API Error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsGeneratingAudience(false);
    }
  };

  const handleViewFullResults = () => {
    openBusinessRegister({
      ref: refQuery,
      lg: lgQuery
    });
  };

  const handleViewDetailedModal = (content: any, title: string) => {
    setModalContent(content);
    setModalTitle(title);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setModalContent(null);
    setModalTitle('');
  };

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
      <div className="absolute top-1/2 left-1/5 w-5 h-5 bg-[#5843BD]/15 rounded-full animate-bounce" style={{ animationDelay: '5s' }}></div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 md:px-6 lg:px-8 md:py-3 lg:py-4 bg-white/90 backdrop-blur-sm border-2 border-[#5843BD]/20 rounded-full text-xs md:text-sm font-medium md:font-bold mb-4 md:mb-6 lg:mb-8 text-[#5843BD] shadow-xl">
            <div className="w-2 h-2 bg-[#FF6633] rounded-full animate-pulse"></div>
            Our Premium Services
          </div>
          <h2 className="text-3xl md:text-5xl xl:text-7xl font-bold md:font-black mb-4 md:mb-6 lg:mb-10 leading-tight">
            Complete Business{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5843BD] to-[#FF6633]">
              Growth Solutions
            </span>
          </h2>
          <p className="text-md  md:text-lg lg:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-normal md:font-medium px-4">
            Transform your business with our AI-powered platform. From market research to hiring,
            we provide everything you need to scale and succeed.
          </p>
        </div>

        {/* Sophisticated Tab Navigation */}
        <div className="flex justify-center mb-8 md:mb-12 lg:mb-16">
          <div className="relative">
            {/* Glass morphism container */}
            <div className="relative bg-white/80 backdrop-blur-2xl rounded-2xl md:rounded-3xl p-1.5 md:p-2 border border-white/40 shadow-2xl">
              {/* Floating indicator */}
              <div
                className={`absolute top-1.5 md:top-2 h-[calc(100%-12px)] md:h-[calc(100%-16px)] rounded-xl md:rounded-2xl transition-all duration-700 ease-out ${activeTab === "demo"
                    ? "left-1.5 md:left-2 w-[calc(50%-6px)] md:w-[calc(50%-8px)] bg-gradient-to-br from-[#5843BD] via-[#6b52d4] to-[#5843BD] shadow-[0_8px_32px_rgba(88,67,189,0.4)]"
                    : "left-[calc(50%+1.5px)] md:left-[calc(50%+2px)] w-[calc(50%-6px)] md:w-[calc(50%-8px)] bg-gradient-to-br from-[#FF6633] via-[#ff7d52] to-[#FF6633] shadow-[0_8px_32px_rgba(255,102,51,0.4)]"
                  }`}
              />

              <div className="relative flex">
                {/* Demo Tab */}
                <button
                  onClick={() => setActiveTab("demo")}
                  className={`relative px-4 py-3 md:px-8 md:py-4 lg:px-12 lg:py-5 rounded-xl md:rounded-2xl font-medium md:font-semibold lg:font-bold transition-all duration-500 flex items-center gap-2 md:gap-3 group min-w-0 flex-1 justify-center ${activeTab === "demo"
                      ? "text-white"
                      : "text-gray-700 hover:text-[#5843BD]"
                    }`}
                >
                  <div className={`relative transition-all duration-500 ${activeTab === "demo" ? "scale-110" : "scale-100 group-hover:scale-110"
                    }`}>
                    <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                    {activeTab === "demo" && (
                      <div className="absolute -inset-2 bg-white/20 rounded-full blur-sm animate-pulse"></div>
                    )}
                  </div>
                  <span className="text-xs md:text-sm lg:text-base xl:text-lg font-medium truncate">
                    <span className="hidden sm:inline">Interactive </span>Demo
                  </span>
                  {activeTab === "demo" && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-[#FF6633] rounded-full animate-pulse"></div>
                  )}
                </button>

                {/* Services Tab */}
                <button
                  onClick={() => setActiveTab("services")}
                  className={`relative px-4 py-3 md:px-8 md:py-4 lg:px-12 lg:py-5 rounded-xl md:rounded-2xl font-medium md:font-semibold lg:font-bold transition-all duration-500 flex items-center gap-2 md:gap-3 group min-w-0 flex-1 justify-center ${activeTab === "services"
                      ? "text-white"
                      : "text-gray-700 hover:text-[#FF6633]"
                    }`}
                >
                  <div className={`relative transition-all duration-500 ${activeTab === "services" ? "scale-110" : "scale-100 group-hover:scale-110"
                    }`}>
                    <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                    </svg>
                    {activeTab === "services" && (
                      <div className="absolute -inset-2 bg-white/20 rounded-full blur-sm animate-pulse"></div>
                    )}
                  </div>
                  <span className="text-xs md:text-sm lg:text-base xl:text-lg font-medium truncate">
                    <span className="hidden sm:inline">Our </span>Services
                  </span>
                  {activeTab === "services" && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-[#5843BD] rounded-full animate-pulse"></div>
                  )}
                </button>
              </div>
            </div>

            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#5843BD]/10 via-transparent to-[#FF6633]/10 rounded-2xl md:rounded-3xl blur-xl -z-10"></div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "demo" && (
          <div className="grid lg:grid-cols-2 items-center gap-16 mb-20">
            {/* Demo Sections Navigation */}
            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-8">Choose Demo Section</h3>
              {demoSections.map((section, index) => (
                <div
                  key={section.id}
                  className={`group relative cursor-pointer transition-all duration-500 ${activeDemoSection === section.id
                      ? 'scale-105'
                      : 'hover:scale-102'
                    }`}
                  onClick={() => setActiveDemoSection(section.id)}
                >
                  <div className={`relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 ${activeDemoSection === section.id
                      ? `border-[${section.color}] shadow-2xl`
                      : 'border-gray-200/50 hover:border-gray-300 hover:shadow-xl'
                    }`}>
                    <div className="flex items-start gap-5">
                      <div className={`flex-shrink-0 p-4 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`} style={{ backgroundColor: section.color }}>
                        {section.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-lg md:text-xl font-bold mb-3 transition-colors duration-300 ${activeDemoSection === section.id ? `text-gray-800` : 'text-gray-800 group-hover:text-gray-900'
                          }`}>
                          {section.title}
                        </h4>
                        <p className="text-gray-600 text-sm md:text-base mb-4 leading-relaxed">
                          {section.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {section.features.slice(0, 2).map((feature, featureIndex) => (
                            <span key={featureIndex} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                              {feature}
                            </span>
                          ))}
                          <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: section.color + '20', color: section.color }}>
                            +{section.features.length - 2} more
                          </span>
                        </div>
                      </div>
                    </div>
                    {activeDemoSection === section.id && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: section.color }}>
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Demo Panel */}
            <div className="relative">
              <div className="sticky top-8">
                {demoSections.map((section) => (
                  activeDemoSection === section.id && (
                    <div key={section.id} className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-200/50 shadow-2xl">
                      {/* Section Header */}
                      <div className="text-center mb-8">
                        <div className="inline-flex p-4 md:p-6 rounded-2xl text-white mb-6 shadow-xl" style={{ backgroundColor: section.color }}>
                          {section.icon}
                        </div>
                        <h3 className="text-xl md:text-3xl font-bold text-gray-800 mb-4">{section.title}</h3>
                        <p className="text-md md:text-lg text-gray-600 leading-relaxed">
                          {section.description}
                        </p>
                      </div>

                      {/* Demo Form based on section */}
                      {section.id === "business-model" && (
                        <div className="space-y-6">
                          <div className="grid gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                              <input
                                type="text"
                                value={formData.businessName || ''}
                                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                placeholder="e.g., TechFlow Solutions"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Services</label>
                              <input
                                type="text"
                                value={formData.services || ''}
                                onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                                placeholder="e.g., Web Development, Digital Marketing, Consulting"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                              <input
                                type="text"
                                value={formData.city || ''}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                placeholder="e.g., Austin, New York, Los Angeles"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Target Market</label>
                              <input
                                type="text"
                                value={formData.targetMarket || ''}
                                onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                                placeholder="e.g., Small businesses, Young professionals"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                              />
                            </div>
                          </div>
                          <button
                            className="w-full text-white py-4 px-6 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50"
                            style={{ backgroundColor: section.color }}
                            onClick={() => handleBusinessModelDemo({
                              businessName: formData.businessName || 'My Business',
                              services: formData.services || 'Technology Services',
                              city: formData.city || 'Austin',
                              targetMarket: formData.targetMarket || 'Small businesses'
                            })}
                            disabled={isLoading}
                          >
                            {isLoading ? 'Generating...' : 'Generate Business Model Canvas'}
                          </button>

                          {demoResults && demoResults.data && (
                            <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-bold text-gray-800">AI-Generated Business Model</h4>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Demo Preview</span>
                              </div>
                              <div className="mb-4 max-h-60 overflow-y-auto">
                                <div className="bg-white/50 p-4 rounded-lg">
                                  <div dangerouslySetInnerHTML={{ __html: cleanHtmlContent(demoResults.data.substring(0, 600)) }} />
                                  {demoResults.data.length > 600 && (
                                    <div className="mt-3 p-3 bg-gradient-to-r from-[#5843BD]/10 to-[#FF6633]/10 rounded-lg border-l-4 border-[#5843BD]">
                                      <p className="text-sm text-gray-600 italic">
                                        This is a preview of your complete business model analysis.
                                        View the full detailed report with actionable insights.
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => handleViewDetailedModal(demoResults, 'Complete Business Model Analysis')}
                                className="w-full bg-white border-2 border-[#5843BD] text-[#5843BD] py-3 px-4 rounded-lg font-semibold hover:bg-[#5843BD] hover:text-white transition-all duration-300"
                              >
                                View Complete Analysis
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {section.id === "market-overview" && (
                        <div className="space-y-6">
                          <div className="grid gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Business Type</label>
                              <input
                                type="text"
                                value={formData.businessType || ''}
                                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                placeholder="e.g., Coffee Shop, Tech Startup"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                              <input
                                type="text"
                                value={formData.location || ''}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g., Austin, TX"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Target Audience</label>
                              <input
                                type="text"
                                value={formData.targetAudience || ''}
                                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                placeholder="e.g., Young professionals, Families"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => handleMarketResearchDemo({
                              businessType: formData.businessType || 'Coffee Shop',
                              location: formData.location || 'Austin, TX',
                              targetAudience: formData.targetAudience || 'Young professionals'
                            })}
                            className="w-full text-white py-4 px-6 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50"
                            style={{ backgroundColor: section.color }}
                            disabled={isLoading}
                          >
                            {isLoading ? 'Analyzing...' : 'Generate Market Analysis'}
                          </button>

                          {demoResults && demoResults.data && (
                            <div className="mt-6 p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-bold text-gray-800">AI Market Research</h4>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Demo Preview</span>
                              </div>
                              <div className="text-sm text-gray-700 whitespace-pre-line mb-4">
                                {demoResults.data.substring(0, 300)}...
                              </div>
                              <button
                                onClick={() => handleViewDetailedModal(demoResults, 'Complete Market Research Analysis')}
                                className="w-full bg-white border-2 border-[#FF6633] text-[#FF6633] py-3 px-4 rounded-lg font-semibold hover:bg-[#FF6633] hover:text-white transition-all duration-300"
                              >
                                View Complete Analysis
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {section.id === "financial-projections" && (
                        <div className="space-y-6">
                          <div className="grid gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                              <input
                                type="text"
                                value={formData.finBusinessName || ''}
                                onChange={(e) => setFormData({ ...formData, finBusinessName: e.target.value })}
                                placeholder="e.g., Austin Coffee Co."
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
                              <select
                                value={formData.finIndustry || ''}
                                onChange={(e) => setFormData({ ...formData, finIndustry: e.target.value })}
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                              >
                                <option value="">Select Industry</option>
                                <option value="Restaurant">Restaurant</option>
                                <option value="Retail">Retail</option>
                                <option value="Technology">Technology</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Consulting">Consulting</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Initial Budget ($)</label>
                              <input
                                type="text"
                                value={formData.finBudget || ''}
                                onChange={(e) => setFormData({ ...formData, finBudget: e.target.value })}
                                placeholder="e.g., $50K"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Target Revenue ($)</label>
                              <input
                                type="text"
                                value={formData.finTargetRevenue || ''}
                                onChange={(e) => setFormData({ ...formData, finTargetRevenue: e.target.value })}
                                placeholder="e.g., $200K"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                              />
                            </div>
                          </div>
                          <button
                            className="w-full text-white py-4 px-6 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50"
                            style={{ backgroundColor: section.color }}
                            onClick={() => handleFinancialProjections(formData)}
                            disabled={isGeneratingFinancials}
                          >
                            {isGeneratingFinancials ? 'Generating Projections...' : 'Generate AI Financial Projections'}
                          </button>
                          {financialProjections && financialProjections.data && (
                            <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-bold text-gray-800">AI Financial Projections</h4>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Demo Preview</span>
                              </div>
                              <div className="text-sm text-gray-700 space-y-2 mb-4">
                                <div className="flex justify-between">
                                  <span className="font-semibold">Year 1 Revenue:</span>
                                  <span className="font-bold" style={{ color: section.color }}>${financialProjections.data.year1Revenue}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold">Break-even:</span>
                                  <span className="text-green-600 font-bold">Month {financialProjections.data.breakEvenMonth}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold">ROI Year 1:</span>
                                  <span className="font-bold" style={{ color: section.color }}>{financialProjections.data.roiYear1}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold">Monthly Growth:</span>
                                  <span className="font-bold text-blue-600">{financialProjections.data.monthlyGrowth}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold">Initial Costs:</span>
                                  <span className="font-bold text-red-600">${financialProjections.data.initialCosts}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold">Profit Margin:</span>
                                  <span className="font-bold text-green-600">{financialProjections.data.profitMargin}%</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {section.id === "competitive-analysis" && (
                        <div className="space-y-6">
                          <div className="grid gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                              <input
                                type="text"
                                value={formData.compBusinessName || ''}
                                onChange={(e) => setFormData({ ...formData, compBusinessName: e.target.value })}
                                placeholder="e.g., Austin Coffee Co."
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
                              <input
                                type="text"
                                value={formData.compIndustry || ''}
                                onChange={(e) => setFormData({ ...formData, compIndustry: e.target.value })}
                                placeholder="e.g., Food & Beverage, Technology"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                              <input
                                type="text"
                                value={formData.compLocation || ''}
                                onChange={(e) => setFormData({ ...formData, compLocation: e.target.value })}
                                placeholder="e.g., Austin, TX"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                              />
                            </div>
                          </div>
                          <button
                            className="w-full text-white py-4 px-6 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50"
                            style={{ backgroundColor: section.color }}
                            onClick={() => handleCompetitorAnalysisDemo({
                              businessName: formData.compBusinessName || 'My Business',
                              industry: formData.compIndustry || 'Food & Beverage',
                              location: formData.compLocation || 'Austin, TX'
                            })}
                            disabled={isLoading}
                          >
                            {isLoading ? 'Analyzing...' : 'Analyze Competitors'}
                          </button>

                          {demoResults && demoResults.data && (
                            <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-bold text-gray-800">AI Competitor Analysis</h4>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Demo Preview</span>
                              </div>
                              <div className="text-sm text-gray-700 whitespace-pre-line mb-4">
                                {demoResults.data.substring(0, 300)}...
                              </div>
                              <button
                                onClick={() => handleViewDetailedModal(demoResults, 'Complete Competitor Analysis')}
                                className="w-full bg-white border-2 border-purple-500 text-purple-500 py-3 px-4 rounded-lg font-semibold hover:bg-purple-500 hover:text-white transition-all duration-300"
                              >
                                View Complete Analysis
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {section.id === "business-plan" && (
                        <div className="space-y-6">
                          <div className="grid gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                              <input
                                type="text"
                                value={formData.planBusinessName || ''}
                                onChange={(e) => setFormData({ ...formData, planBusinessName: e.target.value })}
                                placeholder="e.g., TechFlow Solutions"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
                              <input
                                type="text"
                                value={formData.planIndustry || ''}
                                onChange={(e) => setFormData({ ...formData, planIndustry: e.target.value })}
                                placeholder="e.g., SaaS, E-commerce, Consulting"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Budget Range</label>
                              <select
                                value={formData.planBudget || ''}
                                onChange={(e) => setFormData({ ...formData, planBudget: e.target.value })}
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                              >
                                <option value="">Select budget range</option>
                                <option value="$10K-$50K">$10K - $50K</option>
                                <option value="$50K-$100K">$50K - $100K</option>
                                <option value="$100K-$500K">$100K - $500K</option>
                                <option value="$500K+">$500K+</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Timeline</label>
                              <select
                                value={formData.planTimeline || ''}
                                onChange={(e) => setFormData({ ...formData, planTimeline: e.target.value })}
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                              >
                                <option value="">Select timeline</option>
                                <option value="3 months">3 months</option>
                                <option value="6 months">6 months</option>
                                <option value="1 year">1 year</option>
                                <option value="2+ years">2+ years</option>
                              </select>
                            </div>
                          </div>
                          <button
                            className="w-full text-white py-4 px-6 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50"
                            style={{ backgroundColor: section.color }}
                            onClick={() => handleBusinessPlanDemo({
                              businessName: formData.planBusinessName || 'My Business',
                              industry: formData.planIndustry || 'Technology',
                              budget: formData.planBudget || '$50K-$100K',
                              timeline: formData.planTimeline || '6 months'
                            })}
                            disabled={isLoading}
                          >
                            {isLoading ? 'Generating...' : 'Generate Business Plan'}
                          </button>

                          {demoResults && demoResults.data && (
                            <div className="mt-6 p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-bold text-gray-800">AI Business Plan</h4>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Demo Preview</span>
                              </div>
                              <div className="text-sm text-gray-700 whitespace-pre-line mb-4">
                                {demoResults.data.substring(0, 300)}...
                              </div>
                              <button
                                onClick={() => handleViewDetailedModal(demoResults, 'Complete Business Plan')}
                                className="w-full bg-white border-2 border-orange-500 text-orange-500 py-3 px-4 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300"
                              >
                                View Complete Analysis
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {section.id === "market-audience" && (
                        <div className="space-y-6">
                          <div className="grid gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Business Type</label>
                              <input
                                type="text"
                                value={formData.audBusinessType || ''}
                                onChange={(e) => setFormData({ ...formData, audBusinessType: e.target.value })}
                                placeholder="e.g., Restaurant, Retail Store, Consulting"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                              <input
                                type="text"
                                value={formData.audLocation || ''}
                                onChange={(e) => setFormData({ ...formData, audLocation: e.target.value })}
                                placeholder="e.g., Austin, TX"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
                              <select
                                value={formData.audIndustry || ''}
                                onChange={(e) => setFormData({ ...formData, audIndustry: e.target.value })}
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                              >
                                <option value="">Select Industry</option>
                                <option value="Food & Beverage">Food & Beverage</option>
                                <option value="Retail">Retail</option>
                                <option value="Technology">Technology</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Professional Services">Professional Services</option>
                                <option value="Beauty & Wellness">Beauty & Wellness</option>
                                <option value="Automotive">Automotive</option>
                              </select>
                            </div>
                          </div>
                          <button
                            className="w-full text-white py-4 px-6 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50"
                            style={{ backgroundColor: section.color }}
                            onClick={() => handleAudienceAnalysis(formData)}
                            disabled={isGeneratingAudience}
                          >
                            {isGeneratingAudience ? 'Analyzing Audience...' : 'Generate AI Audience Analysis'}
                          </button>
                          {audienceAnalysis && audienceAnalysis.data && (
                            <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-bold text-gray-800">AI Audience Analysis</h4>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Demo Preview</span>
                              </div>
                              <div className="mb-4 max-h-80 overflow-y-auto">
                                <div className="bg-white/50 p-4 rounded-lg">
                                  <div dangerouslySetInnerHTML={{ __html: cleanHtmlContent(audienceAnalysis.data.substring(0, 800)) }} />
                                  {audienceAnalysis.data.length > 800 && (
                                    <div className="mt-3 p-3 bg-gradient-to-r from-[#5843BD]/10 to-[#FF6633]/10 rounded-lg border-l-4 border-[#5843BD]">
                                      <p className="text-sm text-gray-600 italic">
                                        This is a preview of your complete audience analysis.
                                        Get the full detailed report with actionable insights and marketing strategies.
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}


                      {/* Action Buttons */}
                      <div className="flex flex-col md:flex-row gap-4 mt-8">
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div className="grid lg:grid-cols-2 items-center gap-16 mb-20">
            {/* Services Navigation */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-8">Choose Your Service</h3>
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className={`group relative cursor-pointer transition-all duration-500 ${activeService === service.id
                      ? 'scale-105'
                      : 'hover:scale-102'
                    }`}
                  onClick={() => setActiveService(service.id)}
                >
                  <div className={`relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 ${activeService === service.id
                      ? 'border-[#5843BD] shadow-2xl shadow-[#5843BD]/20'
                      : 'border-gray-200/50 hover:border-[#FF6633]/30 hover:shadow-xl'
                    }`}>
                    <div className="flex items-start gap-5">
                      <div className={`flex-shrink-0 p-4 rounded-xl bg-gradient-to-r ${service.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {service.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-xl font-bold mb-3 transition-colors duration-300 ${activeService === service.id ? 'text-[#5843BD]' : 'text-gray-800 group-hover:text-[#FF6633]'
                          }`}>
                          {service.title}
                        </h4>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {service.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {service.features.slice(0, 2).map((feature, featureIndex) => (
                            <span key={featureIndex} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                              {feature}
                            </span>
                          ))}
                          <span className="px-3 py-1 bg-[#5843BD]/10 text-[#5843BD] text-xs font-medium rounded-full">
                            +{service.features.length - 2} more
                          </span>
                        </div>
                      </div>
                    </div>
                    {activeService === service.id && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#5843BD] rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Service Details Panel */}
            <div className="relative">
              <div className="sticky top-8">
                {services.map((service) => (
                  activeService === service.id && (
                    <div key={service.id} className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-200/50 shadow-2xl">
                      <div className="text-center mb-8">
                        <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-r ${service.color} text-white mb-6 shadow-xl`}>
                          {service.icon}
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-4">{service.title}</h3>
                        <p className="text-lg text-gray-600 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                      <div className="space-y-4 mb-8">
                        <h4 className="text-xl font-bold text-gray-800">What's Included:</h4>
                        <div className="grid gap-3">
                          {service.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center shadow-md`}>
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="font-semibold text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button
                          className={`flex-1 py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r ${service.color} hover:shadow-xl transition-all duration-300 hover:scale-105`}
                          onClick={() => openBusinessRegister({ ref: refQuery, lg: lgQuery })}
                        >
                          Get Started Now
                        </button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Guarantee Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* 30-Day Hiring Guarantee */}
          <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-[#5843BD] to-[#4a3ba0] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">30-Day Hiring Guarantee</h3>
            <p className="text-gray-600 leading-relaxed">
              Get quality candidates within 30 days or receive a full refund. We're confident in our AI matching.
            </p>
          </div>

          {/* Enterprise Security */}
          <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-[#FF6633] to-[#e55a2b] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Enterprise Security</h3>
            <p className="text-gray-600 leading-relaxed">
              SOC 2 compliant with bank-level encryption. Trusted by growing businesses worldwide.
            </p>
          </div>

          {/* Free To Start */}
          <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-[#5843BD] to-[#4a3ba0] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Free To Start</h3>
            <p className="text-gray-600 leading-relaxed">
              Post your first job completely free. No credit card required to see how our AI works.
            </p>
          </div>
        </div>

        {/* Market Research & Business Planning CTA - Sophisticated Design */}
        <div className="relative bg-gradient-to-br from-[#5843BD] via-[#4a3ba0] to-[#3d2f85] rounded-[2rem] overflow-hidden shadow-2xl">
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
                <span className="hidden sm:inline">Premium Research Service</span>
                <span className="sm:hidden">Premium Service</span>
                <div className="px-2 py-1 md:px-3 bg-[#FF6633] rounded-full text-xs">97% Accuracy</div>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold md:font-black text-white mb-3 md:mb-4 lg:mb-6 leading-tight px-4">
                Market Research &<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF6633] to-white">
                  Business Planning
                </span>
              </h3>
              <p className="text-sm md:text-base lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
                Perfect for entrepreneurs and business owners validating ideas or seeking funding
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
                      Old Method
                    </div>
                    <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-3 md:mb-4 lg:mb-6">Traditional<br />Consultants</h4>
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
                        <span className="text-xs md:text-sm">Limited revisions</span>
                      </div>
                      <div className="flex items-start gap-2 md:gap-3 text-white/70">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-red-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs md:text-sm">Generic templates</span>
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

              {/* Moil AI Research */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6633] to-[#e55a2b] rounded-2xl md:rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity animate-pulse" style={{ animationDuration: '3s' }}></div>
                <div className="relative bg-gradient-to-br from-[#FF6633] to-[#e55a2b] rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-10 border-2 border-white/30 shadow-2xl h-full flex flex-col transform hover:scale-105 transition-all duration-300">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/20 rounded-full text-xs font-medium md:font-bold text-white mb-3 md:mb-4 lg:mb-6">
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      AI-Powered
                    </div>
                    <h4 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold md:font-black text-white mb-3 md:mb-4 lg:mb-6">Moil AI<br />Research</h4>
                    <div className="space-y-2 md:space-y-3 lg:space-y-4 mb-3 md:mb-4 lg:mb-6">
                      <div className="flex items-start gap-2 md:gap-3 text-white">
                        <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs md:text-sm font-medium md:font-semibold">Instant results in minutes</span>
                      </div>
                      <div className="flex items-start gap-2 md:gap-3 text-white">
                        <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs md:text-sm font-medium md:font-semibold">Unlimited revisions</span>
                      </div>
                      <div className="flex items-start gap-2 md:gap-3 text-white">
                        <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs md:text-sm font-medium md:font-semibold">Personalized insights</span>
                      </div>
                      <div className="flex items-start gap-2 md:gap-3 text-white">
                        <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs md:text-sm font-medium md:font-semibold">Investor-ready format</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 md:pt-4 lg:pt-6 border-t border-white/20">
                    <div className="flex items-baseline gap-2 mb-2 md:mb-3 lg:mb-4">
                      <div className="text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold md:font-black text-white">$15</div>
                      <div className="text-white/80 text-sm font-medium">/ month</div>
                    </div>
                    <button
                      className="w-full bg-white text-[#FF6633] py-3 px-4 md:py-4 lg:py-5 md:px-6 lg:px-8 rounded-xl md:rounded-2xl font-bold md:font-black text-sm md:text-base lg:text-lg hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105 flex items-center justify-center gap-2 md:gap-3 group"
                      onClick={() => window.open(buildBusinessUrl({ lg: lgQuery, ref: refQuery }), '_blank')}
                    >
                      <span className="text-xs md:text-sm font-medium">Get Your Market Research</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <p className="text-white/70 text-xs text-center mt-4">🔒 Secure payment • 30-day money-back guarantee</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Benefits - Enhanced Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="group relative">
                <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z" />
                    </svg>
                  </div>
                  <h5 className="text-white font-bold text-lg mb-3">Instant Analysis</h5>
                  <p className="text-white/80 text-sm leading-relaxed">Get comprehensive market research in minutes, not weeks</p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <h5 className="text-white font-bold text-lg mb-3">AI-Powered Insights</h5>
                  <p className="text-white/80 text-sm leading-relaxed">Advanced algorithms analyze thousands of data points</p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 2v6h4l-5 7V9H4l5-7zm11 11h-4l3 4.5V22h-3v-4.5l3-4.5z" />
                    </svg>
                  </div>
                  <h5 className="text-white font-bold text-lg mb-3">Investor Ready</h5>
                  <p className="text-white/80 text-sm leading-relaxed">Professional reports formatted for funding presentations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && modalContent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl h-[80vh] md:h-[75vh] overflow-y-scroll shadow-2xl mx-auto my-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800">{modalTitle}</h3>
              <button
                onClick={closeDetailModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: cleanHtmlContent(modalContent.data) }}
              />
            </div>

            <div className="p-6 cursor-pointer  flex justify-end border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleViewFullResults}
                className="bg-gradient-to-r from-[#5843BD] to-[#FF6633] text-white py-4 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Entire Business Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
