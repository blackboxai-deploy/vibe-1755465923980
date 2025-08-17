import { NextRequest, NextResponse } from 'next/server';
import { toggleLike } from '@/lib/db';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: postId } = await params;
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const result = toggleLike(postId, userId);
    
    return NextResponse.json({
      success: true,
      liked: result.liked,
      likesCount: result.likesCount
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    
    if (error instanceof Error && error.message === 'Post not found') {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}