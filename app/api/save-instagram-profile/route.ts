import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        instagram: data.username,
        instagramProfileId: data.id,
        instagramVerified: data.is_verified,
        instagramPrivate: data.is_private,
        postsCount: data.edge_owner_to_timeline_media?.count || 0,
        followersCount: data.edge_followed_by?.count || 0,
        followingCount: data.edge_follow?.count || 0,
        instagramBio: data.biography,
        instagramFullName: data.full_name,
        instagramImage: data.profile_pic_url,
      },
    });

    await prisma.instagramSnapshot.create({
      data: {
        userId: session.user.id,
        postsCount: data.edge_owner_to_timeline_media?.count || 0,
        followersCount: data.edge_followed_by?.count || 0,
        followingCount: data.edge_follow?.count || 0,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Failed to save Instagram profile:', error);
    return NextResponse.json(
      { error: 'Failed to save Instagram profile' },
      { status: 500 }
    );
  }
} 