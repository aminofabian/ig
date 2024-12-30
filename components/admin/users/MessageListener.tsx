import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { toast } from 'sonner';
import { useNotifications } from '@/lib/stores/useNotifications';

interface MessageListenerProps {
  userId: string;
}

const MessageListener = ({ userId }: MessageListenerProps) => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`user-${userId}`);

    channel.bind('new-message', (data: { content: string; timestamp: string }) => {
      // Show toast notification
      toast.info('New message received', {
        description: data.content,
        className: 'bg-zinc-900 border border-white/20 text-white',
        duration: 5000,
      });
      
      // Add to notifications
      addNotification({
        type: 'message',
        content: data.content,
        timestamp: new Date(),
        senderId: userId,
        senderName: 'User'
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [userId, addNotification]);

  return null;
};

export default MessageListener;