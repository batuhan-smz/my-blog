import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const metadata = {
  title: 'Blog Yazıları | Blog',
  description: 'Tüm blog yazılarını keşfedin.',
};

interface SearchParams {
  page?: string;
  tag?: string;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Number(searchParams?.page) || 1;
  const tag = searchParams?.tag;
  const postsPerPage = 9;

  const where = {
    published: true,
    ...(tag && {
      tags: {
        some: {
          name: tag,
        },
      },
    }),
  };

  const [posts, totalPosts] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * postsPerPage,
      take: postsPerPage,
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {tag ? `${tag} ile ilgili yazılar` : 'Blog Yazıları'}
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          {totalPosts} yazı bulundu
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-48 w-full object-cover"
              />
            )}
            <div className="flex-1 p-6 space-y-4">
              <div className="flex items-center gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.name}
                    href={`/blog?tag=${tag.name}`}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="mt-2 text-gray-600 line-clamp-3">{post.excerpt}</p>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={post.author.image || '/default-avatar.svg'}
                  alt={post.author.name || 'Yazar'}
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-sm text-gray-600">{post.author.name}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Link
              key={pageNum}
              href={`/blog?page=${pageNum}${tag ? `&tag=${tag}` : ''}`}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                pageNum === page
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
} 