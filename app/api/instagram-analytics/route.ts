import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        instagram: true,
        instagramVerified: true,
        instagramPrivate: true,
        postsCount: true,
        followersCount: true,
        followingCount: true,
        instagramBio: true,
        instagramFullName: true,
        instagramImage: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...user,
      // Ensure the image URL is properly formatted
      instagramImage: user.instagramImage || null,
    });
  } catch (error) {
    console.error('Error fetching Instagram analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram analytics' },
      { status: 500 }
    );
  }
} 