'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * Returns true when the primary input is a coarse pointer with no hover
 * capability — i.e. a touchscreen phone or tablet.
 * Starts false (SSR + first hydration) then updates on the client.
 */
function useIsTouch(): boolean {
  const [touch, setTouch] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)')
    setTouch(mq.matches)
    const handler = (e: MediaQueryListEvent) => setTouch(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return touch
}

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const isTouch = useIsTouch()
  const [isPointer, setIsPointer] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)

  // Outer ring — slow spring (lags behind)
  const ringX = useSpring(rawX, { stiffness: 120, damping: 20, mass: 0.5 })
  const ringY = useSpring(rawY, { stiffness: 120, damping: 20, mass: 0.5 })

  // Inner dot — fast spring (near-instant)
  const dotX = useSpring(rawX, { stiffness: 500, damping: 30, mass: 0.1 })
  const dotY = useSpring(rawY, { stiffness: 500, damping: 30, mass: 0.1 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Skip all mouse tracking on touch devices — no events to listen to
    if (!mounted || isTouch) return

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      const el = e.target as HTMLElement
      setIsPointer(!!el.closest('a, button, [data-cursor="pointer"]'))
    }
    const onLeave = () => setIsHidden(true)
    const onEnter = () => setIsHidden(false)

    window.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
    }
  }, [mounted, isTouch, rawX, rawY])

  // Nothing on server, nothing on touch devices
  if (!mounted || isTouch) return null

  return (
    <>
      {/* Outer ring — mix-blend-mode: difference inverts colors beneath it */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: isHidden ? 0 : 1 }}
      >
        <motion.div
          className="rounded-full border border-white bg-transparent"
          animate={{ width: isPointer ? 64 : 40, height: isPointer ? 64 : 40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: isHidden ? 0 : 1 }}
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{ width: isPointer ? 10 : 5, height: isPointer ? 10 : 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
      </motion.div>
    </>
  )
}
