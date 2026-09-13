'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'

type LenisHandle = { stop: () => void; start: () => void }

const SCROLL_KEYS = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' ', 'Home', 'End']

export default function Intro() {
  const [gone, setGone] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const fireReveal = () => {
    window.dispatchEvent(new CustomEvent('hub:intro-reveal'))
  }

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const win = window as unknown as { __lenis?: LenisHandle }

    const lockScroll = () => {
      document.body.dataset.scrollLock = 'true'
      win.__lenis?.stop()
    }

    const unlockScroll = () => {
      delete document.body.dataset.scrollLock
      win.__lenis?.start()
    }

    const onBlock = (e: Event) => {
      e.preventDefault()
    }

    const onKeyBlock = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.includes(e.key)) e.preventDefault()
    }

    lockScroll()
    window.addEventListener('wheel', onBlock, { capture: true, passive: false })
    window.addEventListener('touchmove', onBlock, { capture: true, passive: false })
    window.addEventListener('keydown', onKeyBlock, { capture: true })

    const unlock = () => {
      window.removeEventListener('wheel', onBlock, { capture: true } as EventListenerOptions)
      window.removeEventListener('touchmove', onBlock, { capture: true } as EventListenerOptions)
      window.removeEventListener('keydown', onKeyBlock, { capture: true })
      unlockScroll()
    }

    const done = () => {
      unlock()
      document.body.classList.add('intro-done')
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fireReveal()
      done()
      setGone(true)
      return
    }

    const veil = el.querySelector('.intro-veil')
    const kicker = el.querySelector('.intro-kicker')
    const lineA = el.querySelector<HTMLElement>('.intro-line--a')
    const lineB = el.querySelector<HTMLElement>('.intro-line--b')
    const innerA = el.querySelector<HTMLElement>(
      '.intro-line--a .intro-line-inner'
    )
    const innerB = el.querySelector<HTMLElement>(
      '.intro-line--b .intro-line-inner'
    )

    const tl = gsap.timeline({
      onComplete: () => {
        done()
        setGone(true)
      },
    })

    tl.set(el, { clipPath: 'inset(0 0 0% 0)', visibility: 'visible' }, 0)
      .fromTo(
        veil,
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: 'power2.out' },
        0.05
      )
      .fromTo(
        kicker,
        { opacity: 0, y: 14, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.55,
          ease: 'power3.out',
        },
        0.15
      )
      .fromTo(
        innerA,
        { yPercent: 112, y: 0 },
        { yPercent: 0, y: 0, duration: 0.7, ease: 'power4.out' },
        0.3
      )
      .fromTo(
        innerB,
        { yPercent: 112, y: 0 },
        { yPercent: 0, y: 0, duration: 0.7, ease: 'power4.out' },
        0.5
      )
      .call(fireReveal, [], 2.1)
      .to(
        [innerA, innerB],
        { yPercent: -116, y: 0, duration: 0.7, ease: 'power4.in', stagger: 0.07 },
        2.35
      )
      .to(
        [lineA, lineB],
        { y: -12, duration: 0.7, ease: 'power4.in', stagger: 0.07 },
        2.35
      )
      .to(
        kicker,
        {
          opacity: 0,
          y: -14,
          filter: 'blur(6px)',
          duration: 0.45,
          ease: 'power2.in',
        },
        2.35
      )
      .to(veil, { opacity: 0, duration: 0.6, ease: 'power2.out' }, 2.45)
      .to(
        el,
        { clipPath: 'inset(0 0 100% 0)', duration: 0.85, ease: 'power4.inOut' },
        2.6
      )
      .set(el, { pointerEvents: 'none', visibility: 'hidden' }, 3.45)

    return () => {
      tl.kill()
      unlock()
    }
  }, [])

  if (gone) return null

  return (
    <div className="intro" ref={ref} aria-hidden="true">
      <div className="intro-veil" />
      <div className="intro-center">
        <p className="intro-kicker">PROJECT HUB / INTERACTIVE ARCHIVE</p>
        <h2 className="intro-title">
          <span className="intro-line intro-line--a">
            <span className="intro-line-inner">AFRAZ</span>
          </span>
          <span className="intro-line intro-line--b">
            <span className="intro-line-inner">Creative Playground</span>
          </span>
        </h2>
      </div>
    </div>
  )
}