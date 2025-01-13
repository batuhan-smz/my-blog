import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

// Mesaj ekleme
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 });
    }

    const body = await request.json();
    if (!body?.content) {
      return NextResponse.json({ error: 'Mesaj içeriği gerekli' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        content: body.content,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Mesaj eklenirken hata:', error);
    return NextResponse.json(
      { error: 'Mesaj eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Mesajları listeleme
export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Mesajlar listelenirken hata:', error);
    return NextResponse.json(
      { error: 'Mesajlar listelenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 