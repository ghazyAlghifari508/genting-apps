'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

export function useConsultationTimer(startedAt?: string, endedAt?: string) {
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }, [])

  useEffect(() => {
    if (!startedAt || endedAt) {
      if (endedAt && startedAt) {
        setElapsed(Math.floor((new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000))
      }
      return
    }

    const tick = () => {
      setElapsed(Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000))
    }

    tick()
    intervalRef.current = setInterval(tick, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [startedAt, endedAt])

  return { elapsed, formatted: formatTime(elapsed), isRunning: !!startedAt && !endedAt }
}
