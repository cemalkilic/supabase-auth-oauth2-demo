'use client'

import Link from 'next/link'

interface ConsentErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ConsentError({ error, reset }: ConsentErrorProps) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg border border-red-200">
      {/* Header */}
      <div className="p-6 border-b border-red-200 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Authorization Error</h1>
        <p className="text-gray-600">
          There was a problem with the authorization request
        </p>
      </div>

      {/* Error Details */}
      <div className="p-6 border-b border-gray-200">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-2">What went wrong?</h3>
          <p className="text-red-700 text-sm">
            {error.message || 'The authorization request is invalid, expired, or has already been processed.'}
          </p>
        </div>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <h4 className="font-medium text-gray-900">Common causes:</h4>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>The authorization request has expired</li>
            <li>The request has invalid parameters</li>
            <li>The client application is not properly configured</li>
            <li>You are not signed in to TaskFlow</li>
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 space-y-3">
        <button
          onClick={reset}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Try Again
        </button>
        
        <Link
          href="/dashboard"
          className="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Go to Dashboard
        </Link>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <p className="text-xs text-gray-500 text-center">
          If you continue to experience issues, please contact the application developer or 
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 ml-1">
            return to your TaskFlow dashboard
          </Link>.
        </p>
      </div>
    </div>
  )
}