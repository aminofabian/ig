import { NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { sendNotification } from "@/lib/pusher/notifications";

// Define request body type
interface MessageRequest {
  recipientId: string;
  content: string;
}

export const POST = async (req: Request) => {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse JSON body with strict typing
    const body: MessageRequest = await req.json();
    const { recipientId, content } = body;

    if (!recipientId || !content) {
      return NextResponse.json(
        { error: "Recipient ID and content are required." },
        { status: 400 }
      );
    }

    // Save message to database
    const message = await db.message.create({
      data: {
        content,
        fromUserId: session.user.id,
        toUserId: recipientId,
      },
      include: {
        fromUser: true,
      },
    });

    const messageData = {
      id: message.id,
      content: message.content,
      timestamp: message.createdAt.toISOString(),
      fromId: message.fromUserId,
      senderName: `${message.fromUser.firstName || ''} ${message.fromUser.lastName || ''}`.trim() || 'Unknown User',
    };

    // Send message to chat channels & notify recipient
    await Promise.all([
      pusherServer.trigger(
        [`chat-${recipientId}`, `chat-${session.user.id}`],
        "new-message",
        messageData
      ),
      sendNotification(recipientId, {
        content: message.content,
        senderId: session.user.id,
        senderName: messageData.senderName,
      }),
    ]);

    return NextResponse.json(messageData);
  } catch (error) {
    console.error("[MESSAGES_POST] Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
};

// import { NextResponse } from "next/server";
// import { auth } from "@/auth";
// import db from "@/lib/db";
// import { pusherServer } from "@/lib/pusher";
// import { sendNotification } from "@/lib/pusher/notifications";

// export async function POST(req: Request) {
//   try {
//     const session = await auth();
//     if (!session?.user) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const body = await req.json();
//     const { recipientId, content } = body;

//     const message = await db.message.create({
//       data: {
//         content,
//         fromUserId: session.user.id,
//         toUserId: recipientId,
//       },
//       include: {
//         fromUser: true,
//       },
//     });

//     const messageData = {
//       id: message.id,
//       content: message.content,
//       timestamp: message.createdAt.toISOString(),
//       fromId: message.fromUserId,
//       senderName: `${message.fromUser.firstName || ''} ${message.fromUser.lastName || ''}`.trim() || 'Unknown User',
//     };

//     // Send to both sender and recipient channels
//     await Promise.all([
//       // Send chat message
//       pusherServer.trigger(
//         [`chat-${recipientId}`, `chat-${session.user.id}`],
//         'new-message',
//         messageData
//       ),
      
//       // Send notification to recipient
//       sendNotification(recipientId, {
//         content: message.content,
//         senderId: session.user.id,
//         senderName: messageData.senderName
//       })
//     ]);

//     return NextResponse.json(messageData);
//   } catch (error) {
//     console.error("[MESSAGES_POST]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// } 