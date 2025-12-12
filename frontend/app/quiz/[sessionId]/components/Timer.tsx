'use client'

import { formatTime } from '@/lib/timer'

interface TimerProps {
  timeRemaining: number
  isExpired: boolean
}

export function Timer({ timeRemaining, isExpired }: TimerProps) {
  const isWarning = timeRemaining < 300 // Less than 5 minutes
  const isCritical = timeRemaining < 60 // Less than 1 minute

  return (
    <div className={`fixed top-4 right-4 sm:top-5 sm:right-5 z-50 px-4 py-2.5 rounded-lg transition-all ${
      isCritical
        ? 'bg-red-500 text-white'
        : isWarning
        ? 'bg-amber-500 text-white'
        : 'bg-indigo-600 text-white'
    }`}>
      <div className="flex items-center gap-2.5">
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-base font-semibold font-mono tracking-wide">
          {isExpired ? '00:00' : formatTime(timeRemaining)}
        </span>
      </div>
    </div>
  )
}
