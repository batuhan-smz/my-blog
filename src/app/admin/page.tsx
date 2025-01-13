import { prisma } from '@/lib/prisma';
import { FiFileText, FiTag, FiEye } from 'react-icons/fi';

export default async function AdminDashboard() {
  const [totalPosts, publishedPosts, totalTags] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.tag.count(),
  ]);

  const stats = [
    {
      name: 'Toplam Yazı',
      value: totalPosts,
      icon: FiFileText,
      color: 'bg-blue-500',
    },
    {
      name: 'Yayınlanan Yazı',
      value: publishedPosts,
      icon: FiEye,
      color: 'bg-green-500',
    },
    {
      name: 'Toplam Etiket',
      value: totalTags,
      icon: FiTag,
      color: 'bg-purple-500',
    },
  ];

  const recentPosts = await prisma.post.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Genel Bakış</h1>
        <p className="mt-1 text-sm text-gray-500">
          Blog istatistikleri ve son aktiviteler
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
            >
              <dt>
                <div className={`absolute rounded-md p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </dd>
            </div>
          );
        })}
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Son Yazılar</h2>
        </div>
        <div className="border-t border-gray-200 divide-y divide-gray-200">
          {recentPosts.map((post) => (
            <div
              key={post.id}
              className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {post.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {post.author.name} •{' '}
                    {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      post.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {post.published ? 'Yayında' : 'Taslak'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 