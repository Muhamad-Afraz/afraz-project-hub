'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

type Props = {
  images: string[]
  dir: 'left' | 'right'
}

export default function Marquee({ images, dir }: Props) {
  const loomRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const loom = loomRef.current
    if (!loom) return
    const frame = loom.querySelector<HTMLElement>('.marquee-frame')
    if (frame) {
      const h = frame.getBoundingClientRect().height
      if (h > 0) loom.style.setProperty('--mh', `${Math.round(h)}px`)
    }
  }, [])

  useEffect(() => {
    const loom = loomRef.current
    if (!loom) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sideX = dir === 'right' ? 140 : -140
    const panels = Array.from(loom.querySelectorAll<HTMLElement>('.marquee-panel'))

    gsap.set(panels, { clearProps: 'opacity' })
    if (reduced) return

    const tl = gsap.timeline()
    panels.forEach((panel, j) => {
      const n = j % images.length
      if (n >= 5) return
      const flow =
        n < 2 ? { x: sideX, y: 0 } : n < 4 ? { x: 0, y: -180 } : { x: 0, y: 180 }
      gsap.set(panel, { ...flow, opacity: 0 })
      tl.to(
        panel,
        { x: 0, y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        (j >= images.length ? 0.5 : 0) + n * 0.12
      )
    })

    return () => {
      tl.kill()
    }
  }, [dir, images])

  const renderCopy = (copy: number) =>
    images.map((src, n) => (
      <div key={`${copy}-${n}`} className="marquee-panel">
        <img src={src} alt="" draggable={false} />
      </div>
    ))

  return (
    <div className={`marquee marquee--${dir}`} ref={loomRef}>
      <div className="marquee-frame">
        <div className="marquee-strip marquee-strip--a">
          {[0, 1].map(renderCopy)}
        </div>
        <div className="marquee-strip marquee-strip--b">
          {[0, 1].map(renderCopy)}
        </div>
      </div>
    </div>
  )
}