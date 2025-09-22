import { useAuth } from '../contexts/AuthContext'

export default function UserInfo() {
  const { isAuthenticated, user, logout, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center space-x-3 text-sm text-gray-500">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        <span>Not signed in</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      {/* User Avatar */}
      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
        <span className="text-white text-sm font-semibold">
          {user.email.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* User Info */}
      <div className="hidden sm:block">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            {user.email}
          </span>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <span className="text-xs text-green-600 font-medium">
            Connected
          </span>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        title="Sign out"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        <span className="hidden sm:inline">Sign out</span>
      </button>
    </div>
  )
}