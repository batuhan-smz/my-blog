import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Dosya gerekli' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dosya adını benzersiz yap
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${session.user.id}-${uniqueSuffix}${file.name.substring(file.name.lastIndexOf('.'))}`;
    
    // Dosyayı public/uploads dizinine kaydet
    const path = join(process.cwd(), 'public/uploads', filename);
    await writeFile(path, buffer);
    
    // Dosya URL'ini döndür
    const url = `/uploads/${filename}`;

    // Kullanıcının profil fotoğrafını güncelle
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: url },
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Dosya yüklenirken hata:', error);
    return NextResponse.json(
      { error: 'Dosya yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 