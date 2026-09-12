'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Intro() {
  const [gone, setGone] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const fireReveal = () => {
    window.dispatchEvent(new CustomEvent('hub:intro-reveal'))
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const done = () => {
      document.body.classList.add('intro-done')
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fireReveal()
      done()
      setGone(true)
      return
    }

    const kicker = el.querySelector('.intro-kicker')
    const lineA = el.querySelector<HTMLElement>('.intro-line--a')
    const lineB = el.querySelector<HTMLElement>('.intro-line--b')
    const veil = el.querySelector('.intro-veil')

    const tl = gsap.timeline({
      onComplete: () => {
        done()
        setGone(true)
      },
    })

    tl.set(el, { autoAlpha: 1 })
      .to(kicker, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.1)
      .fromTo(
        lineA,
        { yPercent: 110 },
        { yPercent: 0, duration: 0.8, ease: 'power4.out' },
        0.25
      )
      .fromTo(
        lineB,
        { yPercent: 110 },
        { yPercent: 0, duration: 0.8, ease: 'power4.out' },
        0.4
      )
      .to(
        [lineA, lineB],
        { yPercent: -110, duration: 0.7, ease: 'power4.in' },
        1.15
      )
      .call(fireReveal, [], 1.05)
      .to(
        [kicker, veil],
        { opacity: 0, duration: 0.4, ease: 'power2.out' },
        1.15
      )
      .set(el, { autoAlpha: 0, pointerEvents: 'none' }, 1.8)
  }, [])

  if (gone) return null

  return (
    <div className="intro" ref={ref} aria-hidden="true">
      <div className="intro-veil" />
      <div className="intro-center">
        <p className="intro-kicker">PROJECT HUB / INTERACTIVE ARCHIVE</p>
        <h2 className="intro-title">
          <span className="intro-line intro-line--a">AFRAZ</span>
          <span className="intro-line intro-line--b">
            Creative Playground
          </span>
        </h2>
      </div>
    </div>
  )
}