import Feed from '@/components/Feed';

export default function HomePage() {
  const currentUserId = '1'; // Simulated current user - in real app this would come from auth

  return (
    <div className="min-h-screen bg-gray-50">
      <Feed currentUserId={currentUserId} />
    </div>
  );
}