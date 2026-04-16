'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]
const EXPO_IN_OUT: [number, number, number, number] = [0.76, 0, 0.24, 1]

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      {/* ── Header bar ── */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-[100] px-6 sm:px-8 md:px-12 py-5 sm:py-6 md:py-7 flex items-center justify-between"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.4, ease: EXPO_OUT }}
      >
        {/* Solid backdrop — always opaque.
            Glassmorphism variant: swap bg-black for bg-black/75 and add
            [backdrop-filter:blur(12px)] if you prefer the frosted look. */}
        <div className="absolute inset-0 bg-black border-b border-white/10 pointer-events-none" />

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="relative z-10 font-syne font-extrabold text-white text-xs sm:text-sm tracking-[0.28em] uppercase hover:opacity-50 active:opacity-50 transition-opacity duration-300"
          data-cursor="pointer"
        >
          Socialized
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex relative z-10 items-center gap-10">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              data-cursor="pointer"
              className="relative font-space text-white text-xs tracking-[0.3em] uppercase hover:opacity-50 transition-opacity duration-300 group"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white group-hover:w-full transition-all duration-500" />
            </a>
          ))}
        </nav>

        {/* Mobile toggle — "MENU" ticks up to "CLOSE" */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="relative md:hidden z-10 h-4 w-[52px] overflow-hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {(['Menu', 'Close'] as const).map((label, i) => (
            <motion.span
              key={label}
              className="absolute inset-0 flex items-center justify-end font-space text-white text-[10px] tracking-[0.35em] uppercase"
              initial={false}
              animate={{
                y: menuOpen
                  ? i === 0
                    ? '-100%'
                    : '0%'
                  : i === 0
                  ? '0%'
                  : '100%',
              }}
              transition={{ duration: 0.3, ease: EXPO_IN_OUT }}
            >
              {label}
            </motion.span>
          ))}
        </button>
      </motion.header>

      {/* ── Full-screen mobile overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-[99] bg-black flex flex-col justify-center px-6 sm:px-8 md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.65, ease: EXPO_IN_OUT }}
          >
            <nav className="flex flex-col">
              {NAV_LINKS.map((link, i) => (
                <div
                  key={link.label}
                  className="overflow-hidden border-b border-white/10 py-5"
                >
                  <motion.a
                    href={link.href}
                    onClick={closeMenu}
                    className="block font-syne font-extrabold text-white leading-none active:opacity-40 transition-opacity"
                    style={{ fontSize: 'clamp(2.4rem, 12vw, 5rem)' }}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '110%' }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.07 + 0.15,
                      ease: EXPO_OUT,
                    }}
                  >
                    {link.label}
                  </motion.a>
                </div>
              ))}
            </nav>

            {/* Bottom meta */}
            <motion.div
              className="absolute bottom-10 left-6 right-6 sm:left-8 sm:right-8 flex justify-between items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
            >
              <span className="font-space text-white/30 text-[10px] tracking-[0.3em] uppercase">
                hello@socialized.agency
              </span>
              <span className="font-space text-white/20 text-[10px] tracking-widest">
                © 2025
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
