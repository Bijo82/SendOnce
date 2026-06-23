import { useEffect, useState } from 'react'

export function useCountdown(initialSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const [isExpired, setIsExpired] = useState(initialSeconds <= 0)

  useEffect(() => {
    setSecondsLeft(initialSeconds)
    setIsExpired(initialSeconds <= 0)
  }, [initialSeconds])

  useEffect(() => {
    if (initialSeconds <= 0) return

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [initialSeconds])

  const formatted = isExpired
    ? 'Expired'
    : `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`

  return { secondsLeft, isExpired, formatted }
}
