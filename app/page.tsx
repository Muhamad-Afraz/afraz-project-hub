'use client'

import { useCallback, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import Cursor from './components/Cursor'
import Nav, { type NavTarget } from './components/Nav'
import Stage from './components/Stage'
import About from './components/About'
import Orb from './components/Orb'

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
    const id = { work: 'the-work', about: 'about' }[target]
    lenis.scrollTo(`#${id}`, { offset: OFFSET, duration: 1.1 })
  }, [])

  useEffect(() => {
    const select = (sel: string) => document.querySelector<HTMLElement>(sel)
    const kicker = select('.hero-kicker')
    const title = select('.hero-title-inner')
    const vein = select('.hero-vein')
    const sub = select('.hero-sub')
    const cue = select('.hero-cue')
    const items = [kicker, vein, sub, cue].filter(Boolean) as HTMLElement[]

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    gsap.set(kicker as HTMLElement, { autoAlpha: 0, y: 16 })
    gsap.set(title as HTMLElement, { yPercent: 110 })
    gsap.set(items, { autoAlpha: 0, y: 18 })

    const onReveal = () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(kicker as HTMLElement, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.05)
      tl.to(
        title as HTMLElement,
        { yPercent: 0, duration: 0.9, ease: 'power4.out' },
        0.15
      )
      tl.to(items, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.09 }, 0.55)
    }

    if (document.body.classList.contains('intro-done')) {
      onReveal()
      return
    }
    window.addEventListener('hub:intro-reveal', onReveal)
    return () => window.removeEventListener('hub:intro-reveal', onReveal)
  }, [])

  return (
    <>
      <Nav onNavigate={scrollTo} />

      <main className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="hero-kicker">Afraz — creative developer</p>
            <h1 className="hero-title">
              <span className="hero-title-mask">
                <span className="hero-title-inner">
                  Project&nbsp;Hub<span className="hero-dot">.</span>
                </span>
              </span>
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

          <Orb />
        </div>
      </main>

      <Stage lockScroll={lockScroll} scrollToY={scrollToY} />

      <About />

      <footer id="site-foot" className="site-foot">
        <div className="site-foot-inner">
          <p className="site-foot-name">&copy; 2026 — Afraz / Project-Hub</p>
          <nav className="site-foot-nav" aria-label="Footer">
            <button onClick={() => scrollTo('work')}>Work</button>
            <button onClick={() => scrollTo('about')}>About</button>
          </nav>
          <p className="site-foot-note">A working archive — built by hand.</p>
        </div>
      </footer>

      <Cursor />
    </>
  )
}