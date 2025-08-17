'use client';

import { useState } from 'react';
import { Post } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LikeButton from './LikeButton';
import ShareButton from './ShareButton';
import CommentSection from './CommentSection';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
  currentUserId: string;
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="mb-6 overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <CardContent className="p-6">
        <div className="flex items-start space-x-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.author.avatar} alt={post.author.displayName} />
            <AvatarFallback>{post.author.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <Link href={`/profile/${post.author.username}`}>
              <h3 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                {post.author.displayName}
              </h3>
            </Link>
            <p className="text-sm text-gray-500">@{post.author.username}</p>
            <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {/* Caption */}
        {post.caption && (
          <p className="text-gray-800 mb-4 leading-relaxed">{post.caption}</p>
        )}

        {/* Prompt */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-purple-500">
          <p className="text-sm text-gray-600 mb-1 font-medium">AI Prompt:</p>
          <p className="text-gray-800 italic">&quot;{post.prompt}&quot;</p>
        </div>

        {/* Image */}
        <div className="relative mb-4 rounded-lg overflow-hidden bg-gray-100">
          {!imageLoaded && !imageError && (
            <div className="aspect-square flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          )}
          
          {imageError ? (
            <div className="aspect-square flex items-center justify-center bg-gray-200">
              <div className="text-center text-gray-500">
                <div className="text-2xl mb-2">🖼️</div>
                <p className="text-sm">Image failed to load</p>
              </div>
            </div>
          ) : (
            <img
              src={post.imageUrl}
              alt={post.prompt}
              className={`w-full h-auto object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
            />
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <LikeButton
              postId={post.id}
              initialLikes={post.likes}
              initialLiked={post.likedBy.includes(currentUserId)}
              currentUserId={currentUserId}
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="text-gray-600 hover:text-gray-800 p-2"
            >
              <span className="text-lg mr-2">💬</span>
              <span className="text-sm font-medium">{post.comments.length}</span>
            </Button>
            
            <ShareButton post={post} />
          </div>
          
          <Link href={`/post/${post.id}`}>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
              View Post
            </Button>
          </Link>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <CommentSection
              postId={post.id}
              comments={post.comments}
              currentUserId={currentUserId}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}