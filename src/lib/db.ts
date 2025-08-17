import fs from 'fs';
import path from 'path';
import { Database, User, Post, Comment, CreatePostData, CreateCommentData } from './types';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Initialize database with sample data
const initDB = (): Database => {
  const sampleUsers: User[] = [
    {
      id: '1',
      username: 'artcreator',
      displayName: 'Art Creator',
      avatar: 'https://placehold.co/100x100?text=AC',
      bio: 'AI art enthusiast creating stunning visuals',
      joinDate: '2024-01-15',
      followers: 1250,
      following: 350
    },
    {
      id: '2',
      username: 'digitalartist',
      displayName: 'Digital Artist',
      avatar: 'https://placehold.co/100x100?text=DA',
      bio: 'Exploring the boundaries of AI-generated art',
      joinDate: '2024-02-10',
      followers: 890,
      following: 420
    },
    {
      id: '3',
      username: 'promptmaster',
      displayName: 'Prompt Master',
      avatar: 'https://placehold.co/100x100?text=PM',
      bio: 'Crafting the perfect prompts for AI magic',
      joinDate: '2024-03-05',
      followers: 2100,
      following: 180
    }
  ];

  return {
    users: sampleUsers,
    posts: [],
    comments: []
  };
};

// Read database
export const readDB = (): Database => {
  ensureDataDir();
  
  if (!fs.existsSync(DB_PATH)) {
    const initialDB = initDB();
    writeDB(initialDB);
    return initialDB;
  }
  
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return initDB();
  }
};

// Write database
export const writeDB = (data: Database): void => {
  ensureDataDir();
  
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
    throw new Error('Failed to save data');
  }
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// User operations
export const getUsers = (): User[] => {
  const db = readDB();
  return db.users;
};

export const getUserById = (id: string): User | null => {
  const db = readDB();
  return db.users.find(user => user.id === id) || null;
};

export const getUserByUsername = (username: string): User | null => {
  const db = readDB();
  return db.users.find(user => user.username === username) || null;
};

// Post operations
export const getPosts = (limit?: number): Post[] => {
  const db = readDB();
  const sortedPosts = db.posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return limit ? sortedPosts.slice(0, limit) : sortedPosts;
};

export const getPostById = (id: string): Post | null => {
  const db = readDB();
  return db.posts.find(post => post.id === id) || null;
};

export const getPostsByUserId = (userId: string): Post[] => {
  const db = readDB();
  return db.posts.filter(post => post.author.id === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const createPost = (postData: CreatePostData, imageUrl: string): Post => {
  const db = readDB();
  const author = getUserById(postData.authorId);
  
  if (!author) {
    throw new Error('Author not found');
  }

  const newPost: Post = {
    id: generateId(),
    author,
    prompt: postData.prompt,
    imageUrl,
    caption: postData.caption,
    createdAt: new Date().toISOString(),
    likes: 0,
    likedBy: [],
    comments: [],
    shares: 0,
    tags: postData.tags || []
  };

  db.posts.push(newPost);
  writeDB(db);
  return newPost;
};

// Like operations
export const toggleLike = (postId: string, userId: string): { liked: boolean; likesCount: number } => {
  const db = readDB();
  const postIndex = db.posts.findIndex(post => post.id === postId);
  
  if (postIndex === -1) {
    throw new Error('Post not found');
  }

  const post = db.posts[postIndex];
  const likedIndex = post.likedBy.indexOf(userId);
  
  if (likedIndex > -1) {
    // Unlike
    post.likedBy.splice(likedIndex, 1);
    post.likes = post.likedBy.length;
    writeDB(db);
    return { liked: false, likesCount: post.likes };
  } else {
    // Like
    post.likedBy.push(userId);
    post.likes = post.likedBy.length;
    writeDB(db);
    return { liked: true, likesCount: post.likes };
  }
};

// Comment operations
export const addComment = (commentData: CreateCommentData): Comment => {
  const db = readDB();
  const author = getUserById(commentData.authorId);
  const post = getPostById(commentData.postId);
  
  if (!author) {
    throw new Error('Author not found');
  }
  
  if (!post) {
    throw new Error('Post not found');
  }

  const newComment: Comment = {
    id: generateId(),
    postId: commentData.postId,
    authorId: commentData.authorId,
    author,
    content: commentData.content,
    createdAt: new Date().toISOString(),
    likes: 0,
    replies: []
  };

  // Add to comments collection
  db.comments.push(newComment);
  
  // Add to post's comments array
  const postIndex = db.posts.findIndex(p => p.id === commentData.postId);
  if (postIndex > -1) {
    db.posts[postIndex].comments.push(newComment);
  }
  
  writeDB(db);
  return newComment;
};

export const getCommentsByPostId = (postId: string): Comment[] => {
  const db = readDB();
  return db.comments.filter(comment => comment.postId === postId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};