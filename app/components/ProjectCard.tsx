'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import type { Project } from '../data/projects'

type Props = {
  project: Project
  col: number
  active: boolean
  leaving: boolean
  onEnter: () => void
  onLeave: () => void
  onClick: () => void
}

export default function ProjectCard({
  project,
  col,
  active,
  leaving,
  onEnter,
  onLeave,
  onClick,
}: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const coarse =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

  const handleMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = rootRef.current
    if (!el || active) return
    if (coarse) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(el, {
      rotateY: px * 10,
      rotateX: py * -10,
      transformPerspective: 1000,
      duration: 0.6,
      ease: 'power2.out',
    })
  }

  const handleEnter = () => {
    if (coarse) {
      onEnter()
      return
    }
    const el = rootRef.current
    if (el && !active) gsap.to(el, { scale: 1.02, duration: 0.45, ease: 'power3.out' })
    onEnter()
  }

  const handleLeave = () => {
    if (!coarse) {
      gsap.to(rootRef.current, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.6, ease: 'power3.out' })
    }
    onLeave()
  }

  return (
    <article
      ref={rootRef}
      role="button"
      tabIndex={0}
      data-id={project.id}
      data-col={col}
      data-cursor="VIEW"
      aria-label={`${project.title} — ${project.category}`}
      aria-expanded={coarse && active ? true : undefined}
      className={`card card--col-${col}${active ? ' card--active' : ''}${
        leaving ? ' card--leaving' : ''
      }`}
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
        <img className="card-img" src={project.images[0]} alt={`${project.title} preview`} draggable={false} loading={coarse ? 'lazy' : undefined} decoding={coarse ? 'async' : undefined} />
        <img
          className="card-img card-img--layer"
          src={project.images[1] ?? project.images[0]}
          alt=""
          draggable={false}
          loading={coarse ? 'lazy' : undefined}
          decoding={coarse ? 'async' : undefined}
        />
        <span className="card-glow" />
        <span className="card-index">{project.index}</span>
      </div>
      <div className="card-copy">
        <div className="card-meta">
          <span className="card-status">{project.status}</span>
          <span className="card-category">{project.type}</span>
        </div>
        <h3 className="card-title">{project.title}</h3>
        <p className="card-tagline">{project.tagline}</p>
      </div>
    </article>
  )
}