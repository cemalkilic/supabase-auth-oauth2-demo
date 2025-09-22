import { apiRequest } from '../oauth/auth'

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  created_at: string
  updated_at: string
}

export interface TasksResponse {
  success: boolean
  data: Task[]
  user: {
    id: string
    email: string
  }
}

/**
 * Fetch user's tasks from TaskFlow API
 */
export async function fetchTasks(): Promise<Task[]> {
  try {
    const response = await apiRequest('/tasks')
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.status}`)
    }
    
    const data: TasksResponse = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
}

/**
 * Update task completion status
 */
export async function updateTaskCompletion(
  taskId: string, 
  completed: boolean = true
): Promise<Task> {
  try {
    const response = await apiRequest(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ completed }),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to update task: ${response.status}`)
    }
    
    const data: { success: boolean; data: Task; message: string } = await response.json()
    return data.data
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

/**
 * Create a new task
 */
export async function createTask(title: string, description?: string): Promise<Task> {
  try {
    const response = await apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify({ 
        title, 
        description: description || '',
        completed: false 
      }),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to create task: ${response.status}`)
    }
    
    const newTask: Task = await response.json()
    return newTask
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string): Promise<void> {
  try {
    const response = await apiRequest(`/tasks/${taskId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error(`Failed to delete task: ${response.status}`)
    }
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}

/**
 * Get incomplete tasks only
 */
export async function fetchIncompleteTasks(): Promise<Task[]> {
  const allTasks = await fetchTasks()
  return allTasks.filter(task => !task.completed)
}

/**
 * Get completed tasks only
 */
export async function fetchCompletedTasks(): Promise<Task[]> {
  const allTasks = await fetchTasks()
  return allTasks.filter(task => task.completed)
}