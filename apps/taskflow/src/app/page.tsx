'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import TaskList from '@/components/tasks/TaskList'
import AddTaskForm from '@/components/tasks/AddTaskForm'
import type { User } from '@supabase/supabase-js'
import type { Task } from '@/app/actions/tasks'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const initialize = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        // If user is authenticated, fetch their tasks
        if (user) {
          const { data: userTasks, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false })

          if (!error) {
            setTasks(userTasks || [])
          }
        }
      } catch (error) {
        console.error('Error initializing page:', error)
      } finally {
        setLoading(false)
      }
    }

    initialize()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Fetch tasks for the newly authenticated user
          const { data: userTasks, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false })

          if (!error) {
            setTasks(userTasks || [])
          }
        } else {
          // Clear tasks when user logs out
          setTasks([])
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleTaskAdded = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev])
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-8"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show task management interface for authenticated users
  if (user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Tasks
            </h1>
            <p className="text-xl text-gray-600">
              Welcome back, {user.email}! Manage your tasks and stay organized.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Task Management
            </h2>
            
            <AddTaskForm onTaskAdded={handleTaskAdded} />
            <TaskList initialTasks={tasks} />
          </div>

          {/* OAuth Integration Info */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 mb-2">🔗 OAuth Integration</h3>
            <p className="text-blue-700 text-sm mb-2">
              Your TaskFlow account can securely share task data with authorized applications.
            </p>
            <p className="text-blue-600 text-xs">
              Try connecting with FocusTime to track your work sessions: 
              <a href="http://localhost:3001" className="ml-1 underline hover:text-blue-800">
                http://localhost:3001
              </a>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Show getting started content for unauthenticated users
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to TaskFlow
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your personal task management system with OAuth 2.1 provider capabilities
        </p>
        <div className="bg-white rounded-lg shadow p-6 text-left">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Getting Started
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>
              TaskFlow serves as both a task management application and an OAuth 2.1 provider.
              This means other applications can securely access your task data with your permission.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li>Set up your Supabase project credentials</li>
                <li>Create an account or sign in</li>
                <li>Start managing your tasks</li>
                <li>Test OAuth integration with FocusTime</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
