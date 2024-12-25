'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <Card className="w-full max-w-xl mx-auto">
      <CardContent className="p-6 space-y-4">
        <div className="flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your image prompt..."
            className="flex-1"
          />
          <Button 
            onClick={generateImage} 
            disabled={!prompt || loading}
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