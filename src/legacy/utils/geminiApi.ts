import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY_2 || '');

export interface BusinessModelRequest {
  businessName: string;
  services: string;
  city: string;
  targetMarket: string;
}

export interface MarketResearchRequest {
  businessType: string;
  location: string;
  targetAudience: string;
}

export interface CompetitorAnalysisRequest {
  businessName: string;
  industry: string;
  location: string;
}

export interface BusinessPlanRequest {
  businessName: string;
  industry: string;
  budget: string;
  timeline: string;
}

export interface FinancialProjectionRequest {
  businessName: string;
  industry: string;
  location: string;
  budget: string;
  targetRevenue: string;
}

export interface AudienceAnalysisRequest {
  businessType: string;
  location: string;
  industry: string;
}

// Business Model Canvas Generator
export async function generateBusinessModel(data: BusinessModelRequest) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `
  Generate a concise and persuasive Business Model Canvas for "${data.businessName}", offering ${data.services} in ${data.city}, targeting ${data.targetMarket}.
 
The output must:
- Be concise (under 600 characters)
- Focus on business growth, innovation, and clear ROI
- Highlight the value of complete market research as a differentiator
- Sound credible and conversion-oriented, not generic
 
Return ONLY beautifully formatted HTML (Tailwind CSS) structured like this:
 
<div class="space-y-4">
<div><h3 class="font-bold text-gray-800 mb-2">Value Proposition</h3>
<p class="text-sm text-gray-700">Show how complete market research and AI insights help clients reduce risk, identify growth opportunities, and outperform competitors.</p></div>
 
  <div><h3 class="font-bold text-gray-800 mb-2">Revenue Model</h3>
<p class="text-sm text-gray-700">Mention flexible pricing (subscription or project-based) and how insights lead to measurable revenue increases.</p></div>
 
  <div><h3 class="font-bold text-gray-800 mb-2">Key Activities</h3>
<p class="text-sm text-gray-700">Focus on AI-driven research, data validation, and strategic planning for clients seeking fast, evidence-based growth.</p></div>
 
  <div><h3 class="font-bold text-gray-800 mb-2">Partnerships</h3>
<p class="text-sm text-gray-700">Highlight collaborations with local research firms, tech providers, and business consultants in ${data.city} to enhance client outcomes.</p></div>
</div>
 
Return ONLY the HTML (no explanations).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return {
      success: true,
      data: response.text(),
      businessName: data.businessName,
      services: data.services,
      city: data.city
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      success: false,
      error: 'Failed to generate business model. Please try again.',
      data: null
    };
  }
}

// Market Research Generator
export async function generateMarketResearch(data: MarketResearchRequest) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `
    Provide concise market research for a ${data.businessType} business in ${data.location} targeting ${data.targetAudience}.
    
    Return ONLY beautifully formatted HTML (maximum 600 characters):
    
    <div class="space-y-4">
      <div><h3 class="font-bold text-gray-800 mb-2">Market Size</h3><p class="text-sm text-gray-700">Estimated value and potential</p></div>
      <div><h3 class="font-bold text-gray-800 mb-2">Demographics</h3><p class="text-sm text-gray-700">Key customer traits</p></div>
      <div><h3 class="font-bold text-gray-800 mb-2">Growth</h3><p class="text-sm text-gray-700">Market trends and rate</p></div>
      <div><h3 class="font-bold text-gray-800 mb-2">Opportunities</h3><p class="text-sm text-gray-700">2-3 actionable insights</p></div>
    </div>
    
    Return ONLY the HTML with Tailwind CSS classes. Keep it brief and data-driven.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return {
      success: true,
      data: response.text(),
      businessType: data.businessType,
      location: data.location
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      success: false,
      error: 'Failed to generate market research. Please try again.',
      data: null
    };
  }
}

