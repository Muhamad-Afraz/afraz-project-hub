'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { hexToRgba, projects } from '../data/projects'
import ProjectCard from './ProjectCard'
import AboutPanel from './AboutPanel'
import Marquee from './Marquee'

type Props = { lockScroll: (locked: boolean) => void }

type Layout = {
  about: 'left' | 'middle' | 'right'
  marquee: 'left' | 'middle' | 'right'
  dir: 'left' | 'right'
}

const layoutOf = (col: number): Layout => {
  if (col === 0) return { about: 'middle', marquee: 'right', dir: 'right' }
  if (col === 1) return { about: 'left', marquee: 'right', dir: 'right' }
  return { about: 'middle', marquee: 'left', dir: 'left' }
}

const THEME_KEYS = [
  '--accent',
  '--accent-strong',
  '--accent-soft',
  '--glow',
  '--card-border',
  '--card-bg',
  '--card-bg-hover',
] as const

export default function Stage({ lockScroll }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [pinnedId, setPinnedId] = useState<string | null>(null)

  const active = pinnedId ?? hoveredId
  const activeProject = useMemo(
    () => projects.find((p) => p.id === active) ?? null,
    [active]
  )
  const activeCol = useMemo(
    () => (activeProject ? projects.findIndex((p) => p.id === activeProject.id) : -1),
    [activeProject]
  )

  const handleClick = useCallback((id: string) => {
    setPinnedId((prev) => {
      if (prev === id) {
        setHoveredId(null)
        return null
      }
      return id
    })
  }, [])

  const handleEnter = useCallback((id: string) => setHoveredId(id), [])
  const handleLeave = useCallback(
    (id: string) => setHoveredId((prev) => (prev === id ? null : prev)),
    []
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPinnedId(null)
        setHoveredId(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (activeProject) {
      const { accent, accent2 } = activeProject.theme
      root.style.setProperty('--accent', accent)
      root.style.setProperty('--accent-strong', accent2)
      root.style.setProperty('--accent-soft', hexToRgba(accent, 0.55))
      root.style.setProperty('--glow', hexToRgba(accent, 0.3))
      root.style.setProperty('--card-border', hexToRgba(accent, 0.22))
      root.style.setProperty('--card-bg', hexToRgba(accent, 0.05))
      root.style.setProperty('--card-bg-hover', hexToRgba(accent, 0.12))
    } else {
      THEME_KEYS.forEach((k) => root.style.removeProperty(k))
    }
    document.body.dataset.stage = pinnedId ? 'pinned' : active ? 'active' : ''
  }, [activeProject, active, pinnedId])

  useEffect(() => {
    lockScroll(active !== null)
  }, [active, lockScroll])

  const layout = activeCol >= 0 ? layoutOf(activeCol % 3) : null

  return (
    <section
      id="the-work"
      className={`the-work${active ? ' stage--active' : ''}${pinnedId ? ' stage--pinned' : ''}`}
    >
      <header className="work-head">
        <p className="work-label">Selected Work / Archive</p>
        <h2 className="work-title">The Work/-</h2>
      </header>

      <div className="stage-grid">
        {projects.map((p, i) => (
          <ProjectCard
            key={p.id}
            project={p}
            col={i % 3}
            active={active === p.id}
            hidden={active !== null && active !== p.id}
            onEnter={() => handleEnter(p.id)}
            onLeave={() => handleLeave(p.id)}
            onClick={() => handleClick(p.id)}
          />
        ))}

        {activeProject && layout && (
          <div className={`stage-panels${active ? ' is-active' : ''}`} aria-hidden="true">
            <div className={`panel panel--about panel--${layout.about}`}>
              <AboutPanel key={activeProject.id} project={activeProject} />
            </div>
            <div className={`panel panel--marquee panel--${layout.marquee}`}>
              <Marquee
                key={`${activeProject.id}-${layout.dir}`}
                images={activeProject.images}
                dir={layout.dir}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}