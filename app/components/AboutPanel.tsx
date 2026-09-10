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
    }, 550)

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
      </div>
      <h3 className="about-title">{project.title}</h3>
      <p className="about-desc">
        {typed || '\u00A0'}
        {!done && <span className="about-caret" aria-hidden="true" />}
      </p>
      <ul className="about-tags">
        {project.tags.map((t) => (
          <li key={t} className="about-tag">
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}