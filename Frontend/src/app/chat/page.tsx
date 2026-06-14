'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  MessageSquare, 
  ChefHat, 
  Award, 
  Smile, 
  Image, 
  Circle,
  MoreVertical,
  Phone,
  Video,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore, ChatThread, ChatMessage } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { useGamificationStore } from '../../store/gamificationStore';

const initialThreads: ChatThread[] = [
  {
    partner: {
      id: 'chef_ramsay',
      name: 'Chef Ramsay AI',
      avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&h=150&q=80',
      isChef: true,
      isVerified: true
    },
    lastMessage: 'Oi! What are you cooking today? Do not serve me trash!',
    isRead: false,
    updatedAt: new Date().toISOString()
  },
  {
    partner: {
      id: 'chef_alice',
      name: 'Chef Alice',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      isChef: true,
      isVerified: true
    },
    lastMessage: 'Awesome, will check out your new recipe seed!',
    isRead: true,
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  }
];

const mockInitialMessages: Record<string, ChatMessage[]> = {
  chef_ramsay: [
    {
      id: 'm1',
      senderId: 'chef_ramsay',
      receiverId: 'mock-user-123',
      content: 'Oi! What are you cooking today? Do not serve me trash!',
      isRead: true,
      createdAt: new Date(Date.now() - 60000).toISOString()
    }
  ],
  chef_alice: [
    {
      id: 'm2',
      senderId: 'chef_alice',
      receiverId: 'mock-user-123',
      content: 'Hey! Loved your post about the Masala Dosa. Have you tried adding a bit of ghee?',
      isRead: true,
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'm3',
      senderId: 'mock-user-123',
      receiverId: 'chef_alice',
      content: 'Yes! Ghee makes it double crispy! Thanks for the tip.',
      isRead: true,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'm4',
      senderId: 'chef_alice',
      receiverId: 'mock-user-123',
      content: 'Awesome, will check out your new recipe seed!',
      isRead: true,
      createdAt: new Date(Date.now() - 3500000).toISOString()
    }
  ]
};

const ramsayReplies = [
  "IT IS RAW! Wake up, you donut! You need to sear it on medium-high heat with crushed garlic and thyme!",
  "Stunning flavor profiling. Finally, a recipe that doesn't taste like cardboard! Keep it up.",
  "You're using way too much oil! It is swimming in the pan! Less is more, start again!",
  "That is actually impressive. Keep up the high standards and you might make sous chef yet!",
  "What is that? Frozen herbs? Absolute disaster! Fresh herbs only in this kitchen!",
  "Simply delicious. Magnificent. The seasoning is spot on."
];

