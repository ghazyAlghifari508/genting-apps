'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  X,
  PlusCircle,
  History,
  Trash2,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  getChats,
  createChat,
  deleteChat,
  saveUserMessage,
  saveAiMessage,
  getMessages,
} from '@/app/actions/chat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chats when panel opens
  useEffect(() => {
    if (isOpen) {
      loadChats();
    }
  }, [isOpen]);

  // Load messages when a chat is selected
  useEffect(() => {
    if (!selectedChatId) return;
    
    const loadMessages = async () => {
      try {
        const data = await getMessages(selectedChatId);
        setMessages(data.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content
        })));
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    loadMessages();
  }, [selectedChatId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const loadChats = async () => {
    try {
      const data = await getChats();
      setChats(data);
    } catch (err) {
      console.error('Failed to load chats:', err);
    }
  };

  const handleCreateNewChat = async () => {
    try {
      const newChat = await createChat('Diskusi Baru');
      if (newChat) {
        setChats([newChat, ...chats]);
        setSelectedChatId(newChat.id);
        setMessages([]);
        setShowHistory(false);
      }
    } catch (err) {
      console.error('Failed to create chat:', err);
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    try {
      await deleteChat(chatId);
      setChats(chats.filter(c => c.id !== chatId));
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  const sendMessage = useCallback(async () => {
    if (!inputValue.trim() || !selectedChatId || isTyping) return;

    const userText = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    const userMsg: Message = { id: `user-${Date.now()}`, role: 'user', content: userText };
    const aiPlaceholderId = `ai-${Date.now()}`;
    setMessages(prev => [...prev, userMsg]);

    try {
      // Save user message to DB
      await saveUserMessage(selectedChatId, userText);

      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history, message: userText }),
      });

      if (!res.ok || !res.body) throw new Error('No response body');

      // Read SSE stream — update UI word-by-word
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (!line.startsWith('data: ') || line === 'data: [DONE]') continue;
          try {
            const json = JSON.parse(line.slice(6));
            const delta = json.choices?.[0]?.delta?.content || '';
            if (delta) {
              fullText += delta;
              setMessages(prev => {
                const hasPlaceholder = prev.some(m => m.id === aiPlaceholderId);
                if (hasPlaceholder) {
                  return prev.map(m => m.id === aiPlaceholderId ? { ...m, content: fullText } : m);
                } else {
                  return [...prev, { id: aiPlaceholderId, role: 'assistant', content: fullText }];
                }
              });
            }
          } catch { /* skip malformed chunks */ }
        }
      }

      // Save complete AI response to DB
      await saveAiMessage(selectedChatId, fullText);
    } catch (err) {
      console.error('Chat Error:', err);
      setMessages(prev => {
        const hasPlaceholder = prev.some(m => m.id === aiPlaceholderId);
        if (hasPlaceholder) {
          return prev.map(m => m.id === aiPlaceholderId ? { ...m, content: 'Maaf, terjadi kesalahan koneksi. Silakan coba lagi.' } : m);
        } else {
          return [...prev, { id: aiPlaceholderId, role: 'assistant', content: 'Maaf, terjadi kesalahan koneksi. Silakan coba lagi.' }];
        }
      });
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, selectedChatId, isTyping, messages]);

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
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 shadow-lg flex items-center justify-center group"
          >
            <Sparkles className="w-8 h-8 text-white transition-transform group-hover:scale-110" />
            <motion.div 
               animate={{ scale: [1, 1.2, 1] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="absolute -top-1 -right-1 w-6 h-6 bg-doccure-teal rounded-full flex items-center justify-center border-2 border-white"
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
                      onClick={handleCreateNewChat}
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
                             setMessages([]);
                             setShowHistory(false);
                           }}
                           className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
                             selectedChatId === chat.id ? 'bg-doccure-teal/10 text-doccure-dark' : 'hover:bg-slate-50 text-slate-600'
                           }`}
                         >
                           <div className="flex items-center gap-3 truncate">
                             <MessageSquare size={18} className={selectedChatId === chat.id ? 'text-doccure-teal' : 'text-slate-400'} />
                             <span className="text-sm font-bold truncate">{chat.title}</span>
                           </div>
                           <button 
                             onClick={(e) => handleDeleteChat(e, chat.id)}
                             className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-slate-600"
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
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-doccure-teal to-doccure-dark flex items-center justify-center shadow-md">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 leading-tight">Genting AI</h3>
                    <p className="text-[10px] font-bold text-doccure-teal uppercase tracking-widest">
                      {isTyping ? 'Sedang mengetik...' : 'Asisten Kesehatan Bunda'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 hover:text-slate-600 transition-all text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 scrollbar-hide">
                {!selectedChatId ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 px-4">
                    <div className="w-20 h-20 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex items-center justify-center animate-bounce">
                      <Bot size={40} className="text-doccure-teal" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 leading-tight">Halo, Bunda!</h4>
                      <p className="text-slate-400 font-bold text-sm mt-2">Ada yang bisa dibantu hari ini?</p>
                    </div>
                    <Button 
                      onClick={handleCreateNewChat}
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
                            msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-doccure-teal'
                          }`}>
                            {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                          </div>
                          <div className={`px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm w-full overflow-hidden break-words ${
                            msg.role === 'user' 
                              ? 'bg-doccure-teal text-white rounded-tr-none' 
                              : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                          }`}>
                            {msg.role === 'user' ? (
                              <div className="whitespace-pre-wrap">{msg.content}</div>
                            ) : (
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  p: ({...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                  ul: ({...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                                  ol: ({...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                                  li: ({...props}) => <li className="mb-1" {...props} />,
                                  strong: ({...props}) => <strong className="font-bold text-slate-900" {...props} />,
                                  em: ({...props}) => <em className="italic" {...props} />,
                                  table: ({...props}) => (
                                    <div className="overflow-x-auto mb-2 w-full">
                                      <table className="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-lg" {...props} />
                                    </div>
                                  ),
                                  th: ({...props}) => <th className="px-3 py-2 bg-slate-50 text-left text-xs font-semibold text-slate-600 uppercase" {...props} />,
                                  td: ({...props}) => <td className="px-3 py-2 text-sm border-t border-slate-100" {...props} />,
                                  a: ({...props}) => <a className="text-doccure-teal hover:underline font-semibold" target="_blank" rel="noopener noreferrer" {...props} />,
                                }}
                              >
                                {msg.content || ''}
                              </ReactMarkdown>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && messages[messages.length - 1]?.role !== 'assistant' && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                          <Bot size={14} className="text-doccure-teal" />
                        </div>
                        <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5 items-center">
                          <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-doccure-teal/60 rounded-full" />
                          <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-doccure-teal/60 rounded-full" />
                          <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-doccure-teal/60 rounded-full" />
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
                  onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                  className="p-5 bg-white border-t border-slate-100"
                >
                  <div className="relative group bg-slate-50 rounded-[1.5rem] border border-transparent focus-within:border-doccure-teal/20 focus-within:bg-white transition-all p-1.5 flex items-center">
                    <input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Tanya GENTING AI..."
                      disabled={isTyping}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium px-3 text-slate-700 placeholder:text-slate-400 outline-none disabled:opacity-50"
                    />
                    <Button
                      type="submit"
                      disabled={!inputValue.trim() || isTyping}
                      size="icon"
                      className="w-10 h-10 bg-doccure-teal hover:bg-doccure-dark text-white rounded-xl transition-all shadow-md shrink-0"
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
