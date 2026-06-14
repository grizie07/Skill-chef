import { create } from 'zustand';

export interface NotificationItem {
  _id: string;
  type: 'like' | 'comment' | 'follow' | 'save' | 'challenge' | 'mention';
  message: string;
  targetId?: string;
  isRead: boolean;
  createdAt: string;
  senderId?: {
    name: string;
    avatarUrl: string;
  };
}

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  setNotifications: (notifications: NotificationItem[]) => void;
  addNotification: (notification: NotificationItem) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) => {
    const unread = notifications.filter((n) => !n.isRead).length;
    set({ notifications, unreadCount: unread });
  },

  addNotification: (notification) =>
    set((state) => {
      if (state.notifications.some((n) => n._id === notification._id)) return {};
      const updated = [notification, ...state.notifications];
      return {
        notifications: updated,
        unreadCount: state.unreadCount + (notification.isRead ? 0 : 1)
      };
    }),

  markAsRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      );
      const isUnread = state.notifications.find((n) => n._id === id && !n.isRead);
      return {
        notifications: updated,
        unreadCount: state.unreadCount - (isUnread ? 1 : 0)
      };
    }),

  markAllAsRead: () =>
    set((state) => {
      const updated = state.notifications.map((n) => ({ ...n, isRead: true }));
      return {
        notifications: updated,
        unreadCount: 0
      };
    })
}));
