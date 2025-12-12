'use client'

import { useRouter } from 'next/navigation'

export default function ResultPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
            className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
                />
              </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Quiz Submitted Successfully!</h1>
      </div>
    </div>
  )
}