// Competitor Analysis Generator
export async function generateCompetitorAnalysis(data: CompetitorAnalysisRequest) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `
    Analyze competitors for "${data.businessName}" in ${data.industry} industry, ${data.location}.
    
    Return ONLY beautifully formatted HTML (maximum 600 characters):
    
    <div class="space-y-4">
      <div><h3 class="font-bold text-gray-800 mb-2">Main Competitors</h3><p class="text-sm text-gray-700">2-3 key players</p></div>
      <div><h3 class="font-bold text-gray-800 mb-2">Your Advantages</h3><p class="text-sm text-gray-700">Potential differentiators</p></div>
      <div><h3 class="font-bold text-gray-800 mb-2">Market Gaps</h3><p class="text-sm text-gray-700">Unaddressed opportunities</p></div>
      <div><h3 class="font-bold text-gray-800 mb-2">Strategy</h3><p class="text-sm text-gray-700">Recommended positioning</p></div>
    </div>
    
    Return ONLY the HTML with Tailwind CSS classes. Keep it concise and actionable.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return {
      success: true,
      data: response.text(),
      businessName: data.businessName,
      industry: data.industry
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      success: false,
      error: 'Failed to generate competitor analysis. Please try again.',
      data: null
    };
  }
}

// Business Plan Generator
export async function generateBusinessPlan(data: BusinessPlanRequest) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `
    Create a concise business plan for "${data.businessName}" in ${data.industry} with ${data.budget} budget over ${data.timeline}.
    
    Return ONLY beautifully formatted HTML (maximum 600 characters):
    
    <div class="space-y-4">
      <div><h3 class="font-bold text-gray-800 mb-2">Concept</h3><p class="text-sm text-gray-700">Business goals and vision</p></div>
      <div><h3 class="font-bold text-gray-800 mb-2">Strategy</h3><p class="text-sm text-gray-700">Customer acquisition approach</p></div>
      <div><h3 class="font-bold text-gray-800 mb-2">Financials</h3><p class="text-sm text-gray-700">Revenue and cost estimates</p></div>
      <div><h3 class="font-bold text-gray-800 mb-2">Next Steps</h3><p class="text-sm text-gray-700">Immediate actions</p></div>
    </div>
    
    Return ONLY the HTML with Tailwind CSS classes. Keep it practical and focused.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return {
      success: true,
      data: response.text(),
      businessName: data.businessName,
      industry: data.industry,
      budget: data.budget
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      success: false,
      error: 'Failed to generate business plan. Please try again.',
      data: null
    };
  }
}

// Financial Projections Generator
export async function generateFinancialProjections(data: FinancialProjectionRequest) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `
    Generate realistic financial projections for "${data.businessName}" in ${data.industry} industry, located in ${data.location}, with a ${data.budget} budget targeting ${data.targetRevenue} revenue.
    
    Provide ONLY these specific metrics in JSON format:
    {
      "year1Revenue": "amount in K format (e.g., 180K)",
      "breakEvenMonth": "month number (e.g., 9)",
      "roiYear1": "percentage (e.g., 24)",
      "monthlyGrowth": "percentage (e.g., 8)",
      "initialCosts": "amount in K format (e.g., 45K)",
      "profitMargin": "percentage (e.g., 32)"
    }
    
    Base projections on industry standards and location market conditions. Be realistic and conservative.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    try {
      const jsonData = JSON.parse(response.text());
      return {
        success: true,
        data: jsonData,
        businessName: data.businessName,
        industry: data.industry,
        location: data.location
      };
    } catch (parseError) {
      // Fallback with default values if JSON parsing fails
      return {
        success: true,
        data: {
          year1Revenue: "180K",
          breakEvenMonth: "9",
          roiYear1: "24",
          monthlyGrowth: "8",
          initialCosts: "45K",
          profitMargin: "32"
        },
        businessName: data.businessName,
        industry: data.industry,
        location: data.location
      };
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      success: false,
      error: 'Failed to generate financial projections. Please try again.',
      data: null
    };
  }
}

// Audience Analysis Generator
export async function generateAudienceAnalysis(data: AudienceAnalysisRequest) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `
    Analyze target audience for ${data.businessType} business in ${data.location}, ${data.industry} industry.
    
    Return ONLY beautifully formatted HTML (maximum 600 characters):
    
    <div class="space-y-4">
      <div><h3 class="font-bold text-gray-800 mb-2">Demographics</h3><p class="text-sm text-gray-700">Age, income, lifestyle</p></div>
      <div><h3 class="font-bold text-gray-800 mb-2">Behavior</h3><p class="text-sm text-gray-700">Shopping patterns and preferences</p></div>
      <div><h3 class="font-bold text-gray-800 mb-2">Market Size</h3><p class="text-sm text-gray-700">Local potential and growth</p></div>
      <div><h3 class="font-bold text-gray-800 mb-2">Strategy</h3><p class="text-sm text-gray-700">Best engagement channels</p></div>
    </div>
    
    Return ONLY the HTML with Tailwind CSS classes. Keep it practical and actionable.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return {
      success: true,
      data: response.text(),
      businessType: data.businessType,
      location: data.location,
      industry: data.industry
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      success: false,
      error: 'Failed to generate audience analysis. Please try again.',
      data: null
    };
  }
}
