"use client";

import { useEffect } from 'react';
import { pusherClient } from '@/lib/pusher';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useNotifications } from '@/lib/stores/useNotifications';
import { useMessages } from '@/lib/contexts/MessageContext';

export const AdminMessageListener = () => {
  const { data: session } = useSession();
  const { addNotification } = useNotifications();
  const { addMessage } = useMessages();

  useEffect(() => {
    if (!session?.user?.id) return;

    // Listen for notifications
    const notificationChannel = pusherClient.subscribe(`notifications-${session.user.id}`);
    
    notificationChannel.bind('new-notification', (data: {
      type: 'message';
      content: string;
      timestamp: Date;
      senderId: string;
      senderName: string;
    }) => {
      addNotification({
        type: data.type,
        content: data.content,
        timestamp: data.timestamp,
        senderId: data.senderId,
        senderName: data.senderName
      });

      toast.info(`New message from ${data.senderName}`, {
        description: data.content,
        className: 'bg-zinc-900 border border-white/20 text-white',
        duration: 5000,
      });
    });

    // Listen for chat messages
    const chatChannel = pusherClient.subscribe(`chat-${session.user.id}`);
    
    chatChannel.bind('new-message', (data: {
      content: string;
      timestamp: string;
      senderId: string;
      senderName: string;
    }) => {
      addMessage({
        id: Math.random().toString(),
        content: data.content,
        timestamp: data.timestamp,
        senderName: data.senderName,
        isOwnMessage: data.senderId === session.user.id,
        fromAdmin: false
      });
    });

    return () => {
      notificationChannel.unbind_all();
      notificationChannel.unsubscribe();
      chatChannel.unbind_all();
      chatChannel.unsubscribe();
    };
  }, [session?.user?.id, addNotification, addMessage]);

  return null;
}; 