import { createClient } from '@/lib/supabase/server'
import { GemiMomChat } from '@/components/gemi-mom-chat'
import { redirect } from 'next/navigation'
import { Bot } from 'lucide-react'

export const metadata = {
  title: 'Gemi-Mom | GENTING',
  description: 'Asisten AI pencegah stunting',
}

export default async function ChatPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Gemi-Mom Chat</h1>
        <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
          Konsultasi cerdas seputar kesehatan Bunda & Si Kecil bersama AI <Bot className="w-5 h-5 text-cerulean" />
        </p>
      </div>

      <div className="flex-1 relative bg-white rounded-[2.5rem] shadow-2xl shadow-cerulean/5 border-0 overflow-hidden">
        <GemiMomChat userId={user.id} />
        
        {/* Subtle Background Accents for Chat Area */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
           <div className="absolute top-0 right-0 w-64 h-64 bg-cerulean/5 rounded-full blur-3xl opacity-50" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-sea-green/5 rounded-full blur-3xl opacity-50" />
        </div>
      </div>
    </div>
  )
}
