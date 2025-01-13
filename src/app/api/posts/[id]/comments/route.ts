import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

// Yorum ekleme
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Yetkilendirme gerekli', { status: 401 });
    }

    const { content } = await request.json();
    if (!content) {
      return new NextResponse('Yorum içeriği gerekli', { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return new NextResponse('Yazı bulunamadı', { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: params.id,
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

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Yorum eklenirken hata:', error);
    return new NextResponse('Bir hata oluştu', { status: 500 });
  }
}

// Yorumları listeleme
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: params.id },
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

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Yorumlar listelenirken hata:', error);
    return new NextResponse('Bir hata oluştu', { status: 500 });
  }
} 