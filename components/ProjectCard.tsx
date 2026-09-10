'use client'

import { useRef, useCallback, useEffect } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion, elementCenter } from '@/lib/utils'
import { Project } from '@/lib/types'
import { useThemeSystem } from '@/lib/useThemeSystem'
import CanvasVisual from './CanvasVisual'
import styles from '@/components/ProjectCard.module.css'

interface Props {
  project: Project
  index: number
  openProject: (project: Project, cardEl?: HTMLElement | null) => void
}

export default function ProjectCard({ project, index, openProject }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const theme = useThemeSystem()

  const handleMouseEnter = useCallback(() => {
    theme.apply(project)
    const grid = document.getElementById('ambientGrid')
    if (grid) {
      grid.style.opacity = String(project.theme.gridOpacity)
    }
  }, [project, theme])

  const handleMouseLeave = useCallback(() => {
    theme.applyDefault()
    if (innerRef.current) {
      gsap.to(innerRef.current, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out',
      })
    }
  }, [theme])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (prefersReducedMotion() || !innerRef.current || !bgRef.current) return

      const rect = cardRef.current!.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height

      const tiltX = (y - 0.5) * -8
      const tiltY = (x - 0.5) * 8

      gsap.to(innerRef.current, {
        rotateX: tiltX,
        rotateY: tiltY,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 800,
      })

      gsap.to(bgRef.current, {
        x: (x - 0.5) * 10,
        y: (y - 0.5) * 10,
        duration: 0.3,
        ease: 'power2.out',
      })
    },
    []
  )

  const handleClick = useCallback(() => {
    openProject(project, cardRef.current)
  }, [project, openProject])

  useEffect(() => {
    if (prefersReducedMotion() || !cardRef.current) return
    const el = cardRef.current
    const center = elementCenter(el)

    el.addEventListener('mousemove', (e: MouseEvent) => {
      const dx = e.clientX - center.x
      const dy = e.clientY - center.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 100) {
        const power = (1 - dist / 100) * 0.05
        gsap.to(el, { x: dx * power, y: dy * power, duration: 0.3, ease: 'power2.out' })
      }
    })
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' })
    })
  }, [])

  return (
    <div
      ref={cardRef}
      className={`project-card ${styles.card}`}
      data-project-index={index}
      data-cursor="project"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <div ref={innerRef} className={styles.inner}>
        <div
          ref={bgRef}
          className={styles.bg}
          style={{ background: project.theme.visualGradient }}
        />
        <div className={styles.content}>
          <div className={styles.top}>
            <span className={styles.index}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className={styles.category}>{project.category}</span>
          </div>
          <div className={styles.visual}>
            <CanvasVisual project={project} />
          </div>
          <div className={styles.bottom}>
            <h3 className={styles.title}>{project.title}</h3>
            <p className={styles.desc}>{project.description}</p>
            <div className={styles.tags}>
              {project.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.hoverLayer}>
          <span className={styles.viewLabel}>View Project &#8599;</span>
        </div>
        <div className={styles.border} />
      </div>
    </div>
  )
}
