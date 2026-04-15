import type { Metadata } from 'next'
import { Syne, Space_Grotesk } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Socialized — Online Brand Agency',
  description:
    'We shape digital identities. An online brand agency specializing in brand strategy, visual identity, and digital presence.',
  openGraph: {
    title: 'Socialized — Online Brand Agency',
    description: 'We shape digital identities.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-black text-white antialiased noise-overlay">
        {children}
      </body>
    </html>
  )
}
