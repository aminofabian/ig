import { create } from 'zustand';

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  fromAdmin: boolean;
  read: boolean;
  userId: string;
}

interface MessagesStore {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'read'>) => void;
  markMessageRead: (id: string) => void;
  markAllRead: () => void;
}

export const useMessages = create<MessagesStore>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [
      {
        ...message,
        id: Math.random().toString(),
        read: false,
      },
      ...state.messages,
    ],
  })),
  markMessageRead: (id) => set((state) => ({
    messages: state.messages.map((message) =>
      message.id === id ? { ...message, read: true } : message
    ),
  })),
  markAllRead: () => set((state) => ({
    messages: state.messages.map((message) => ({ ...message, read: true })),
  })),
})); 