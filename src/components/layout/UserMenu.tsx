'use client';

import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

interface UserMenuProps {
  session: Session | null;
}

export default function UserMenu({ session }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!session) {
    return (
      <div className="flex space-x-4">
        <Link
          href="/giris"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Giriş Yap
        </Link>
        <Link
          href="/kayit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
        >
          Kayıt Ol
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
      >
        <img
          src={session?.user?.image || '/default-avatar.svg'}
          alt={session?.user?.name || 'Kullanıcı'}
          className="h-8 w-8 rounded-full"
        />
        <span>{session?.user?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <Link
              href="/profil"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profil
            </Link>
            <button
              onClick={() => signOut()}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 