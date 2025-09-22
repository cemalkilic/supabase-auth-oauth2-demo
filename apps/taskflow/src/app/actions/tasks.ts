'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface Task {
  id: string
  user_id: string
  title: string
  completed: boolean
  created_at: string
  updated_at: string
}

export async function createTask(title: string) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { error } = await supabase
    .from('tasks')
    .insert([
      {
        title: title.trim(),
        user_id: user.id,
      }
    ])

  if (error) {
    throw new Error(`Failed to create task: ${error.message}`)
  }

  revalidatePath('/dashboard')
}

export async function updateTask(id: string, updates: Partial<Task>) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { error } = await supabase
    .from('tasks')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(`Failed to update task: ${error.message}`)
  }

  revalidatePath('/dashboard')
}

export async function deleteTask(id: string) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(`Failed to delete task: ${error.message}`)
  }

  revalidatePath('/dashboard')
}

export async function toggleTaskComplete(id: string) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // First, get the current task to toggle its completed state
  const { data: task, error: fetchError } = await supabase
    .from('tasks')
    .select('completed')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError) {
    throw new Error(`Failed to fetch task: ${fetchError.message}`)
  }

  const { error } = await supabase
    .from('tasks')
    .update({
      completed: !task.completed,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(`Failed to toggle task: ${error.message}`)
  }

  revalidatePath('/dashboard')
}