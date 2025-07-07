'use client'

import { useState } from 'react'

interface AdminUser {
  email: string
  password: string
  name: string
  role?: string
}

interface SeederResult {
  email: string
  success: boolean
  message?: string
  error?: string
  action?: string
  user?: {
    id: string
    email: string
  }
}

interface SeederResponse {
  success: boolean
  message: string
  results: SeederResult[]
  summary: {
    total: number
    created: number
    skipped: number
    failed: number
  }
}

export default function AdminSeederPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SeederResponse | null>(null)
  const [customAdmins, setCustomAdmins] = useState<AdminUser[]>([
    { email: '', password: '', name: '', role: 'admin' }
  ])
  const [useCustomAdmins, setUseCustomAdmins] = useState(false)

  const runDefaultSeeder = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/seed-admin', {
        method: 'GET'
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to run seeder',
        results: [],
        summary: { total: 0, created: 0, skipped: 0, failed: 0 }
      })
    } finally {
      setLoading(false)
    }
  }

  const runCustomSeeder = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/seed-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminUsers: customAdmins }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to run custom seeder',
        results: [],
        summary: { total: 0, created: 0, skipped: 0, failed: 0 }
      })
    } finally {
      setLoading(false)
    }
  }

  const addCustomAdmin = () => {
    setCustomAdmins([...customAdmins, { email: '', password: '', name: '', role: 'admin' }])
  }

  const removeCustomAdmin = (index: number) => {
    if (customAdmins.length > 1) {
      setCustomAdmins(customAdmins.filter((_, i) => i !== index))
    }
  }

  const updateCustomAdmin = (index: number, field: keyof AdminUser, value: string) => {
    const updated = [...customAdmins]
    updated[index] = { ...updated[index], [field]: value }
    setCustomAdmins(updated)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Seeder</h1>
          <p className="mt-2 text-gray-600">Create admin users in the database</p>
        </div>

        {/* Default Admin Seeder */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Default Admin Users</h2>
          <p className="text-gray-600 mb-4">
            This will create the following default admin users:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
            <li><strong>admin@dawala.com</strong> - Super Admin (password: admin123456)</li>
            <li><strong>superadmin@dawala.com</strong> - Super Administrator (password: superadmin123)</li>
          </ul>
          
          <button
            onClick={runDefaultSeeder}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {loading ? 'Running Seeder...' : 'Run Default Seeder'}
          </button>
        </div>

        {/* Custom Admin Seeder */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Custom Admin Users</h2>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={useCustomAdmins}
                onChange={(e) => setUseCustomAdmins(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Use custom admins</span>
            </label>
          </div>

          {useCustomAdmins && (
            <div className="space-y-4">
              {customAdmins.map((admin, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={admin.email}
                        onChange={(e) => updateCustomAdmin(index, 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="admin@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        value={admin.password}
                        onChange={(e) => updateCustomAdmin(index, 'password', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={admin.name}
                        onChange={(e) => updateCustomAdmin(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Admin Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        value={admin.role}
                        onChange={(e) => updateCustomAdmin(index, 'role', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                        <option value="moderator">Moderator</option>
                      </select>
                    </div>
                  </div>
                  
                  {customAdmins.length > 1 && (
                    <button
                      onClick={() => removeCustomAdmin(index)}
                      className="mt-2 text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove Admin
                    </button>
                  )}
                </div>
              ))}
              
              <button
                onClick={addCustomAdmin}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add Another Admin
              </button>
              
              <button
                onClick={runCustomSeeder}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {loading ? 'Running Custom Seeder...' : 'Run Custom Seeder'}
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Seeder Results</h2>
            
            <div className={`p-4 rounded-md mb-4 ${
              result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.message}
              </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-md text-center">
                <div className="text-2xl font-bold text-gray-900">{result.summary.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="bg-green-50 p-3 rounded-md text-center">
                <div className="text-2xl font-bold text-green-600">{result.summary.created}</div>
                <div className="text-sm text-green-600">Created</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-md text-center">
                <div className="text-2xl font-bold text-yellow-600">{result.summary.skipped}</div>
                <div className="text-sm text-yellow-600">Skipped</div>
              </div>
              <div className="bg-red-50 p-3 rounded-md text-center">
                <div className="text-2xl font-bold text-red-600">{result.summary.failed}</div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
            </div>

            {/* Detailed Results */}
            {result.results.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Detailed Results</h3>
                <div className="space-y-2">
                  {result.results.map((item, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-md border ${
                        item.success
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{item.email}</p>
                          <p className={`text-sm ${item.success ? 'text-green-600' : 'text-red-600'}`}>
                            {item.message || item.error}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.action === 'created'
                            ? 'bg-green-100 text-green-800'
                            : item.action === 'skipped'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.action || (item.success ? 'success' : 'failed')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8">
          <a
            href="/admin"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  )
} 