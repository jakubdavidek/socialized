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

const LINES_DESKTOP = ['WE SHAPE', 'DIGITAL', 'IDENTITIES.']
const LINES_MOBILE = ['WE SHAPE', 'DIGITAL', 'IDENTITIES.']
const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

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

function RevealLine({
  text,
  delay,
  fontSize,
  leading,
  align = 'left',
}: {
  text: string
  delay: number
  fontSize: string
  leading: string
  align?: 'left' | 'center'
}) {
  return (
    <div className={`overflow-hidden max-w-full ${leading}`}>
      <motion.span
        className={`block font-syne font-extrabold text-white whitespace-nowrap tracking-tight ${leading} ${align === 'center' ? 'text-center' : ''}`}
        style={{ fontSize }}
        initial={{ y: '106%', rotate: 2 }}
        animate={{ y: '0%', rotate: 0 }}
        transition={{ duration: 1.4, delay, ease: EXPO }}
      >
        {text}
      </motion.span>
    </div>
  )
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const isMobile = useIsMobile()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const tiltX = useSpring(useTransform(mouseY, [-300, 300], [3, -3]), { stiffness: 80, damping: 20 })
  const tiltY = useSpring(useTransform(mouseX, [-600, 600], [-4, 4]), { stiffness: 80, damping: 20 })

  useEffect(() => {
    if (isMobile) return
    const handle = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2)
      mouseY.set(e.clientY - window.innerHeight / 2)
    }
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [isMobile, mouseX, mouseY])

  /* ── Mobile ──────────────────────────────────────────────────

     FONT-SIZE: clamp(1.4rem, 8vw, 3.2rem)
     ─────────────────────────────────────
     Syne Extrabold practical glyph ratio (browser-measured) ≈ 0.78
     tracking-tight reduces effective ratio to ≈ 0.75
     Worst-case word: "IDENTITIES." — 11 chars
     Calculation @ 320px: 8vw = 25.6px → 11 × 25.6 × 0.75 = 211px < 272px ✓
     Calculation @ 431px: 8vw = 34.5px → 11 × 34.5 × 0.75 = 285px < 383px ✓
     Calculation @ 767px: 8vw = 61.4px → 11 × 61.4 × 0.75 = 507px < 719px ✓

     LAYOUT: headline + CTA in one group, gap-8 between them
     ────────────────────────────────────────────────────────
     The group sits in a flex-1 container with justify-center,
     so it naturally floats at vertical center regardless of
     screen height. Sub-label and footer stay pinned at edges.
     This eliminates the dead space without needing justify-between
     or hardcoded margins.                                        */
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="relative min-h-[100dvh] bg-black overflow-hidden flex flex-col"
      >
        {/* Grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)',
            backgroundSize: '90px 90px',
          }}
        />

        {/* Orb */}
        <motion.div
          className="absolute top-[-10%] right-[-5%] w-[80vw] h-[80vw] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ── Sub-label — top edge ── */}
        <div className="relative z-10 px-6 pt-16">
          <div className="overflow-hidden">
            <motion.p
              className="font-space text-[10px] tracking-[0.4em] uppercase text-white/40 text-center"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: EXPO }}
            >
            </motion.p>
          </div>
        </div>

        {/* ── Central group: headline + CTA ──────────────────────
            flex-1 + justify-center → group floats at midpoint.
            gap-8 (32px) tightens heading↔button relationship so
            they read as a single typographic unit, not two
            separate elements with dead air between them.         */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 gap-8">

          {/* Heading block */}
          <div className="w-full">
            {LINES_MOBILE.map((line, i) => (
              <RevealLine
                key={line}
                text={line}
                delay={0.5 + i * 0.1}
                /* clamp floor 1.4rem prevents tiny text on very small
                   screens; 8vw scales linearly with viewport; 3.2rem
                   cap prevents oversizing on large phones (≥400px).   */
                fontSize="clamp(1.4rem, 8vw, 3.2rem)"
                leading="leading-[1.08]"
                align="center"
              />
            ))}
          </div>

          {/* CTA — directly below heading, no extra spacer needed */}
          <motion.div
            className="w-full flex flex-col gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.5, ease: EXPO }}
          >
            <MagneticButton strength={0}>
              <a
                href="#contact"
                data-cursor="pointer"
                className="group relative inline-flex items-center justify-center gap-4 border border-white/60 hover:border-white active:border-white text-white font-space font-medium tracking-[0.2em] uppercase text-xs px-8 py-4 overflow-hidden transition-colors duration-300 w-full min-h-[52px]"
              >
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

            <p className="font-space text-white/25 text-[10px] tracking-widest uppercase text-center">
            </p>
          </motion.div>
        </div>

        {/* ── Footer row — bottom edge ── */}
        <motion.div
          className="relative z-10 px-6 pb-10 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <span className="font-space text-white/20 text-[10px] tracking-widest"></span>
          {/* Animated scroll line — replaces the vertical desktop indicator */}
          <div className="relative w-px h-8 bg-white/10 overflow-hidden">
            <motion.div
              className="absolute top-0 w-full bg-white/40"
              animate={{
                height: ['0%', '100%', '100%', '0%'],
                top: ['0%', '0%', '100%', '100%'],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', times: [0, 0.4, 0.6, 1] }}
            />
          </div>
        </motion.div>
      </section>
    )
  }

  /* ── Desktop ─────────────────────────────────────────────── */
  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[560px] bg-black overflow-hidden flex flex-col justify-end"
    >
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '90px 90px',
        }}
      />

      <motion.div
        className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative z-10 px-8 md:px-12 pb-20"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="overflow-hidden mb-8">
          <motion.p
            className="font-space text-xs md:text-sm tracking-[0.4em] uppercase text-white/40"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: EXPO }}
          >
          </motion.p>
        </div>

        <motion.div
          className="mb-16 max-w-[90vw]"
          style={{ rotateX: tiltX, rotateY: tiltY, perspective: 1000 }}
        >
          {LINES_DESKTOP.map((line, i) => (
            <RevealLine
              key={line}
              text={line}
              delay={0.5 + i * 0.12}
              fontSize="clamp(2.5rem, 9vw, 9.5rem)"
              leading="leading-[0.92]"
            />
          ))}
        </motion.div>

        <motion.div
          className="flex items-center gap-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.5, ease: EXPO }}
        >
          <MagneticButton strength={0.4}>
            <a
              href="#contact"
              data-cursor="pointer"
              className="group relative inline-flex items-center gap-4 border border-white/60 hover:border-white active:border-white text-white font-space font-medium tracking-[0.2em] uppercase text-xs px-8 py-4 overflow-hidden transition-colors duration-300 min-h-[52px]"
            >
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

          <span className="font-space text-white/25 text-xs tracking-widest uppercase">
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 right-8 md:right-12 flex flex-col items-center gap-3 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        <span
          className="font-space text-white/30 text-[10px] tracking-[0.3em] uppercase"
          style={{ writingMode: 'vertical-rl' }}
        >
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

      <motion.div
        className="absolute bottom-8 left-8 md:left-12 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span className="font-space text-white/20 text-xs tracking-widest"></span>
      </motion.div>
    </section>
  )
}