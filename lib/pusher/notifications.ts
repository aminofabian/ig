import { pusherServer } from '@/lib/pusher';

export async function sendNotification(recipientId: string, data: {
  content: string;
  senderId: string;
  senderName: string;
}) {
  const notification = {
    id: Math.random().toString(),
    type: 'message',
    content: data.content,
    timestamp: new Date(),
    senderId: data.senderId,
    senderName: data.senderName,
    read: false
  };

  // Send to notifications channel
  await pusherServer.trigger(
    `notifications-${recipientId}`,
    'new-notification',
    notification
  );

  // Send to chat channel
  await pusherServer.trigger(
    `chat-${recipientId}`,
    'new-message',
    {
      ...notification,
      timestamp: notification.timestamp.toISOString()
    }
  );

  return notification;
} 