import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { exchangeCodeForToken } from '../lib/oauth/client'
import { getOAuthError } from '../lib/oauth/auth'
import { useAuth } from '../contexts/AuthContext'
import { useToastContext } from '../contexts/ToastContext'

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const { refreshUser, reinitializeAuth } = useAuth()
  const { success, error: showError } = useToastContext()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const state = urlParams.get('state')
        
        // Check for OAuth errors first
        const oauthError = getOAuthError(urlParams)
        if (oauthError) {
          // OAuth error (like user denied access) - redirect to login instead of showing error toast
          console.warn('OAuth error:', oauthError)
          navigate('/', { replace: true })
          return
        }

        if (!code || !state) {
          // Missing OAuth parameters - likely direct access to callback URL
          // Redirect to login page silently instead of showing error
          console.warn('Missing OAuth parameters, redirecting to login')
          navigate('/', { replace: true })
          return
        }

        setMessage('Exchanging authorization code for tokens...')
        
        // Exchange authorization code for access token
        await exchangeCodeForToken(code, state)
        
        setMessage('Fetching user profile...')
        
        // Reinitialize auth context to properly detect the new tokens
        await reinitializeAuth()
        
        setStatus('success')
        setMessage('Authentication successful! Redirecting...')
        
        // Clean up URL and redirect to timer
        window.history.replaceState({}, document.title, '/auth/callback')
        
        // Small delay to ensure the UI updates, then navigate
        setTimeout(() => {
          navigate('/timer')
          // No success toast - user can see they're logged in from the UI
        }, 600)
        
      } catch (error) {
        console.error('OAuth callback error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
        
        // Handle code verifier errors gracefully by redirecting to login
        if (errorMessage.includes('Code verifier not found')) {
          console.warn('Code verifier missing, redirecting to login')
          navigate('/', { replace: true })
          return
        }
        
        setStatus('error')
        setMessage(errorMessage)
        
        // Show error toast for other authentication failures
        showError(
          '❌ Authentication failed',
          errorMessage
        )
      }
    }

    handleCallback()
  }, [navigate, reinitializeAuth])

  return (
    <div className="max-w-md mx-auto text-center page-transition">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6">
          {status === 'loading' && (
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          )}
          {status === 'success' && (
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {status === 'loading' && 'Processing Authorization'}
          {status === 'success' && 'Authentication Successful'}
          {status === 'error' && 'Authentication Failed'}
        </h1>

        <p className="text-gray-600 mb-6">
          {status === 'loading' && 'Please wait while we complete your login...'}
          {status === 'success' && message}
          {status === 'error' && message}
        </p>

        {status === 'success' && (
          <p className="text-sm text-primary-600 font-medium">
            Redirecting to timer...
          </p>
        )}

        {status === 'error' && (
          <button
            onClick={() => navigate('/')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
          >
            Return Home
          </button>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          OAuth client implementation will be completed in Prompt 9.
        </p>
      </div>
    </div>
  )
}