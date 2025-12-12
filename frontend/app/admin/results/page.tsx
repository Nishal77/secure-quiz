'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Result, Session } from '@/lib/supabaseClient'

interface ResultWithSession extends Result {
  session: Session
}

type SortField = 'usn' | 'name' | 'final_score' | 'calculated_at'
type SortOrder = 'asc' | 'desc'

export default function AdminResultsPage() {
  const [results, setResults] = useState<ResultWithSession[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('calculated_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  useEffect(() => {
    loadResults()
  }, [])

  async function loadResults() {
    try {
      const { data: resultsData, error: resultsError } = await supabase
        .from('results')
        .select('*')
        .order('calculated_at', { ascending: false })

      if (resultsError) {
        console.error('Error loading results:', resultsError)
        setLoading(false)
        return
      }

      // Load sessions for each result
      const resultsWithSessions = await Promise.all(
        (resultsData || []).map(async (result) => {
          const { data: sessionData } = await supabase
            .from('sessions')
            .select('*')
            .eq('id', result.session_id)
            .single()

          return {
            ...result,
            session: sessionData,
          } as ResultWithSession
        })
      )

      setResults(resultsWithSessions)
      setLoading(false)
    } catch (err) {
      console.error('Load results error:', err)
      setLoading(false)
    }
  }

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = results.filter((result) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        result.session?.usn?.toLowerCase().includes(searchLower) ||
        result.session?.student_name?.toLowerCase().includes(searchLower)
      )
    })

    // Sort results
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case 'usn':
          aValue = a.session?.usn || ''
          bValue = b.session?.usn || ''
          break
        case 'name':
          aValue = a.session?.student_name || ''
          bValue = b.session?.student_name || ''
          break
        case 'final_score':
          aValue = a.final_score || 0
          bValue = b.final_score || 0
          break
        case 'calculated_at':
          aValue = new Date(a.calculated_at || '').getTime()
          bValue = new Date(b.calculated_at || '').getTime()
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [results, searchTerm, sortField, sortOrder])

  // Calculate statistics
  const statistics = useMemo(() => {
    if (filteredAndSortedResults.length === 0) {
      return {
        total: 0,
        average: 0,
        highest: 0,
        lowest: 0,
      }
    }

    const scores = filteredAndSortedResults.map((r) => r.final_score)
    const total = scores.reduce((sum, score) => sum + score, 0)
    const average = total / scores.length
    const highest = Math.max(...scores)
    const lowest = Math.min(...scores)

    return {
      total: filteredAndSortedResults.length,
      average: parseFloat(average.toFixed(2)),
      highest: parseFloat(highest.toFixed(2)),
      lowest: parseFloat(lowest.toFixed(2)),
    }
  }, [filteredAndSortedResults])

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  function getSortIcon(field: SortField) {
    if (sortField !== field) return '↕️'
    return sortOrder === 'asc' ? '↑' : '↓'
  }

  async function handleExport() {
    setExporting(true)
    try {
      const { data, error } = await supabase.functions.invoke('admin-export', {
        body: { format: 'csv' },
      })

      if (error) {
        alert('Failed to export data')
        return
      }

      // Download CSV
      const blob = new Blob([data.csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `quiz-results-${new Date().toISOString()}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export error:', err)
      alert('Failed to export data')
    } finally {
      setExporting(false)
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quiz Results</h1>
            <p className="text-gray-600 mt-1">View and manage student quiz results</p>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting || results.length === 0}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {exporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </>
            )}
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 mb-1">Total Submissions</p>
            <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 mb-1">Average Score</p>
            <p className="text-2xl font-bold text-indigo-600">{statistics.average}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 mb-1">Highest Score</p>
            <p className="text-2xl font-bold text-green-600">{statistics.highest}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 mb-1">Lowest Score</p>
            <p className="text-2xl font-bold text-red-600">{statistics.lowest}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by USN or Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Results Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading results...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('usn')}
                    >
                      <div className="flex items-center gap-2">
                        USN {getSortIcon('usn')}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Name {getSortIcon('name')}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('final_score')}
                    >
                      <div className="flex items-center gap-2">
                        Total Marks {getSortIcon('final_score')}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('calculated_at')}
                    >
                      <div className="flex items-center gap-2">
                        Submitted At {getSortIcon('calculated_at')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedResults.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        {searchTerm ? 'No results found matching your search' : 'No results found'}
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedResults.map((result) => (
                      <tr key={result.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {result.session?.usn || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.session?.student_name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">
                          {result.final_score.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(result.calculated_at || result.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
