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
      // Get current user data
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
      // Get snapshot from ~30 days ago
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

    const changes = thirtyDaysAgo ? {
      postsGrowth: currentUser!.postsCount - thirtyDaysAgo.postsCount,
      followersGrowth: currentUser!.followersCount - thirtyDaysAgo.followersCount,
      followingGrowth: currentUser!.followingCount - thirtyDaysAgo.followingCount,
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