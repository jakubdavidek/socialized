import CustomCursor from '@/components/CustomCursor'
import PageTransition from '@/components/PageTransition'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import About from '@/components/About'
import MarqueeBand from '@/components/MarqueeBand'
import Services from '@/components/Services'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <PageTransition />
      <CustomCursor />
      <Navigation />
      <main>
        <Hero />
        <About />
        <MarqueeBand />
        <Services />
        <Footer />
      </main>
    </>
  )
}
