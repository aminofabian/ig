"use client";

import { useEffect } from 'react';
import { pusherClient } from '@/lib/pusher';
import { useSession } from 'next-auth/react';
import { useNotifications } from '@/lib/stores/useNotifications';
import { useChat } from '@/lib/contexts/ChatContext';
import { toast } from 'sonner';

export const NotificationListener = () => {
  const { data: session } = useSession();
  const { addNotification } = useNotifications();
  const { addMessage } = useChat();

  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = pusherClient.subscribe(`notifications-${session.user.id}`);
    const chatChannel = pusherClient.subscribe(`chat-${session.user.id}`);
    
    // Listen for notifications
    channel.bind('new-notification', (data: {
      id: string;
      type: 'message';
      content: string;
      timestamp: Date;
      senderId: string;
      senderName: string;
      read: boolean;
    }) => {
      addNotification(data);

      toast.info(`New message from ${data.senderName}`, {
        description: data.content,
        className: 'bg-zinc-900 border border-white/20 text-white',
        duration: 5000,
      });
    });

    // Listen for chat messages
    chatChannel.bind('new-message', (message: {
      id: string;
      content: string;
      timestamp: string;
      fromId: string;
      senderName: string;
    }) => {
      addMessage(message);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      chatChannel.unbind_all();
      chatChannel.unsubscribe();
    };
  }, [session?.user?.id, addNotification, addMessage]);

  return null;
}; 