'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { autoSetupAdmin } from '@/lib/auto-setup'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [setupStatus, setSetupStatus] = useState<'idle' | 'running' | 'complete' | 'error'>('idle')
  const [setupMessage, setSetupMessage] = useState('')

  useEffect(() => {
    const initializeApp = async () => {
      // Auto-setup admin user if not already done
      if (setupStatus === 'idle') {
        setSetupStatus('running')
        const result = await autoSetupAdmin()
        
        if (result.success) {
          setSetupStatus('complete')
          setSetupMessage(result.message || 'Setup completed successfully')
        } else {
          setSetupStatus('error')
          setSetupMessage(result.error || 'Setup failed')
        }
      }

      // Handle navigation after setup
      if (!loading && setupStatus !== 'idle') {
        if (user) {
          router.push('/admin')
        } else {
          router.push('/login')
        }
      }
    }

    initializeApp()
  }, [user, loading, router, setupStatus])

  // Loading state
  if (loading || setupStatus === 'running') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {setupStatus === 'running' ? 'Setting up admin user...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (setupStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Setup Error</h2>
            <p className="text-gray-600 mb-4">{setupMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Retry Setup
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
