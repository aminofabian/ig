// app/api/instagram-contact/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  const apiKey = process.env.RAPIDAPI_CONTACT_KEY;
  const apiHost = process.env.RAPIDAPI_CONTACT_HOST;

  if (!apiKey || !apiHost) {
    console.error('Missing API configuration:', { apiKey: !!apiKey, apiHost: !!apiHost });
    return NextResponse.json(
      { error: 'API configuration is missing' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      'https://rocketapi-for-instagram.p.rapidapi.com/instagram/user/get_info',
      {
        method: 'POST',
        headers: {
          'x-rapidapi-host': 'rocketapi-for-instagram.p.rapidapi.com',
          'X-RapidAPI-Key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username
        }),
        cache: 'no-store'
      }
    );

    if (response.status === 401) {
      console.error('API Authorization failed - check your API key and host');
      return NextResponse.json(
        { error: 'API authorization failed. Please check your configuration.' },
        { status: 401 }
      );
    }

    if (response.status === 429) {
      console.error('Rate limit exceeded for Instagram API');
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a few minutes.' },
        { status: 429 }
      );
    }

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching Instagram data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram data. Please try again later.' },
      { status: 500 }
    );
  }
}