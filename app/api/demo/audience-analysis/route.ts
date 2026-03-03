import { NextRequest, NextResponse } from 'next/server';
import { generateAudienceAnalysis } from '../../../../src/legacy/utils/geminiApi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessType, location, industry } = body;

    if (!businessType || !location || !industry) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await generateAudienceAnalysis({
      businessType,
      location,
      industry
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
