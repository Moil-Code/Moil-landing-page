import { NextRequest, NextResponse } from 'next/server';
import { generateFinancialProjections } from '../../../../src/legacy/utils/geminiApi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessName, industry, location, budget, targetRevenue } = body;

    if (!businessName || !industry || !location || !budget || !targetRevenue) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await generateFinancialProjections({
      businessName,
      industry,
      location,
      budget,
      targetRevenue
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
