'use client'

import { useState, useTransition } from 'react'
import { submitConsentDecision, type ConsentRequest } from '@/lib/oauth/authorization'

interface ConsentFormProps {
  consentRequest: ConsentRequest
}

export default function ConsentForm({ consentRequest }: ConsentFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleDecision = (action: 'approve' | 'deny') => {
    setError('')
    
    startTransition(async () => {
      try {
        console.log('Submitting consent decision:', {
          authorization_id: consentRequest.authorization_id,
          action,
          consentRequest
        })
        const result = await submitConsentDecision(consentRequest.authorization_id, action, consentRequest)
        
        // Redirect to the client application
        window.location.href = result.redirect_url
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      }
    })
  }

  const formatExpiryTime = (expiresAt: string) => {
    const expiry = new Date(expiresAt)
    const now = new Date()
    const diffMinutes = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60))
    
    if (diffMinutes <= 0) {
      return 'Expired'
    } else if (diffMinutes === 1) {
      return '1 minute'
    } else {
      return `${diffMinutes} minutes`
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Authorize Application</h1>
        <p className="text-gray-600">
          <strong>{consentRequest.client.name}</strong> is requesting access to your TaskFlow account
        </p>
      </div>

      {/* Client Information */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{consentRequest.client.name}</h3>
            {consentRequest.client.uri && (
              <a
                href={consentRequest.client.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 mt-1 inline-block"
              >
                Visit website →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* User Account Info */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {consentRequest.user_email.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Signed in as</p>
            <p className="text-sm text-gray-600">{consentRequest.user_email}</p>
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">
          Access Permissions
        </h3>
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Full access to your TaskFlow account</p>
            <p className="text-xs text-gray-500 mt-1">
              This includes reading your profile, viewing and managing your tasks, and performing actions on your behalf.
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-6 space-y-3">
        <button
          onClick={() => handleDecision('approve')}
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isPending ? 'Authorizing...' : 'Authorize'}
        </button>
        
        <button
          onClick={() => handleDecision('deny')}
          disabled={isPending}
          className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isPending ? 'Canceling...' : 'Cancel'}
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <p className="text-xs text-gray-500 text-center">
          By authorizing, you allow {consentRequest.client.name} to access your TaskFlow account. 
          You can revoke this access at any time in your account settings.
        </p>
      </div>
    </div>
  )
}