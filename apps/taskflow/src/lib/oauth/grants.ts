import { createClient } from '@/lib/supabase/client'

export interface OAuthGrant {
  client: {
    id: string
    name: string
    uri: string
    logo_uri: string
  }
  scopes: string[]
  granted_at: string
}

export async function listOAuthGrants(): Promise<OAuthGrant[]> {
  const supabase = createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    // Use auth-js OAuth method to list grants
    const { data: grants, error } = await supabase.auth.oauth.listGrants()

    if (error) {
      throw error
    }

    return grants || []
  } catch (error) {
    console.error('Error fetching OAuth grants:', error)
    throw error
  }
}

export async function revokeOAuthGrant(clientId: string): Promise<void> {
  const supabase = createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    // Use auth-js OAuth method to revoke grant
    const result = await supabase.auth.oauth.revokeGrant({ clientId })

    console.log('Revoke grant result:', result)

    if (result.error) {
      throw result.error
    }
  } catch (error) {
    console.error('Error revoking OAuth grant:', error)
    throw error
  }
}
