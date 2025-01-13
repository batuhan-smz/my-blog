import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';
import ThemeToggle from './ThemeToggle';

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">[Batuhan Semiz]</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/#projects"
                className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700"
              >
                Projeler
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700"
              >
                Blog
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700"
              >
                İletişim
              </Link>
              <Link
                href="/yorumlar"
                className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700"
              >
                Yorumlar
              </Link>
              {session?.user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700"
                >
                  Yönetim Paneli
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserMenu session={session} />
            <MobileMenu session={session} />
          </div>
        </div>
      </div>
    </nav>
  );
} 