'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiFileText, FiTag, FiSettings } from 'react-icons/fi';

const menuItems = [
  { href: '/admin', label: 'Genel Bakış', icon: FiHome },
  { href: '/admin/yazilar', label: 'Yazılar', icon: FiFileText },
  { href: '/admin/etiketler', label: 'Etiketler', icon: FiTag },
  { href: '/admin/ayarlar', label: 'Ayarlar', icon: FiSettings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="h-full px-3 py-4">
        <div className="mb-6 px-3">
          <h2 className="text-lg font-semibold text-gray-900">Yönetim Paneli</h2>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-indigo-600' : 'text-gray-400'
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
} 