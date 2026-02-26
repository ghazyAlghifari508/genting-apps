import { motion } from 'framer-motion'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RemindersCardProps {
  reminders: string[]
  currentWeek: number
}

export function RemindersCard({ reminders, currentWeek }: RemindersCardProps) {
  return (
    <div className="bg-[#1e293b] rounded-[32px] p-1 shadow-xl overflow-hidden relative group transition-colors">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
      
      <div className="p-6 relative z-10 transition-colors">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Bell className="w-5 h-5 text-doccure-yellow" />
          </motion.div>
          Smart Reminders
        </h3>
        
        <div className="space-y-4 transition-colors">
          {reminders.map((reminder, idx) => (
            <div key={idx} className="flex gap-4 group/item">
              <div className="w-1 h-12 bg-doccure-teal/20 group-hover/item:bg-doccure-teal rounded-full transition-colors shrink-0" />
              <div>
                <p className="text-sm font-medium text-white/90 leading-snug group-hover/item:text-white transition-colors">{reminder}</p>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1 inline-block transition-colors">PENTING • MINGGU {currentWeek}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white/5 p-4 flex justify-center transition-colors">
        <Button variant="ghost" className="text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest px-8">
          Lihat Semua Notifikasi
        </Button>
      </div>
    </div>
  )
}
