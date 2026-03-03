import { NextRequest, NextResponse } from 'next/server';
import { generateBusinessPlan } from '../../../../src/legacy/utils/geminiApi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessName, industry, budget, timeline } = body;

    // Validate required fields
    if (!businessName || !industry || !budget || !timeline) {
      return NextResponse.json(
        { error: 'Missing required fields: businessName, industry, budget, timeline' },
        { status: 400 }
      );
    }

    // Generate business plan using Gemini AI
    const result = await generateBusinessPlan({
      businessName,
      industry,
      budget,
      timeline
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
      budget: result.budget,
      message: 'Business plan generated successfully'
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
