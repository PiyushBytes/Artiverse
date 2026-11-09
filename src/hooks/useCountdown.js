import { useEffect, useState } from 'react'
export function useCountdown(target) {
  const getTime = () => {
    const diff = Math.max(0, new Date(target).getTime() - Date.now())
    return { days: Math.floor(diff / 86400000), hours: Math.floor(diff / 3600000) % 24, minutes: Math.floor(diff / 60000) % 60, seconds: Math.floor(diff / 1000) % 60 }
  }
  const [time, setTime] = useState(getTime)
  useEffect(() => { const id = setInterval(() => setTime(getTime()), 1000); return () => clearInterval(id) }, [target])
  return time
}