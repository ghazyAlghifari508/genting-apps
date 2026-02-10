'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Trash2, MessageSquare, Sparkles, User, Bot, LayoutPanelLeft, ChevronLeft } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

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

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userId, setUserId] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    loadChats();
  }, []);

  // 2. Load Messages when Chat selected
  useEffect(() => {
    if (selectedChatId) {
      loadMessages(selectedChatId);
    } else {
      setMessages([]);
    }
  }, [selectedChatId]);

  // 3. Auto Scroll & Textarea Height
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

    // 2. Format History dengan Benar (Gemini pakai 'model' bukan 'assistant')
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

    // Tambahkan ke UI
    setMessages(prev => [...prev, aiMsg]);

  } catch (err) {
    console.error("Kacau nih:", err);
    // Tambahkan pesan error palsu ke UI agar user tahu
  } finally {
    setIsTyping(false);
  }
};

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-rose-100">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-r border-slate-200 bg-white flex flex-col z-20`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-rose-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200">
              <Sparkles className="text-white" size={22} />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Genting AI
            </span>
          </div>

          <button
            onClick={createNewChat}
            className="w-full group flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-2xl font-semibold transition-all active:scale-[0.98] shadow-md"
          >
            <Plus size={18} />
            <span>Diskusi Baru</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-1">
          <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Riwayat Chat</p>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              className={`group flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all ${
                selectedChatId === chat.id ? 'bg-rose-50 text-rose-700' : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <MessageSquare size={16} className={selectedChatId === chat.id ? 'text-rose-500' : 'text-slate-400'} />
                <span className="text-sm font-medium truncate">{chat.title}</span>
              </div>
              <button 
                onClick={(e) => deleteChat(e, chat.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-rose-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
        {/* Header */}
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
            >
              <LayoutPanelLeft size={20} />
            </button>
            <h2 className="font-bold text-slate-800 italic">Asisten Kesehatan Bunda</h2>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto pb-36">
          <div className="max-w-3xl mx-auto pt-10 px-6 space-y-8">
            {!selectedChatId ? (
              <div className="text-center space-y-6 py-20">
                <div className="inline-flex p-5 bg-white rounded-3xl shadow-xl shadow-slate-200/50 mb-4 animate-bounce">
                  <Bot size={48} className="text-rose-500" />
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  Halo, Bunda! <br/>
                  <span className="text-rose-500 underline decoration-rose-200">Ada yang bisa dibantu?</span>
                </h1>
                <button 
                  onClick={createNewChat}
                  className="px-8 py-3 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all font-medium text-slate-600"
                >
                  Mulai konsultasi sekarang →
                </button>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={msg.id || i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                  <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-rose-500'
                    }`}>
                      {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                    </div>
                    <div className={`px-5 py-3.5 rounded-[22px] text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                      msg.role === 'user' 
                        ? 'bg-rose-500 text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isTyping && (
              <div className="flex gap-4 justify-start">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <Bot size={18} className="text-rose-500" />
                </div>
                <div className="bg-white px-5 py-4 rounded-[22px] rounded-tl-none shadow-sm flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Floating Input */}
        {selectedChatId && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent">
            <div className="max-w-3xl mx-auto">
              <div className="relative group bg-white rounded-[26px] shadow-2xl shadow-slate-300/40 border border-slate-200/50 p-2 transition-all focus-within:ring-4 focus-within:ring-rose-100">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ketik pesan Bunda di sini..."
                  rows={1}
                  className="w-full pl-5 pr-14 py-4 bg-transparent border-none focus:ring-0 resize-none text-slate-700 placeholder:text-slate-400"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2.5 bottom-2.5 p-3.5 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-100 text-white rounded-[18px] transition-all active:scale-95 shadow-lg shadow-rose-200"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}