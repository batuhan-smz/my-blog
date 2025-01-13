'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FiSave, FiEye } from 'react-icons/fi';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

export default function NewPostPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [slug, setSlug] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');

  async function handleSubmit(publish: boolean = false) {
    setIsLoading(true);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
          tags: tags.split(',').map((tag) => tag.trim()),
          coverImage,
          published: publish,
        }),
      });

      if (res.ok) {
        router.push('/admin/yazilar');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.message || 'Bir hata oluştu');
      }
    } catch (error) {
      alert('Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yeni Yazı</h1>
          <p className="mt-1 text-sm text-gray-500">
            Yeni bir blog yazısı oluşturun
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => handleSubmit(false)}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiSave className="h-4 w-4 mr-2" />
            Taslak Olarak Kaydet
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <FiEye className="h-4 w-4 mr-2" />
            Yayınla
          </button>
        </div>
      </div>

      <div className="space-y-6 bg-white shadow-sm rounded-lg p-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Başlık
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700"
          >
            URL (boş bırakılırsa başlıktan otomatik oluşturulur)
          </label>
          <input
            type="text"
            name="slug"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-700"
          >
            Özet
          </label>
          <textarea
            name="excerpt"
            id="excerpt"
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="coverImage"
            className="block text-sm font-medium text-gray-700"
          >
            Kapak Görseli URL
          </label>
          <input
            type="text"
            name="coverImage"
            id="coverImage"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700"
          >
            Etiketler (virgülle ayırın)
          </label>
          <input
            type="text"
            name="tags"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            İçerik
          </label>
          <div className="mt-1 prose max-w-full">
            <Editor value={content} onChange={setContent} />
          </div>
        </div>
      </div>
    </div>
  );
} 