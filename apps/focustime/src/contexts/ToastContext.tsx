import { createContext, useContext, type ReactNode } from 'react'
import { useToast } from '../hooks/useToast'
import { ToastContainer } from '../components/ui/Toast'

interface ToastContextType {
  success: (title: string, message?: string, duration?: number) => string
  error: (title: string, message?: string, duration?: number) => string
  warning: (title: string, message?: string, duration?: number) => string
  info: (title: string, message?: string, duration?: number) => string
  dismiss: (id: string) => void
  clearAll: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const { toasts, dismissToast, success, error, warning, info, clearAll } = useToast()

  const contextValue: ToastContextType = {
    success,
    error,
    warning,
    info,
    dismiss: dismissToast,
    clearAll,
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

export function useToastContext(): ToastContextType {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
}