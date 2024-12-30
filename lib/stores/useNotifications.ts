import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'message' | 'system';
  content: string;
  timestamp: Date;
  read: boolean;
  senderId?: string;
  senderName?: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getUnreadMessages: () => Notification[];
}

export const useNotifications = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) => set((state) => {
    const newNotification = {
      ...notification,
      id: Math.random().toString(),
      read: false,
    };
    return {
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    };
  }),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ),
    unreadCount: Math.max(0, state.unreadCount - 1),
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(notification => ({ ...notification, read: true })),
    unreadCount: 0,
  })),
  getUnreadMessages: () => get().notifications.filter(n => !n.read && n.type === 'message'),
})); 