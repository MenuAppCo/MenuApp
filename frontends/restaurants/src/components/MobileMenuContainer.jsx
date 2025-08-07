import { useEffect, useRef } from 'react'

const MobileMenuContainer = ({ children, className = '' }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    // Prevenir scroll horizontal en móviles
    const preventHorizontalScroll = (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0]
        const startX = touch.clientX
        const startY = touch.clientY

        const handleTouchMove = (e) => {
          const touch = e.touches[0]
          const deltaX = Math.abs(touch.clientX - startX)
          const deltaY = Math.abs(touch.clientY - startY)

          if (deltaX > deltaY && deltaX > 10) {
            e.preventDefault()
          }
        }

        const handleTouchEnd = () => {
          document.removeEventListener('touchmove', handleTouchMove, { passive: false })
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

export default MobileMenuContainer 