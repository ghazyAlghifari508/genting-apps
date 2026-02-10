'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2,
  Sparkles,
  MinusCircle,
  Brain
} from 'lucide-react'
import { useChat } from '@ai-sdk/react'

interface GemiMomChatProps {
  userId?: string
}

export function GemiMomChat({ userId }: GemiMomChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [inputState, setInputState] = useState('')

  const chatHelpers = useChat({
    api: '/api/ai/chat',
    body: { userId },
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Halo Bunda! Gemi-Mom di sini, siap menemani perjalanan Bunda mencegah stunting dan menjaga kesehatan si kecil. Apa yang ingin Bunda tanyakan hari ini?',
      },
    ],
  } as any) as any

  const { messages, status, sendMessage } = chatHelpers
  const isLoading = chatHelpers.isLoading || status === 'submitted' || status === 'streaming'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputState(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputState.trim() || isLoading) return

    const userMessage = {
      role: 'user',
      content: inputState
    }
    
    if (sendMessage) {
      await sendMessage(userMessage)
    } else if (chatHelpers.append) {
      await chatHelpers.append(userMessage)
    }
    
    setInputState('')
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
            className="fixed bottom-24 right-6 z-50 w-16 h-16 rounded-[2rem] bg-gradient-to-br from-cerulean to-sea-green shadow-xl shadow-cerulean/30 flex items-center justify-center group"
          >
            <MessageCircle className="w-8 h-8 text-white transition-transform group-hover:scale-110" />
            <motion.div 
               animate={{ scale: [1, 1.2, 1] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="absolute -top-1 -right-1 w-6 h-6 bg-grapefruit rounded-full flex items-center justify-center border-2 border-white"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '600px'
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)]"
          >
            <Card className="rounded-[2.5rem] border-0 overflow-hidden flex flex-col h-full shadow-2xl bg-white ring-1 ring-black/5">
              {/* Header */}
              <div className="bg-gradient-to-r from-cerulean to-sea-green p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-lg">Gemi-Mom</h3>
                    <div className="flex items-center gap-1.5">
                       <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
                       <p className="text-xs text-white/80 font-medium italic">Asisten AI Budiman Bunda</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white"
                  >
                    <MinusCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              {!isMinimized && (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-slate-50/30">
                    {messages.map((message: any) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] p-4 rounded-[1.5rem] shadow-sm text-sm font-medium leading-relaxed ${
                            message.role === 'user'
                              ? 'bg-cerulean text-white rounded-br-none'
                              : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-slate-100 p-4 rounded-[1.5rem] rounded-bl-none shadow-sm">
                           <div className="flex gap-1">
                             <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-cerulean/40" />
                             <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-cerulean/60" />
                             <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-cerulean/80" />
                           </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleSubmit} className="p-5 bg-white border-t border-slate-100">
                    <div className="relative flex items-center">
                      <Input
                        value={inputState}
                        onChange={handleInputChange}
                        placeholder="Ketik pertanyaan Bunda..."
                        className="bg-slate-50 h-14 pl-5 pr-14 rounded-2xl border-0 ring-0 focus-visible:ring-1 focus-visible:ring-cerulean/20 font-medium"
                        disabled={isLoading}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !inputState.trim()}
                        className="absolute right-2 w-10 h-10 rounded-xl bg-cerulean hover:bg-cerulean/90 text-white shadow-lg shadow-cerulean/20"
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
