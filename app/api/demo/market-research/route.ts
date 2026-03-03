import { NextRequest, NextResponse } from 'next/server';
import { generateMarketResearch } from '../../../../src/legacy/utils/geminiApi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessType, location, targetAudience } = body;

    // Validate required fields
    if (!businessType || !location || !targetAudience) {
      return NextResponse.json(
        { error: 'Missing required fields: businessType, location, targetAudience' },
        { status: 400 }
      );
    }

    // Generate market research using Gemini AI
    const result = await generateMarketResearch({
      businessType,
      location,
      targetAudience
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
      businessType: result.businessType,
      location: result.location,
      message: 'Market research generated successfully'
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
