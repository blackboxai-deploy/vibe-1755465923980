import { NextRequest, NextResponse } from 'next/server';
import { addComment, getCommentsByPostId } from '@/lib/db';
import { CreateCommentData } from '@/lib/types';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: postId } = await params;
    const comments = getCommentsByPostId(postId);
    
    return NextResponse.json({
      success: true,
      comments,
      count: comments.length
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: postId } = await params;
    const body: Omit<CreateCommentData, 'postId'> = await request.json();
    
    if (!body.content || !body.authorId) {
      return NextResponse.json(
        { success: false, error: 'Content and author ID are required' },
        { status: 400 }
      );
    }
    
    if (body.content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Comment cannot be empty' },
        { status: 400 }
      );
    }
    
    if (body.content.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Comment must be less than 500 characters' },
        { status: 400 }
      );
    }
    
    const commentData: CreateCommentData = {
      ...body,
      postId
    };
    
    const newComment = addComment(commentData);
    
    return NextResponse.json({
      success: true,
      comment: newComment
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating comment:', error);
    
    if (error instanceof Error && (error.message === 'Post not found' || error.message === 'Author not found')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}