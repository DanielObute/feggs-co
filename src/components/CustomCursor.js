import React, { useEffect, useRef, useState } from 'react'

// A custom "F" cursor that follows the mouse and spins while scrolling.
// Only activates on devices with a real mouse (desktop) — touchscreens
// keep their normal behavior untouched.
function CustomCursor() {
  const posRef = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const scrollTimeout = useRef(null)

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    setEnabled(isFinePointer)
    if (!isFinePointer) return

    document.body.style.cursor = 'none'

    const moveCursor = (e) => {
      if (posRef.current) {
        posRef.current.style.left = `${e.clientX}px`
        posRef.current.style.top = `${e.clientY}px`
      }
    }

    const handleScroll = () => {
      setSpinning(true)
      clearTimeout(scrollTimeout.current)
      scrollTimeout.current = setTimeout(() => setSpinning(false), 300)
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout.current)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <style>{`
        @keyframes feggs-cursor-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .feggs-cursor-inner {
          transform: translate(-50%, -50%);
        }
        .feggs-cursor-inner.spinning {
          animation: feggs-cursor-spin 0.6s linear infinite;
        }
      `}</style>
      <div ref={posRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 99999, pointerEvents: 'none' }}>
        <span
          className={`feggs-cursor-inner${spinning ? ' spinning' : ''}`}
          style={{
            display: 'inline-block',
            fontFamily: 'Bodoni Moda, serif',
            fontStyle: 'italic',
            fontWeight: '600',
            fontSize: '22px',
            color: '#F5EDE8',
            textShadow: '0 1px 6px rgba(0,0,0,0.7)',
            userSelect: 'none',
          }}
        >
          F
        </span>
      </div>
    </>
  )
}

export default CustomCursor