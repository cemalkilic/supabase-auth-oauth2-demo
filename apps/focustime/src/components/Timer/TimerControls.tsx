import { type SessionType } from '../../hooks/useTimer'

interface TimerControlsProps {
  isRunning: boolean
  sessionType: SessionType
  currentTask: string | null
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkipToBreak: () => void
}

export default function TimerControls({
  isRunning,
  sessionType,
  currentTask,
  onStart,
  onPause,
  onReset,
  onSkipToBreak,
}: TimerControlsProps) {
  const isFocus = sessionType === 'focus'
  const canStart = true // For now, allow starting without a task selected
  
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Main Control Button */}
      <button
        onClick={isRunning ? onPause : onStart}
        disabled={!canStart}
        className={`
          inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold
          transition-all duration-200 transform hover:scale-105 min-w-[180px] sm:min-w-[200px] touch-manipulation
          ${!canStart 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:scale-100' 
            : isRunning
            ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
            : isFocus
            ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl'
            : 'bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 text-white shadow-lg hover:shadow-xl'
          }
        `}
      >
        {isRunning ? (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6"></path>
            </svg>
            Pause {isFocus ? 'Focus' : 'Break'}
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Start {isFocus ? 'Focus' : 'Break'}
          </>
        )}
      </button>

      {/* Secondary Controls */}
      <div className="flex gap-2 sm:gap-3 flex-wrap justify-center">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium
                   bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200 touch-manipulation"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span className="hidden xs:inline">Reset</span>
        </button>

        {isFocus && (
          <button
            onClick={onSkipToBreak}
            className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium
                     bg-secondary-200 text-secondary-700 hover:bg-secondary-300 transition-colors duration-200 touch-manipulation"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <span className="hidden xs:inline">Skip to Break</span>
          </button>
        )}
      </div>

      {/* Status Text */}
      <div className="text-center mt-4">
        {!currentTask && (
          <p className="text-sm text-gray-500">
            💡 You can start the timer without selecting a task
          </p>
        )}
        {currentTask && (
          <p className="text-sm text-gray-600">
            Ready to focus on: <span className="font-medium">{currentTask}</span>
          </p>
        )}
      </div>
    </div>
  )
}