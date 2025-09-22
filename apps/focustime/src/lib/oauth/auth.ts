import { 
  buildAuthorizationUrl, 
  clearTokens, 
  getAccessToken, 
  isAuthenticated as checkAuthenticated,
  fetchUserProfile,
  getCachedUserProfile,
  type UserProfile 
} from './client'

/**
 * Initiate OAuth login flow
 */
export async function login(): Promise<void> {
  try {
    const authUrl = await buildAuthorizationUrl()
    
    // Redirect to TaskFlow OAuth authorization page
    window.location.href = authUrl
  } catch (error) {
    console.error('Login failed:', error)
    throw new Error('Failed to initiate login process')
  }
}

/**
 * Logout user and clear all session data
 */
export function logout(): void {
  // Clear all tokens and user data
  clearTokens()
  
  // Redirect to landing page
  window.location.href = '/'
}

/**
 * Get current access token
 */
export function getCurrentAccessToken(): string | null {
  return getAccessToken()
}

/**
 * Check if user is currently authenticated
 */
export function isAuthenticated(): boolean {
  return checkAuthenticated()
}

/**
 * Get user profile (cached or fetch fresh)
 */
export async function getUserProfile(forceRefresh = false): Promise<UserProfile | null> {
  if (!isAuthenticated()) {
    return null
  }
  
  // Return cached profile if available and not forcing refresh
  if (!forceRefresh) {
    const cached = getCachedUserProfile()
    if (cached) {
      return cached
    }
  }
  
  try {
    return await fetchUserProfile()
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    
    // If auth error, user might need to login again
    if (error instanceof Error && error.message.includes('Authentication expired')) {
      logout()
    }
    
    return null
  }
}

/**
 * Make authenticated API request to TaskFlow
 */
export async function apiRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessToken()
  if (!token) {
    throw new Error('User not authenticated')
  }
  
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${import.meta.env.VITE_TASKFLOW_API_URL || 'http://localhost:3000/api'}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  
  // Handle authentication errors
  if (response.status === 401) {
    console.warn('API request failed with 401, logging out user')
    logout()
    throw new Error('Authentication expired')
  }
  
  return response
}

/**
 * Utility function to handle OAuth callback errors
 */
export function getOAuthError(searchParams: URLSearchParams): string | null {
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  
  if (error) {
    switch (error) {
      case 'access_denied':
        return 'Access was denied. You must approve the request to continue.'
      case 'invalid_request':
        return 'Invalid request. Please try logging in again.'
      case 'unauthorized_client':
        return 'Application not authorized. Please contact support.'
      case 'unsupported_response_type':
        return 'Invalid response type. Please contact support.'
      case 'invalid_scope':
        return 'Invalid permissions requested. Please contact support.'
      case 'server_error':
        return 'Server error occurred. Please try again later.'
      case 'temporarily_unavailable':
        return 'Service temporarily unavailable. Please try again later.'
      default:
        return errorDescription || `OAuth error: ${error}`
    }
  }
  
  return null
}

/**
 * Check if tokens are about to expire and refresh if needed
 */
export async function ensureValidToken(): Promise<boolean> {
  if (!isAuthenticated()) {
    return false
  }
  
  // Token validation and refresh logic would go here
  // For now, just check if we have a valid token
  return true
}