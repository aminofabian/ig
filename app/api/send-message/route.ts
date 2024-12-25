// First, create a new file: app/api/send-message/route.ts
import Pusher from 'pusher';
import { NextResponse } from 'next/server';
import { toast } from 'sonner';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(request: Request) {
  try {
    const { userId, content } = await request.json();
    
    // Trigger the message event for this specific user
    await pusher.trigger(`user-${userId}`, 'new-message', {
      content,
      timestamp: new Date().toISOString(),
      from: 'admin'
    });

    // Store message in database (example using prisma)
    // const message = await prisma.message.create({
    //   data: {
    //     content,
    //     userId,
    //     fromAdmin: true,
    //   },
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}