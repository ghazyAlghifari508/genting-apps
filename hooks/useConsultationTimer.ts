'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'

export function useConsultationTimer(startedAt?: string, endedAt?: string) {
  const [now, setNow] = useState(() => Date.now())

  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }, [])

  useEffect(() => {
    if (!startedAt || endedAt) {
      return
    }

    const intervalId = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(intervalId)
  }, [startedAt, endedAt])

  const elapsed = useMemo(() => {
    if (!startedAt) return 0

    const startTimestamp = new Date(startedAt).getTime()
    if (Number.isNaN(startTimestamp)) return 0

    const endTimestamp = endedAt ? new Date(endedAt).getTime() : now
    if (Number.isNaN(endTimestamp)) return 0

    return Math.max(0, Math.floor((endTimestamp - startTimestamp) / 1000))
  }, [startedAt, endedAt, now])

  return { elapsed, formatted: formatTime(elapsed), isRunning: !!startedAt && !endedAt }
}
