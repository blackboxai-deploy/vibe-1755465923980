import CreatePost from '@/components/CreatePost';

export default function CreatePage() {
  const currentUserId = '1'; // Simulated current user - in real app this would come from auth

  return (
    <div className="min-h-screen bg-gray-50">
      <CreatePost currentUserId={currentUserId} />
    </div>
  );
}