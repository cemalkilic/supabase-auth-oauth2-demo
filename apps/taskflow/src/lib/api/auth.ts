import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export interface ApiAuthResult {
  success: boolean
  user?: any
  error?: string
  supabase?: any
}

export async function verifyBearerToken(request: NextRequest): Promise<ApiAuthResult> {
  try {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        error: 'Missing or invalid authorization header'
      }
    }

    const token = authHeader.substring(7) // Remove "Bearer " prefix
    
    if (!token) {
      return {
        success: false,
        error: 'Invalid authorization header format'
      }
    }

    // Create Supabase client and validate the token
    const supabase = await createClient()
    
    // Validate the token with Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Invalid or expired token'
      }
    }

    return {
      success: true,
      user,
      supabase
    }

  } catch (error) {
    return {
      success: false,
      error: 'Failed to verify access token'
    }
  }
}

export function createAuthenticatedSupabaseClient(accessToken: string) {
  // In a real implementation, this would create a Supabase client
  // configured with the user's access token for RLS
  
  // For demonstration, we'll return a regular Supabase client
  // In production, you would pass the token to enable user context
  return createClient()
}

export function createApiErrorResponse(message: string, status: number = 400) {
  return new Response(
    JSON.stringify({
      error: {
        message,
        code: status,
        timestamp: new Date().toISOString()
      }
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

export function createApiSuccessResponse(data: any, status: number = 200) {
  return new Response(
    JSON.stringify({
      data,
      timestamp: new Date().toISOString()
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

export function validateScopes(requiredScopes: string[], userScopes: string[]): boolean {
  return requiredScopes.every(scope => userScopes.includes(scope))
}

export function extractScopesFromToken(token: string): string[] {
  try {
    // For OAuth tokens from our authorization flow, parse the JWT to get client_id
    const payload = JSON.parse(atob(token.split('.')[1]))
    
    // Check if this is an OAuth token with our client_id
    if (payload.client_id === '037610c0-6f9a-4242-bdc3-3e3966b4a49b') {
      // OAuth tokens from FocusTime get full access to authorized scopes
      return ['profile:read', 'tasks:read', 'tasks:write']
    }
    
    // For other valid Supabase tokens, provide basic read access
    if (payload.sub && payload.email) {
      return ['profile:read', 'tasks:read']
    }
  } catch (error) {
    // If token parsing fails, no scopes
    console.error('Failed to parse token for scopes:', error)
  }
  
  return []
}