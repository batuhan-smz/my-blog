import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Comments from '@/components/Comments';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!post) {
    return {
      title: 'Yazı Bulunamadı',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPost({ params }: Props) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      tags: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!post || !post.published) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <header className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {post.title}
        </h1>
        <div className="flex items-center space-x-4 text-gray-600">
          <span>{post.author.name}</span>
          <span>•</span>
          <time dateTime={post.createdAt.toISOString()}>
            {new Date(post.createdAt).toLocaleDateString('tr-TR')}
          </time>
        </div>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag.name}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </header>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
      )}

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-16">
        <Comments postId={post.id} />
      </div>
    </article>
  );
} 