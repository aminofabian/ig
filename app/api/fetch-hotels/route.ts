import { NextResponse } from 'next/server';

const RAPID_API_KEY = '52655f1cfbmshc28794a26461c71p1a3967jsnc854ec10622d';

export async function GET() {
  try {
    const url = 'https://local-business-data.p.rapidapi.com/search';
    const params = new URLSearchParams({
      query: 'Hotels in San Francisco, USA',
      limit: '100',
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
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': 'local-business-data.p.rapidapi.com'
      }
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching hotel data:', error);
    return NextResponse.json({ error: 'Failed to fetch hotel data' }, { status: 500 });
  }
} 