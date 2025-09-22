'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import TaskItem from './TaskItem'
import type { Task } from '@/app/actions/tasks'

interface TaskListProps {
  initialTasks: Task[]
}

export default function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  // Update tasks when initialTasks prop changes
  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const refreshTasks = async () => {
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setTasks(data || [])
      }
    } catch {
      setError('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      setError('')

      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          setError(error.message)
        } else {
          setTasks(data || [])
        }
      } catch {
        setError('Failed to fetch tasks')
      } finally {
        setLoading(false)
      }
    }

    // Set up real-time subscription with user filtering
    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return null

      return supabase
        .channel('tasks_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Real-time task update:', payload)
            if (payload.eventType === 'INSERT') {
              setTasks(prev => [payload.new as Task, ...prev])
            } else if (payload.eventType === 'UPDATE') {
              setTasks(prev => 
                prev.map(task => 
                  task.id === payload.new.id ? payload.new as Task : task
                )
              )
            } else if (payload.eventType === 'DELETE') {
              setTasks(prev => 
                prev.filter(task => task.id !== payload.old.id)
              )
            }
          }
        )
        .subscribe()
    }

    // Set up subscription
    const channelPromise = setupRealtimeSubscription()

    // Initial fetch if no initial tasks
    if (initialTasks.length === 0) {
      fetchTasks()
    }

    return () => {
      channelPromise.then(channel => {
        if (channel) {
          supabase.removeChannel(channel)
        }
      })
    }
  }, [supabase])

  if (loading && tasks.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
              <div className="flex-1 h-4 bg-gray-300 rounded"></div>
              <div className="flex gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading tasks: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-red-600 hover:text-red-700 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="max-w-sm mx-auto">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-600 text-sm">
            Create your first task using the form above to get started!
          </p>
        </div>
      </div>
    )
  }

  // Separate completed and pending tasks
  const pendingTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)

  return (
    <div className="space-y-6">
      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Pending Tasks ({pendingTasks.length})
          </h3>
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-500 mb-3">
            Completed Tasks ({completedTasks.length})
          </h3>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      {tasks.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700">
              Progress: {completedTasks.length} of {tasks.length} completed
            </span>
            <span className="text-blue-600 font-medium">
              {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
            </span>
          </div>
          {tasks.length > 0 && (
            <div className="mt-2 bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedTasks.length / tasks.length) * 100}%` }}
              ></div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}