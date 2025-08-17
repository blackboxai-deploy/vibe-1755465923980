import { AIGenerationRequest, AIGenerationResponse } from './types';

// Default system prompt for image generation
export const DEFAULT_SYSTEM_PROMPT = `You are an AI image generator. Create high-quality, visually appealing images based on the user's prompt. Focus on:
- Artistic composition and visual appeal
- Rich colors and lighting
- Creative interpretation of the prompt
- Professional quality output
- Safe for work content only

Generate a single image that best represents the user's request.`;

// AI Image Generation using custom endpoint (no API keys required)
export async function generateImage(request: AIGenerationRequest): Promise<AIGenerationResponse> {
  const startTime = Date.now();
  
  try {
    const model = request.model || 'replicate/black-forest-labs/flux-1.1-pro';
    const systemPrompt = request.systemPrompt || DEFAULT_SYSTEM_PROMPT;
    
    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': 'cus_SGPn4uhjPI0F4w',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: request.prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const generationTime = Date.now() - startTime;

    // Extract image URL from response
    let imageUrl = '';
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const content = data.choices[0].message.content;
      
      // Try to extract URL from the response
      const urlMatch = content.match(/https?:\/\/[^\s\)]+\.(jpg|jpeg|png|gif|webp)/i);
      if (urlMatch) {
        imageUrl = urlMatch[0];
      } else if (content.includes('http')) {
        // Fallback: look for any http URL
        const anyUrlMatch = content.match(/https?:\/\/[^\s\)]+/i);
        if (anyUrlMatch) {
          imageUrl = anyUrlMatch[0];
        }
      }
    }

    if (!imageUrl) {
      throw new Error('No image URL found in response');
    }

    return {
      success: true,
      imageUrl,
      metadata: {
        model,
        prompt: request.prompt,
        generationTime
      }
    };

  } catch (error) {
    console.error('Image generation failed:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      metadata: {
        model: request.model || 'replicate/black-forest-labs/flux-1.1-pro',
        prompt: request.prompt,
        generationTime: Date.now() - startTime
      }
    };
  }
}

// Test connection to AI service
export async function testAIConnection(): Promise<boolean> {
  try {
    const testResult = await generateImage({
      prompt: 'A simple test image of a blue circle'
    });
    
    return testResult.success;
  } catch (error) {
    console.error('AI connection test failed:', error);
    return false;
  }
}

// Get available models (for future expansion)
export const AVAILABLE_MODELS = [
  {
    id: 'replicate/black-forest-labs/flux-1.1-pro',
    name: 'FLUX 1.1 Pro',
    description: 'High-quality image generation with excellent detail',
    provider: 'Replicate'
  }
];

// Validate prompt for safety and quality
export function validatePrompt(prompt: string): { valid: boolean; message?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { valid: false, message: 'Prompt cannot be empty' };
  }
  
  if (prompt.length < 3) {
    return { valid: false, message: 'Prompt must be at least 3 characters long' };
  }
  
  if (prompt.length > 1000) {
    return { valid: false, message: 'Prompt must be less than 1000 characters' };
  }
  
  // Basic content filtering
  const inappropriateWords = ['violent', 'nsfw', 'explicit', 'gore', 'harmful'];
  const lowerPrompt = prompt.toLowerCase();
  
  for (const word of inappropriateWords) {
    if (lowerPrompt.includes(word)) {
      return { valid: false, message: 'Prompt contains inappropriate content' };
    }
  }
  
  return { valid: true };
}