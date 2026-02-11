'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Plus, 
  Trash2, 
  MessageSquare, 
  Sparkles, 
  User, 
  Bot, 
  LayoutPanelLeft, 
  X,
  MessageCircle,
  PlusCircle,
  History
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// --- Interfaces ---
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface Chat {
  id: string;
  title: string;
  updated_at: string;
}

export function AiChatFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inisialisasi Supabase
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 1. Initialize User & Load History
  useEffect(() => {
    const anonymousId = localStorage.getItem('user_id') || `user-${Date.now()}`;
    localStorage.setItem('user_id', anonymousId);
    setUserId(anonymousId);
    if (isOpen) {
      loadChats();
    }
  }, [isOpen]);

  // 2. Load Messages when Chat selected
  useEffect(() => {
    if (selectedChatId) {
      loadMessages(selectedChatId);
    } else {
      setMessages([]);
    }
  }, [selectedChatId]);

  // 3. Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const loadChats = async () => {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .order('updated_at', { ascending: false });
    if (!error && data) setChats(data);
  };

  const loadMessages = async (chatId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    if (!error && data) setMessages(data);
  };

  const createNewChat = async () => {
    const { data, error } = await supabase
      .from('chats')
      .insert([{ user_id: userId, title: 'Diskusi Baru' }])
      .select()
      .single();

    if (!error && data) {
      setChats([data, ...chats]);
      setSelectedChatId(data.id);
      setShowHistory(false);
    }
  };

  const deleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    const { error } = await supabase.from('chats').delete().eq('id', chatId);
    if (!error) {
      setChats(chats.filter(c => c.id !== chatId));
      if (selectedChatId === chatId) setSelectedChatId(null);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !selectedChatId) return;

    const userText = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    try {
      // 1. Simpan pesan User ke Supabase
      const { data: userMsg, error: dbError } = await supabase
        .from('messages')
        .insert({ 
          chat_id: selectedChatId, 
          role: 'user', 
          content: userText 
        })
        .select()
        .single();

      if (dbError) throw dbError;
      setMessages(prev => [...prev, userMsg]);

      // 2. Format History (Gemini pakai 'model' bukan 'assistant')
      const formattedHistory = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // 3. Panggil API Route
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userText, 
          chatHistory: formattedHistory 
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // 4. Simpan Balasan AI ke Database
      const { data: aiMsg, error: aiDbError } = await supabase
        .from('messages')
        .insert({ 
          chat_id: selectedChatId, 
          role: 'assistant', 
          content: data.response 
        })
        .select()
        .single();

      if (aiDbError) throw aiDbError;
      setMessages(prev => [...prev, aiMsg]);

    } catch (err) {
      console.error("Kacau nih:", err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 45 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl shadow-slate-900/30 flex items-center justify-center group"
          >
            <Sparkles className="w-8 h-8 text-white transition-transform group-hover:scale-110" />
            <motion.div 
               animate={{ scale: [1, 1.2, 1] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center border-2 border-white"
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 100, scale: 0.9, x: 50 }}
            className="fixed bottom-6 right-6 z-50 w-[450px] max-w-[calc(100vw-3rem)] h-[650px] max-h-[calc(100vh-6rem)] flex flex-col"
          >
            <Card className="flex-1 rounded-[2.5rem] border-0 overflow-hidden flex flex-col shadow-2xl bg-white ring-1 ring-black/5 relative">
              
              {/* Sidebar Overlay (History) */}
              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    className="absolute inset-0 z-30 bg-white border-r border-slate-100 p-6 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="font-black text-xl text-slate-900">Riwayat Chat</h3>
                       <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)} className="rounded-xl">
                          <X className="w-5 h-5" />
                       </Button>
                    </div>

                    <Button 
                      onClick={createNewChat}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-6 font-bold shadow-lg shadow-slate-900/20 mb-6 gap-2"
                    >
                       <PlusCircle className="w-5 h-5" />
                       Diskusi Baru
                    </Button>

                    <div className="flex-1 overflow-y-auto space-y-1 pr-2">
                       {chats.map((chat) => (
                         <div
                           key={chat.id}
                           onClick={() => {
                             setSelectedChatId(chat.id);
                             setShowHistory(false);
                           }}
                           className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
                             selectedChatId === chat.id ? 'bg-rose-50 text-rose-700' : 'hover:bg-slate-50 text-slate-600'
                           }`}
                         >
                           <div className="flex items-center gap-3 truncate">
                             <MessageSquare size={18} className={selectedChatId === chat.id ? 'text-rose-500' : 'text-slate-400'} />
                             <span className="text-sm font-bold truncate">{chat.title}</span>
                           </div>
                           <button 
                             onClick={(e) => deleteChat(e, chat.id)}
                             className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-rose-500"
                           >
                             <Trash2 size={16} />
                           </button>
                         </div>
                       ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Header */}
              <div className="bg-white border-b border-slate-100 p-5 flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowHistory(true)}
                    className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-all text-slate-400"
                  >
                    <History className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center shadow-lg shadow-rose-200">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 leading-tight">Genting AI</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Asisten Kesehatan Bunda</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 scrollbar-hide">
                {!selectedChatId ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 px-4">
                    <div className="w-20 h-20 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex items-center justify-center animate-bounce">
                      <Bot size={40} className="text-rose-500" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 leading-tight">Halo, Bunda!</h4>
                      <p className="text-slate-400 font-bold text-sm mt-2">Ada yang bisa dibantu hari ini?</p>
                    </div>
                    <Button 
                      onClick={createNewChat}
                      className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-8 h-12 font-bold shadow-lg shadow-slate-900/10"
                    >
                      Mulai Konsultasi →
                    </Button>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, i) => (
                      <motion.div 
                        key={msg.id || i} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                            msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-rose-500'
                          }`}>
                            {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                          </div>
                          <div className={`px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm whitespace-pre-wrap ${
                            msg.role === 'user' 
                              ? 'bg-rose-500 text-white rounded-tr-none' 
                              : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                          <Bot size={14} className="text-rose-500" />
                        </div>
                        <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5 items-center">
                          <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-rose-400 rounded-full"></motion.span>
                          <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-rose-400 rounded-full"></motion.span>
                          <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-rose-400 rounded-full"></motion.span>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Footer Input */}
              {selectedChatId && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="p-5 bg-white border-t border-slate-100"
                >
                  <div className="relative group bg-slate-50 rounded-[1.5rem] border border-transparent focus-within:border-rose-100 focus-within:bg-white transition-all p-1.5 flex items-center">
                    <input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Tanya GENTING AI..."
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium px-3 text-slate-700 placeholder:text-slate-400"
                    />
                    <Button
                      type="submit"
                      disabled={!inputValue.trim() || isTyping}
                      size="icon"
                      className="w-10 h-10 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-all shadow-lg shadow-rose-200 shrink-0"
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </form>
              )}

            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
