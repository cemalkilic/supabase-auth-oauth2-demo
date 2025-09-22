import { type SessionType } from '../../hooks/useTimer'

interface TimerDisplayProps {
  formattedTime: string
  sessionType: SessionType
  progress: number
  currentTask: string | null
}

export default function TimerDisplay({ 
  formattedTime, 
  sessionType, 
  progress, 
  currentTask 
}: TimerDisplayProps) {
  const isFocus = sessionType === 'focus'
  const progressColor = isFocus ? 'stroke-primary-500' : 'stroke-secondary-500'
  const bgColor = isFocus ? 'from-primary-50 to-primary-100' : 'from-secondary-50 to-secondary-100'

  // Calculate stroke dash array for progress circle
  const radius = 120
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="text-center">
      {/* Session Type Indicator */}
      <div className="mb-6">
        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
          isFocus 
            ? 'bg-primary-100 text-primary-800' 
            : 'bg-secondary-100 text-secondary-800'
        }`}>
          {isFocus ? '🎯 Focus Session' : '☕ Break Time'}
        </span>
      </div>

      {/* Current Task */}
      {currentTask && (
        <div className="mb-6">
          <p className="text-gray-600 text-sm">Working on:</p>
          <p className="text-lg font-medium text-gray-800 truncate max-w-md mx-auto">
            {currentTask}
          </p>
        </div>
      )}

      {/* Timer Circle */}
      <div className="relative inline-flex items-center justify-center mb-6 sm:mb-8">
        {/* Background Circle */}
        <div className={`w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-gradient-to-br ${bgColor} flex items-center justify-center shadow-xl`}>
          {/* Progress Ring */}
          <svg 
            className="absolute inset-0 w-full h-full transform -rotate-90" 
            viewBox="0 0 256 256"
          >
            {/* Background ring */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            {/* Progress ring */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              className={`${progressColor} transition-all duration-300 ease-in-out`}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          
          {/* Time Display */}
          <div className="text-center z-10">
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 font-mono tracking-wider">
              {formattedTime}
            </div>
            <div className={`text-xs sm:text-sm font-medium mt-1 sm:mt-2 ${
              isFocus ? 'text-primary-600' : 'text-secondary-600'
            }`}>
              {Math.ceil(progress)}% complete
            </div>
          </div>
        </div>
      </div>

      {/* Session Description */}
      <div className="max-w-md mx-auto">
        <p className="text-gray-600 text-sm">
          {isFocus 
            ? 'Stay focused and work on your current task. Avoid distractions and make progress!'
            : 'Take a well-deserved break. Stretch, hydrate, or just relax for a moment.'
          }
        </p>
      </div>
    </div>
  )
}