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

  return null
}
