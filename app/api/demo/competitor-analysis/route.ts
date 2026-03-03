import { NextRequest, NextResponse } from 'next/server';
import { generateCompetitorAnalysis } from '../../../../src/legacy/utils/geminiApi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessName, industry, location } = body;

    // Validate required fields
    if (!businessName || !industry || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: businessName, industry, location' },
        { status: 400 }
      );
    }

    // Generate competitor analysis using Gemini AI
    const result = await generateCompetitorAnalysis({
      businessName,
      industry,
      location
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      businessName: result.businessName,
      industry: result.industry,
      message: 'Competitor analysis generated successfully'
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
