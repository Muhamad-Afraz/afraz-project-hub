'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import gsap from 'gsap'
import { FILTERS, hexToRgba, projects } from '../data/projects'
import type { FilterKey, Project } from '../data/projects'
import ProjectCard from './ProjectCard'
import AboutPanel from './AboutPanel'
import Marquee from './Marquee'

type Props = { lockScroll: (locked: boolean) => void; scrollToY: (y: number) => void }

const THEME_KEYS = [
  '--accent',
  '--accent-strong',
  '--accent-soft',
  '--glow',
  '--card-border',
  '--card-bg',
  '--card-bg-hover',
  '--veil',
] as const

const VISIBLE_TOP = 96
const VISIBLE_BOTTOM = 64

// Panels sit beside the active card, same row, pushing against the card's
// right edge when it has room — otherwise against its left edge.
const layoutOf = (col: number) => {
  if (col === 0) return { about: 2, marquee: 3 }
  if (col === 1) return { about: 3, marquee: 1 }
  return { about: 2, marquee: 1 }
}

export default function Stage({ lockScroll, scrollToY }: Props) {
  const [filter, setFilter] = useState<FilterKey>('all')
  const [exiting, setExiting] = useState<string[]>([])
  const [enterTick, setEnterTick] = useState(0)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [pinnedId, setPinnedId] = useState<string | null>(null)

  const gridRef = useRef<HTMLDivElement>(null)
  const gridHeightRef = useRef(0)
  const visibleIdsRef = useRef<string[]>(projects.map((p) => p.id))
  const holdRef = useRef<string | null>(null)
  const pinTimerRef = useRef<number | null>(null)
  const settleRef = useRef<number | null>(null)
  const pointerRef = useRef({ x: -1, y: -1 })

  const active = pinnedId ?? hoveredId
  const activeProject = useMemo(
    () => projects.find((p) => p.id === active) ?? null,
    [active]
  )

  const matches = useCallback(
    (p: Project) => filter === 'all' || p.type === filter,
    [filter]
  )

  const shown = useMemo(
    () => projects.filter((p) => matches(p) || exiting.includes(p.id)),
    [matches, exiting]
  )

  const filteredCount = useMemo(() => projects.filter(matches).length, [matches])

  const activeRow = useMemo(() => {
    if (!activeProject) return -1
    const idx = shown.findIndex((p) => p.id === activeProject.id)
    return idx < 0 ? -1 : Math.floor(idx / 3)
  }, [activeProject, shown])

  const activeCol = useMemo(() => {
    if (!activeProject) return -1
    const idx = shown.findIndex((p) => p.id === activeProject.id)
    return idx < 0 ? -1 : idx % 3
  }, [activeProject, shown])

  const clearSettle = useCallback(() => {
    if (settleRef.current) {
      window.clearTimeout(settleRef.current)
      settleRef.current = null
    }
  }, [])

  const changeFilter = useCallback(
    (f: FilterKey) => {
      if (f === filter) return
      const leaving = projects
        .filter((p) => matches(p) && !(f === 'all' || p.type === f))
        .map((p) => p.id)
      if (!leaving.length) {
        setFilter(f)
        visibleIdsRef.current = projects
          .filter((p) => f === 'all' || p.type === f)
          .map((p) => p.id)
        setEnterTick((t) => t + 1)
        return
      }
      setExiting(leaving)
      window.setTimeout(() => {
        setFilter(f)
        setExiting([])
        visibleIdsRef.current = projects
          .filter((p) => f === 'all' || p.type === f)
          .map((p) => p.id)
        setEnterTick((t) => t + 1)
        holdRef.current = null
        clearSettle()
        setPinnedId((prev) =>
          prev && !(f === 'all' || projects.find((p) => p.id === prev)?.type === f)
            ? null
            : prev
        )
      }, 300)
    },
    [filter, matches, clearSettle]
  )

  const ensureVisible = useCallback(
    (cardEl: HTMLElement | null) => {
      if (!cardEl) return
      const rect = cardEl.getBoundingClientRect()
      const vh = window.innerHeight
      let dy = 0
      if (rect.top < VISIBLE_TOP) dy = rect.top - VISIBLE_TOP
      else if (rect.bottom > vh - VISIBLE_BOTTOM) dy = rect.bottom - (vh - VISIBLE_BOTTOM)
      if (dy) scrollToY(Math.max(0, window.scrollY + dy))
    },
    [scrollToY]
  )

  const handleEnter = useCallback(
    (id: string) => {
      setHoveredId(id)
      if (pinnedId) return
      if (!window.matchMedia('(pointer: fine)').matches) return
      requestAnimationFrame(() => {
        const el = gridRef.current?.querySelector<HTMLElement>(`[data-id="${id}"]`) ?? null
        if (!el) return
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        const needsScroll = rect.top < VISIBLE_TOP || rect.bottom > vh - VISIBLE_BOTTOM
        if (needsScroll) {
          holdRef.current = id
          clearSettle()
          ensureVisible(el)
          // Once the scroll settles, release the hold: keep the hover only if
          // the pointer is still near the (now-scrolled) card.
          settleRef.current = window.setTimeout(() => {
            settleRef.current = null
            const activeCard = document.querySelector<HTMLElement>('.card--active')
            if (!activeCard || activeCard.dataset.id !== id) return
            if (document.body.dataset.stage === 'pinned') return
            const r = el.getBoundingClientRect()
            const p = pointerRef.current
            const near =
              p.x >= r.left - 80 &&
              p.x <= r.right + 80 &&
              p.y >= r.top - 48 &&
              p.y <= r.bottom + 64
            holdRef.current = null
            if (!near) setHoveredId(null)
          }, 1000)
        } else {
          clearSettle()
          holdRef.current = null
        }
      })
    },
    [pinnedId, ensureVisible, clearSettle]
  )

  const handleLeave = useCallback(
    (id: string) =>
      setHoveredId((prev) => (prev === id && holdRef.current !== id ? null : prev)),
    []
  )

  const unpin = useCallback(() => {
    holdRef.current = null
    clearSettle()
    if (pinTimerRef.current) {
      window.clearTimeout(pinTimerRef.current)
      pinTimerRef.current = null
    }
    setPinnedId(null)
    setHoveredId(null)
  }, [clearSettle])

  const handleClick = useCallback(
    (id: string) => {
      if (pinnedId === id) {
        unpin()
        return
      }
      clearSettle()
      if (pinTimerRef.current) {
        window.clearTimeout(pinTimerRef.current)
        pinTimerRef.current = null
      }
      // Pinned (page is framed and locked) — other cards must not change the pin.
      if (pinnedId) {
        return
      }
      requestAnimationFrame(() => {
        const el = gridRef.current?.querySelector<HTMLElement>(`[data-id="${id}"]`) ?? null
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (!el || reduced) {
          setPinnedId(id)
          setHoveredId(null)
          return
        }
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        const ideal = (vh - rect.height) / 2
        const top = Math.min(Math.max(ideal, VISIBLE_TOP), vh - rect.height - 48)
        const dy = rect.top - top
        if (Math.abs(dy) <= 4) {
          setPinnedId(id)
          setHoveredId(null)
          return
        }
        // Frame the card's row first (centered), then pin once the scroll settles.
        holdRef.current = id
        scrollToY(Math.max(0, window.scrollY + dy))
        pinTimerRef.current = window.setTimeout(() => {
          holdRef.current = null
          setPinnedId(id)
          setHoveredId(null)
          pinTimerRef.current = null
        }, 850)
      })
    },
    [pinnedId, scrollToY, unpin]
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') unpin()
    }
    const onMove = (e: MouseEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY }
      // After an auto-scroll hover settles (hold released), keep the effect
      // bound to the cursor: clear it once the pointer drifts away from the card.
      if (holdRef.current !== null) return
      if (document.body.dataset.stage === 'pinned') return
      const act = document.querySelector<HTMLElement>('.card--active')
      if (!act) return
      const r = act.getBoundingClientRect()
      const near =
        e.clientX >= r.left - 80 &&
        e.clientX <= r.right + 80 &&
        e.clientY >= r.top - 48 &&
        e.clientY <= r.bottom + 64
      if (!near) setHoveredId((prev) => (prev === act.dataset.id ? null : prev))
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousemove', onMove)
    }
  }, [unpin])

  useEffect(() => {
    const root = document.documentElement
    if (activeProject) {
      const { accent, accent2, bg } = activeProject.theme
      root.style.setProperty('--accent', accent)
      root.style.setProperty('--accent-strong', accent2)
      root.style.setProperty('--accent-soft', hexToRgba(accent, 0.6))
      root.style.setProperty('--glow', hexToRgba(accent, 0.3))
      root.style.setProperty('--card-border', hexToRgba(accent, 0.22))
      root.style.setProperty('--card-bg', hexToRgba(accent, 0.05))
      root.style.setProperty('--card-bg-hover', hexToRgba(accent, 0.1))
      root.style.setProperty('--veil', bg)
    } else {
      THEME_KEYS.forEach((k) => root.style.removeProperty(k))
    }
    document.body.dataset.stage = pinnedId ? 'pinned' : active ? 'active' : ''
  }, [activeProject, active, pinnedId])

  useEffect(() => {
    lockScroll(!!pinnedId)
  }, [pinnedId, lockScroll])

  useEffect(
    () => () => {
      if (pinTimerRef.current) window.clearTimeout(pinTimerRef.current)
      if (settleRef.current) window.clearTimeout(settleRef.current)
    },
    []
  )

  useLayoutEffect(() => {
    const el = gridRef.current
    if (!el) return
    const h = el.offsetHeight
    const prev = gridHeightRef.current
    gridHeightRef.current = h
    if (!prev || Math.abs(prev - h) <= 2) return
    el.classList.add('is-tweening')
    gsap.fromTo(
      el,
      { height: prev },
      {
        height: h,
        duration: 0.55,
        ease: 'power3.out',
        onComplete: () => {
          el.classList.remove('is-tweening')
          gsap.set(el, { clearProps: 'height' })
        },
      }
    )
  }, [filter, enterTick])

  useLayoutEffect(() => {
    const now = projects.filter(matches).map((p) => p.id)
    const newcomers = now.filter((id) => !visibleIdsRef.current.includes(id))
    visibleIdsRef.current = now
    if (!newcomers.length) return
    const el = gridRef.current
    if (!el) return
    const targets = Array.from(el.querySelectorAll<HTMLElement>('.card')).filter(
      (c) => newcomers.includes(c.dataset.id as string)
    )
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(targets, { opacity: 1, y: 0 })
      return
    }
    gsap.fromTo(
      targets,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06, clearProps: 'transform' }
    )
  }, [enterTick, matches])

  const layout = activeCol >= 0 ? layoutOf(activeCol) : null

  return (
    <section
      id="the-work"
      className={`the-work stage${active ? ' stage--active' : ''}${
        pinnedId ? ' stage--pinned' : ''
      }`}
    >
      <header className="work-head">
        <div className="work-head-row">
          <p className="work-label">Work / Archive</p>
          <span className="work-count">
            {String(filteredCount).padStart(2, '0')} projects
          </span>
        </div>
        <h2 className="work-title">Projects</h2>
        <p className="work-sub">
          An archive of interactive work. Approach a project and it becomes the
          room — hover to preview, click to pin.
        </p>
        <div className="work-filters" role="group" aria-label="Filter projects">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`filter-chip${filter === f.key ? ' is-active' : ''}`}
              onClick={() => changeFilter(f.key)}
              aria-pressed={filter === f.key}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <div ref={gridRef} className={`stage-grid${active ? ' is-focused' : ''}`}>
        {shown.map((p, i) => (
          <ProjectCard
            key={p.id}
            project={p}
            col={i % 3}
            active={active === p.id}
            leaving={exiting.includes(p.id)}
            onEnter={() => handleEnter(p.id)}
            onLeave={() => handleLeave(p.id)}
            onClick={() => handleClick(p.id)}
          />
        ))}

        {activeProject && activeRow >= 0 && layout && (
          <div className={`stage-panels${active ? ' is-active' : ''}`} aria-hidden="true">
            <div
              className="panel panel--about"
              style={{ gridRow: String(activeRow + 1), gridColumn: String(layout.about) }}
            >
              <AboutPanel key={activeProject.id} project={activeProject} />
            </div>
            <div
              className="panel panel--marquee"
              style={{ gridRow: String(activeRow + 1), gridColumn: String(layout.marquee) }}
            >
              <Marquee key={activeProject.id} images={activeProject.images} dir="right" />
            </div>
          </div>
        )}
      </div>

      {pinnedId && (
        <div className="stage-close">
          <button className="stage-close-btn" onClick={unpin}>
            Back to work <span className="stage-close-esc">Esc</span>
          </button>
        </div>
      )}
    </section>
  )
}