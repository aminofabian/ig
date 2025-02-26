// app/api/instagram/fetch-all/route.ts
import { NextResponse } from 'next/server';
import { fetchAllHashtagPosts } from '../../lib/instagram';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hashtag = searchParams.get('hashtag');
    
    if (!hashtag) {
      return NextResponse.json({ error: 'Hashtag parameter is required' }, { status: 400 });
    }
    
    const result = await fetchAllHashtagPosts(hashtag);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in fetch-all API route:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }, { status: 500 });
  }
}