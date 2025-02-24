import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId, content } = await request.json();

    if (!userId || !content) {
      return NextResponse.json({ error: 'Missing userId or content' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!pusherServer) {
      console.warn('🚨 Pusher server is not initialized.');
      return NextResponse.json({ error: 'Pusher not available' }, { status: 500 });
    }

    // Trigger the message event for this specific user
    await pusherServer.trigger(`private-user-${userId}`, 'new-message', {
      content,
      timestamp: new Date().toISOString(),
      fromAdmin: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

// // First, create a new file: app/api/send-message/route.ts
// import { NextResponse } from 'next/server';
// import { pusherServer } from '@/lib/pusher'; // Import the shared pusher instance
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function POST(request: Request) {
//   try {
//     const { userId, content } = await request.json();
//     const user = await prisma.user.findUnique({
//       where: { id: userId }
//     });
    
//     // Trigger the message event for this specific user
//     await pusherServer.trigger(
//       `private-user-${userId}`,
//       'new-message',
//       {
//         content,
//         timestamp: new Date().toISOString(),
//         fromAdmin: true,
//       }
//     );

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Error sending message:', error);
//     return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
//   }
// }