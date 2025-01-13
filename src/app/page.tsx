import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Messages from '@/components/Messages';
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
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
  });

  return (
    <div className="space-y-12">
      <section className="text-center space-y-6">
        <div className="relative w-32 h-32 mx-auto">
          <Image
            src={session?.user?.image || '/default-avatar.svg'}
            alt={session?.user?.name || 'Profil'}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {session?.user?.name || 'Hoş Geldiniz'}
          </h1>
          <div className="flex justify-center gap-4 mt-4">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaGithub className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaTwitter className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaLinkedin className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaInstagram className="w-6 h-6" />
            </a>
          </div>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Yazılım, teknoloji ve kişisel deneyimlerim hakkında yazılar paylaşıyorum.
          </p>
        </div>
      </section>

      <section id="hakkimda" className="scroll-mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hakkımda</h2>
        <div className="prose prose-lg max-w-none">
          <p>
            Merhaba! Ben bir yazılım geliştiricisiyim ve bu blog üzerinden deneyimlerimi,
            öğrendiklerimi ve teknoloji dünyasındaki güncel gelişmeleri paylaşıyorum.
          </p>
          <p>
            Web geliştirme, mobil uygulama geliştirme ve yapay zeka alanlarında çalışmalar yapıyorum.
            Sürekli yeni teknolojiler öğreniyor ve kendimi geliştiriyorum.
          </p>
        </div>
      </section>

      <section id="projeler" className="scroll-mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Projeler</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="border rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Proje 1</h3>
            <p className="text-gray-600 mb-4">
              Proje açıklaması buraya gelecek.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 rounded text-sm">React</span>
              <span className="px-2 py-1 bg-gray-100 rounded text-sm">TypeScript</span>
              <span className="px-2 py-1 bg-gray-100 rounded text-sm">Tailwind</span>
            </div>
          </div>
          <div className="border rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Proje 2</h3>
            <p className="text-gray-600 mb-4">
              Proje açıklaması buraya gelecek.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 rounded text-sm">Next.js</span>
              <span className="px-2 py-1 bg-gray-100 rounded text-sm">Prisma</span>
              <span className="px-2 py-1 bg-gray-100 rounded text-sm">PostgreSQL</span>
            </div>
          </div>
          <div className="border rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Proje 3</h3>
            <p className="text-gray-600 mb-4">
              Proje açıklaması buraya gelecek.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 rounded text-sm">Flutter</span>
              <span className="px-2 py-1 bg-gray-100 rounded text-sm">Firebase</span>
              <span className="px-2 py-1 bg-gray-100 rounded text-sm">GetX</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Son Yazılar</h2>
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
                  <h3 className="text-xl font-semibold text-gray-900">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="mt-2 text-gray-600 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={post.author.image || '/default-avatar.svg'}
                    alt={post.author.name || 'Yazar'}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-sm text-gray-600">
                    {post.author.name}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="iletisim" className="scroll-mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">İletişim</h2>
        <Messages />
      </section>
    </div>
  );
}
