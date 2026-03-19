import { motion } from 'framer-motion'
import { Star, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ProfileCardProps {
  fullName: string
  firstName: string
  profileCompletion: number
  avatarUrl?: string | null
}

export function ProfileCard({ fullName, firstName, profileCompletion, avatarUrl }: ProfileCardProps) {
  return (
    <div className="bg-white  border border-slate-200  rounded-2xl p-6 shadow-sm relative overflow-hidden transition-colors">
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-50  rounded-full blur-xl" />
      
      <div className="flex gap-4 mb-6 relative z-10">
        <div className="relative group">
          <div className="w-16 h-16 rounded-full bg-slate-100  flex items-center justify-center border-4 border-slate-50  shadow-inner overflow-hidden transition-all group-hover:scale-105 duration-300">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={fullName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-doccure-teal flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          <motion.div 
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 bg-doccure-yellow rounded-full p-1 border-2 border-white  shadow-sm transition-colors"
          >
            <Star size={10} className="text-doccure-dark" fill="currentColor" />
          </motion.div>
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <h4 className="text-lg font-bold text-slate-900  truncate transition-colors">{fullName || firstName}</h4>
          <p className="text-xs font-bold text-slate-500  uppercase tracking-widest leading-none transition-colors">Profil Kehamilan</p>
        </div>
      </div>

      <div className="p-4 bg-slate-50  rounded-2xl border border-slate-100  mb-6 transition-colors">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-500  uppercase tracking-wider">Kelengkapan Data</span>
          <span className="text-sm font-bold text-doccure-teal">{profileCompletion}%</span>
        </div>
        <div className="h-2 bg-slate-200  rounded-full overflow-hidden transition-colors">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${profileCompletion}%` }}
            className="h-full bg-doccure-teal rounded-full" 
          />
        </div>
      </div>

      <Button asChild variant="outline" className="w-full border-slate-200  text-slate-700  font-bold h-11 rounded-xl shadow-sm hover:bg-slate-50  transition-colors">
        <Link href="/profile">Edit Profil Lengkap</Link>
      </Button>
    </div>
  )
}
