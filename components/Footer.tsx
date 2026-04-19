'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import MagneticButton from './MagneticButton'

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com/socialized.cz' },
  { label: 'Twitter / X', href: 'https://x.com/socialized.cz' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Youtube', href: 'https://youtube.com/socialized.cz' },
]

export default function Footer() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <footer
      ref={ref}
      id="contact"
      className="relative bg-black border-t border-white/10 px-6 sm:px-8 md:px-12 pt-20 sm:pt-28 md:pt-40 pb-12 sm:pb-14"
    >
      {/* Ambient glow — isolated so it never clips content */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90vw] md:w-[80vw] h-[40vh] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at bottom, rgba(255,255,255,0.04) 0%, transparent 70%)',
        }}
      />

      {/* All content shares the same max-width + centering as every other section */}
      <div className="relative max-w-7xl mx-auto">

        {/* ── "Start a Conversation" label ── */}
        <motion.p
          className="flex items-center gap-3 font-space text-[10px] tracking-[0.45em] uppercase text-white/30 mb-6 sm:mb-8 md:mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EXPO }}
        >
          <span className="w-5 sm:w-6 h-px bg-white/30 shrink-0" />
          Začněte konverzaci
        </motion.p>

        {/* ── Giant email ──────────────────────────────────────────────
            Font-size uses a viewport-relative value so the text always
            fits inside max-w-7xl (1280 px) without overflowing:
              • floor  1.5 rem  → readable on 320 px phones
              • slope  4.5 vw   → scales with viewport (fits at all sizes)
              • cap    5.2 rem  → ≈83 px; 22 chars × ~0.6 × 83 = 1095 px ≤ 1280 px ✓

            MagneticButton gets className="block w-full" so its wrapper
            is a block-level full-width div — the inline-block default
            would cause the motion.div to be only as wide as the text,
            which overflows its parent at large font sizes.
        ── */}
        <div className="mb-16 sm:mb-20 md:mb-32">
          <MagneticButton strength={0.12} className="block w-full">
            <motion.a
              href="mailto:hello@socialized.agency"
              data-cursor="pointer"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.1, delay: 0.15, ease: EXPO }}
              className="group inline-block font-syne font-extrabold text-white leading-[1.1] hover:text-white/60 active:text-white/60 transition-colors duration-500"
              style={{ fontSize: 'clamp(1.5rem, 4.5vw, 5.2rem)' }}
            >
              info@socialized.cz
              {/* Underline draws in on hover */}
              <span className="block h-[2px] sm:h-[3px] bg-white/50 w-0 group-hover:w-full group-active:w-full transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] mt-1 sm:mt-2" />
            </motion.a>
          </MagneticButton>
        </div>

        {/* ── Bottom bar ───────────────────────────────────────────────
            Three items: logo / social links / copyright.
            On mobile they stack; md+ they sit on one row.
        ── */}
        <motion.div
          className="border-t border-white/10 pt-6 sm:pt-8
                     flex flex-col gap-5
                     md:flex-row md:items-center md:justify-between md:gap-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.4 }}
        >
          {/* Logo */}
          <span className="font-syne font-extrabold text-white text-sm tracking-[0.22em] uppercase shrink-0">
            Socialized
          </span>

          {/* Social links */}
          <nav className="flex flex-wrap gap-5 sm:gap-6 md:gap-8">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                data-cursor="pointer"
                className="font-space text-white/30 text-[10px] tracking-[0.35em] uppercase hover:text-white active:text-white transition-colors duration-300"
              >
                {s.label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <span className="font-space text-white/20 text-[10px] tracking-widest shrink-0">
            © 2026 Socialized
          </span>
        </motion.div>

      </div>
    </footer>
  )
}
