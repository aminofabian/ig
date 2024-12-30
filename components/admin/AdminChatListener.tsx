"use client";

import { useEffect } from 'react';
import { pusherClient } from '@/lib/pusher';
import { useSession } from 'next-auth/react';
import { useChat } from '@/lib/contexts/ChatContext';

export const AdminChatListener = () => {
  const { data: session } = useSession();
  const { addMessage } = useChat();

  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = pusherClient.subscribe(`chat-${session.user.id}`);
    
    channel.bind('new-message', (data: {
      id: string;
      content: string;
      timestamp: string;
      fromId: string;
      senderName: string;
    }) => {
      addMessage(data);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [session?.user?.id, addMessage]);

  return null;
}; 