'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { fetchAuthorizationDetails, type ConsentRequest } from '@/lib/oauth/authorization'
import ConsentForm from './ConsentForm'
import ConsentLoading from '../../app/oauth/consent/loading'

interface ConsentPageClientProps {
  searchParams: Promise<{
    authorization_id?: string
    client_id?: string
    redirect_uri?: string
    scope?: string
    state?: string
    code_challenge?: string
    code_challenge_method?: string
  }>
}

export default function ConsentPageClient({ searchParams }: ConsentPageClientProps) {
  const [params, setParams] = useState<Awaited<ConsentPageClientProps['searchParams']> | null>(null)
  const [user, setUser] = useState<any>(null)
  const [consentRequest, setConsentRequest] = useState<ConsentRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const isInitializing = useRef(false)

  useEffect(() => {
    const initializeComponent = async () => {
      // Prevent duplicate initialization
      if (isInitializing.current) {
        return
      }
      isInitializing.current = true
      
      try {
        // Resolve search params
        const resolvedParams = await searchParams
        console.log('OAuth consent page received params:', resolvedParams)
        setParams(resolvedParams)

        // Check authentication
        const supabase = createClient()
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()

        if (userError) {
          console.error('Error getting user:', userError)
          // Redirect to login instead of showing error
          const returnUrl = `/oauth/consent?${new URLSearchParams(resolvedParams).toString()}`
          router.push(`/auth/login?return_to=${encodeURIComponent(returnUrl)}`)
          return
        }

        if (!currentUser) {
          // Redirect to login with return URL
          const returnUrl = `/oauth/consent?${new URLSearchParams(resolvedParams).toString()}`
          router.push(`/auth/login?return_to=${encodeURIComponent(returnUrl)}`)
          return
        }

        setUser(currentUser)

        // Extract authorization_id from query parameters
        const authorizationId = resolvedParams.authorization_id
        console.log('Extracted authorization_id:', authorizationId)
        
        if (!authorizationId) {
          setError('Missing authorization_id parameter')
          setLoading(false)
          return
        }

        // Fetch authorization details using client-side function
        console.log('Fetching authorization details for:', authorizationId)
        const consentData = await fetchAuthorizationDetails(authorizationId)
        
        if (!consentData) {
          setError('Authorization request not found or expired')
          setLoading(false)
          return
        }

        setConsentRequest(consentData)
        setLoading(false)

      } catch (err) {
        console.error('Error initializing consent page:', err)
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
        setLoading(false)
      } finally {
        isInitializing.current = false
      }
    }

    initializeComponent()
  }, [searchParams, router])

  if (loading) {
    return <ConsentLoading />
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg border border-red-200 p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">What went wrong?</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!consentRequest) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Authorization Not Found</h1>
          <p className="text-gray-600">The requested authorization could not be found or has expired.</p>
        </div>
      </div>
    )
  }

  return <ConsentForm consentRequest={consentRequest} />
}