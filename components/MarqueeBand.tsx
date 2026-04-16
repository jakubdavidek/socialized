'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

/* ─── Marquee data ──────────────────────────────────────────── */
const ROW_1 = [
  'SOCIALIZED', '◆', 'BRAND IDENTITY', '◆',
  'DIGITAL PRESENCE', '◆', 'ONLINE AGENCY', '◆',
]

const ROW_2 = [
  'VISUAL SYSTEMS', '◆', 'STRATEGY', '◆',
  'WEB DESIGN', '◆', 'MOTION', '◆',
]

/* ─── CSS keyframes injected once ──────────────────────────────
   We translate by exactly -50% — the track holds [items, items]
   so -50% lands on the exact pixel where the first copy started.
   The browser loops back to 0 with no visible seam.
   `reverse` rows run the mirror keyframes (scroll left → right). */
const STYLE = `
  @keyframes marquee-ltr {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes marquee-rtl {
    from { transform: translateX(-50%); }
    to   { transform: translateX(0); }
  }
`

/* ─── Track ─────────────────────────────────────────────────── */
function Track({
  items,
  reverse = false,
  large = false,
  duration = 28,
}: {
  items: string[]
  reverse?: boolean
  large?: boolean
  duration?: number
}) {
  return (
    <div className="overflow-hidden" aria-hidden="true">
      {/* The inner div is 200% wide (two identical copies).
          CSS animation moves it by -50% (= one full copy width)
          then loops — perfectly seamless.                        */}
      <div
        className="flex whitespace-nowrap will-change-transform"
        style={{
          animation: `${reverse ? 'marquee-rtl' : 'marquee-ltr'} ${duration}s linear infinite`,
        }}
      >
        {/* Copy A */}
        {items.map((item, i) => (
          <span
            key={`a-${i}`}
            className={`shrink-0 font-syne font-extrabold tracking-widest text-black ${
              large
                ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-4 sm:px-6'
                : 'text-xs sm:text-sm md:text-base px-3 sm:px-5'
            }`}
          >
            {item}
          </span>
        ))}
        {/* Copy B — identical, so when A exits left, B is already
            in position and the eye never sees a gap or reset.    */}
        {items.map((item, i) => (
          <span
            key={`b-${i}`}
            className={`shrink-0 font-syne font-extrabold tracking-widest text-black ${
              large
                ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-4 sm:px-6'
                : 'text-xs sm:text-sm md:text-base px-3 sm:px-5'
            }`}
            aria-hidden="true"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── MarqueeBand ───────────────────────────────────────────── */
export default function MarqueeBand() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])

  return (
    <>
      {/* Inject keyframes once into <head> */}
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />

      <motion.section
        ref={ref}
        style={{ y }}
        className="relative py-7 sm:py-9 md:py-10 bg-white overflow-hidden select-none"
        aria-label="Marquee banner"
      >
        {/* Row 1 — large text, left-to-right */}
        <Track items={ROW_1} large duration={22} />

        <div className="my-2 sm:my-3 h-px bg-black/10 mx-6 sm:mx-8" />

        {/* Row 2 — small text, right-to-left */}
        <Track items={ROW_2} reverse duration={30} />
      </motion.section>
    </>
  )
}
