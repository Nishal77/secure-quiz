'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { validateUSN, validateName } from '@/lib/validation'

export default function LoginPage() {
  const router = useRouter()
  const [usn, setUsn] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate inputs
    const usnValidation = validateUSN(usn)
    if (!usnValidation.valid) {
      setError(usnValidation.error || 'Invalid USN')
      return
    }

    const nameValidation = validateName(name)
    if (!nameValidation.valid) {
      setError(nameValidation.error || 'Invalid name')
      return
    }

    setLoading(true)

    try {
      // Get active event first
      const { data: events, error: eventError } = await supabase
        .from('events')
        .select('id')
        .eq('is_active', true)
        .single()

      if (eventError || !events) {
        setError('No active quiz event found. Please contact administrator.')
        setLoading(false)
        return
      }

      // Call edge function to start session
      const { data, error: sessionError } = await supabase.functions.invoke('start-session', {
        body: {
          usn: usn.trim().toUpperCase(),
          name: name.trim(),
          eventId: events.id,
        },
      })

      if (sessionError) {
        console.error('Session error:', sessionError)
        
        // Handle different error types
        let errorMessage = 'Failed to start quiz session. Please try again.'
        
        if (sessionError.message) {
          errorMessage = sessionError.message
        } else if (sessionError.error) {
          errorMessage = sessionError.error
        } else if (typeof sessionError === 'string') {
          errorMessage = sessionError
        }
        
        // Check for specific error codes
        if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
          errorMessage = 'Authentication failed. Please contact administrator.'
        } else if (errorMessage.includes('404') || errorMessage.includes('not found')) {
          errorMessage = 'Event or questions not found. Please contact administrator.'
        } else if (errorMessage.includes('No questions')) {
          errorMessage = 'No questions available for this event. Please contact administrator.'
        }
        
        setError(errorMessage)
        setLoading(false)
        return
      }

      if (!data || !data.sessionId) {
        console.error('No session ID in response:', data)
        setError('Failed to create session. No session ID returned. Please try again.')
        setLoading(false)
        return
      }

      // Store session info in localStorage for quick access
      localStorage.setItem('quiz_session_id', data.sessionId)
      localStorage.setItem('quiz_usn', usn.trim().toUpperCase())
      localStorage.setItem('quiz_name', name.trim())

      // Redirect to user dashboard
      router.push(`/user/dashboard?sessionId=${data.sessionId}`)
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Platform</h1>
            <p className="text-gray-600">Enter your details to begin</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="usn" className="block text-sm font-medium text-gray-700 mb-2">
                USN (University Seat Number)
              </label>
              <input
                id="usn"
                type="text"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your USN"
                required
                disabled={loading}
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
                disabled={loading}
                autoComplete="off"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Starting Quiz...' : 'Start Quiz'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

