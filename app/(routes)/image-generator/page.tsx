// components/ImageGenerator.tsx
'use client';

import { useState } from 'react';
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
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    setImage(''); // Clear previous image

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }
      
      if (data.message?.status === 'success' && data.message.output_png) {
        setImage(data.message.output_png);
      } else {
        setError('Failed to generate image. Please try again.');
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
            placeholder="Describe the image you want to generate..."
            className="min-h-[200px] text-white bg-gray-900 border-gray-700 placeholder:font-italic"
          />
          <div className="text-right text-sm text-gray-400">
            {prompt.length}/{MAX_CHARS} characters
          </div>
          <Button
            onClick={generateImage}
            disabled={!prompt.trim() || loading}
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
            <img 
              src={image} 
              alt="Generated" 
              className="w-full rounded-lg"
              onError={() => setError('Failed to load the generated image')}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageGenerator;
