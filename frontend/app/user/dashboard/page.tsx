'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import type { Session } from '@/lib/supabaseClient'

export default function UserDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('sessionId') || 
    (typeof window !== 'undefined' ? localStorage.getItem('quiz_session_id') : null)

  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const currentSessionId = sessionId || 
      (typeof window !== 'undefined' ? localStorage.getItem('quiz_session_id') : null)

    if (!currentSessionId) {
      setError('No session found. Please login again.')
      setLoading(false)
      return
    }

    async function loadSession() {
      try {
        const { data: sessionData, error: sessionError } = await supabase
          .from('sessions')
          .select('*')
          .eq('id', currentSessionId)
          .single()

        if (sessionError) {
          console.error('Session load error:', sessionError)
          setError('Session not found. Please login again.')
          setLoading(false)
          return
        }

        if (!sessionData) {
          setError('Session not found. Please login again.')
          setLoading(false)
          return
        }

        setSession(sessionData)
        setLoading(false)
      } catch (err) {
        console.error('Load session error:', err)
        setError('Failed to load session. Please try again.')
        setLoading(false)
      }
    }

    if (currentSessionId) {
      loadSession()
    }
  }, [sessionId])

  const handleStartQuiz = () => {
    const currentSessionId = sessionId || 
      (typeof window !== 'undefined' ? localStorage.getItem('quiz_session_id') : null)
    
    if (currentSessionId) {
      router.push(`/quiz/${currentSessionId}`)
    } else {
      setError('Session ID not found. Please login again.')
      router.push('/')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center border border-gray-200">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Go Back to Login
          </button>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {session.student_name}!
            </h1>
            <p className="text-lg text-gray-600">USN: {session.usn}</p>
            </div>

          {/* Quiz Instructions - Clean and Professional */}
            {!session.is_submitted && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quiz Instructions</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>
                    <strong className="text-gray-900">Tab Switching is Prohibited:</strong> Switching tabs, minimizing the browser, or opening other applications will result in immediate disqualification. Your quiz will be automatically submitted with penalties.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>You have a limited time to complete the quiz. The timer starts when you begin and cannot be paused.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Answers are automatically saved as you navigate between questions.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Use navigation buttons to move between questions. Review all answers before final submission.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Ensure stable internet connection. Do not refresh the page during the quiz.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>All activities are monitored and logged for security purposes.</span>
                </li>
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {!session.is_submitted ? (
                <button
                  onClick={handleStartQuiz}
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-semibold"
                >
                  Start Quiz
                </button>
              ) : (
                <button
                  onClick={() => router.push(`/quiz/${session.id}/result`)}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-semibold"
                >
                  View Results
                </button>
              )}
              <button
                onClick={() => router.push('/')}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Logout
              </button>
          </div>
        </div>
      </div>
    </div>
  )
}
