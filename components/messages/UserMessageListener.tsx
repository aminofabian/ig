"use client";

import { useEffect } from 'react';
import { pusherClient } from '@/lib/pusher';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useNotifications } from '@/lib/stores/useNotifications';

export const UserMessageListener = () => {
  const { data: session } = useSession();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = pusherClient.subscribe(`private-user-${session.user.id}`);

    channel.bind('new-message', (data: {
      id: string;
      content: string;
      timestamp: string;
      fromAdmin: boolean;
      senderId: string;
      senderName: string;
    }) => {
      // Add to notifications
      addNotification({
        type: 'message',
        content: data.content,
        timestamp: new Date(data.timestamp),
        senderId: data.senderId,
        senderName: data.senderName,
      });

      // Show toast
      toast.info(`New message from ${data.senderName}`, {
        description: data.content,
        className: 'bg-zinc-900 border border-white/20 text-white',
        duration: 5000,
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [session?.user?.id, addNotification]);

  return null;
}; 