'use client'

import { useState, useEffect } from 'react'
import { listOAuthGrants, revokeOAuthGrant, type OAuthGrant } from '@/lib/oauth/grants'

export default function GrantsList() {
  const [grants, setGrants] = useState<OAuthGrant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [revokingClientId, setRevokingClientId] = useState<string | null>(null)

  const loadGrants = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await listOAuthGrants()
      setGrants(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load authorized applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGrants()
  }, [])

  const handleRevoke = async (clientId: string, clientName: string) => {
    if (!confirm(`Are you sure you want to revoke access for "${clientName}"? The application will no longer be able to access your TaskFlow account.`)) {
      return
    }

    try {
      setRevokingClientId(clientId)
      setError(null)
      await revokeOAuthGrant(clientId)
      // Remove the grant from the list
      setGrants(grants.filter(grant => grant.client.id !== clientId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke access')
    } finally {
      setRevokingClientId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-red-800">{error}</p>
        </div>
        <button
          onClick={loadGrants}
          className="mt-3 text-sm text-red-700 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (grants.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Authorized Applications</h3>
        <p className="text-gray-600">You haven't authorized any applications to access your TaskFlow account yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {grants.map((grant) => (
        <div
          key={grant.client.id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              {/* Client Logo */}
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                {grant.client.logo_uri ? (
                  <img
                    src={grant.client.logo_uri}
                    alt={grant.client.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                )}
              </div>

              {/* Client Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{grant.client.name}</h3>

                {grant.client.uri && (
                  <a
                    href={grant.client.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 mb-3"
                  >
                    Visit website
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </a>
                )}

                {/* Scopes */}
                {grant.scopes.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Authorized Scopes:</p>
                    <div className="flex flex-wrap gap-2">
                      {grant.scopes.map((scope) => (
                        <span
                          key={scope}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grant Date */}
                <p className="text-sm text-gray-500">
                  Authorized on {formatDate(grant.granted_at)}
                </p>
              </div>
            </div>

            {/* Revoke Button */}
            <button
              onClick={() => handleRevoke(grant.client.id, grant.client.name)}
              disabled={revokingClientId === grant.client.id}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {revokingClientId === grant.client.id ? 'Revoking...' : 'Revoke Access'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
