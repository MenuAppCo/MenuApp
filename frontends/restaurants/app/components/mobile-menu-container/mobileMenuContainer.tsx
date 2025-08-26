import { useEffect, useRef } from 'react'

export default function MobileMenuContainer({ children, className = '' } :{children: React.ReactNode, className?: string}) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const preventHorizontalScroll = (e: any) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0]
        const startX = touch.clientX
        const startY = touch.clientY

        const handleTouchMove = (e: TouchEvent) => {
          const touch = e.touches[0]
          const deltaX = Math.abs(touch.clientX - startX)
          const deltaY = Math.abs(touch.clientY - startY)

          if (deltaX > deltaY && deltaX > 10) {
            e.preventDefault()
          }
        }

        const handleTouchEnd = () => {
          document.removeEventListener('touchmove', handleTouchMove as EventListener)
          document.removeEventListener('touchend', handleTouchEnd)
        }

        document.addEventListener('touchmove', handleTouchMove, { passive: false })
        document.addEventListener('touchend', handleTouchEnd)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('touchstart', preventHorizontalScroll, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', preventHorizontalScroll)
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen bg-white overflow-x-hidden ${className}`}
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth'
      }}
    >
      {children}
    </div>
  )
}

