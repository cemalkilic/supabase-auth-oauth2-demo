'use client'

import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import AddTaskForm from '@/components/tasks/AddTaskForm'
import TaskList from '@/components/tasks/TaskList'
import type { Task } from '@/app/actions/tasks'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        redirect('/auth/login')
        return
      }
      
      setUser(user)

      // Fetch initial tasks
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching tasks:', error)
      }

      setTasks(tasks || [])
      setLoading(false)
    }

    checkAuth()
  }, [supabase])

  const handleTaskAdded = (newTask: Task) => {
    // Immediately add the new task to the list
    setTasks(prev => [newTask, ...prev])
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.email}! Manage your tasks and stay productive.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Tasks</h2>
        
        <AddTaskForm onTaskAdded={handleTaskAdded} />
        
        <TaskList initialTasks={tasks} />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-800 mb-2">OAuth Provider Ready</h3>
        <p className="text-blue-700 text-sm mb-4">
          Your TaskFlow account is ready to act as an OAuth provider. 
          Other applications can now request access to your task data with your permission.
        </p>
        <div className="flex gap-3">
          <a
            href="/oauth/demo"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Test OAuth Flow
          </a>
          <a
            href="/api/docs"
            className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            API Documentation
          </a>
        </div>
      </div>
    </div>
  )
}