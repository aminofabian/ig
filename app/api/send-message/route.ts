// First, create a new file: app/api/send-message/route.ts
import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher'; // Import the shared pusher instance
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId, content } = await request.json();
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    // Trigger the message event for this specific user
    await pusherServer.trigger(
      `private-user-${user}`,
      'new-message',
      {
        content,
        timestamp: new Date().toISOString(),
        fromAdmin: true,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}