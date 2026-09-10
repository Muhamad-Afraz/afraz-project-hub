'use client'

import { useCallback, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import Cursor from './components/Cursor'
import Nav, { type NavTarget } from './components/Nav'
import Stage from './components/Stage'
import About from './components/About'
import Lab from './components/Lab'

const OFFSET = -76

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenisRef.current = lenis

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  const lockScroll = useCallback((locked: boolean) => {
    const lenis = lenisRef.current
    if (locked) {
      lenis?.stop()
      document.body.dataset.scrollLock = 'true'
    } else {
      lenis?.start()
      delete document.body.dataset.scrollLock
    }
  }, [])

  const scrollToY = useCallback((y: number) => {
    const lenis = lenisRef.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, y)
      return
    }
    if (lenis) lenis.scrollTo(y, { duration: 0.8 })
  }, [])

  const scrollTo = useCallback((target: NavTarget) => {
    const lenis = lenisRef.current
    if (!lenis) return
    if (target === 'top') {
      lenis.scrollTo(0, { duration: 1.1 })
      return
    }
    const id = { work: 'the-work', about: 'about', lab: 'lab' }[target]
    lenis.scrollTo(`#${id}`, { offset: OFFSET, duration: 1.1 })
  }, [])

  return (
    <>
      <Nav onNavigate={scrollTo} />

      <main className="hero">
        <div className="hero-inner">
          <p className="hero-kicker">Afraz — creative developer</p>
          <h1 className="hero-title">
            Project&nbsp;Hub<span className="hero-dot">.</span>
          </h1>
          <p className="hero-vein">Work / Archive / Interactive</p>
          <p className="hero-sub">
            The dedicated archive of interactive projects — web builds,
            experiments, client work and unfinished concepts. Every entry is
            built by hand and kept close to the machine.
          </p>
          <button className="hero-cue" onClick={() => scrollTo('work')}>
            <span className="hero-cue-label">Enter the work</span>
            <span className="hero-cue-line">
              <span className="hero-cue-track" />
            </span>
          </button>
        </div>
      </main>

      <Stage lockScroll={lockScroll} scrollToY={scrollToY} />

      <About />

      <Lab />

      <footer id="site-foot" className="site-foot">
        <div className="site-foot-inner">
          <p className="site-foot-name">&copy; 2026 — Afraz / Project-Hub</p>
          <nav className="site-foot-nav" aria-label="Footer">
            <button onClick={() => scrollTo('work')}>Work</button>
            <button onClick={() => scrollTo('about')}>About</button>
            <button onClick={() => scrollTo('lab')}>Lab</button>
          </nav>
          <p className="site-foot-note">A working archive — built by hand.</p>
        </div>
      </footer>

      <Cursor />
    </>
  )
}