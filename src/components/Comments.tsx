'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string | null;
    image: string | null;
  };
}

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  async function fetchComments() {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Yorumlar yüklenirken hata:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments([comment, ...comments]);
        setNewComment('');
      } else {
        const data = await response.json();
        alert(data.message || 'Bir hata oluştu');
      }
    } catch (error) {
      alert('Yorum eklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Yorumlar</h2>

      {session ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Yorumunuzu yazın..."
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Gönderiliyor...' : 'Yorum Yap'}
          </button>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-gray-600">
            Yorum yapmak için{' '}
            <Link href="/giris" className="text-indigo-600 hover:text-indigo-500">
              giriş yapın
            </Link>
          </p>
        </div>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex-shrink-0">
              <div className="relative w-10 h-10">
                <Image
                  src={comment.author.image || '/default-avatar.svg'}
                  alt={comment.author.name || 'Avatar'}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  {comment.author.name}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <p className="mt-1 text-gray-600">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 