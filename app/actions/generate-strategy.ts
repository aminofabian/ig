'use server';

export async function generateStrategyAction(input: {
  businessName: string;
  businessDescription: string;
  targetAudience: string;
  goals: string;
}) {
  if (!input.businessName || !input.businessDescription || !input.targetAudience || !input.goals) {
    throw new Error('All fields are required');
  }

  try {
    const response = await fetch('https://open-ai21.p.rapidapi.com/claude3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': process.env.RAPIDAPI_AI_KEY!,
        'x-rapidapi-host': 'open-ai21.p.rapidapi.com'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: `Create a detailed Instagram marketing strategy for the following business:
            
Business Name: ${input.businessName}
Business Description: ${input.businessDescription}
Target Audience: ${input.targetAudience}
Business Goals: ${input.goals}

Please provide a comprehensive strategy that includes:
1. Content Pillars (3-5 main themes)
2. Post Types and Format Mix (e.g., Reels, Carousels, Stories)
3. Posting Schedule
4. Engagement Strategy
5. Growth Tactics
6. Key Performance Metrics to Track

Format the response in markdown with clear sections and bullet points.`
          }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      console.error('API Response:', await response.text());
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    
    // Extract strategy from the result property
    const strategyContent = data.result || '';
    return { strategy: strategyContent };
    
  } catch (error) {
    console.error('Error in generateStrategyAction:', error);
    throw new Error('Failed to generate strategy');
  }
} 