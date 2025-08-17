import { NextRequest, NextResponse } from 'next/server';
import { generateImage, validatePrompt, DEFAULT_SYSTEM_PROMPT } from '@/lib/ai-client';
import { AIGenerationRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: AIGenerationRequest = await request.json();
    const { prompt, model, systemPrompt } = body;
    
    // Validate prompt
    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }
    
    const promptValidation = validatePrompt(prompt);
    if (!promptValidation.valid) {
      return NextResponse.json(
        { success: false, error: promptValidation.message },
        { status: 400 }
      );
    }
    
    // Generate image
    const result = await generateImage({
      prompt,
      model: model || 'replicate/black-forest-labs/flux-1.1-pro',
      systemPrompt: systemPrompt || DEFAULT_SYSTEM_PROMPT
    });
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      metadata: result.metadata
    });
    
  } catch (error) {
    console.error('Error in image generation endpoint:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    availableModels: [
      {
        id: 'replicate/black-forest-labs/flux-1.1-pro',
        name: 'FLUX 1.1 Pro',
        description: 'High-quality image generation with excellent detail'
      }
    ],
    defaultSystemPrompt: DEFAULT_SYSTEM_PROMPT,
    endpoint: '/api/generate-image',
    methods: ['POST']
  });
}