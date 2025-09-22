import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
}

export default function LoadingSpinner({ 
  size = 'md', 
  className 
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'border-blue-600 border-t-transparent rounded-full animate-spin',
        sizeClasses[size],
        className
      )}
      aria-label="Loading"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}