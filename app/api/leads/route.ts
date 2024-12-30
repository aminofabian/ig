import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { users, hashtag } = await request.json();

    // Batch create leads
    const createdLeads = await prisma.lead.createMany({
      data: users.map((user: any) => ({
        username: user.username || '',
        fullName: user.full_name || '',
        profilePicUrl: user.profile_pic_url || '',
        followers: user.follower_count || 0,
        following: user.following_count || 0,
        posts: user.media_count || 0,
        biography: user.biography || '',
        website: user.website || '',
        isBusiness: user.is_business || false,
        businessCategory: user.business_category || '',
        engagementRate: user.engagement_rate || 0,
        sourceHashtag: hashtag,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json(createdLeads);
  } catch (error) {
    console.error('Error saving leads:', error);
    return NextResponse.json(
      { error: 'Failed to save leads' },
      { status: 500 }
    );
  }
} 