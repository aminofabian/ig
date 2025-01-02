'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from "sonner";

interface ScenePrompt {
  mainScene: string;
  description: string;
  visualStyle: string;
  keyMoments: string[];
}

interface StoryboardResponse {
  frames: Array<{
    description: string;
    imageUrl: string;
  }>;
  prompt: string;
  productionNotes?: {
    equipment: string[];
    techniques: string[];
    challenges: string[];
    solutions: string[];
  };
  sequenceFlow?: {
    transitions: string[];
    pacing: string;
    visualContinuity: string;
  };
  visualStyle?: {
    colorScheme: string[];
    moodBoard: string[];
    styleGuide: string;
  };
}

export default function AIVideoPage() {
  const [loading, setLoading] = useState(false);
  const [scenePrompt, setScenePrompt] = useState<ScenePrompt>({
    mainScene: '',
    description: '',
    visualStyle: '',
    keyMoments: ['']
  });
  const [storyboard, setStoryboard] = useState<StoryboardResponse | null>(null);

  const addKeyMoment = () => {
    setScenePrompt(prev => ({
      ...prev,
      keyMoments: [...prev.keyMoments, '']
    }));
  };

  const removeKeyMoment = (index: number) => {
    setScenePrompt(prev => ({
      ...prev,
      keyMoments: prev.keyMoments.filter((_, i) => i !== index)
    }));
  };

  const updateKeyMoment = (index: number, value: string) => {
    setScenePrompt(prev => ({
      ...prev,
      keyMoments: prev.keyMoments.map((moment, i) => 
        i === index ? value : moment
      )
    }));
  };

  const handleGenerate = async () => {
    if (!scenePrompt.mainScene.trim()) {
      toast.error('Please enter a main scene');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ scenePrompts: scenePrompt })
      });

      const data = await response.json();
      console.log('Response data:', data); // For debugging

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.frames || !Array.isArray(data.frames)) {
        throw new Error('Invalid response format from API');
      }

      setStoryboard(data);
      toast.success('Storyboard generated successfully');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate storyboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full p-4 space-y-2">
      <div className="border-b border-neutral-800 pb-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">AI Video Generator</h2>
        <p className="text-sm text-neutral-400">
          Create cinematic storyboards using AI
        </p>
      </div>

      <div className="grid gap-6 mt-8">
        {/* Scene Input Form */}
        <div className="rounded-lg border border-neutral-800 p-4 space-y-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white">Main Scene</label>
              <Input
                placeholder="Epic mountain-top warrior scene"
                value={scenePrompt.mainScene}
                onChange={(e) => setScenePrompt(prev => ({ ...prev, mainScene: e.target.value }))}
                className="mt-2 bg-background text-slate-700"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white">Description</label>
              <Textarea
                placeholder="Opening sequence showing warrior's isolation"
                value={scenePrompt.description}
                onChange={(e) => setScenePrompt(prev => ({ ...prev, description: e.target.value }))}
                className="mt-2 bg-background text-slate-700"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white">Visual Style</label>
              <Input
                placeholder="High contrast, epic fantasy"
                value={scenePrompt.visualStyle}
                onChange={(e) => setScenePrompt(prev => ({ ...prev, visualStyle: e.target.value }))}
                className="mt-2 bg-background text-slate-700"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white">Key Moments</label>
              <div className="space-y-2 mt-2">
                {scenePrompt.keyMoments.map((moment, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Describe a key moment"
                      value={moment}
                      onChange={(e) => updateKeyMoment(index, e.target.value)}
                      className="bg-background text-slate-700"
                    />
                    {scenePrompt.keyMoments.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeKeyMoment(index)}
                        className="border-neutral-800 hover:bg-neutral-800/50"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addKeyMoment}
                  className="mt-2 border-neutral-800 hover:bg-neutral-800/50 text-slate-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Key Moment
                </Button>
              </div>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-[#f059da] hover:bg-[#f059da]/90 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Storyboard'
            )}
          </Button>
        </div>

        {/* Generated Storyboard */}
        {storyboard && (
          <div className="rounded-lg border border-neutral-800 p-4 space-y-4">
            <h3 className="text-lg font-semibold text-white">Generated Storyboard</h3>
            <p className="text-sm text-neutral-400">{storyboard.prompt}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {storyboard.frames.map((frame, index) => (
                <div key={index} className="space-y-2">
                  <img
                    src={frame.imageUrl}
                    alt={`Frame ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <p className="text-sm text-neutral-400">{frame.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 