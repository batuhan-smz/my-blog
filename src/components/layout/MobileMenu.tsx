'use client';

import { Session } from 'next-auth';
import Link from 'next/link';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

interface MobileMenuProps {
  session: Session | null;
}

export default function MobileMenu({ session }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
      >
        <span className="sr-only">Menüyü aç</span>
        {isOpen ? (
          <HiX className="block h-6 w-6" />
        ) : (
          <HiMenu className="block h-6 w-6" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/#projects"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Projeler
            </Link>
            <Link
              href="/blog"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/#contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              İletişim
            </Link>
            {session?.user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Yönetim Paneli
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 