'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Session } from '@/lib/supabaseClient'

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'submitted'>('all')

  useEffect(() => {
    loadSessions()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('sessions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sessions',
        },
        () => {
          loadSessions()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  async function loadSessions() {
    try {
      let query = supabase.from('sessions').select('*').order('created_at', { ascending: false })

      if (filter === 'active') {
        query = query.eq('is_submitted', false)
      } else if (filter === 'submitted') {
        query = query.eq('is_submitted', true)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error loading sessions:', error)
        return
      }

      setSessions(data || [])
      setLoading(false)
    } catch (err) {
      console.error('Load sessions error:', err)
      setLoading(false)
    }
  }

  const filteredSessions = sessions.filter((session) => {
    if (filter === 'active') return !session.is_submitted
    if (filter === 'submitted') return session.is_submitted
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Live Sessions</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md ${
                filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-md ${
                filter === 'active' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('submitted')}
              className={`px-4 py-2 rounded-md ${
                filter === 'submitted' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              Submitted
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sessions...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    USN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Started At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tab Switches
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Remaining
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No sessions found
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => {
                    const expiresAt = new Date(session.expires_at).getTime()
                    const now = Date.now()
                    const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000))
                    const minutes = Math.floor(remaining / 60)
                    const seconds = remaining % 60

                    return (
                      <tr key={session.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {session.usn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {session.student_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(session.started_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              session.is_submitted
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {session.is_submitted ? 'Submitted' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={
                              session.tab_switch_count > 0 ? 'text-red-600 font-semibold' : ''
                            }
                          >
                            {session.tab_switch_count}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {session.is_submitted ? (
                            <span className="text-gray-400">N/A</span>
                          ) : (
                            <span
                              className={
                                remaining < 300 ? 'text-red-600 font-semibold' : 'text-gray-700'
                              }
                            >
                              {minutes}:{seconds.toString().padStart(2, '0')}
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

