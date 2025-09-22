import { useState, useEffect, useRef, useCallback } from 'react'

export type SessionType = 'focus' | 'break'

interface TimerState {
  timeRemaining: number
  isRunning: boolean
  sessionType: SessionType
  currentTaskId: string | null
  timeSpent: number
}

const FOCUS_DURATION = 25 * 60 // 25 minutes in seconds
const BREAK_DURATION = 5 * 60 // 5 minutes in seconds

export function useTimer(onSessionComplete?: (sessionType: SessionType, timeSpent: number, taskId: string | null) => void) {
  const [timerState, setTimerState] = useState<TimerState>({
    timeRemaining: FOCUS_DURATION,
    isRunning: false,
    sessionType: 'focus',
    currentTaskId: null,
    timeSpent: 0,
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    if (intervalRef.current) return

    setTimerState(prev => ({ ...prev, isRunning: true }))
    
    intervalRef.current = setInterval(() => {
      setTimerState(prev => {
        const newTimeRemaining = prev.timeRemaining - 1
        const newTimeSpent = prev.timeSpent + 1

        if (newTimeRemaining <= 0) {
          // Session completed - notify callback
          if (onSessionComplete) {
            onSessionComplete(prev.sessionType, newTimeSpent, prev.currentTaskId)
          }

          // Switch to break or focus
          const newSessionType: SessionType = prev.sessionType === 'focus' ? 'break' : 'focus'
          const newDuration = newSessionType === 'focus' ? FOCUS_DURATION : BREAK_DURATION
          
          return {
            ...prev,
            timeRemaining: newDuration,
            sessionType: newSessionType,
            isRunning: false,
            timeSpent: 0, // Reset time spent for new session
          }
        }

        return {
          ...prev,
          timeRemaining: newTimeRemaining,
          timeSpent: newTimeSpent,
        }
      })
    }, 1000)
  }, [])

  const pauseTimer = useCallback(() => {
    clearTimer()
    setTimerState(prev => ({ ...prev, isRunning: false }))
  }, [clearTimer])

  const resetTimer = useCallback(() => {
    clearTimer()
    setTimerState(prev => ({
      ...prev,
      timeRemaining: prev.sessionType === 'focus' ? FOCUS_DURATION : BREAK_DURATION,
      isRunning: false,
      timeSpent: 0,
    }))
  }, [clearTimer])

  const skipToBreak = useCallback(() => {
    clearTimer()
    setTimerState(prev => ({
      ...prev,
      timeRemaining: BREAK_DURATION,
      sessionType: 'break',
      isRunning: false,
      timeSpent: 0,
    }))
  }, [clearTimer])

  const setCurrentTask = useCallback((taskId: string | null) => {
    setTimerState(prev => ({ ...prev, currentTaskId: taskId }))
  }, [])

  const startNewSession = useCallback((sessionType: SessionType = 'focus') => {
    clearTimer()
    const duration = sessionType === 'focus' ? FOCUS_DURATION : BREAK_DURATION
    setTimerState(prev => ({
      ...prev,
      timeRemaining: duration,
      sessionType,
      isRunning: false,
      timeSpent: 0,
    }))
  }, [clearTimer])

  // Progress calculation
  const totalDuration = timerState.sessionType === 'focus' ? FOCUS_DURATION : BREAK_DURATION
  const progress = ((totalDuration - timerState.timeRemaining) / totalDuration) * 100

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer()
    }
  }, [clearTimer])

  return {
    timeRemaining: timerState.timeRemaining,
    formattedTime: formatTime(timerState.timeRemaining),
    isRunning: timerState.isRunning,
    sessionType: timerState.sessionType,
    currentTaskId: timerState.currentTaskId,
    timeSpent: timerState.timeSpent,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    skipToBreak,
    setCurrentTask,
    startNewSession,
  }
}