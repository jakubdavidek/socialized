'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const ROW_1 = [
  'SOCIALIZED', '◆', 'BRAND IDENTITY', '◆',
  'DIGITAL PRESENCE', '◆', 'ONLINE AGENCY', '◆',
  'SOCIALIZED', '◆', 'BRAND IDENTITY', '◆',
  'DIGITAL PRESENCE', '◆', 'ONLINE AGENCY', '◆',
]

const ROW_2 = [
  'VISUAL SYSTEMS', '◆', 'STRATEGY', '◆',
  'WEB DESIGN', '◆', 'MOTION', '◆',
  'VISUAL SYSTEMS', '◆', 'STRATEGY', '◆',
  'WEB DESIGN', '◆', 'MOTION', '◆',
]

function Track({
  items,
  reverse = false,
  large = false,
  speed = 28,
}: {
  items: string[]
  reverse?: boolean
  large?: boolean
  speed?: number
}) {
  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex whitespace-nowrap will-change-transform"
        animate={{ x: reverse ? ['0%', '50%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className={`shrink-0 font-syne font-extrabold tracking-widest text-black ${
              large
                ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-4 sm:px-6'
                : 'text-xs sm:text-sm md:text-base px-3 sm:px-5'
            }`}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default function MarqueeBand() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])

  return (
    <motion.section
      ref={ref}
      style={{ y }}
      className="relative py-7 sm:py-9 md:py-10 bg-white overflow-hidden select-none"
      aria-label="Marquee banner"
    >
      <Track items={ROW_1} large speed={22} />

      <div className="my-2 sm:my-3 h-px bg-black/10 mx-6 sm:mx-8" />

      <Track items={ROW_2} reverse speed={30} />
    </motion.section>
  )
}
