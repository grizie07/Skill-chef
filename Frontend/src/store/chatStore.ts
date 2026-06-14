import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface ChatThread {
  partner: {
    id: string;
    name: string;
    avatarUrl: string;
    isChef: boolean;
    isVerified: boolean;
  };
  lastMessage: string;
  isRead: boolean;
  updatedAt: string;
}

interface ChatState {
  threads: ChatThread[];
  activePartnerId: string | null;
  activeMessages: ChatMessage[];
  isPartnerTyping: boolean;
  setThreads: (threads: ChatThread[]) => void;
  setActivePartnerId: (id: string | null) => void;
  setActiveMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setPartnerTyping: (isTyping: boolean) => void;
  updateThreadLastMessage: (partnerId: string, content: string, isRead: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  threads: [],
  activePartnerId: null,
  activeMessages: [],
  isPartnerTyping: false,

  setThreads: (threads) => set({ threads }),
  setActivePartnerId: (activePartnerId) => set({ activePartnerId, activeMessages: [] }),
  setActiveMessages: (activeMessages) => set({ activeMessages }),

  addMessage: (message) =>
    set((state) => {
      // Check if message is already in active thread
      const exists = state.activeMessages.some((m) => m.id === message.id);
      const newMessages = exists ? state.activeMessages : [...state.activeMessages, message];
      
      // Update thread last message as well
      const partnerId = message.senderId === state.activePartnerId ? message.senderId : message.receiverId;
      state.updateThreadLastMessage(partnerId, message.content, message.senderId !== state.activePartnerId);

      return { activeMessages: newMessages };
    }),

  setPartnerTyping: (isPartnerTyping) => set({ isPartnerTyping }),

  updateThreadLastMessage: (partnerId, content, isRead) =>
    set((state) => {
      const threadIndex = state.threads.findIndex((t) => t.partner.id === partnerId);
      if (threadIndex === -1) return {}; // Thread not loaded yet

      const updatedThreads = [...state.threads];
      const thread = updatedThreads[threadIndex];
      updatedThreads[threadIndex] = {
        ...thread,
        lastMessage: content,
        isRead,
        updatedAt: new Date().toISOString()
      };

      // Sort threads by updatedAt descending
      updatedThreads.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      return { threads: updatedThreads };
    })
}));
