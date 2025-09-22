import { useState } from 'react'
import { type Task } from '../../lib/api/taskflow'

interface TaskCompletionModalProps {
  isOpen: boolean
  task: Task | null
  timeSpent: number // in seconds
  onMarkComplete: () => Promise<void>
  onKeepWorking: () => void
  onClose: () => void
}

export default function TaskCompletionModal({
  isOpen,
  task,
  timeSpent,
  onMarkComplete,
  onKeepWorking,
  onClose,
}: TaskCompletionModalProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const [completed, setCompleted] = useState(false)

  if (!isOpen) return null

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    if (minutes === 0) return `${seconds} seconds`
    if (minutes === 1) return `1 minute`
    return `${minutes} minutes`
  }

  const handleMarkComplete = async () => {
    if (!task) return

    try {
      setIsCompleting(true)
      await onMarkComplete()
      setCompleted(true)
      
      // Close modal after showing success message
      setTimeout(() => {
        onClose()
        setCompleted(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to mark task complete:', error)
      setIsCompleting(false)
    }
  }

  const handleKeepWorking = () => {
    onKeepWorking()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        {completed ? (
          // Success state
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Task Completed!</h2>
            <p className="text-gray-600">
              Great work! You've successfully completed "{task?.title}".
            </p>
          </div>
        ) : (
          // Main modal content
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Focus Session Complete!</h2>
              <p className="text-gray-600">
                You focused for <span className="font-semibold text-primary-600">{formatTime(timeSpent)}</span>
                {task && (
                  <span> on "<span className="font-medium">{task.title}</span>"</span>
                )}
              </p>
            </div>

            {task ? (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-1">Task Details</h3>
                <p className="text-sm text-gray-700">{task.title}</p>
                {task.description && (
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                )}
              </div>
            ) : (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  You completed a free focus session without a specific task. Great job staying focused!
                </p>
              </div>
            )}

            <div className="space-y-3">
              {task && (
                <button
                  onClick={handleMarkComplete}
                  disabled={isCompleting}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
                    isCompleting
                      ? 'bg-green-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 transform hover:scale-105'
                  }`}
                >
                  {isCompleting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Marking Complete...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Mark Task as Complete
                    </>
                  )}
                </button>
              )}

              <button
                onClick={handleKeepWorking}
                disabled={isCompleting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium transition-colors duration-200 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                {task ? 'Keep Working on This Task' : 'Start Another Session'}
              </button>

              <button
                onClick={onClose}
                disabled={isCompleting}
                className="w-full px-4 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors duration-200 disabled:opacity-50"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}