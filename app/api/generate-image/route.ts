import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    const response = await fetch('https://api.getimg.ai/v1/flux-schnell/text-to-image', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GET_IMG_API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        negative_prompt: '',
        steps: 20,
        width: 512,
        height: 512,
        guidance_scale: 7.5,
        model_id: 'flux-schnell'
      })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}