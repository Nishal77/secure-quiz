'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()

  const menuItems = [
    {
      title: 'Live Sessions',
      description: 'Monitor all active quiz sessions in real-time',
      href: '/admin/sessions',
      icon: '👥',
    },
    {
      title: 'Results',
      description: 'View and analyze quiz results',
      href: '/admin/results',
      icon: '📊',
    },
    {
      title: 'Events',
      description: 'Create events and upload question sets',
      href: '/admin/events',
      icon: '📝',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage quiz events and monitor student sessions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h2>
              <p className="text-gray-600">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

