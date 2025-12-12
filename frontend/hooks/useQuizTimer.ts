'use client'

import { useState, useEffect, useCallback } from 'react'

const QUIZ_DURATION = 15 * 60 // 15 minutes in seconds
const STORAGE_KEY_PREFIX = 'quiz_timer_'

interface UseQuizTimerProps {
  sessionId: string
  onExpire: () => void
}

export function useQuizTimer({ sessionId, onExpire }: UseQuizTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(QUIZ_DURATION)
  const [isExpired, setIsExpired] = useState(false)

  // Get or initialize quiz start time
  const getQuizStartTime = useCallback(() => {
    if (typeof window === 'undefined') return null
    
    const storageKey = `${STORAGE_KEY_PREFIX}${sessionId}`
    const stored = localStorage.getItem(storageKey)
    
    if (stored) {
      return parseInt(stored, 10)
    }
    
    // Initialize timer if not exists
    const startTime = Date.now()
    localStorage.setItem(storageKey, startTime.toString())
    return startTime
  }, [sessionId])

  // Calculate remaining time
  const calculateRemaining = useCallback((startTime: number): number => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    const remaining = Math.max(0, QUIZ_DURATION - elapsed)
    return remaining
  }, [])

  // Update timer
  useEffect(() => {
    const startTime = getQuizStartTime()
    if (!startTime) return

    // Initial calculation
    const initialRemaining = calculateRemaining(startTime)
    setTimeRemaining(initialRemaining)
    setIsExpired(initialRemaining <= 0)

    // Update timer every second
    const interval = setInterval(() => {
      const remaining = calculateRemaining(startTime)
      setTimeRemaining(remaining)
      setIsExpired(remaining <= 0)

      if (remaining <= 0) {
        clearInterval(interval)
        setIsExpired(true)
        onExpire()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [sessionId, getQuizStartTime, calculateRemaining, onExpire])

  // Cleanup on unmount or session end
  useEffect(() => {
    return () => {
      // Don't cleanup on unmount - we want it to persist
      // Only cleanup when quiz is submitted
    }
  }, [])

  return {
    timeRemaining,
    isExpired,
  }
}

// Helper to clear timer storage (call when quiz is submitted)
export function clearQuizTimer(sessionId: string) {
  if (typeof window === 'undefined') return
  const storageKey = `${STORAGE_KEY_PREFIX}${sessionId}`
  localStorage.removeItem(storageKey)
}
