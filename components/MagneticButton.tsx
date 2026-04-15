'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** How strongly the button is pulled toward the cursor (default 0.35) */
  strength?: number
  /**
   * className is forwarded to the wrapper div.
   * Defaults to "inline-block" — override with "block w-full" for full-width
   * elements like the footer email where inline-block causes overflow.
   * NOTE: display must live in className, not style, so the prop can override it.
   */
  className?: string
}

export default function MagneticButton({
  children,
  strength = 0.35,
  className = 'inline-block',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 180, damping: 16, mass: 0.4 })
  const y = useSpring(rawY, { stiffness: 180, damping: 16, mass: 0.4 })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    rawX.set((e.clientX - cx) * strength)
    rawY.set((e.clientY - cy) * strength)
  }

  const handleLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      // display lives in className so callers can override it via the prop.
      // x/y stay in style — those are always motion values.
      style={{ x, y }}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  )
}
