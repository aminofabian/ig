import { NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { recipientId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const messages = await db.message.findMany({
      where: {
        OR: [
          {
            fromUserId: session.user.id,
            toUserId: params.recipientId,
          },
          {
            fromUserId: params.recipientId,
            toUserId: session.user.id,
          },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        fromUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      timestamp: msg.createdAt.toISOString(),
      fromId: msg.fromUserId,
      senderName: `${msg.fromUser.firstName || ''} ${msg.fromUser.lastName || ''}`.trim() || 'Unknown User',
    }));

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error("[MESSAGES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 