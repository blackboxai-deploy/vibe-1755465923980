import { notFound } from 'next/navigation';
import { getPostById } from '@/lib/db';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const currentUserId = '1'; // Simulated current user
  const { id } = await params;
  const post = getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
              ← Back to Feed
            </Button>
          </Link>
        </div>

        {/* Post */}
        <PostCard post={post} currentUserId={currentUserId} />

        {/* Related Actions */}
        <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Enjoyed this artwork?</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/create" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                Create Your Own
              </Button>
            </Link>
            <Link href={`/profile/${post.author.username}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View Artist Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}