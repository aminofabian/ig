"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { pusherClient } from '@/lib/pusher';
import { useSession } from 'next-auth/react';
import { useNotifications } from '@/lib/stores/useNotifications';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  fromId: string;
  senderName: string;
}

interface ChatContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  loadMessages: (userId: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const { data: session } = useSession();
  const { addNotification } = useNotifications();

  const addMessage = (message: Message) => {
    setMessages(prev => {
      if (prev.some(m => m.id === message.id)) {
        return prev;
      }
      return [...prev, message];
    });
  };

  const loadMessages = async (userId: string) => {
    try {
      const response = await fetch(`/api/messages/${userId}`);
      const data = await response.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/messages/mark-read/${messageId}`, { method: 'POST' });
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = pusherClient.subscribe(`chat-${session.user.id}`);
    
    channel.bind('new-message', (message: Message) => {
      addMessage(message);
      addNotification({
        type: 'message',
        content: message.content,
        timestamp: new Date(),
        senderId: message.fromId,
        senderName: message.senderName
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [session?.user?.id, addNotification]);

  return (
    <ChatContext.Provider value={{ messages, addMessage, loadMessages, markAsRead }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
}; 