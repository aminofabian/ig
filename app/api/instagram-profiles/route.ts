import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profiles = await prisma.user.findMany({
      where: {
        instagram: { not: null }
      },
      select: {
        id: true,
        instagram: true,
        instagramFullName: true,
        instagramImage: true,
        instagramVerified: true,
        instagramPrivate: true,
        postsCount: true,
        followersCount: true,
        followingCount: true,
      }
    });

    return NextResponse.json(profiles);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Instagram profiles' },
      { status: 500 }
    );
  }
} 