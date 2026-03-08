'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, MessageSquare, DollarSign, Calendar, Star, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface Notification {
  id: string
  title: string
  message: string
  notification_type: string
  is_read: boolean
  created_at: string
  action_url?: string
  reference_id?: string
}

interface NotificationsPanelProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'new_consultation':
      return <MessageSquare className="w-5 h-5 text-cerulean" />
    case 'message':
      return <MessageSquare className="w-5 h-5 text-cerulean" />
    case 'payment':
      return <DollarSign className="w-5 h-5 text-sea-green" />
    case 'reminder':
      return <Calendar className="w-5 h-5 text-apricot" />
    case 'review':
      return <Star className="w-5 h-5 text-apricot" />
    case 'system':
      return <AlertCircle className="w-5 h-5 text-slate-500" />
    default:
      return <Bell className="w-5 h-5 text-slate-400" />
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'new_consultation':
      return 'bg-cerulean/10 border-cerulean/20'
    case 'message':
      return 'bg-cerulean/10 border-cerulean/20'
    case 'payment':
      return 'bg-sea-green/10 border-sea-green/20'
    case 'reminder':
      return 'bg-apricot/10 border-apricot/20'
    case 'review':
      return 'bg-apricot/10 border-apricot/20'
    case 'system':
      return 'bg-slate-50 border-slate-200'
    default:
      return 'bg-slate-50 border-slate-200'
  }
}

export default function NotificationsPanel({ notifications, onMarkAsRead }: NotificationsPanelProps) {
  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <Card className="rounded-[2.5rem] p-8 border-white/50 bg-white/70 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black tracking-tight text-slate-900">Notifikasi</h3>
          <p className="text-sm text-slate-500 font-medium">
            {unreadCount > 0 ? `${unreadCount} belum dibaca` : 'Semua sudah dibaca'}
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-cerulean/10 flex items-center justify-center">
          <Bell className="w-6 h-6 text-cerulean" />
        </div>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-[2rem] bg-slate-50/50 border border-dashed border-slate-200">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 font-bold">Tidak ada notifikasi</p>
            <p className="text-xs text-slate-400 mt-1">Notifikasi akan muncul di sini</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-5 rounded-[2rem] border transition-all duration-300 cursor-pointer hover:shadow-md ${
                notification.is_read
                  ? 'bg-slate-50/30 border-slate-100'
                  : `${getNotificationColor(notification.notification_type)} border-2`
              }`}
              onClick={() => !notification.is_read && onMarkAsRead(notification.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  notification.is_read ? 'bg-white border border-slate-100' : getNotificationColor(notification.notification_type)
                }`}>
                  {getNotificationIcon(notification.notification_type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h4 className={`text-sm font-black text-slate-900 mb-1 ${
                        !notification.is_read ? 'font-extrabold' : ''
                      }`}>
                        {notification.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <div className="w-2 h-2 rounded-full bg-cerulean flex-shrink-0 mt-1" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      {format(new Date(notification.created_at), 'dd MMM yyyy • HH:mm', { locale: id })}
                    </span>
                    {notification.action_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-3 text-xs font-bold text-cerulean hover:bg-cerulean/10 rounded-xl"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.location.href = notification.action_url!
                        }}
                      >
                        Lihat
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <Button 
          variant="ghost" 
          className="w-full mt-6 rounded-2xl h-14 font-bold text-slate-400 hover:text-cerulean hover:bg-cerulean/5 transition-all"
        >
          Lihat Semua Notifikasi
        </Button>
      )}
    </Card>
  )
}

