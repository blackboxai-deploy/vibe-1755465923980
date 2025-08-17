'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Post } from '@/lib/types';

interface ShareButtonProps {
  post: Post;
}

export default function ShareButton({ post }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleShare = async () => {
    if (isSharing) return;

    setIsSharing(true);

    try {
      const shareUrl = `${window.location.origin}/post/${post.id}`;
      const shareText = `Check out this amazing AI-generated artwork: "${post.prompt}" by @${post.author.username}`;

      // Try native Web Share API first
      if (navigator.share) {
        await navigator.share({
          title: 'AI Art Social - Amazing AI Creation',
          text: shareText,
          url: shareUrl,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      
      // Fallback: try to copy to clipboard
      try {
        const shareUrl = `${window.location.origin}/post/${post.id}`;
        const shareText = `Check out this AI artwork: "${post.prompt}" ${shareUrl}`;
        await navigator.clipboard.writeText(shareText);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } catch (clipboardError) {
        console.error('Clipboard also failed:', clipboardError);
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        disabled={isSharing}
        className="text-gray-600 hover:text-gray-800 p-2"
      >
        <span className="text-lg mr-2">🔗</span>
        <span className="text-sm font-medium">Share</span>
      </Button>
      
      {showSuccess && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}