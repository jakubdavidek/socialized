'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

const SERVICES = [
  {
    number: '01',
    title: 'Brandová strategie',
    description:
      'Jdeme do hloubky — zkoumáme váš positioning, konkurenci i cílové skupiny — abychom vytvořili brandovou strategii, která prorazí hlukem a promluví přímo k těm, na kterých záleží.',
    tags: ['Positioning', 'Výzkum', 'Messaging'],
  },
  {
    number: '02',
    title: 'Vizuální identita',
    description:
      'Loga, písma, barevné systémy, ikonografie a motion — vytváříme ucelený vizuální jazyk, který funguje na každém touchpointu a odolává zkoušce časem.',
    tags: ['Logo', 'Typografie', 'Motion'],
  },
  {
    number: '03',
    title: 'Digitální přítomnost',
    description:
      'Od vysoce konverzních webů až po ekosystémy sociálních médií — budujeme a spravujeme celou vaši digitální stopu, aby vaše značka dominovala online od prvního dne.',
    tags: ['Web', 'Sociální sítě', 'Obsah'],
  },
]

/* Tag pill — shared between mobile and desktop layouts */
function TagPill({ label }: { label: string }) {
  return (
    <span className="font-space text-[9px] tracking-[0.3em] uppercase text-white/25 border border-white/10 px-2 py-1 group-hover:border-white/25 group-hover:text-white/50 transition-colors duration-300">
      {label}
    </span>
  )
}

function ServiceRow({
  service,
  index,
}: {
  service: (typeof SERVICES)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: index * 0.1, ease: EXPO }}
      className="group border-t border-white/10 hover:border-white/30 transition-colors duration-500 py-8 sm:py-10 md:py-12"
    >
      {/* ── MOBILE layout (< md) ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {/* Number + Title in one row */}
        <div className="flex items-baseline gap-3">
          <span className="font-space text-white/25 text-[10px] tracking-widest shrink-0">
            {service.number}
          </span>
          <h3 className="font-syne font-bold text-white text-xl leading-tight">
            {service.title}
          </h3>
        </div>

        {/* Description — no indent, full width */}
        <p className="font-space text-white/40 text-sm leading-[1.9]">
          {service.description}
        </p>

        {/* Tags visible on mobile */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {service.tags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </div>
      </div>

      {/* ── DESKTOP layout (≥ md) ── */}
      <div className="hidden md:grid grid-cols-12 items-start gap-8">
        {/* Number */}
        <div className="col-span-1">
          <span className="font-space text-white/20 text-xs tracking-widest">
            {service.number}
          </span>
        </div>

        {/* Title */}
        <div className="col-span-3">
          <motion.h3
            className="font-syne font-bold text-white text-xl lg:text-2xl leading-tight"
            whileHover={{ x: 6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {service.title}
          </motion.h3>
        </div>

        {/* Description */}
        <div className="col-span-6">
          <p className="font-space text-white/40 text-sm leading-[1.9]">
            {service.description}
          </p>
        </div>

        {/* Tags + arrow */}
        <div className="col-span-2 flex flex-col items-end gap-2 justify-between h-full">
          <span className="text-white/20 text-xl group-hover:text-white -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            ↗
          </span>
          <div className="flex flex-wrap gap-1.5 justify-end mt-4">
            {service.tags.map((tag) => (
              <TagPill key={tag} label={tag} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Services() {
  const headingRef = useRef<HTMLDivElement>(null)
  const headingInView = useInView(headingRef, { once: true, margin: '-40px' })

  return (
    <section
      id="work"
      className="bg-black py-24 sm:py-36 md:py-48 px-6 sm:px-8 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div
          ref={headingRef}
          className="flex items-end justify-between mb-12 sm:mb-16 md:mb-20 gap-6"
        >
          <div className="overflow-hidden">
            <motion.h2
              className="font-syne font-bold text-white leading-none"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 5rem)' }}
              initial={{ y: '105%' }}
              animate={headingInView ? { y: 0 } : {}}
              transition={{ duration: 1.1, ease: EXPO }}
            >
              Naše služby
            </motion.h2>
          </div>

          <motion.span
            className="font-space text-white/25 text-xs tracking-[0.35em] uppercase hidden md:block shrink-0"
            initial={{ opacity: 0 }}
            animate={headingInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Co nabízíme
          </motion.span>
        </div>

        {/* Rows */}
        <div>
          {SERVICES.map((service, i) => (
            <ServiceRow key={service.number} service={service} index={i} />
          ))}
          <div className="border-t border-white/10" />
        </div>
      </div>
    </section>
  )
}
