'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import type { Project } from '../data/projects'

type Props = {
  project: Project
  col: number
  active: boolean
  hidden: boolean
  onEnter: () => void
  onLeave: () => void
  onClick: () => void
}

export default function ProjectCard({
  project,
  col,
  active,
  hidden,
  onEnter,
  onLeave,
  onClick,
}: Props) {
  const rootRef = useRef<HTMLElement>(null)

  const handleMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = rootRef.current
    if (!el || hidden) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(el, {
      rotateY: px * 16,
      rotateX: py * -16,
      transformPerspective: 1000,
      duration: 0.6,
      ease: 'power2.out',
    })
  }

  const handleEnter = () => {
    gsap.to(rootRef.current, { scale: 1.05, duration: 0.5, ease: 'power3.out' })
    onEnter()
  }

  const handleLeave = () => {
    gsap.to(rootRef.current, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.7, ease: 'power3.out' })
    onLeave()
  }

  return (
    <article
      ref={rootRef}
      role="button"
      tabIndex={0}
      data-col={col}
      data-cursor="VIEW"
      aria-label={`${project.title} — ${project.category}`}
      className={`card card--col-${col}${active ? ' card--active' : ''}${hidden ? ' card--hidden' : ''}`}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onPointerMove={handleMove}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className="card-visual">
        <img className="card-img" src={project.images[5]} alt="" draggable={false} />
        <img className="card-img card-img--layer" src={project.images[2]} alt="" draggable={false} />
        <span className="card-glow" />
        <span className="card-index">{project.index}</span>
      </div>
      <div className="card-copy">
        <span className="card-category">{project.category}</span>
        <h3 className="card-title">{project.title}</h3>
        <p className="card-tagline">{project.tagline}</p>
      </div>
    </article>
  )
}