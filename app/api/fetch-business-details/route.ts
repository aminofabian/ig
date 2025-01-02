import { NextResponse } from 'next/server';

const RAPID_API_KEY = '52655f1cfbmshc28794a26461c71p1a3967jsnc854ec10622d';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('business_id');
    
    if (!businessId) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
    }

    const url = 'https://local-business-data.p.rapidapi.com/business-details';
    const params = new URLSearchParams({
      business_id: businessId,
      extract_emails_and_contacts: 'true',
      extract_share_link: 'false',
      region: 'us',
      language: 'en'
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
    console.error('Error fetching business details:', error);
    return NextResponse.json({ error: 'Failed to fetch business details' }, { status: 500 });
  }
} 