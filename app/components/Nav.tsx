'use client'

import { useEffect, useState } from 'react'

export type NavTarget = 'top' | 'work' | 'about' | 'lab'

type SectionId = 'the-work' | 'about' | 'lab'

const LINKS: { target: NavTarget; id: SectionId; label: string }[] = [
  { target: 'work', id: 'the-work', label: 'Work' },
  { target: 'about', id: 'about', label: 'About' },
  { target: 'lab', id: 'lab', label: 'Lab' },
]

type Props = { onNavigate: (target: NavTarget) => void }

export default function Nav({ onNavigate }: Props) {
  const [active, setActive] = useState<SectionId>('the-work')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    )
    const io = new IntersectionObserver(
      (entries) => {
        const mid = window.innerHeight * 0.45
        let best: SectionId | null = null
        let bestDist = Infinity
        entries.forEach((e) => {
          if (e.boundingClientRect.top <= mid + 60) {
            const d = Math.abs(e.boundingClientRect.top - mid)
            if (d < bestDist) {
              bestDist = d
              best = e.target.id as SectionId
            }
          }
        })
        if (best) setActive(best)
      },
      { threshold: 0 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 48))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav-inner">
        <button
          className="nav-brand"
          onClick={() => onNavigate('top')}
          aria-label="Back to top"
        >
          <span className="nav-brand-mark">AF</span>
          <span className="nav-brand-name">Afraz / Project-Hub</span>
        </button>

        <nav className="nav-links" aria-label="Primary">
          {LINKS.map((l, i) => (
            <button
              key={l.id}
              className={`nav-link${active === l.id ? ' is-active' : ''}`}
              onClick={() => onNavigate(l.target)}
              aria-current={active === l.id ? 'true' : undefined}
            >
              <span className="nav-link-idx">{String(i + 1).padStart(2, '0')}</span>
              {l.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}