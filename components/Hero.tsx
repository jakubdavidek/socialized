'use client'

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import MagneticButton from './MagneticButton'

const LINES = ['WE SHAPE', 'DIGITAL', 'IDENTITIES.']
const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* ─── Detect touch / narrow viewport ───────────────────────────
   Returns false on the server and after first hydration, then
   updates once the browser fires. This avoids hydration mismatches
   while still disabling heavy effects on mobile. */
function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return mobile
}

/* ─── Single masked-reveal headline line ───────────────────────
   overflow-hidden on the wrapper acts as the clip mask;
   the span slides up from below it. */
function RevealLine({ text, delay }: { text: string; delay: number }) {
  return (
    <div className="overflow-hidden leading-[0.92]">
      <motion.span
        className="block font-syne font-extrabold text-white leading-[0.92]"
        /* Lower floor (2.5rem) so "IDENTITIES." fits on 320 px phones.
           9vw hits sweet-spot on tablets; 9.5rem caps on large monitors. */
        style={{ fontSize: 'clamp(2.5rem, 9vw, 9.5rem)' }}
        initial={{ y: '106%', rotate: 2 }}
        animate={{ y: '0%', rotate: 0 }}
        transition={{ duration: 1.4, delay, ease: EXPO }}
      >
        {text}
      </motion.span>
    </div>
  )
}

/* ─── Hero ──────────────────────────────────────────────────── */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const isMobile = useIsMobile()

  /* Parallax — values are always computed (hooks must be unconditional)
     but only *applied* on desktop via the style prop below. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  /* Interactive 3-D tilt — desktop/mouse only */
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const tiltX = useSpring(useTransform(mouseY, [-300, 300], [3, -3]), {
    stiffness: 80,
    damping: 20,
  })
  const tiltY = useSpring(useTransform(mouseX, [-600, 600], [-4, 4]), {
    stiffness: 80,
    damping: 20,
  })

  useEffect(() => {
    if (isMobile) return // no-op on touch; avoids unnecessary listeners
    const handle = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2)
      mouseY.set(e.clientY - window.innerHeight / 2)
    }
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [isMobile, mouseX, mouseY])

  return (
    // 100svh = "small viewport height" — excludes mobile browser chrome
    // so content is never cut off by the address bar on iOS / Android.
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[560px] bg-black overflow-hidden flex flex-col justify-end"
    >
      {/* ── Subtle grid ── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '90px 90px',
        }}
      />

      {/* ── Ambient orb ── */}
      <motion.div
        className="absolute top-[-10%] right-[-5%] w-[80vw] h-[80vw] sm:w-[60vw] sm:h-[60vw] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Main content ── */}
      <motion.div
        className="relative z-10 px-6 sm:px-8 md:px-12 pb-12 sm:pb-14 md:pb-20"
        /* Parallax only on desktop; static on mobile to prevent jitter */
        style={{
          y: isMobile ? 0 : contentY,
          opacity: isMobile ? 1 : contentOpacity,
        }}
      >
        {/* Sub-label */}
        <div className="overflow-hidden mb-4 sm:mb-6 md:mb-8">
          <motion.p
            className="font-space text-[10px] sm:text-xs md:text-sm tracking-[0.4em] uppercase text-white/40"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: EXPO }}
          >
            Online Brand Agency — Est. 2017
          </motion.p>
        </div>

        {/* Headline — tilt only on desktop, capped to 90vw so it never overflows */}
        <motion.div
          className="mb-8 sm:mb-12 md:mb-16 max-w-[90vw]"
          style={
            isMobile
              ? {}
              : { rotateX: tiltX, rotateY: tiltY, perspective: 1000 }
          }
        >
          {LINES.map((line, i) => (
            <RevealLine key={line} text={line} delay={0.5 + i * 0.12} />
          ))}
        </motion.div>

        {/* CTA row — stacks vertically on mobile, inline on sm+ */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 md:gap-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.5, ease: EXPO }}
        >
          {/* strength=0 on mobile: magnetic pull requires a mouse */}
          <MagneticButton strength={isMobile ? 0 : 0.4}>
            <a
              href="#contact"
              data-cursor="pointer"
              className="group relative inline-flex items-center justify-center sm:justify-start gap-4 border border-white/60 hover:border-white active:border-white text-white font-space font-medium tracking-[0.2em] uppercase text-xs px-8 py-4 overflow-hidden transition-colors duration-300 w-full sm:w-auto min-h-[52px]"
            >
              {/* Hover / active fill */}
              <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
              <span className="relative z-10 group-hover:text-black group-active:text-black transition-colors duration-300">
                Start a Project
              </span>
              <motion.span
                className="relative z-10 group-hover:text-black group-active:text-black transition-colors duration-300"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </a>
          </MagneticButton>

          <span className="font-space text-white/25 text-[10px] sm:text-xs tracking-widest uppercase text-center sm:text-left">
            Scroll to explore
          </span>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator — hidden on small phones (< sm) ── */}
      <motion.div
        className="absolute bottom-8 right-6 sm:right-8 md:right-12 hidden sm:flex flex-col items-center gap-3 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        <span
          className="font-space text-white/30 text-[10px] tracking-[0.3em] uppercase"
          style={{ writingMode: 'vertical-rl' }}
        >
          Scroll
        </span>
        <div className="relative w-px h-16 bg-white/10 overflow-hidden">
          <motion.div
            className="absolute top-0 w-full bg-white"
            animate={{
              height: ['0%', '100%', '100%', '0%'],
              top: ['0%', '0%', '100%', '100%'],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.4, 0.6, 1],
            }}
          />
        </div>
      </motion.div>

      {/* ── Year ── */}
      <motion.div
        className="absolute bottom-8 left-6 sm:left-8 md:left-12 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span className="font-space text-white/20 text-[10px] sm:text-xs tracking-widest">
          ©2025
        </span>
      </motion.div>
    </section>
  )
}