export default function ChatDashboard() {
  const user = useAuthStore((state) => state.user);
  const updateXP = useAuthStore((state) => state.updateXP);
  const triggerLevelUp = useGamificationStore((state) => state.triggerLevelUp);

  const { 
    threads, 
    activePartnerId, 
    activeMessages, 
    isPartnerTyping, 
    setThreads, 
    setActivePartnerId, 
    setActiveMessages, 
    addMessage, 
    setPartnerTyping 
  } = useChatStore();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize threads
  useEffect(() => {
    if (threads.length === 0) {
      setThreads(initialThreads);
    }
    // Default select Ramsay
    if (!activePartnerId && initialThreads.length > 0) {
      handleSelectThread(initialThreads[0].partner.id);
    }
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, isPartnerTyping]);

  const handleSelectThread = (partnerId: string) => {
    setActivePartnerId(partnerId);
    
    // Set initial messages
    if (mockInitialMessages[partnerId]) {
      setActiveMessages(mockInitialMessages[partnerId]);
    } else {
      setActiveMessages([]);
    }

    // Mark thread as read
    setThreads(
      threads.map((t) => t.partner.id === partnerId ? { ...t, isRead: true } : t)
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !activePartnerId) return;

    const userMessage: ChatMessage = {
      id: `m_${Date.now()}`,
      senderId: user?.id || 'mock-user-123',
      receiverId: activePartnerId,
      content: inputVal,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    // Add user message locally
    addMessage(userMessage);
    const sentText = inputVal;
    setInputVal('');

    // Trigger AI Ramsay response if active partner is Ramsay
    if (activePartnerId === 'chef_ramsay') {
      setPartnerTyping(true);

      setTimeout(() => {
        setPartnerTyping(false);
        const replyIndex = Math.floor(Math.random() * ramsayReplies.length);
        const ramsayMessage: ChatMessage = {
          id: `m_ai_${Date.now()}`,
          senderId: 'chef_ramsay',
          receiverId: user?.id || 'mock-user-123',
          content: ramsayReplies[replyIndex],
          isRead: false,
          createdAt: new Date().toISOString()
        };
        addMessage(ramsayMessage);

        // Award XP for cooking consultation
        if (user) {
          const nextXp = user.xp + 5;
          let nextLevel = user.level;
          if (nextXp >= 150) {
            nextLevel = user.level + 1;
            triggerLevelUp(nextLevel);
          }
          updateXP(nextXp, nextLevel);
        }
      }, 2000);
    } else if (activePartnerId === 'chef_alice') {
      setPartnerTyping(true);
      setTimeout(() => {
        setPartnerTyping(false);
        const aliceMessage: ChatMessage = {
          id: `m_alice_${Date.now()}`,
          senderId: 'chef_alice',
          receiverId: user?.id || 'mock-user-123',
          content: "Wow, that sounds brilliant! Let's schedule a live streams bake session soon! 🎂",
          isRead: false,
          createdAt: new Date().toISOString()
        };
        addMessage(aliceMessage);
      }, 2500);
    }
  };

  const activeThread = threads.find((t) => t.partner.id === activePartnerId);

  return (
    <div className="max-w-6xl mx-auto py-6 h-[calc(100vh-130px)] flex gap-6">
      
      {/* Sidebar - Threads list */}
      <div className="w-full md:w-80 bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl overflow-hidden flex flex-col shrink-0 shadow-sm">
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-100 dark:border-accent-borderDark flex justify-between items-center bg-gray-50/50 dark:bg-accent-slateDark/50">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 dark:text-white flex items-center gap-1.5">
            <MessageSquare className="h-4.5 w-4.5 text-brand-500" />
            Chef Channels
          </h2>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Scroll list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {threads.map((thread) => {
            const active = thread.partner.id === activePartnerId;
            return (
              <button
                key={thread.partner.id}
                onClick={() => handleSelectThread(thread.partner.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${
                  active 
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/10' 
                    : 'hover:bg-gray-50 dark:hover:bg-accent-slateDark'
                }`}
              >
                <div className="relative">
                  <img
                    src={thread.partner.avatarUrl}
                    alt={thread.partner.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-white/10"
                  />
                  {thread.partner.id === 'chef_ramsay' && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 border-2 border-white dark:border-accent-cardDark rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className={`text-xs font-black truncate flex items-center gap-0.5 ${
                      active ? 'text-white' : 'text-gray-800 dark:text-white'
                    }`}>
                      {thread.partner.name}
                      {thread.partner.isVerified && (
                        <Award className={`h-3.5 w-3.5 ${active ? 'text-white' : 'text-blue-500 fill-blue-500'}`} />
                      )}
                    </span>
                    <span className={`text-[8px] font-bold ${active ? 'text-white/70' : 'text-gray-400'}`}>
                      {new Date(thread.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={`text-[11px] truncate font-medium ${
                    active 
                      ? 'text-white/80' 
                      : thread.isRead ? 'text-gray-500 dark:text-gray-400' : 'font-extrabold text-gray-800 dark:text-white'
                  }`}>
                    {thread.lastMessage}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Messaging Panel */}
      <div className="flex-1 bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl overflow-hidden flex flex-col shadow-sm">
        {activeThread ? (
          <>
            {/* Header info */}
            <div className="p-4 border-b border-gray-100 dark:border-accent-borderDark flex justify-between items-center bg-gray-50/50 dark:bg-accent-slateDark/50">
              <div className="flex items-center gap-3">
                <img
                  src={activeThread.partner.avatarUrl}
                  alt={activeThread.partner.name}
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-100 dark:ring-gray-800"
                />
                <div>
                  <h3 className="text-xs font-black text-gray-800 dark:text-white flex items-center gap-0.5">
                    {activeThread.partner.name}
                    {activeThread.partner.isVerified && (
                      <Award className="h-3.5 w-3.5 text-blue-500 fill-blue-500" />
                    )}
                  </h3>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Circle className="h-1.5 w-1.5 fill-emerald-500 text-emerald-500 animate-pulse" />
                    Active Now
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 text-gray-400">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-accent-slateDark rounded-xl transition-colors">
                  <Phone className="h-4.5 w-4.5" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-accent-slateDark rounded-xl transition-colors">
                  <Video className="h-4.5 w-4.5" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-accent-slateDark rounded-xl transition-colors">
                  <MoreVertical className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/20 dark:bg-accent-slateDark/10">
              {activeMessages.map((msg) => {
                const self = msg.senderId !== activePartnerId;
                return (
                  <div key={msg.id} className={`flex ${self ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3.5 rounded-3xl text-xs leading-relaxed font-medium ${
                      self 
                        ? 'bg-brand-500 text-white rounded-tr-none shadow-md shadow-brand-500/5' 
                        : 'bg-white dark:bg-accent-slateDark border border-gray-100 dark:border-accent-borderDark text-gray-800 dark:text-gray-100 rounded-tl-none'
                    }`}>
                      {msg.content}
                      <span className={`block text-[8px] text-right mt-1 font-semibold opacity-60 ${
                        self ? 'text-white/80' : 'text-gray-400'
                      }`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Partner typing badge */}
              {isPartnerTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-accent-slateDark border border-gray-100 dark:border-accent-borderDark p-3 rounded-3xl rounded-tl-none flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 dark:border-accent-borderDark bg-white dark:bg-accent-cardDark flex gap-2">
              <button 
                type="button"
                className="p-3 bg-gray-50 dark:bg-accent-slateDark rounded-2xl hover:bg-gray-100 dark:hover:bg-accent-borderDark border border-transparent hover:border-gray-200 dark:hover:border-accent-borderDark text-gray-400"
              >
                <Image className="h-4.5 w-4.5" />
              </button>
              <button 
                type="button"
                className="p-3 bg-gray-50 dark:bg-accent-slateDark rounded-2xl hover:bg-gray-100 dark:hover:bg-accent-borderDark border border-transparent hover:border-gray-200 dark:hover:border-accent-borderDark text-gray-400"
              >
                <Smile className="h-4.5 w-4.5" />
              </button>

              <input
                type="text"
                placeholder={activePartnerId === 'chef_ramsay' ? "Season your text... ask Chef Ramsay AI anything" : "Type a culinary query..."}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-accent-slateDark border border-gray-100 dark:border-accent-borderDark rounded-2xl px-4 text-xs text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/10 placeholder-gray-400"
              />

              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white p-3.5 rounded-2xl shadow-md shadow-brand-500/15 transition-all flex items-center justify-center shrink-0"
              >
                <Send className="h-4.5 w-4.5 fill-white/10" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3 text-gray-400">
            <ChefHat className="h-10 w-10 text-gray-300 dark:text-gray-600" />
            <h4 className="font-extrabold text-sm text-gray-700 dark:text-gray-300">Select a Chef Channel</h4>
            <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
              Get raw advice or recipe reviews by opening a dialogue with verify community leaders.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
