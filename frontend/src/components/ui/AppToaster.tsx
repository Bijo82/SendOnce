import { Toaster } from 'react-hot-toast'

const toastStyle = {
  background: 'rgba(15, 23, 42, 0.95)',
  color: '#f8fafc',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(12px)',
  padding: '12px 16px',
  borderRadius: '12px',
  fontSize: '14px',
}

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: toastStyle,
        success: {
          iconTheme: { primary: '#34d399', secondary: '#0f172a' },
        },
        error: {
          iconTheme: { primary: '#f87171', secondary: '#0f172a' },
        },
      }}
    />
  )
}
