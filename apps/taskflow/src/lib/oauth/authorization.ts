import { createClient } from '@/lib/supabase/client'
import { config } from '@/lib/config'

interface OAuthApiError {
  error?: string
  error_description?: string
  message?: string
}

// Helper function to make OAuth API calls with proper error handling
async function makeOAuthApiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const supabase = createClient()
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError || !sessionData.session) {
    throw new Error('Authentication required')
  }

  const response = await fetch(`${config.supabase.url}/auth/v1/${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${sessionData.session.access_token}`,
      'Content-Type': 'application/json',
      'apikey': config.supabase.anonKey,
      ...options.headers
    }
  })

  if (!response.ok) {
    let errorData: OAuthApiError = {}
    try {
      errorData = await response.json()
    } catch {
      // JSON parsing failed, use status text
      errorData = { error: response.statusText }
    }

    const errorMessage = errorData.error_description || 
                        errorData.message || 
                        errorData.error || 
                        `OAuth API error: ${response.status}`

    throw new Error(errorMessage)
  }

  return response.json()
}

export interface ClientApplication {
  id: string
  name: string
  description?: string
  redirect_uris: string[]
  logo_url?: string
  website_url?: string
  created_at: string
}

export interface ConsentRequest {
  authorization_id: string
  client: ClientApplication
  scopes: string[]
  user_email: string
  expires_at: string
}

export async function fetchAuthorizationDetails(authorizationId: string): Promise<ConsentRequest | null> {
  const supabase = createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    // Call the Supabase Auth OAuth API endpoint
    const authData = await makeOAuthApiCall(`oauth/authorizations/${authorizationId}`)

    // Check if user already gave consent (API returns redirect_url directly)
    if (authData.redirect_url) {
      // User already consented, redirect immediately
      window.location.href = authData.redirect_url
      return null
    }

    // Transform the response to match our ConsentRequest interface
    return {
      authorization_id: authorizationId,
      client: {
        id: authData.client?.client_id,
        name: authData.client?.client_name || 'OAuth Client',
        description: authData.client?.description || '',
        redirect_uris: authData.client?.redirect_uris,
        logo_url: authData.client?.logo_uri || '/api/placeholder-logo',
        website_url: authData.client?.client_uri || '',
        created_at: authData.client?.created_at
      },
      scopes: authData.scope ? authData.scope.split(' ') : [],
      user_email: authData.user?.email || user.email || '',
      expires_at: authData.expires_at
    }
  } catch (error) {
    console.error('Error fetching authorization details:', error)
    
    // Handle 404 specifically - authorization not found
    if (error instanceof Error && error.message.includes('404')) {
      return null
    }
    
    throw error
  }
}

export async function submitConsentDecision(
  authorizationId: string, 
  action: 'approve' | 'deny',
  consentRequest: ConsentRequest
): Promise<{ redirect_url: string }> {
  console.log('submitConsentDecision called with:', { authorizationId, action, consentRequest })
  
  const supabase = createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    // Call the Supabase Auth OAuth consent API endpoint
    const responseData = await makeOAuthApiCall(`oauth/authorizations/${authorizationId}/consent`, {
      method: 'POST',
      body: JSON.stringify({
        action: action
      })
    })
    
    console.log('OAuth API response:', responseData)
    
    // The API response already contains the redirect_url, so just return it
    if (responseData.redirect_url) {
      return { redirect_url: responseData.redirect_url }
    }
    
    throw new Error('No redirect URL found')

  } catch (error) {
    console.error('Error submitting consent decision:', error)
    throw error
  }
}
