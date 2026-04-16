'use client'

import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

const STATS = [
  { value: '15+', label: 'Brands Built' },
  { value: '2+', label: 'Years of Craft' },
  { value: '∞', label: 'Potential Unlocked' },
]

/* "Slide up on view" wrapper — reduced margin so it triggers
   earlier on short mobile viewports */
function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px 0px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: EXPO }}
    >
      {children}
    </motion.div>
  )
}

/* Line that draws itself from left → right */
function DrawLine({ delay = 0 }: { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20px' })

  return (
    <div ref={ref} className="h-px bg-white/10 overflow-hidden">
      <motion.div
        className="h-full bg-white/40"
        style={{ originX: 0 }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, delay, ease: EXPO }}
      />
    </div>
  )
}

/* Extracted component so hooks aren't called inside .map() */
function HeadlineLine({ text, delay }: { text: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <div ref={ref} className="overflow-hidden">
      <motion.h2
        className="font-syne font-bold text-white leading-tight"
        style={{ fontSize: 'clamp(2rem, 4.5vw, 5rem)' }}
        initial={{ y: '105%' }}
        animate={inView ? { y: 0 } : {}}
        transition={{ duration: 1.2, delay, ease: EXPO }}
      >
        {text}
      </motion.h2>
    </div>
  )
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-black py-24 sm:py-36 md:py-48 px-6 sm:px-8 md:px-12 overflow-hidden"
    >
      {/* Parallax dot grid */}
      <motion.div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          y: bgY,
          backgroundImage:
            'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Section label */}
        <FadeUp className="mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-3 font-space text-[10px] tracking-[0.45em] uppercase text-white/35">
            <span className="w-5 sm:w-6 h-px bg-white/35 inline-block" />
            What We Do
          </span>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 lg:gap-24 items-start">
          {/* ── Left: headline + body ── */}
          <div className="lg:col-span-7">
            <div className="mb-6 sm:mb-8">
              <HeadlineLine text="We build brands" delay={0} />
              <HeadlineLine text="people talk about." delay={0.1} />
            </div>

            <FadeUp delay={0.2}>
              <p className="font-space text-white/45 text-base sm:text-lg leading-[1.85] max-w-xl">
                In a world drowning in noise, we create signal. Socialized is
                an online brand identity agency that crafts visual systems,
                digital experiences, and strategic narratives that make your
                brand unforgettable.
              </p>
            </FadeUp>

            <FadeUp delay={0.35} className="mt-8 sm:mt-10">
              <a
                href="#work"
                data-cursor="pointer"
                className="group inline-flex items-center gap-3 font-space text-xs text-white/50 hover:text-white active:text-white tracking-[0.3em] uppercase transition-colors duration-300"
              >
                <span>See our work</span>
                <span className="inline-block group-hover:translate-x-2 group-active:translate-x-2 transition-transform duration-300">
                  →
                </span>
              </a>
            </FadeUp>
          </div>

          {/* ── Right: stats ──
              On mobile: 3-column grid so numbers sit side-by-side.
              On lg: vertical stack matching the original design. */}
          <div className="lg:col-span-5 lg:pt-6">
            {/* Mobile: 3-up grid */}
            <div className="grid grid-cols-3 lg:hidden gap-px bg-white/10 border border-white/10">
              {STATS.map((stat) => (
                <FadeUp key={stat.value} className="bg-black p-5 sm:p-6">
                  <span
                    className="block font-syne font-extrabold text-white leading-none mb-2"
                    style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}
                  >
                    {stat.value}
                  </span>
                  <span className="font-space text-white/35 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase leading-tight">
                    {stat.label}
                  </span>
                </FadeUp>
              ))}
            </div>

            {/* Desktop: vertical stack with draw-in dividers */}
            <div className="hidden lg:block space-y-0">
              {STATS.map((stat, i) => (
                <div key={stat.value}>
                  <DrawLine delay={i * 0.1} />
                  <FadeUp delay={i * 0.12 + 0.1} className="py-8">
                    <div className="flex items-end justify-between gap-4">
                      <span
                        className="font-syne font-extrabold text-white leading-none"
                        style={{ fontSize: 'clamp(3.5rem, 6vw, 5.5rem)' }}
                      >
                        {stat.value}
                      </span>
                      <span className="font-space text-white/35 text-xs tracking-[0.35em] uppercase mb-2 text-right">
                        {stat.label}
                      </span>
                    </div>
                  </FadeUp>
                </div>
              ))}
              <DrawLine delay={0.4} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
