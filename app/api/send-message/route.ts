// app/api/send-message/route.ts
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true
});

export async function POST(req: Request) {
  try {
    const { userId, content } = await req.json();
    
    await pusher.trigger(`user-${userId}`, 'new-message', {
      content,
      timestamp: new Date().toISOString()
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to send message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
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
//       `private-user-${user}`,
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