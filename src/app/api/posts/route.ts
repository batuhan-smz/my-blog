import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse(
        JSON.stringify({ message: 'Yetkisiz erişim' }),
        { status: 401 }
      );
    }

    const {
      title,
      content,
      excerpt,
      slug,
      tags = [],
      coverImage,
      published,
    } = await request.json();

    // Zorunlu alanları kontrol et
    if (!title || !content || !slug) {
      return new NextResponse(
        JSON.stringify({ message: 'Başlık, içerik ve URL zorunludur' }),
        { status: 400 }
      );
    }

    // Slug'ın benzersiz olduğunu kontrol et
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return new NextResponse(
        JSON.stringify({ message: 'Bu URL zaten kullanılıyor' }),
        { status: 400 }
      );
    }

    // Etiketleri oluştur veya bul
    const tagObjects = await Promise.all(
      tags.map(async (tagName: string) => {
        return prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });
      })
    );

    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt,
        slug,
        coverImage,
        published,
        author: {
          connect: { id: session.user.id },
        },
        tags: {
          connect: tagObjects.map((tag) => ({ id: tag.id })),
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Blog yazısı oluşturulurken hata:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Bir hata oluştu' }),
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const tag = searchParams.get('tag');
    const published = searchParams.get('published');

    const where = {
      ...(tag && {
        tags: {
          some: {
            name: tag,
          },
        },
      }),
      ...(published !== null && { published: published === 'true' }),
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: {
              name: true,
            },
          },
          tags: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Blog yazıları listelenirken hata:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Bir hata oluştu' }),
      { status: 500 }
    );
  }
} 