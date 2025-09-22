'use client'

import { useState, useTransition } from 'react'
import { updateTask, deleteTask, toggleTaskComplete, type Task } from '@/app/actions/tasks'

interface TaskItemProps {
  task: Task
}

export default function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleToggleComplete = () => {
    setError('')
    startTransition(async () => {
      try {
        await toggleTaskComplete(task.id)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update task')
      }
    })
  }

  const handleSaveEdit = () => {
    if (!editTitle.trim()) {
      setError('Task title cannot be empty')
      return
    }

    setError('')
    startTransition(async () => {
      try {
        await updateTask(task.id, { title: editTitle.trim() })
        setIsEditing(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update task')
      }
    })
  }

  const handleDelete = () => {
    setError('')
    startTransition(async () => {
      try {
        await deleteTask(task.id)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete task')
      }
    })
  }

  const handleCancelEdit = () => {
    setEditTitle(task.title)
    setIsEditing(false)
    setError('')
  }

  if (showDeleteConfirm) {
    return (
      <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
        <div>
          <p className="text-red-800 font-medium">Delete this task?</p>
          <p className="text-red-600 text-sm">This action cannot be undone.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggleComplete}
        disabled={isPending}
        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
      />
      
      <div className="flex-1">
        {isEditing ? (
          <div>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit()
                if (e.key === 'Escape') handleCancelEdit()
              }}
              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              disabled={isPending}
            />
            {error && (
              <p className="text-red-600 text-sm mt-1">{error}</p>
            )}
          </div>
        ) : (
          <span 
            className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-900'} select-none`}
            onDoubleClick={() => !task.completed && setIsEditing(true)}
          >
            {task.title}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveEdit}
              disabled={isPending || !editTitle.trim()}
              className="text-green-600 hover:text-green-700 disabled:opacity-50 transition-colors"
              title="Save (Enter)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={isPending}
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
              title="Cancel (Escape)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </>
        ) : (
          <>
            {!task.completed && (
              <button
                onClick={() => setIsEditing(true)}
                disabled={isPending}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
                title="Edit task (double-click)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
            )}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isPending}
              className="text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
              title="Delete task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  )
}