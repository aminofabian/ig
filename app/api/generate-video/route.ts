import { NextResponse } from 'next/server';

const RAPID_API_KEY = '175e40e8a2msh1b0a7544f3a19c0p16a088jsn14d59f4ca80a';

export async function POST(request: Request) {
  try {
    const { scenePrompts } = await request.json();

    // Create the request body in the exact format the API expects
    const requestBody = {
      scenePrompts: {
        mainScene: scenePrompts.mainScene,
        description: scenePrompts.description,
        visualStyle: scenePrompts.visualStyle,
        keyMoments: scenePrompts.keyMoments.filter((moment: string) => moment.trim() !== '')
      }
    };

    const url = 'https://openai-sora-ai-video-prompt-generator-cinematic-api.p.rapidapi.com/generateStoryboard';
    const params = new URLSearchParams({
      style: 'detailed',
      frames: '8',
      language: 'en',
      noqueue: '1'
    });

    const response = await fetch(`${url}?${params}`, {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': 'openai-sora-ai-video-prompt-generator-cinematic-api.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    console.log('Request Body:', requestBody);
    console.log('API Response:', data);

    if (!response.ok || data.status === 'error') {
      throw new Error(data.message || 'Failed to generate storyboard');
    }

    // Transform the data to match our expected format
    const transformedData = {
      frames: data.result?.storyboardFrames?.map((frame: any, index: number) => ({
        description: frame.description || frame.action || `Frame ${index + 1}`,
        imageUrl: frame.imageUrl || frame.url || ''
      })) || [],
      prompt: `${scenePrompts.mainScene} - ${scenePrompts.description}`,
      productionNotes: data.result?.productionNotes || null,
      sequenceFlow: data.result?.sequenceFlow || null,
      visualStyle: data.result?.visualStyle || null
    };

    // Add debug logging
    console.log('Transformed Data:', transformedData);

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate storyboard' },
      { status: 500 }
    );
  }
} 