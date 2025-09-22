import { NextRequest } from 'next/server'
import { verifyBearerToken, extractScopesFromToken, validateScopes } from '@/lib/api/auth'
import { createCorsResponse, createCorsErrorResponse, handleCors } from '@/lib/api/cors'

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: handleCors(request) as HeadersInit,
  })
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyBearerToken(request)
    if (!authResult.success) {
      return createCorsErrorResponse(
        authResult.error || 'Authentication failed', 
        401, 
        request
      )
    }

    // Check scopes
    const token = request.headers.get('Authorization')?.replace('Bearer ', '') || ''
    const userScopes = extractScopesFromToken(token)
    
    if (!validateScopes(['profile:read'], userScopes)) {
      return createCorsErrorResponse(
        'Insufficient permissions. Required scope: profile:read', 
        403, 
        request
      )
    }

    // Extract safe user information
    const user = authResult.user
    const userProfile = {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
      email_confirmed_at: user.email_confirmed_at,
      last_sign_in_at: user.last_sign_in_at,
      // Include any safe metadata
      user_metadata: {
        // Only include safe, non-sensitive metadata
        name: user.user_metadata?.name,
        avatar_url: user.user_metadata?.avatar_url,
      }
    }

    // Optionally include task statistics if user has tasks:read scope
    let taskStats = undefined
    if (validateScopes(['tasks:read'], userScopes)) {
      try {
        const { data: tasks } = await authResult.supabase
          .from('tasks')
          .select('completed')
        
        if (tasks) {
          const totalTasks = tasks.length
          const completedTasks = tasks.filter((task: { completed: boolean }) => task.completed).length
          const pendingTasks = totalTasks - completedTasks
          
          taskStats = {
            total: totalTasks,
            completed: completedTasks,
            pending: pendingTasks,
            completion_rate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
          }
        }
      } catch {
        // If tasks query fails, continue without stats
      }
    }

    const responseData: any = {
      user: userProfile,
      scopes: userScopes
    }

    if (taskStats) {
      responseData.task_statistics = taskStats
    }

    return createCorsResponse(
      responseData,
      200,
      request
    )

  } catch (error) {
    return createCorsErrorResponse(
      'Internal server error', 
      500, 
      request
    )
  }
}