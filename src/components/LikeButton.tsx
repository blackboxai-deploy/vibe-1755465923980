'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initialLiked: boolean;
  currentUserId: string;
}

export default function LikeButton({ 
  postId, 
  initialLikes, 
  initialLiked, 
  currentUserId 
}: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (isLoading) return;

    // Optimistic update
    const newLiked = !isLiked;
    const newLikes = newLiked ? likes + 1 : likes - 1;
    
    setIsLiked(newLiked);
    setLikes(newLikes);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const data = await response.json();
      
      if (data.success) {
        setIsLiked(data.liked);
        setLikes(data.likesCount);
      } else {
        throw new Error(data.error || 'Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Revert optimistic update on error
      setIsLiked(!newLiked);
      setLikes(newLiked ? likes - 1 : likes + 1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={isLoading}
      className={`p-2 transition-colors ${
        isLiked 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-600 hover:text-red-500'
      }`}
    >
      <span className={`text-lg mr-2 transition-transform ${isLoading ? 'scale-110' : ''}`}>
        {isLiked ? '❤️' : '🤍'}
      </span>
      <span className="text-sm font-medium">{likes}</span>
    </Button>
  );
}