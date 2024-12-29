import { NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch both snapshots and hashtags
    const [snapshots, hashtags] = await Promise.all([
      db.instagramSnapshot.findMany({
        where: { userId: session.user.id },
        orderBy: { timestamp: 'asc' }
      }),
      db.hashtag.findMany({
        where: { userId: session.user.id },
        orderBy: { searchedAt: 'desc' },
        include: {
          posts: true
        }
      })
    ]);

    // Calculate performance metrics
    const analytics = {
      snapshots,
      hashtags,
      summary: {
        totalPosts: snapshots[snapshots.length - 1]?.postsCount ?? 0,
        followerGrowth: snapshots.length > 1 
          ? (snapshots[snapshots.length - 1]?.followersCount ?? 0) - (snapshots[0]?.followersCount ?? 0)
          : 0,
        topHashtags: hashtags
          .sort((a, b) => (b.avgLikes ?? 0) - (a.avgLikes ?? 0))
          .slice(0, 5)
      }
    };

    return NextResponse.json(analytics);
    
  } catch (error) {
    console.error('[INSTAGRAM_ANALYTICS]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 