import { createClient } from '@/lib/supabase/client'

export interface ClientApplication {
  id: string
  name: string
  uri: string
  logo_uri: string
}

export interface ConsentRequest {
  authorization_id: string
  client: ClientApplication
  scopes: string[]
  user_email: string
  redirect_url?: string
}

export async function fetchAuthorizationDetails(authorizationId: string): Promise<ConsentRequest | null> {
  const supabase = createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    const { data: authData, error } = await supabase.auth.oauth.getAuthorizationDetails(authorizationId)
    if (error) {
      throw error
    }

    if (!authData) {
      return null
    }

    // Note: The runtime API returns 'redirect_url' but TypeScript types say 'redirect_uri'
    // This is fixed in the latest version of the library, for now we cast to access the actual property
    const authDataWithUrl = authData as typeof authData & { redirect_url?: string }

    // Check if user already gave consent (API returns redirect_url directly)
    if (authDataWithUrl.redirect_url) {
      // User already consented, redirect immediately
      window.location.href = authDataWithUrl.redirect_url
      return null
    }

    // Transform the response to match our ConsentRequest interface
    return {
      authorization_id: authorizationId,
      client: {
        id: authData.client.id,
        name: authData.client.name,
        uri: authData.client.uri,
        logo_uri: authData.client.logo_uri
      },
      scopes: authData.scope ? authData.scope.split(' ') : [],
      user_email: authData.user?.email || user.email || '',
      redirect_url: authDataWithUrl.redirect_url
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
  const supabase = createClient()
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    // Use auth-js OAuth method to approve or deny authorization
    let result

    if (action === 'approve') {
      const { data, error } = await supabase.auth.oauth.approveAuthorization(authorizationId)
      result = { data, error }
    } else {
      const { data, error } = await supabase.auth.oauth.denyAuthorization(authorizationId)
      result = { data, error }
    }

    if (result.error) {
      throw result.error
    }

    // The API response contains the redirect_url
    if (result.data?.redirect_url) {
      return { redirect_url: result.data.redirect_url }
    }

    throw new Error('No redirect URL found')

  } catch (error) {
    console.error('Error submitting consent decision:', error)
    throw error
  }
}
