'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'

interface LoadingScreenProps {
  message?: string
  fullScreen?: boolean
}

export function LoadingScreen({ message = 'Memuat...', fullScreen = false }: LoadingScreenProps) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-8">
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-cerulean/20 rounded-full blur-2xl animate-pulse" />
        
        {/* Animated Rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative w-20 h-20 rounded-full border-4 border-cerulean/10 border-t-cerulean"
        />
        
        {/* Center Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cerulean to-sea-green flex items-center justify-center shadow-lg">
            <Leaf className="w-5 h-5 text-white" />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <p className="text-lg font-black tracking-tight text-slate-900 group">
          GENTING<span className="text-cerulean">.</span>
        </p>
        <div className="flex items-center gap-1 justify-center">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{message}</span>
           <motion.span
             animate={{ opacity: [0, 1, 0] }}
             transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1] }}
             className="w-1 h-1 rounded-full bg-cerulean"
           />
           <motion.span
             animate={{ opacity: [0, 1, 0] }}
             transition={{ duration: 1.5, repeat: Infinity, delay: 0.2, times: [0, 0.5, 1] }}
             className="w-1 h-1 rounded-full bg-cerulean"
           />
           <motion.span
             animate={{ opacity: [0, 1, 0] }}
             transition={{ duration: 1.5, repeat: Infinity, delay: 0.4, times: [0, 0.5, 1] }}
             className="w-1 h-1 rounded-full bg-cerulean"
           />
        </div>
      </motion.div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-floral flex items-center justify-center">
        {content}
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      {content}
    </div>
  )
}
