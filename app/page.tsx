'use client'

import { useCallback, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import Cursor from './components/Cursor'
import Stage from './components/Stage'

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenisRef.current = lenis

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    const work = document.querySelector('.the-work')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (work) observer.observe(work)

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
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

  const scrollToWork = () => {
    lenisRef.current?.scrollTo('#the-work')
  }

  return (
    <>
      <main className="hero">
        <p className="hero-label">afraz-creates//</p>
        <h1 className="hero-title">PROJECT HUB</h1>

        <button
          className="scroll-indicator"
          onClick={scrollToWork}
          aria-label="Scroll down to The Work"
        >
          <span className="scroll-indicator-text">Scroll Down</span>
          <span className="scroll-indicator-track">
            <span className="scroll-indicator-progress" />
          </span>
        </button>
      </main>

      <Stage lockScroll={lockScroll} />

      <footer className="site-foot">
        <p>afraz-creates//project-hub — archive 2026</p>
      </footer>

      <Cursor />
    </>
  )
}