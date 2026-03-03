import { NextRequest, NextResponse } from 'next/server';
import { generateBusinessModel } from '../../../../src/legacy/utils/geminiApi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessName, services, city, targetMarket } = body;

    // Validate required fields
    if (!businessName || !services || !city || !targetMarket) {
      return NextResponse.json(
        { error: 'Missing required fields: businessName, services, city, targetMarket' },
        { status: 400 }
      );
    }

    // Generate business model using Gemini AI
    const result = await generateBusinessModel({
      businessName,
      services,
      city,
      targetMarket
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
      services: result.services,
      city: result.city,
      message: 'Business model generated successfully'
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
