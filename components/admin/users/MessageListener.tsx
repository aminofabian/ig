import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { toast } from 'sonner';

interface MessageListenerProps {
  userId: string;
}

const MessageListener = ({ userId }: MessageListenerProps) => {
  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    // Subscribe to user's channel
    const channel = pusher.subscribe(`user-${userId}`);

    // Listen for new messages
    channel.bind('new-message', (data: { content: string; timestamp: string }) => {
      toast.info('New message from admin:', {
        description: data.content,
        className: 'bg-zinc-900 border border-white/20 text-white',
        duration: 5000,
      });
      
      // You could also update your UI, play a sound, etc.
    });

    // Cleanup on unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [userId]);

  return null; // This component doesn't render anything
};

export default MessageListener;