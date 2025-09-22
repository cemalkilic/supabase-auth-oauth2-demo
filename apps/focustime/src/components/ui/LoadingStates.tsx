export function TaskListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function TaskSelectorSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
      <div className="h-12 bg-gray-200 rounded-lg"></div>
    </div>
  )
}

export function TimerSkeleton() {
  return (
    <div className="text-center animate-pulse">
      <div className="mb-6">
        <div className="h-6 bg-gray-200 rounded-full w-32 mx-auto"></div>
      </div>
      
      <div className="w-72 h-72 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-8">
        <div className="w-32 h-16 bg-gray-300 rounded"></div>
      </div>
      
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded-xl w-48 mx-auto"></div>
        <div className="flex justify-center space-x-3">
          <div className="h-10 bg-gray-200 rounded-lg w-20"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
        </div>
      </div>
    </div>
  )
}

export function UserInfoSkeleton() {
  return (
    <div className="flex items-center space-x-3 animate-pulse">
      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      <div className="hidden sm:block">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-16"></div>
    </div>
  )
}

interface PulsingDotProps {
  className?: string
}

export function PulsingDot({ className }: PulsingDotProps) {
  return (
    <div className={`animate-pulse bg-current rounded-full ${className}`} />
  )
}

interface LoadingDotsProps {
  className?: string
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={`flex space-x-1 ${className}`}>
      <PulsingDot className="w-2 h-2 animate-bounce" />
      <PulsingDot className="w-2 h-2 animate-bounce delay-75" />
      <PulsingDot className="w-2 h-2 animate-bounce delay-150" />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 animate-pulse">
      <div className="space-y-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="flex justify-center">
          <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
        </div>
      </div>
    </div>
  )
}