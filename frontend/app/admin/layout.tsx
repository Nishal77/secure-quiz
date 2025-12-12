'use client'

import { useState, useEffect } from 'react'

const ADMIN_CODE = '112233'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if admin is already authenticated
    const authStatus = localStorage.getItem('admin_authenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (code.trim() === ADMIN_CODE) {
      setIsAuthenticated(true)
      localStorage.setItem('admin_authenticated', 'true')
    } else {
      setError('Invalid code. Please try again.')
      setCode('')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_authenticated')
    setCode('')
    setError('')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Access</h1>
              <p className="text-gray-600">Enter the admin code to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Code
                </label>
                <input
                  id="adminCode"
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value)
                    setError('')
                  }}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter 6-digit code"
                  required
                  maxLength={6}
                  autoComplete="off"
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-semibold"
              >
                Access Admin
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      {children}
    </div>
  )
}
