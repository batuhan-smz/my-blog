import Messages from '@/components/Messages';

export default function MessagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Ziyaretçi Defteri</h1>
        <Messages />
      </div>
    </div>
  );
} 