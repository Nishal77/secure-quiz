'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Event {
  id: string
  name: string
  description: string | null
  duration_minutes: number
  start_time: string | null
  end_time: string | null
  is_active: boolean
  created_at: string
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_minutes: 60,
    start_time: '',
    end_time: '',
  })

  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading events:', error)
        return
      }

      setEvents(data || [])
      setLoading(false)
    } catch (err) {
      console.error('Load events error:', err)
      setLoading(false)
    }
  }

  async function handleCreateEvent() {
    if (!formData.name || !formData.duration_minutes) {
      alert('Please fill in all required fields')
      return
    }

    setUploading(true)

    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          name: formData.name,
          description: formData.description || null,
          duration_minutes: formData.duration_minutes,
          start_time: formData.start_time || null,
          end_time: formData.end_time || null,
          is_active: false,
        })
        .select()
        .single()

      if (error) {
        alert('Failed to create event: ' + error.message)
        return
      }

      // If file is provided, upload questions
      if (file && data) {
        await uploadQuestions(data.id, file)
      }

      setShowCreateModal(false)
      setFormData({
        name: '',
        description: '',
        duration_minutes: 60,
        start_time: '',
        end_time: '',
      })
      setFile(null)
      loadEvents()
    } catch (err) {
      console.error('Create event error:', err)
      alert('Failed to create event')
    } finally {
      setUploading(false)
    }
  }

  async function uploadQuestions(eventId: string, file: File) {
    const text = await file.text()
    const lines = text.split('\n').filter((line) => line.trim())

    // Parse CSV format: question,option_a,option_b,option_c,option_d,correct_answer,marks,negative_marks
    const questions = []
    for (let i = 1; i < lines.length; i++) {
      const [question, optionA, optionB, optionC, optionD, correctAnswer, marks, negativeMarks] =
        lines[i].split(',')

      if (question && optionA && optionB && optionC && optionD && correctAnswer) {
        questions.push({
          event_id: eventId,
          question_text: question.trim(),
          option_a: optionA.trim(),
          option_b: optionB.trim(),
          option_c: optionC.trim(),
          option_d: optionD.trim(),
          correct_answer: correctAnswer.trim().toUpperCase(),
          marks: parseInt(marks) || 1,
          negative_marks: parseFloat(negativeMarks) || 0.15,
        })
      }
    }

    if (questions.length > 0) {
      const { error } = await supabase.from('questions').insert(questions)

      if (error) {
        alert('Failed to upload questions: ' + error.message)
        throw error
      }
    }
  }

  async function toggleEventActive(eventId: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('events')
        .update({ is_active: !currentStatus })
        .eq('id', eventId)

      if (error) {
        alert('Failed to update event status')
        return
      }

      loadEvents()
    } catch (err) {
      console.error('Toggle event error:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create Event
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{event.name}</h2>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      event.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {event.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {event.description && (
                  <p className="text-gray-600 mb-4 text-sm">{event.description}</p>
                )}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>Duration: {event.duration_minutes} minutes</p>
                  {event.start_time && (
                    <p>Start: {new Date(event.start_time).toLocaleString()}</p>
                  )}
                  {event.end_time && <p>End: {new Date(event.end_time).toLocaleString()}</p>}
                </div>
                <button
                  onClick={() => toggleEventActive(event.id, event.is_active)}
                  className={`w-full px-4 py-2 rounded-md ${
                    event.is_active
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {event.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Event</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) =>
                      setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Questions CSV
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: question,option_a,option_b,option_c,option_d,correct_answer,marks,negative_marks
                  </p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEvent}
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {uploading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

