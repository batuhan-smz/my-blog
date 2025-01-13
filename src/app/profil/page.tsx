import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import ProfileForm from '@/components/ProfileForm'

export default async function ProfilPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/giris')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative w-20 h-20">
            <Image
              src={session.user?.image || '/default-avatar.svg'}
              alt={session.user?.name || 'Profil resmi'}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{session.user?.name}</h1>
            <p className="text-gray-600">{session.user?.email}</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Profil Düzenle</h2>
          <ProfileForm />
        </div>
      </div>
    </div>
  )
} 