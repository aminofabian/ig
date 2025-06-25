'use server';

export async function generateHashtagsAction(input: string) {
  if (!input) {
    throw new Error('Input is required');
  }

  try {
    // const response = await fetch('https://open-ai21.p.rapidapi.com/claude3', {
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
            content: `Generate relevant hashtags for the following content. Return only hashtags separated by spaces, no explanations or other text: ${input}`
          }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      console.error('API Response:', await response.text());
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    
    // Extract hashtags from the result property
    const hashtagContent = data.result || '';
    return { hashtags: hashtagContent };
    
  } catch (error) {
    console.error('Error in generateHashtagsAction:', error);
    throw new Error('Failed to generate hashtags');
  }
}
