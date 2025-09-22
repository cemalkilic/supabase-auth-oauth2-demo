'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Task } from '@/app/actions/tasks'

interface AddTaskFormProps {
  onTaskAdded: (task: Task) => void
}

export default function AddTaskForm({ onTaskAdded }: AddTaskFormProps) {
  const [title, setTitle] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('Please enter a task title')
      return
    }

    setError('')
    
    startTransition(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          throw new Error('Not authenticated')
        }

        const { data: newTask, error } = await supabase
          .from('tasks')
          .insert([
            {
              title: title.trim(),
              user_id: user.id,
            }
          ])
          .select()
          .single()

        if (error) {
          throw new Error(`Failed to create task: ${error.message}`)
        }

        setTitle('')
        onTaskAdded(newTask) // Immediately update parent component
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create task')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isPending}
          />
          {error && (
            <p className="text-red-600 text-sm mt-1">{error}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isPending || !title.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Adding...' : 'Add Task'}
        </button>
      </div>
    </form>
  )
}