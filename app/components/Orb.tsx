'use client'

import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const PH_IMG = (() => {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="520" viewBox="0 0 400 520">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eaf1ff"/><stop offset="1" stop-color="#7aa8ff"/></linearGradient></defs>` +
    `<rect width="400" height="520" fill="#0a0a0c"/>` +
    `<rect width="400" height="520" fill="url(#g)" opacity="0.5"/>` +
    `<rect width="400" height="520" fill="url(#g)" opacity="0.12"/>` +
    `<circle cx="200" cy="200" r="150" fill="url(#g)" opacity="0.14"/>` +
    `<circle cx="200" cy="200" r="96" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.5" stroke-dasharray="3 7"/>` +
    `<circle cx="200" cy="200" r="46" fill="#ffffff" opacity="0.12"/>` +
    `<text x="24" y="58" font-family="monospace" font-size="14" letter-spacing="3" fill="#ffffff" opacity="0.85">AFRAZ / PROJECT HUB</text>` +
    `<text x="200" y="330" text-anchor="middle" font-family="monospace, sans-serif" font-size="30" letter-spacing="8" fill="#ffffff" opacity="0.95">PROJECT</text>` +
    `<text x="200" y="372" text-anchor="middle" font-family="monospace, sans-serif" font-size="30" letter-spacing="8" fill="#ffffff" opacity="0.95">HUB</text>` +
    `<text x="200" y="500" text-anchor="middle" font-family="monospace, sans-serif" font-size="11" letter-spacing="2" fill="#ffffff" opacity="0.4">PROJECT-HUB ARCHIVE</text>` +
    `</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
})()

type OrbEntry = {
  key: string
  name: string
  index: string
  accent: string
  image: string
}

const ENTRIES: OrbEntry[] = [
  {
    key: 'portfolio',
    name: 'Portfolio',
    index: '01',
    accent: '#b6ff2e',
    image: '/Portfolio.image/Hero section.png',
  },
  {
    key: 'nexus',
    name: 'Nexus 2027',
    index: '02',
    accent: '#a78bfa',
    image: '/Nexus.image/Hero section.png',
  },
  {
    key: 'coffee',
    name: 'Coffee House',
    index: '03',
    accent: '#ddc19c',
    image: '/Housecoffee.image/Hero section.png',
  },
  {
    key: 'hub',
    name: 'Project Hub',
    index: '04',
    accent: '#dfe8ff',
    image: PH_IMG,
  },
]

// A face is front-facing when carousel spin + face rotateY == 0 (mod 360),
// i.e. face index i satisfies i == -spin/90 (mod 4).
function faceOf(deg: number) {
  return (((-Math.round(deg / 90)) % 4) + 4) % 4
}

const STAR_N = 42
const STARS: Array<Record<string, string>> = Array.from(
  { length: STAR_N },
  (_, i) => {
    const golden = i * 2.399963229728653
    const v = 1 - (2 * (i + 0.5)) / STAR_N
    const phi = Math.acos(v)
    const r = 72 + ((i * 37) % 52)
    const x = r * Math.sin(phi) * Math.cos(golden)
    const y = r * Math.sin(phi) * Math.sin(golden)
    const z = r * v
    return {
      '--s': `${1 + (i % 3)}px`,
      '--x': `${x.toFixed(0)}px`,
      '--y': `${y.toFixed(0)}px`,
      '--z': `${z.toFixed(0)}px`,
      '--o': `${0.25 + ((i * 13) % 20) / 40}`,
      '--dur': `${2.6 + (i % 5) * 0.7}s`,
      '--del': `${-((i * 29) % 100) / 10}s`,
    }
  }
)

export default function Orb() {
  const boxRef = useRef<HTMLDivElement>(null)
  const spaceRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const bloomRef = useRef<HTMLDivElement>(null)
  const readIdxRef = useRef<HTMLSpanElement>(null)
  const readNameRef = useRef<HTMLSpanElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)

  const coarse =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

  useEffect(() => {
    const box = boxRef.current
    const space = spaceRef.current
    const carousel = carouselRef.current
    const bloom = bloomRef.current
    if (!box || !space || !carousel) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const spin = { deg: 0 }
    const tilt = { rx: -6, ry: 0 }
    const pulse = { s: 1 }
    const shown = { name: ENTRIES[0].name, front: 0 }
    let typeToken = 0

    let tween: gsap.core.Tween | null = null
    let idle: gsap.core.Tween | null = null

    const clear = () => {
      tween?.kill()
      idle?.kill()
      tween = null
      idle = null
    }

    const flare = () => {
      if (!bloom) return
      gsap.killTweensOf(bloom)
      gsap.fromTo(
        bloom,
        { opacity: 0.6 },
        { opacity: 0.95, duration: 0.7, ease: 'power2.out' }
      )
    }

    const typeName = (el: HTMLElement, final: string) => {
      const token = ++typeToken
      let text = el.textContent ?? ''
      const stepDelete = () => {
        if (token !== typeToken) return
        if (text.length > 0) {
          text = text.slice(0, -1)
          el.textContent = text
          window.setTimeout(stepDelete, 20)
          return
        }
        let typed = 0
        const stepType = () => {
          if (token !== typeToken) return
          typed += 1
          el.textContent = final.slice(0, typed)
          if (typed < final.length) {
            window.setTimeout(stepType, 38 + Math.round(Math.random() * 30))
          }
        }
        stepType()
      }
      stepDelete()
    }

    const setReadout = (i: number) => {
      const e = ENTRIES[i]
      box.style.setProperty('--orb-accent', e.accent)
      if (readIdxRef.current) readIdxRef.current.textContent = e.index
      const name = readNameRef.current
      if (name && shown.name !== e.name) {
        shown.name = e.name
        if (reduce) {
          name.textContent = e.name
          return
        }
        typeName(name, e.name)
      }
    }

    const render = () => {
      carousel.style.transform = `rotateY(${spin.deg}deg)`
      space.style.transform = `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${pulse.s})`
      box.style.setProperty('--orb-rx', `${tilt.rx}deg`)
      box.style.setProperty('--orb-ry', `${tilt.ry}deg`)
      const f = faceOf(spin.deg)
      if (f !== shown.front) {
        shown.front = f
        setReadout(f)
      }
    }
    render()

    const startIdle = () => {
      idle = gsap.to(spin, { deg: '+=360', duration: 28, ease: 'none', repeat: -1 })
    }

    const spinTo = (deg: number, dur = 1.05, ease = 'expo.inOut') => {
      clear()
      if (!reduce) {
        gsap.fromTo(
          pulse,
          { s: 1.035 },
          { s: 1, duration: 0.85, ease: 'elastic.out(1,0.55)' }
        )
        flare()
      }
      tween = gsap.to(spin, {
        deg,
        duration: dur,
        ease,
        onComplete: () => {
          tween = null
          setReadout(faceOf(spin.deg))
          startIdle()
        },
      })
    }

    const qRx = gsap.quickTo(tilt, 'rx', { duration: 1.1, ease: 'power3.out' })
    const qRy = gsap.quickTo(tilt, 'ry', { duration: 1.1, ease: 'power3.out' })

    const state = { down: false, x: 0, moved: 0, dx: 0 }

    const hover = (e: PointerEvent, on: boolean) => {
      box.classList.toggle('is-hot', on)
      if (!on || coarse) return
      const r = box.getBoundingClientRect()
      const nx = (e.clientX - r.left) / r.width - 0.5
      const ny = (e.clientY - r.top) / r.height - 0.5
      box.style.setProperty('--mx', `${(nx + 0.5) * 100}%`)
      box.style.setProperty('--my', `${(ny + 0.5) * 100}%`)
      qRx(-6 + ny * -14)
      qRy(nx * 20)
    }

    const dimHint = () => {
      const h = hintRef.current
      if (h) h.style.opacity = '0'
    }

    if (reduce) {
      setReadout(0)
      return () => clear()
    }

    gsap.ticker.add(render)
    setReadout(0)
    startIdle()

    const onPointerEnter = () => box.classList.add('is-hot')
    const onPointerLeave = () => {
      box.classList.remove('is-hot')
      qRx(-6)
      qRy(0)
    }

    const onPointerDown = (e: PointerEvent) => {
      dimHint()
      clear()
      state.down = true
      state.x = e.clientX
      state.moved = 0
      state.dx = 0
      if (e.pointerType === 'mouse') box.setPointerCapture(e.pointerId)
      qRx(0)
      qRy(0)
    }

    const onPointerMove = (e: PointerEvent) => {
      hover(e, true)
      if (state.down) {
        const dx = e.clientX - state.x
        state.x = e.clientX
        state.moved += Math.abs(dx)
        state.dx = dx
        spin.deg += dx * 0.5
      }
    }

    const onPointerUp = (e: PointerEvent) => {
      hover(e, false)
      if (!state.down) return
      state.down = false
      if (state.moved > 6) {
        const inertia = Math.max(-16, Math.min(16, state.dx * 6))
        const target = Math.round((spin.deg + inertia) / 90) * 90
        spinTo(target, 1.1, 'power3.out')
        return
      }
      // No swipe: a scroll gesture (pointercancel) or a light nudge killed the
      // idle spin on pointerdown. Always bring rotation back unless a spin-to
      // tween is already running.
      if (!tween) startIdle()
    }

    const onClick = () => {
      dimHint()
      if (state.moved > 6) return
      state.moved = 0
      spinTo(spin.deg - 90, 0.9, 'power3.out')
    }

    box.addEventListener('pointerenter', onPointerEnter)
    box.addEventListener('pointerleave', onPointerLeave)
    box.addEventListener('pointerdown', onPointerDown)
    box.addEventListener('pointermove', onPointerMove)
    box.addEventListener('pointerup', onPointerUp)
    box.addEventListener('pointercancel', onPointerUp)
    box.addEventListener('click', onClick)

    return () => {
      gsap.ticker.remove(render)
      clear()
      box.removeEventListener('pointerenter', onPointerEnter)
      box.removeEventListener('pointerleave', onPointerLeave)
      box.removeEventListener('pointerdown', onPointerDown)
      box.removeEventListener('pointermove', onPointerMove)
      box.removeEventListener('pointerup', onPointerUp)
      box.removeEventListener('pointercancel', onPointerUp)
      box.removeEventListener('click', onClick)
    }
  }, [])

  const faces: ReactNode[] = ENTRIES.map((e, i) => {
    const style = {
      transform: `rotateY(${i * 90}deg) translateZ(var(--face-r))`,
    } as const
    return (
      <figure key={e.key} className={`orb-face orb-face--${i}`} style={style}>
        <div className="orb-face-frame">
          <img
            className="orb-face-img"
            src={e.image}
            alt=""
            draggable={false}
          />
          <span className="orb-face-veil" />
          <span className="orb-face-sheen" />
        </div>
        <span className="orb-face-halo" />
        <figcaption className="orb-face-caption">
          <span className="orb-face-index">{e.index}</span>
          <span className="orb-face-name">{e.name}</span>
        </figcaption>
      </figure>
    )
  })

  const stars: ReactNode[] = STARS.slice(0, coarse ? 12 : STAR_N).map(
    (style, i) => <i key={i} className="orb-star" style={style as CSSProperties} />
  )

  return (
    <div className="hero-orb">
      <div
        className="orb"
        ref={boxRef}
        role="button"
        aria-label="Cycle through projects"
      >
        <div className="orb-space" ref={spaceRef}>
          <div className="orb-rings" aria-hidden="true">
            <div className="orb-ring orb-ring--1" />
            <div className="orb-ring orb-ring--2" />
            <div className="orb-div orb-div--h" />
            <div className="orb-div orb-div--v" />
          </div>

          <div className="orb-iris" aria-hidden="true" />

          <div className="orb-bloom" ref={bloomRef} aria-hidden="true" />

          <div className="orb-field" aria-hidden="true">
            {stars}
          </div>

          <div className="orb-carousel" ref={carouselRef}>
            {faces}
          </div>

          <span className="orb-core" aria-hidden="true" />

          <div className="orb-hud" aria-hidden="true">
            <div className="orb-sweep-wrap">
              <i className="orb-sweep" />
            </div>
            <span className="orb-bracket orb-bracket--tl" />
            <span className="orb-bracket orb-bracket--tr" />
            <span className="orb-bracket orb-bracket--bl" />
            <span className="orb-bracket orb-bracket--br" />
          </div>

          <div className="orb-light" aria-hidden="true" />
        </div>

        <div className="orb-readout">
          <span className="orb-readout-idx" ref={readIdxRef}>
            01
          </span>
          <span className="orb-readout-name" ref={readNameRef}>
            Portfolio
          </span>
          <span className="orb-readout-cursor" aria-hidden="true" />
        </div>

        <div className="orb-hint" ref={hintRef}>
          <span>drag — rotate</span>
          <span>click — next</span>
        </div>
      </div>
    </div>
  )
}