'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { DEFAULT_SYSTEM_PROMPT } from '@/lib/ai-client';

interface CreatePostProps {
  currentUserId: string;
  onPostCreated?: () => void;
}

export default function CreatePost({ currentUserId, onPostCreated }: CreatePostProps) {
  const [prompt, setPrompt] = useState('');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for image generation');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          systemPrompt: showAdvanced ? systemPrompt : DEFAULT_SYSTEM_PROMPT,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      
      if (data.success) {
        setGeneratedImage(data.imageUrl);
      } else {
        throw new Error(data.error || 'Image generation failed');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreatePost = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsPosting(true);
    setError(null);

    try {
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          caption: caption.trim() || undefined,
          authorId: currentUserId,
          tags: tagsArray.length > 0 ? tagsArray : undefined,
          systemPrompt: showAdvanced ? systemPrompt : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data = await response.json();
      
      if (data.success) {
        // Reset form
        setPrompt('');
        setCaption('');
        setTags('');
        setGeneratedImage(null);
        setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
        setShowAdvanced(false);
        
        // Notify parent component
        if (onPostCreated) {
          onPostCreated();
        }
        
        // Redirect to feed
        window.location.href = '/';
      } else {
        throw new Error(data.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error instanceof Error ? error.message : 'Failed to create post');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Create AI Artwork
          </CardTitle>
          <p className="text-gray-600">Generate stunning images with AI and share them with the community</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-sm font-medium">
              AI Prompt <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create... (e.g., 'A majestic dragon flying over a mystical forest at sunset')"
              rows={4}
              maxLength={1000}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">{prompt.length}/1000 characters</p>
          </div>

          {/* Caption Input */}
          <div className="space-y-2">
            <Label htmlFor="caption" className="text-sm font-medium">Caption (Optional)</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption to describe your creation or share your thoughts..."
              rows={3}
              maxLength={500}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">{caption.length}/500 characters</p>
          </div>

          {/* Tags Input */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium">Tags (Optional)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="nature, fantasy, digital art (separate with commas)"
            />
            <p className="text-xs text-gray-500">Separate tags with commas</p>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
            </Button>

            {showAdvanced && (
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <Label htmlFor="systemPrompt" className="text-sm font-medium">
                  System Prompt (Customize AI Behavior)
                </Label>
                <Textarea
                  id="systemPrompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={6}
                  className="resize-none text-xs"
                />
                <p className="text-xs text-gray-500">
                  Modify this to change how the AI interprets your prompts
                </p>
              </div>
            )}
          </div>

          {/* Preview Image */}
          {generatedImage && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Preview</Label>
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={generatedImage}
                  alt="Generated preview"
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleGenerateImage}
              disabled={isGenerating || !prompt.trim()}
              variant="outline"
              className="flex-1"
            >
              {isGenerating ? 'Generating...' : 'Preview Image'}
            </Button>
            
            <Button
              onClick={handleCreatePost}
              disabled={isPosting || !prompt.trim()}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {isPosting ? 'Creating...' : 'Create Post'}
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>💡 <strong>Tip:</strong> Be specific in your prompts for better results</p>
            <p>🎨 <strong>Examples:</strong> "Oil painting of", "Digital art style", "Photorealistic"</p>
            <p>⚡ <strong>Note:</strong> Image generation may take 30-60 seconds</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}