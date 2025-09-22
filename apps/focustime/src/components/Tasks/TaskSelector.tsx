import { useState } from 'react'
import { type Task } from '../../lib/api/taskflow'

interface TaskSelectorProps {
  tasks: Task[]
  selectedTaskId: string | null
  onSelectTask: (taskId: string | null) => void
  loading?: boolean
  error?: string | null
  onRefresh?: () => void
}

export default function TaskSelector({
  tasks,
  selectedTaskId,
  onSelectTask,
  loading = false,
  error = null,
  onRefresh,
}: TaskSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedTask = tasks.find(task => task.id === selectedTaskId)
  const incompleteTasks = tasks.filter(task => !task.completed)

  const handleTaskSelect = (taskId: string | null) => {
    onSelectTask(taskId)
    setIsOpen(false)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading tasks...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span className="text-red-800 text-sm">{error}</span>
        </div>
      </div>
    )
  }

  if (incompleteTasks.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 text-center">
        <div className="mb-4">
          <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Available</h3>
        <p className="text-gray-600 text-sm mb-4">
          You don't have any incomplete tasks. Create some tasks in TaskFlow to get started with focused work sessions.
        </p>
        <p className="text-gray-500 text-sm">
          Create some tasks in TaskFlow first, then return here to start focused work sessions.
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Select a Task to Focus On
        </label>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
            title="Refresh tasks"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        )}
      </div>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left shadow-sm hover:border-primary-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {selectedTask ? (
                <div>
                  <div className="font-medium text-gray-900 truncate">
                    {selectedTask.title}
                  </div>
                  {selectedTask.description && (
                    <div className="text-sm text-gray-500 truncate mt-1">
                      {selectedTask.description}
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-gray-500">Please select a task to focus on</span>
              )}
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {/* No task option */}
            <button
              onClick={() => handleTaskSelect(null)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors duration-150 ${
                !selectedTaskId ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
              }`}
            >
              <div className="font-medium">Choose a task first</div>
              <div className="text-sm text-gray-500 mt-1">Select a task to start your focus session</div>
            </button>

            {/* Task options */}
            {incompleteTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => handleTaskSelect(task.id)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
                  selectedTaskId === task.id ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                } ${
                  task !== incompleteTasks[incompleteTasks.length - 1] ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="font-medium truncate">{task.title}</div>
                {task.description && (
                  <div className="text-sm text-gray-500 truncate mt-1">{task.description}</div>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  Created {new Date(task.created_at).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedTask && (
        <div className="mt-3 p-3 bg-primary-50 rounded-lg border border-primary-200">
          <div className="flex items-start space-x-2">
            <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-primary-800">
                <strong>Selected:</strong> {selectedTask.title}
              </p>
              {selectedTask.description && (
                <p className="text-xs text-primary-700 mt-1">{selectedTask.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}