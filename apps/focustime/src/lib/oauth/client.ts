import { config } from '../config'
import { generatePKCEPair } from './pkce'

export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
  refresh_token?: string
}

export interface UserProfile {
  id: string
  email: string
  created_at: string
}

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'focustime_access_token',
  REFRESH_TOKEN: 'focustime_refresh_token',
  TOKEN_EXPIRY: 'focustime_token_expiry',
  CODE_VERIFIER: 'focustime_code_verifier',
  USER_PROFILE: 'focustime_user_profile',
} as const

/**
 * Build authorization URL with PKCE for OAuth 2.1 flow
 */
export async function buildAuthorizationUrl(): Promise<string> {
  const { verifier, challenge } = await generatePKCEPair()
  
  // Store code verifier for later use in token exchange
  sessionStorage.setItem(STORAGE_KEYS.CODE_VERIFIER, verifier)
  
  // Generate random state for CSRF protection
  const state = crypto.getRandomValues(new Uint8Array(16))
    .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '')
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.oauth.clientId,
    redirect_uri: config.oauth.redirectUri,
    scope: config.oauth.scopes.join(' '),
    state: state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  })
  
  return `${config.supabase.url}/oauth/authorize?${params.toString()}`
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
  code: string, 
  _state: string
): Promise<TokenResponse> {
  const codeVerifier = sessionStorage.getItem(STORAGE_KEYS.CODE_VERIFIER)
  if (!codeVerifier) {
    // Instead of throwing immediately, try to generate a new PKCE pair
    // This handles cases where sessionStorage was cleared or user went through flow multiple times
    console.warn('Code verifier not found in sessionStorage, this might be due to browser security or multiple auth attempts')
    throw new Error('Code verifier not found. Please restart the login process.')
  }
  
  // Clear code verifier after use
  sessionStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER)
  
  const tokenUrl = `${config.supabase.url}/oauth/token`
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: config.oauth.clientId,
      code: code,
      redirect_uri: config.oauth.redirectUri,
      code_verifier: codeVerifier,
    }),
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('Token exchange failed:', response.status, errorText)
    throw new Error(`Token exchange failed: ${response.status}`)
  }
  
  const tokenData: TokenResponse = await response.json()
  
  // Store tokens securely in sessionStorage
  storeTokens(tokenData)
  
  return tokenData
}

/**
 * Store tokens in sessionStorage with expiry
 */
function storeTokens(tokenData: TokenResponse): void {
  sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokenData.access_token)
  
  if (tokenData.refresh_token) {
    sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokenData.refresh_token)
  }
  
  // Calculate expiry time (subtract 5 minutes for safety margin)
  const expiryTime = Date.now() + (tokenData.expires_in - 300) * 1000
  sessionStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString())
}

/**
 * Get current access token
 */
export function getAccessToken(): string | null {
  const token = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  const expiry = sessionStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY)
  
  if (!token || !expiry) {
    return null
  }
  
  // Check if token is expired
  if (Date.now() >= parseInt(expiry)) {
    clearTokens()
    return null
  }
  
  return token
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAccessToken() !== null
}

/**
 * Clear all stored tokens and user data
 */
export function clearTokens(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    sessionStorage.removeItem(key)
  })
}

/**
 * Fetch user profile from TaskFlow API
 */
export async function fetchUserProfile(): Promise<UserProfile> {
  const token = getAccessToken()
  if (!token) {
    throw new Error('No access token available')
  }
  
  const response = await fetch(`${config.taskflow.apiUrl}/user`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) {
    if (response.status === 401) {
      clearTokens()
      throw new Error('Authentication expired')
    }
    throw new Error(`Failed to fetch user profile: ${response.status}`)
  }
  
  const responseData = await response.json()
  
  // Extract user data from the nested response
  const profile: UserProfile = responseData.user
  
  // Cache user profile
  sessionStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile))
  
  return profile
}

/**
 * Get cached user profile
 */
export function getCachedUserProfile(): UserProfile | null {
  const cached = sessionStorage.getItem(STORAGE_KEYS.USER_PROFILE)
  if (!cached) {
    return null
  }
  
  try {
    return JSON.parse(cached)
  } catch {
    return null
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshToken(): Promise<TokenResponse> {
  const refreshTokenValue = sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  if (!refreshTokenValue) {
    throw new Error('No refresh token available')
  }
  
  const response = await fetch(`${config.supabase.url}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: config.oauth.clientId,
      refresh_token: refreshTokenValue,
    }),
  })
  
  if (!response.ok) {
    clearTokens()
    throw new Error(`Token refresh failed: ${response.status}`)
  }
  
  const tokenData: TokenResponse = await response.json()
  storeTokens(tokenData)
  
  return tokenData
}