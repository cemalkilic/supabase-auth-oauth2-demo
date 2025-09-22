import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { 
  isAuthenticated, 
  getUserProfile, 
  logout as authLogout,
} from '../lib/oauth/auth'
import type { UserProfile } from '../lib/oauth/client'

interface AuthContextType {
  isAuthenticated: boolean
  user: UserProfile | null
  loading: boolean
  login: () => void
  logout: () => void
  refreshUser: () => Promise<void>
  reinitializeAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      setLoading(true)
      
      if (isAuthenticated()) {
        setAuthenticated(true)
        
        // Try to get user profile
        const profile = await getUserProfile()
        setUser(profile)
      } else {
        setAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      setAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    // The actual login is handled by the auth module
    // This just updates the UI state
    setLoading(true)
  }

  const handleLogout = () => {
    setUser(null)
    setAuthenticated(false)
    authLogout()
  }

  const refreshUser = async () => {
    if (!authenticated) {
      return
    }

    try {
      const profile = await getUserProfile(true) // Force refresh
      setUser(profile)
    } catch (error) {
      console.error('Failed to refresh user:', error)
      // Don't automatically logout on profile fetch failure
      // The auth module will handle token expiry
    }
  }

  // Listen for storage changes (for multi-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('focustime_')) {
        // Re-check auth status when tokens change
        initializeAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const value: AuthContextType = {
    isAuthenticated: authenticated,
    user,
    loading,
    login: handleLogin,
    logout: handleLogout,
    refreshUser,
    reinitializeAuth: initializeAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook for protected routes
export function useRequireAuth() {
  const { isAuthenticated, loading, user } = useAuth()
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Redirect to landing page if not authenticated
      window.location.href = '/'
    }
  }, [isAuthenticated, loading])

  return { isAuthenticated, loading, user }
}