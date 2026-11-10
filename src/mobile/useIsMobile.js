import { useEffect, useState } from 'react'

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < breakpoint
  })

  const [isTablet, setIsTablet] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth >= 768 && window.innerWidth < 1024
  })

  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)

    const checkMatch = () => {
      setIsMobile(window.innerWidth < breakpoint)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    checkMatch()
    window.addEventListener('resize', checkMatch, { passive: true })
    return () => window.removeEventListener('resize', checkMatch)
  }, [breakpoint])

  return { isMobile, isTablet, isTouch }
}

export default useIsMobile

