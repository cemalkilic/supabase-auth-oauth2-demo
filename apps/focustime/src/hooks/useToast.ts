import { useState, useCallback } from 'react'
import type { Toast, ToastType } from '../components/ui/Toast'

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((
    type: ToastType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = `toast-${++toastId}`
    const toast: Toast = {
      id,
      type,
      title,
      message,
      duration,
    }

    setToasts(prev => [...prev, toast])

    return id
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const success = useCallback((title: string, message?: string, duration?: number) => {
    return showToast('success', title, message, duration)
  }, [showToast])

  const error = useCallback((title: string, message?: string, duration?: number) => {
    return showToast('error', title, message, duration)
  }, [showToast])

  const warning = useCallback((title: string, message?: string, duration?: number) => {
    return showToast('warning', title, message, duration)
  }, [showToast])

  const info = useCallback((title: string, message?: string, duration?: number) => {
    return showToast('info', title, message, duration)
  }, [showToast])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    showToast,
    dismissToast,
    success,
    error,
    warning,
    info,
    clearAll,
  }
}