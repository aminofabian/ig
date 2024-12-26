// app/api/generate-image/route.ts
import { NextResponse } from 'next/server';

// Add route configuration
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// Add CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Add OPTIONS handler for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    const data = {
      jsonBody: {
        function_name: 'image_generator',
        type: 'image_generation',
        query: prompt,
        output_type: 'png'
      }
    };

    console.log('Making request to RapidAPI with prompt:', prompt);

    const response = await fetch('https://ai-image-generator14.p.rapidapi.com/', {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_IMAGE_GENERATOR_KEY || '',
        'X-RapidAPI-Host': 'ai-image-generator14.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return NextResponse.json({ 
        error: `API Error: ${response.status} - ${errorText}` 
      }, { 
        status: response.status,
        headers: corsHeaders 
      });
    }

    const responseData = await response.json();
    console.log('Successful API Response:', responseData);
    
    // Return response with CORS headers
    return NextResponse.json(responseData, { headers: corsHeaders });
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate image' 
    }, { 
      status: 500,
      headers: corsHeaders 
    });
  }
}

