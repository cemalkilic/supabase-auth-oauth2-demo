import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { config } from '../lib/config'
import { login } from '../lib/oauth/auth'
import { useAuth } from '../contexts/AuthContext'

export default function Landing() {
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Automatically redirect authenticated users to timer
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/timer', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleLoginClick = async () => {
    if (isAuthenticated) {
      // User is already logged in, redirect to timer
      window.location.href = '/timer'
      return
    }

    try {
      setIsLoading(true)
      await login()
      // login() will redirect to OAuth provider, so we won't reach here
    } catch (error) {
      console.error('Login failed:', error)
      setIsLoading(false)
      alert('Login failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-8 sm:py-12 page-transition">
      <div className="max-w-2xl mx-auto text-center px-4 sm:px-6">
        {/* Simplified Hero Section */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mb-6 mx-auto">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {config.app.name}
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-6 max-w-lg mx-auto">
            Stay focused with the Pomodoro technique. Connect your TaskFlow tasks and boost your productivity.
          </p>
        </div>

        {/* Main CTA Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 mb-8 card-hover">
          <button
            onClick={handleLoginClick}
            disabled={isLoading}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all duration-200 button-press touch-manipulation mb-4 ${
              isLoading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16l-5.08 5.08a.75.75 0 01-1.061 0l-2.54-2.54a.75.75 0 111.061-1.061L12 11.69l4.507-4.507a.75.75 0 111.061 1.061z"/>
                </svg>
                {isAuthenticated ? 'Go to Timer' : 'Connect with TaskFlow'}
              </>
            )}
          </button>

          <p className="text-sm text-gray-500">
            🔒 Secure OAuth 2.1 authentication
          </p>
        </div>

        {/* Simple Benefits */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="flex items-start gap-3 p-4 bg-white/50 rounded-lg border border-gray-200">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 text-sm">Sync Your Tasks</h3>
              <p className="text-gray-600 text-xs mt-1">Import tasks from TaskFlow automatically</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white/50 rounded-lg border border-gray-200">
            <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 text-sm">Focus Sessions</h3>
              <p className="text-gray-600 text-xs mt-1">25-minute Pomodoro timer with breaks</p>
            </div>
          </div>
        </div>

        {/* Subtle Demo Info */}
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          Demo application showcasing OAuth 2.1 integration between TaskFlow and FocusTime
        </p>
      </div>
    </div>
  )
}