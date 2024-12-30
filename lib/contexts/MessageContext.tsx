"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { pusherClient } from '@/lib/pusher';
import { useSession } from 'next-auth/react';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  fromAdmin: boolean;
  senderName: string;
  isOwnMessage: boolean;
}

interface MessageContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  fetchMessages: (recipientId: string) => Promise<void>;
}

const MessageContext = createContext<MessageContextType | null>(null);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const { data: session } = useSession();

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const fetchMessages = async (recipientId: string) => {
    try {
      const response = await fetch(`/api/messages/${recipientId}`);
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = pusherClient.subscribe(`private-user-${session.user.id}`);

    channel.bind('new-message', (message: Message) => {
      addMessage(message);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [session?.user?.id]);

  return (
    <MessageContext.Provider value={{ messages, addMessage, fetchMessages }}>
      {children}
    </MessageContext.Provider>
  );
}

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) throw new Error('useMessages must be used within a MessageProvider');
  return context;
}; 