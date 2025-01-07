import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch the user with Instagram-related fields
    const profile = await prisma.user.findUnique({
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

    if (!profile?.instagram) {
      return NextResponse.json(
        { error: 'No Instagram profile found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      username: profile.instagram,
      full_name: profile.instagramFullName,
      biography: profile.instagramBio,
      followers: profile.followersCount,
      following: profile.followingCount,
      posts: profile.postsCount,
      verified: profile.instagramVerified,
      private: profile.instagramPrivate,
      profile_pic_url: profile.instagramImage
    });
  } catch (error) {
    console.error('Error fetching Instagram profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram profile' },
      { status: 500 }
    );
  }
} 