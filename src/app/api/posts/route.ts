import { NextRequest, NextResponse } from 'next/server';
import { getPosts, createPost } from '@/lib/db';
import { generateImage, validatePrompt } from '@/lib/ai-client';
import { CreatePostData } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const userId = searchParams.get('userId');
    
    let posts;
    if (userId) {
      const { getPostsByUserId } = await import('@/lib/db');
      posts = getPostsByUserId(userId);
    } else {
      posts = getPosts(limit ? parseInt(limit) : undefined);
    }
    
    return NextResponse.json({
      success: true,
      posts,
      count: posts.length
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePostData = await request.json();
    const { prompt, caption, authorId, tags, systemPrompt } = body;
    
    // Validate required fields
    if (!prompt || !authorId) {
      return NextResponse.json(
        { success: false, error: 'Prompt and author ID are required' },
        { status: 400 }
      );
    }
    
    // Validate prompt
    const promptValidation = validatePrompt(prompt);
    if (!promptValidation.valid) {
      return NextResponse.json(
        { success: false, error: promptValidation.message },
        { status: 400 }
      );
    }
    
    // Generate AI image
    const imageResult = await generateImage({
      prompt,
      systemPrompt,
      model: 'replicate/black-forest-labs/flux-1.1-pro'
    });
    
    if (!imageResult.success) {
      return NextResponse.json(
        { success: false, error: `Image generation failed: ${imageResult.error}` },
        { status: 500 }
      );
    }
    
    // Create post in database
    const newPost = createPost(body, imageResult.imageUrl!);
    
    return NextResponse.json({
      success: true,
      post: newPost,
      generationMetadata: imageResult.metadata
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}