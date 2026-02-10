'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Clock, ChevronRight } from 'lucide-react'

interface Client {
  id: string
  paymentId: string
  userName: string
  userAvatar: string | null
  createdAt: string
}

interface ClientListProps {
  clients: Client[]
}

export function ClientList({ clients }: ClientListProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-semibold mb-4">Pasien Terbaru</h2>
      
      {clients.length === 0 ? (
        <Card className="glass-card rounded-2xl p-8 text-center">
          <Users className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
          <p className="text-foreground/60">Belum ada pasien</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {clients.map((client, index) => (
            <motion.div
              key={client.paymentId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
            >
              <Link href={`/doctor/chat/${client.paymentId}`}>
                <Card className="glass-card rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center overflow-hidden">
                      {client.userAvatar ? (
                        <img src={client.userAvatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-6 h-6 text-green" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{client.userName}</p>
                      <div className="flex items-center gap-1 text-sm text-foreground/60">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(client.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-xl">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  )
}
