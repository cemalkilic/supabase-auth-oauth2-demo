import { useState, useEffect, useCallback } from 'react'
import { 
  fetchTasks, 
  updateTaskCompletion, 
  createTask,
  deleteTask,
  type Task 
} from '../lib/api/taskflow'
import { useAuth } from '../contexts/AuthContext'

interface UseTasksReturn {
  tasks: Task[]
  incompleteTasks: Task[]
  loading: boolean
  error: string | null
  refreshTasks: () => Promise<void>
  completeTask: (taskId: string) => Promise<void>
  uncompleteTask: (taskId: string) => Promise<void>
  addTask: (title: string, description?: string) => Promise<void>
  removeTask: (taskId: string) => Promise<void>
  getTaskById: (taskId: string) => Task | undefined
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  // Filter incomplete tasks
  const incompleteTasks = tasks.filter(task => !task.completed)

  const loadTasks = useCallback(async () => {
    if (!isAuthenticated) {
      setTasks([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      const fetchedTasks = await fetchTasks()
      setTasks(fetchedTasks)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tasks'
      console.error('Failed to load tasks:', err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  // Load tasks on mount and when auth status changes
  useEffect(() => {
    loadTasks()
  }, [loadTasks])


  const refreshTasks = useCallback(async () => {
    await loadTasks()
  }, [loadTasks])

  const completeTask = useCallback(async (taskId: string) => {
    if (!isAuthenticated) return

    try {
      // Optimistic update
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, completed: true } : task
        )
      )

      // API call
      await updateTaskCompletion(taskId, true)
      
      // Refresh to ensure consistency
      await refreshTasks()
    } catch (err) {
      // Revert optimistic update on error
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, completed: false } : task
        )
      )
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete task'
      console.error('Failed to complete task:', err)
      setError(errorMessage)
      throw err
    }
  }, [isAuthenticated, refreshTasks])

  const uncompleteTask = useCallback(async (taskId: string) => {
    if (!isAuthenticated) return

    try {
      // Optimistic update
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, completed: false } : task
        )
      )

      // API call
      await updateTaskCompletion(taskId, false)
      
      // Refresh to ensure consistency
      await refreshTasks()
    } catch (err) {
      // Revert optimistic update on error
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, completed: true } : task
        )
      )
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to uncomplete task'
      console.error('Failed to uncomplete task:', err)
      setError(errorMessage)
      throw err
    }
  }, [isAuthenticated, refreshTasks])

  const addTask = useCallback(async (title: string, description?: string) => {
    if (!isAuthenticated) return

    try {
      setError(null)
      const newTask = await createTask(title, description)
      
      // Add to local state
      setTasks(prevTasks => [newTask, ...prevTasks])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task'
      console.error('Failed to create task:', err)
      setError(errorMessage)
      throw err
    }
  }, [isAuthenticated])

  const removeTask = useCallback(async (taskId: string) => {
    if (!isAuthenticated) return

    const originalTasks = [...tasks]

    try {
      // Optimistic update
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))

      // API call
      await deleteTask(taskId)
    } catch (err) {
      // Revert optimistic update on error
      setTasks(originalTasks)
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task'
      console.error('Failed to delete task:', err)
      setError(errorMessage)
      throw err
    }
  }, [isAuthenticated, tasks])

  const getTaskById = useCallback((taskId: string): Task | undefined => {
    return tasks.find(task => task.id === taskId)
  }, [tasks])

  return {
    tasks,
    incompleteTasks,
    loading,
    error,
    refreshTasks,
    completeTask,
    uncompleteTask,
    addTask,
    removeTask,
    getTaskById,
  }
}