import { notFound } from 'next/navigation';
import { getUserByUsername, getPostsByUserId } from '@/lib/db';
import PostCard from '@/components/PostCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const currentUserId = '1'; // Simulated current user
  const { username } = await params;
  const user = getUserByUsername(username);

  if (!user) {
    notFound();
  }

  const userPosts = getPostsByUserId(user.id);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar} alt={user.displayName} />
                <AvatarFallback className="text-2xl">
                  {user.displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{user.displayName}</h1>
                <p className="text-lg text-gray-600 mb-2">@{user.username}</p>
                <p className="text-gray-700 mb-4">{user.bio}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div>
                    <span className="font-semibold text-gray-900">{userPosts.length}</span> Posts
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{user.followers}</span> Followers
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{user.following}</span> Following
                  </div>
                  <div>
                    Joined {formatDate(user.joinDate)}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                {user.id !== currentUserId && (
                  <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                    Follow
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  Share Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {user.displayName}&apos;s Creations
            </h2>
            <p className="text-gray-600">{userPosts.length} posts</p>
          </div>

          {userPosts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600">
                  {user.id === currentUserId 
                    ? "Start creating amazing AI artwork to share with the community!"
                    : `${user.displayName} hasn't shared any artwork yet.`
                  }
                </p>
                {user.id === currentUserId && (
                  <Button 
                    className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    onClick={() => window.location.href = '/create'}
                  >
                    Create Your First Post
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userPosts.map((post) => (
                <div key={post.id} className="lg:break-inside-avoid">
                  <PostCard post={post} currentUserId={currentUserId} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}