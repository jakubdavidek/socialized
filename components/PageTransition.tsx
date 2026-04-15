'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const WIPE: [number, number, number, number] = [0.76, 0, 0.24, 1]
const REVEAL: [number, number, number, number] = [0.16, 1, 0.3, 1]

/**
 * Scroll-gated splash screen.
 *
 * Flow:
 *  1. Mounts over the page, locks body scroll.
 *  2. Logo + "scroll to enter" prompt animate in.
 *  3. First scroll-intent (wheel / touchmove / keydown) triggers the exit.
 *  4. Curtain wipes upward off the viewport (1 s ease-in-out).
 *  5. onExitComplete → scroll unlocked → component unmounts entirely.
 *  6. Safety valve: auto-dismisses after 9 s so the site is never unreachable.
 */
export default function PageTransition() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(true)

  // ── Step 1: mount guard (prevents SSR/hydration mismatch) ──────────
  useEffect(() => {
    setMounted(true)
  }, [])

  // ── Step 2: lock scroll + wire up dismiss triggers ─────────────────
  useEffect(() => {
    if (!mounted) return

    // Lock scroll on both html and body (covers iOS Safari quirks)
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    const dismiss = () => setVisible(false)

    window.addEventListener('wheel', dismiss, { once: true, passive: true })
    window.addEventListener('touchmove', dismiss, { once: true, passive: true })
    window.addEventListener('keydown', dismiss, { once: true })

    // Fallback — never trap the user indefinitely
    const fallback = setTimeout(dismiss, 9000)

    return () => {
      window.removeEventListener('wheel', dismiss)
      window.removeEventListener('touchmove', dismiss)
      window.removeEventListener('keydown', dismiss)
      clearTimeout(fallback)
    }
  }, [mounted])

  // ── Step 3: unlock scroll once curtain fully exits ──────────────────
  const handleExitComplete = () => {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
  }

  // Nothing on server; first client render also returns null so React
  // hydration sees identical output on both sides.
  if (!mounted) return null

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9998] bg-black flex flex-col items-center justify-center select-none"
          // No `initial` needed — the div starts at its natural position (y: 0)
          exit={{ y: '-100%', transition: { duration: 1.05, ease: WIPE } }}
        >
          {/* ── Subtle background grid (matches Hero) ── */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '90px 90px',
            }}
          />

          {/* ── Center lockup ── */}
          <div className="relative flex flex-col items-center gap-5">
            {/* Logo reveal */}
            <div className="overflow-hidden">
              <motion.span
                className="block font-syne font-extrabold text-white tracking-[0.4em] uppercase"
                style={{ fontSize: 'clamp(1.1rem, 3.5vw, 2.2rem)' }}
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.25, ease: REVEAL }}
              >
                Socialized
              </motion.span>
            </div>

            {/* Sub-label */}
            <div className="overflow-hidden">
              <motion.span
                className="block font-space text-[10px] sm:text-xs tracking-[0.45em] uppercase text-white/35"
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.45, ease: REVEAL }}
              >
                Online Brand Agency
              </motion.span>
            </div>

            {/* Decorative line — draws itself in */}
            <motion.div
              className="w-12 h-px bg-white/20"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              style={{ originX: 0.5 }}
              transition={{ duration: 0.7, delay: 0.9, ease: REVEAL }}
            />
          </div>

          {/* ── Bottom: scroll prompt ── */}
          <motion.div
            className="absolute bottom-10 sm:bottom-12 flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.4 }}
          >
            <span className="font-space text-[9px] sm:text-[10px] tracking-[0.45em] uppercase text-white/30">
              Scroll to enter
            </span>

            {/* Animated bar — same pattern as Hero scroll indicator */}
            <div className="relative w-px h-12 sm:h-14 bg-white/10 overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-full bg-white/50"
                animate={{
                  height: ['0%', '100%', '100%', '0%'],
                  top: ['0%', '0%', '100%', '100%'],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  times: [0, 0.4, 0.6, 1],
                  delay: 1.6,
                }}
              />
            </div>
          </motion.div>

          {/* ── Year — bottom-left (matches Hero aesthetic) ── */}
          <motion.span
            className="absolute bottom-10 sm:bottom-12 left-6 sm:left-8 md:left-12 font-space text-[10px] text-white/15 tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            ©2025
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
