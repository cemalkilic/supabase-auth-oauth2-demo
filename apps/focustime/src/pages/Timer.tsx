import { useState } from 'react'
import { useTimer, type SessionType } from '../hooks/useTimer'
import { useTasks } from '../hooks/useTasks'
import { useAuth } from '../contexts/AuthContext'
import { useToastContext } from '../contexts/ToastContext'
import TimerDisplay from '../components/Timer/TimerDisplay'
import TimerControls from '../components/Timer/TimerControls'
import TaskSelector from '../components/Tasks/TaskSelector'
import TaskCompletionModal from '../components/Tasks/TaskCompletionModal'

export default function Timer() {
  const { isAuthenticated } = useAuth()
  const { tasks, loading: tasksLoading, error: tasksError, completeTask, getTaskById, refreshTasks } = useTasks()
  const { success, error: showError } = useToastContext()
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [timerStarted, setTimerStarted] = useState(false)
  const [completedSession, setCompletedSession] = useState<{
    sessionType: SessionType
    timeSpent: number
    taskId: string | null
  } | null>(null)

  const handleSessionComplete = (sessionType: SessionType, timeSpent: number, taskId: string | null) => {
    // Show success toast for any completed session
    const minutes = Math.floor(timeSpent / 60)
    const sessionName = sessionType === 'focus' ? 'focus session' : 'break'
    
    // Session complete feedback is shown in the completion modal

    // Only show completion modal for focus sessions when a task was selected
    if (sessionType === 'focus' && taskId) {
      setCompletedSession({ sessionType, timeSpent, taskId })
      setShowCompletionModal(true)
    }
  }

  const {
    formattedTime,
    isRunning,
    sessionType,
    currentTaskId,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    skipToBreak,
    setCurrentTask,
    startNewSession,
  } = useTimer(handleSessionComplete)

  // Handle task selection
  const handleTaskSelect = (taskId: string | null) => {
    setSelectedTaskId(taskId)
    setCurrentTask(taskId)
  }

  // Handle starting the timer
  const handleStartTimer = () => {
    if (isAuthenticated && !selectedTaskId) {
      // User can see they need to select a task from the UI
      return
    }
    
    setTimerStarted(true)
    startTimer()
    
    // Timer start feedback is visible in the UI - no toast needed
  }

  const handleMarkComplete = async () => {
    if (!completedSession?.taskId) return
    
    try {
      const task = getTaskById(completedSession.taskId)
      
      console.log('🔄 API: Marking task as complete...', {
        taskId: completedSession.taskId,
        taskTitle: task?.title,
        timeSpent: completedSession.timeSpent
      })
      
      // Real API call to TaskFlow to complete the task
      await completeTask(completedSession.taskId)
      
      success(
        '✅ Task completed!',
        `"${task?.title}" has been marked as complete.`
      )
      
      // Clear current session and reset
      setCompletedSession(null)
      setShowCompletionModal(false)
      setTimerStarted(false)
      setSelectedTaskId(null)
      
      // Refresh tasks to get updated data
      refreshTasks()
    } catch (error) {
      console.error('Failed to complete task:', error)
      showError(
        'Failed to complete task',
        'There was an error marking the task as complete. Please try again.'
      )
    }
  }

  const handleKeepWorking = () => {
    // Continue with the same task
    if (completedSession?.taskId) {
      setCurrentTask(completedSession.taskId)
      setSelectedTaskId(completedSession.taskId)
    }
    
    setCompletedSession(null)
    setShowCompletionModal(false)
    startNewSession('focus')
  }

  // Demo function to simulate session completion
  const handleDemoComplete = () => {
    if (!selectedTaskId) {
      // User can see they need to select a task from the UI
      return
    }
    
    // Simulate a completed focus session with 5 minutes of work
    const demoTimeSpent = 300 // 5 minutes in seconds
    setCompletedSession({ 
      sessionType: 'focus', 
      timeSpent: demoTimeSpent, 
      taskId: selectedTaskId 
    })
    setShowCompletionModal(true)
    
  }

  const currentTask = currentTaskId ? getTaskById(currentTaskId) : null

  return (
    <div className="max-w-4xl mx-auto page-transition">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Pomodoro Timer
        </h1>
        <p className="text-xl text-gray-600">
          Stay focused with 25-minute work sessions and 5-minute breaks
        </p>
      </div>

      {/* Task Selection - Show first for authenticated users */}
      {isAuthenticated && !timerStarted && (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 card-hover">
          <TaskSelector
            tasks={tasks}
            selectedTaskId={selectedTaskId}
            onSelectTask={handleTaskSelect}
            loading={tasksLoading}
            error={tasksError}
            onRefresh={refreshTasks}
          />
          
          {/* Start Timer Button */}
          {selectedTaskId && (
            <div className="mt-6 text-center">
              <button
                onClick={handleStartTimer}
                className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-lg"
              >
                🎯 Start Focus Session
              </button>
              <div className="text-center mt-3 space-y-2">
                <p className="text-gray-600 text-sm">
                  Ready to focus on "{getTaskById(selectedTaskId)?.title}"
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <span>Want to test the completion flow?</span>
                  <button
                    onClick={handleDemoComplete}
                    className="text-purple-500 hover:text-purple-600 underline font-medium transition-colors duration-150"
                  >
                    Try Demo Complete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Timer Section - Show only after task selection or for non-authenticated users */}
      {(timerStarted || !isAuthenticated) && (
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 card-hover">
          <TimerDisplay
            formattedTime={formattedTime}
            sessionType={sessionType}
            progress={progress}
            currentTask={currentTask?.title || null}
          />
          
          <div className="mt-8">
            <TimerControls
              isRunning={isRunning}
              sessionType={sessionType}
              currentTask={currentTask?.title || null}
              onStart={!timerStarted ? handleStartTimer : startTimer}
              onPause={pauseTimer}
              onReset={() => {
                resetTimer()
                if (isAuthenticated) {
                  setTimerStarted(false)
                  setSelectedTaskId(null)
                }
              }}
              onSkipToBreak={skipToBreak}
            />
          </div>
        </div>
      )}

      {/* Auth prompt for non-authenticated users */}
      {!isAuthenticated && (
        <div className="bg-blue-50 rounded-2xl p-6 mb-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Connect TaskFlow for Task Integration
            </h3>
            <p className="text-blue-800 text-sm mb-4">
              Sign in with TaskFlow to sync your tasks and track focus sessions automatically.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              Sign In with TaskFlow
            </a>
          </div>
        </div>
      )}

      {/* Task Completion Modal */}
      <TaskCompletionModal
        isOpen={showCompletionModal}
        task={completedSession?.taskId ? (getTaskById(completedSession.taskId) || null) : null}
        timeSpent={completedSession?.timeSpent || 0}
        onMarkComplete={handleMarkComplete}
        onKeepWorking={handleKeepWorking}
        onClose={() => setShowCompletionModal(false)}
      />

      {/* Pomodoro Technique Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          🍅 Pomodoro Technique
        </h3>
        <div className="text-blue-800 text-sm space-y-2">
          <p><strong>1. Focus:</strong> Work for 25 minutes on a single task</p>
          <p><strong>2. Break:</strong> Take a 5-minute break to recharge</p>
          <p><strong>3. Repeat:</strong> After 4 cycles, take a longer 15-30 minute break</p>
          <p className="mt-3 font-medium">This timer automatically switches between focus and break sessions!</p>
          {isAuthenticated && (
            <p className="mt-2 font-medium text-green-700">✅ Task integration enabled - complete tasks automatically!</p>
          )}
        </div>
      </div>
    </div>
  )
}