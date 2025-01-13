'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string | null;
    image: string | null;
  };
}

export default function Messages() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const response = await fetch('/api/messages');
      const data = await response.json();
      
      if (response.ok) {
        setMessages(data);
      } else {
        setError(data.error || 'Mesajlar yüklenirken bir hata oluştu');
      }
    } catch (error) {
      setError('Mesajlar yüklenirken bir hata oluştu');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages([data, ...messages]);
        setNewMessage('');
      } else {
        setError(data.error || 'Mesaj gönderilirken bir hata oluştu');
      }
    } catch (error) {
      setError('Mesaj gönderilirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Ziyaretçi Defteri</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
          {error}
        </div>
      )}

      {session ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Gönderiliyor...' : 'Mesaj Gönder'}
          </button>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-gray-600">
            Mesaj göndermek için{' '}
            <Link href="/giris" className="text-indigo-600 hover:text-indigo-500">
              giriş yapın
            </Link>
          </p>
        </div>
      )}

      <div className="space-y-6">
        {messages.map((message) => (
          <div key={message.id} className="flex space-x-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex-shrink-0">
              <div className="relative w-10 h-10">
                <Image
                  src={message.author.image || '/default-avatar.svg'}
                  alt={message.author.name || 'Avatar'}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  {message.author.name}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(message.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <p className="mt-1 text-gray-600">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 