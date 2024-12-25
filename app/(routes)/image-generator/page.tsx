'use client'
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const MAX_CHARS = 1000;

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_CHARS) {
      setPrompt(e.target.value);
    }
  };

  const generateImage = async () => {
    setLoading(true);
    setError('');

    try {
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
      if (data.image) {
        setImage(`data:image/png;base64,${data.image}`);
      } else {
        setError('Failed to generate image');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError('Error generating image: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto bg-black">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Textarea
            value={prompt}
            onChange={handlePromptChange}
            placeholder="Enter your image prompt..."
            className="min-h-[200px] text-white bg-gray-900 border-gray-700"
          />
          <div className="text-right text-sm text-gray-400">
            {prompt.length}/{MAX_CHARS} characters
          </div>
          <Button 
            onClick={generateImage} 
            disabled={!prompt || loading}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Generate'
            )}
          </Button>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        {image && (
          <div className="mt-4">
            <img src={image} alt="Generated" className="w-full rounded-lg" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageGenerator;