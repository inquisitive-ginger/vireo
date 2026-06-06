import { Toaster } from 'sonner'

export interface ToastProps {
  position?:
    | 'bottom-right'
    | 'bottom-left'
    | 'top-right'
    | 'top-left'
    | 'top-center'
    | 'bottom-center'
  visibleToasts?: number
}

export function Toast({ position = 'bottom-right', visibleToasts = 3 }: ToastProps) {
  return (
    <Toaster
      position={position}
      visibleToasts={visibleToasts}
      theme="system"
      toastOptions={{
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
          fontFamily: 'var(--font-ui)',
        },
      }}
    />
  )
}
