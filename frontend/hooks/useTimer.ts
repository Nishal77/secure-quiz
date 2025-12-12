'use client'

import { useState, useEffect, useCallback } from 'react'
import { calculateTimeRemaining, isTimerExpired } from '@/lib/timer'
import { QUIZ_CONFIG } from '@/lib/constants'

interface UseTimerProps {
  expiresAt: string
  onExpire: () => void
}

export function useTimer({ expiresAt, onExpire }: UseTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [serverTime, setServerTime] = useState(0)
  const [clientTime, setClientTime] = useState(Date.now())
  const [offset, setOffset] = useState(0)
  const [isExpired, setIsExpired] = useState(false)

  // Fetch server time
  const syncServerTime = useCallback(async () => {
    try {
      const response = await fetch('/api/server-time')
      const data = await response.json()
      const serverTimeMs = new Date(data.serverTime).getTime()
      const clientTimeMs = Date.now()
      const newOffset = serverTimeMs - clientTimeMs

      setServerTime(serverTimeMs)
      setClientTime(clientTimeMs)
      setOffset(newOffset)
    } catch (error) {
      console.error('Failed to sync server time:', error)
    }
  }, [])

  // Update timer
  useEffect(() => {
    if (!expiresAt) return

    // Initial sync
    syncServerTime()

    // Periodic sync
    const syncInterval = setInterval(syncServerTime, QUIZ_CONFIG.SERVER_TIME_SYNC_INTERVAL)

    // Timer update interval
    const timerInterval = setInterval(() => {
      const now = Date.now()
      setClientTime(now)
      const remaining = calculateTimeRemaining(expiresAt, serverTime, now, offset)
      setTimeRemaining(remaining)
      setIsExpired(isTimerExpired(remaining))

      if (isTimerExpired(remaining)) {
        onExpire()
      }
    }, QUIZ_CONFIG.TIMER_UPDATE_INTERVAL)

    return () => {
      clearInterval(syncInterval)
      clearInterval(timerInterval)
    }
  }, [expiresAt, serverTime, offset, syncServerTime, onExpire])

  return {
    timeRemaining,
    isExpired,
    serverTime,
    clientTime,
    offset,
  }
}

