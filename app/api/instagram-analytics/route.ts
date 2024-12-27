import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [currentUser, thirtyDaysAgo] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          instagram: true,
          instagramProfileId: true,
          instagramVerified: true,
          instagramPrivate: true,
          postsCount: true,
          followersCount: true,
          followingCount: true,
          instagramBio: true,
          instagramFullName: true,
          instagramImage: true,
        }
      }),
      prisma.instagramSnapshot.findFirst({
        where: {
          userId: session.user.id,
          timestamp: {
            lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: {
          timestamp: 'desc'
        }
      })
    ]);

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const changes = thirtyDaysAgo ? {
      postsGrowth: (currentUser.postsCount ?? 0) - thirtyDaysAgo.postsCount,
      followersGrowth: (currentUser.followersCount ?? 0) - thirtyDaysAgo.followersCount,
      followingGrowth: (currentUser.followingCount ?? 0) - thirtyDaysAgo.followingCount,
    } : null;

    return NextResponse.json({
      ...currentUser,
      changes
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Instagram analytics' },
      { status: 500 }
    );
  }
} 