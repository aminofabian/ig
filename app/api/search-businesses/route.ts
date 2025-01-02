import { NextResponse } from 'next/server';

const RAPID_API_KEY = '175e40e8a2msh1b0a7544f3a19c0p16a088jsn14d59f4ca80a';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'Hotels in San Francisco, USA';

    const url = 'https://local-business-search.p.rapidapi.com/search';
    const params = new URLSearchParams({
      query: query,
      limit: '20',
      lat: '37.359428',
      lng: '-121.925337',
      zoom: '13',
      language: 'en',
      region: 'us',
      extract_emails_and_contacts: 'true'
    });

    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': 'local-business-search.p.rapidapi.com'
      },
      cache: 'no-store'
    });

    const data = await response.json();

    if (!data || data.error) {
      throw new Error(data?.error || 'Invalid response from API');
    }

    const transformedData = data.data.map((business: any) => ({
      ...business,
      owner_name: business.owner_name || null,
      email: business.email || 
             (business.emails && business.emails.length > 0 ? business.emails[0] : null)
    }));

    return NextResponse.json({
      status: 'success',
      data: transformedData,
      message: 'Data fetched successfully'
    });

  } catch (error) {
    const errorMessage = (error as Error).message || 'Failed to fetch data';
    console.error('API Error:', errorMessage);

    return NextResponse.json({ 
      status: 'error', 
      data: [], 
      message: errorMessage
    }, { 
      status: 500 
    });
  }
} 