import { NextResponse } from 'next/server';

const RAPID_API_KEY = '52655f1cfbmshc28794a26461c71p1a3967jsnc854ec10622d';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('query') || 'Hotels in San Francisco, USA';
    const lat = searchParams.get('lat') || '37.359428';
    const lng = searchParams.get('lng') || '-121.925337';
    
    const url = 'https://local-business-data.p.rapidapi.com/search';
    const params = new URLSearchParams({
      query: searchQuery,
      limit: '100',
      lat: lat,
      lng: lng,
      zoom: '13',
      language: 'en',
      region: 'us',
      extract_emails_and_contacts: 'true'
    });

    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': 'local-business-data.p.rapidapi.com'
      }
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching business data:', error);
    return NextResponse.json({ error: 'Failed to fetch business data' }, { status: 500 });
  }
} 