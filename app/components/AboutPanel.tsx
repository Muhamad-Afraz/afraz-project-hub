'use client'

import { useEffect, useState } from 'react'
import type { Project } from '../data/projects'

type Props = { project: Project }

export default function AboutPanel({ project }: Props) {
  const [typed, setTyped] = useState('')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(project.description)
      return
    }

    setTyped('')
    let i = 0
    let interval: ReturnType<typeof setInterval> | undefined
    const timer = setTimeout(() => {
      interval = setInterval(() => {
        i += 1
        setTyped(project.description.slice(0, i))
        if (i >= project.description.length && interval) clearInterval(interval)
      }, 12)
    }, 450)

    return () => {
      clearTimeout(timer)
      if (interval) clearInterval(interval)
    }
  }, [project])

  const done = typed.length >= project.description.length

  return (
    <div className="about">
      <div className="about-meta">
        <span className="about-index">{project.index}</span>
        <span className="about-category">{project.category}</span>
        <span className="about-status">{project.status}</span>
      </div>

      <h3 className="about-title">{project.title}</h3>

      <p className="about-desc">
        {typed || '\u00A0'}
        {!done && <span className="about-caret" aria-hidden="true" />}
      </p>

      <div className="about-tech">
        <span className="about-tech-label">Tech</span>
        <ul className="about-tags">
          {project.tags.map((t) => (
            <li key={t} className="about-tag">
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="about-actions">
        {project.url ? (
          <a className="btn btn--primary" href={project.url}>
            Open project <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span className="btn btn--muted" aria-disabled="true">
            Open project <span className="about-pending">— link pending</span>
          </span>
        )}
      </div>
    </div>
  )
}