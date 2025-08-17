export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  joinDate: string;
  followers: number;
  following: number;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

export interface Post {
  id: string;
  author: User;
  prompt: string;
  imageUrl: string;
  caption?: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  shares: number;
  tags: string[];
}

export interface AIGenerationRequest {
  prompt: string;
  model?: string;
  systemPrompt?: string;
}

export interface AIGenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  metadata?: {
    model: string;
    prompt: string;
    generationTime: number;
  };
}

export interface LikeAction {
  postId: string;
  userId: string;
  action: 'like' | 'unlike';
}

export interface ShareData {
  postId: string;
  userId: string;
  platform?: string;
}

export interface Database {
  users: User[];
  posts: Post[];
  comments: Comment[];
}

export interface CreatePostData {
  prompt: string;
  caption?: string;
  authorId: string;
  tags?: string[];
  systemPrompt?: string;
}

export interface CreateCommentData {
  postId: string;
  authorId: string;
  content: string;
  parentCommentId?: string;
}