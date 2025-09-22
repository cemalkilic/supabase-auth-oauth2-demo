import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/lib/config'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove "Bearer " prefix
    const { id: taskId } = await params
    
    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }

    // Create Supabase client and validate token
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Create authenticated Supabase client for RLS
    const authenticatedSupabase = createSupabaseClient(
      config.supabase.url,
      config.supabase.anonKey,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )

    // Update task as completed using authenticated client
    const { data: updatedTask, error: updateError } = await authenticatedSupabase
      .from('tasks')
      .update({
        completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .eq('user_id', user.id) // Ensure user can only update their own tasks
      .select()
      .single()

    if (updateError) {
      console.error('Error updating task:', updateError)
      
      if (updateError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Task not found or you do not have permission to update it' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to update task' },
        { status: 500 }
      )
    }

    if (!updatedTask) {
      return NextResponse.json(
        { error: 'Task not found or you do not have permission to update it' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      data: updatedTask,
      message: 'Task marked as completed'
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove "Bearer " prefix
    const { id: taskId } = await params
    
    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }

    // Create Supabase client and validate token
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Create authenticated Supabase client for RLS
    const authenticatedSupabase = createSupabaseClient(
      config.supabase.url,
      config.supabase.anonKey,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )

    // Fetch specific task using authenticated client
    const { data: task, error: taskError } = await authenticatedSupabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('user_id', user.id)
      .single()

    if (taskError) {
      console.error('Error fetching task:', taskError)
      return NextResponse.json(
        { error: 'Task not found or you do not have permission to view it' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      data: task
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
