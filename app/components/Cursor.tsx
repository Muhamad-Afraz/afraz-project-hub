'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return
    setEnabled(true)
    document.documentElement.classList.add('has-cursor')
    return () => {
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const dx = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power2.out' })
    const dy = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power2.out' })
    const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })
    const label = ring.querySelector<HTMLSpanElement>('.cursor-label')

    const move = (e: MouseEvent) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }

    const updateLabel = (target: EventTarget | null) => {
      const el = target as HTMLElement | null
      const hit = el && el.closest ? (el.closest('[data-cursor]') as HTMLElement | null) : null
      if (hit) {
        ring.classList.add('cursor-ring--hot')
        const pinned = document.body.dataset.stage === 'pinned'
        if (label) label.textContent = pinned ? 'PINNED' : hit.dataset.cursor || 'VIEW'
      } else {
        ring.classList.remove('cursor-ring--hot')
        if (label) label.textContent = ''
      }
    }

    const over = (e: MouseEvent) => updateLabel(e.target)
    const click = (e: MouseEvent) => updateLabel(e.target)

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    document.addEventListener('click', click)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('click', click)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring">
        <span className="cursor-label" />
      </div>
    </div>
  )
}