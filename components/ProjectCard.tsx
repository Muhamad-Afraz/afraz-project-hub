'use client'

import { useRef, useCallback, useEffect } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion, isTouchDevice } from '@/lib/utils'
import { Project } from '@/lib/types'
import { useThemeSystem } from '@/lib/useThemeSystem'
import CanvasVisual from './CanvasVisual'
import styles from '@/components/ProjectCard.module.css'

interface Props {
  project: Project
  index: number
  openProject: (project: Project, cardEl?: HTMLElement | null) => void
}

const ATMO: Record<string, string> = {
  default: '',
  nexus: styles.atmoNexus,
  coffee: styles.atmoCoffee,
  developer: styles.atmoDeveloper,
  infra: styles.atmoInfra,
}

export default function ProjectCard({ project, index, openProject }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const theme = useThemeSystem()
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const atmosphere = project.world?.atmosphere || 'default'
  const atmoClass = ATMO[atmosphere] || ''
  const numeral = String(index + 1).padStart(2, '0')

  const applyWorld = useCallback(() => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current)
      leaveTimer.current = null
    }
    theme.apply(project)
  }, [project, theme])

  const releaseWorld = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    leaveTimer.current = setTimeout(() => {
      theme.applyDefault()
    }, 160)
  }, [theme])

  const handleMouseEnter = useCallback(() => {
    applyWorld()
  }, [applyWorld])

  const handleMouseLeave = useCallback(() => {
    const el = frameRef.current
    if (el) {
      el.style.setProperty('--mx', '0')
      el.style.setProperty('--my', '0')
      el.style.setProperty('--lx', '50%')
      el.style.setProperty('--ly', '50%')
    }
    releaseWorld()
  }, [releaseWorld])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = frameRef.current
    if (!el || prefersReducedMotion() || isTouchDevice()) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    el.style.setProperty('--mx', String(x - 0.5))
    el.style.setProperty('--my', String(y - 0.5))
    el.style.setProperty('--lx', `${(e.clientX - rect.left).toFixed(0)}px`)
    el.style.setProperty('--ly', `${(e.clientY - rect.top).toFixed(0)}px`)
  }, [])

  const handleClick = useCallback(() => {
    openProject(project, cardRef.current)
  }, [project, openProject])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        openProject(project, cardRef.current)
      }
    },
    [project, openProject]
  )

  const handleFocus = useCallback(() => {
    if (!isTouchDevice()) applyWorld()
  }, [applyWorld])

  const handleBlur = useCallback(() => {
    if (!isTouchDevice()) releaseWorld()
  }, [releaseWorld])

  useEffect(() => {
    const el = cardRef.current
    if (!el || prefersReducedMotion() || isTouchDevice()) return

    const rect = el.getBoundingClientRect()
    const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - center.x
      const dy = e.clientY - center.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 130) {
        const power = (1 - dist / 130) * 0.045
        gsap.to(el, {
          x: dx * power,
          y: dy * power,
          duration: 0.3,
          ease: 'power2.out',
        })
      }
    }
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.45)' })
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className={`project-card ${styles.card} ${atmoClass}`}
      data-project-index={index}
      data-cursor="project"
      role="button"
      tabIndex={0}
      aria-label={`${project.title} — open project`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div ref={frameRef} className={styles.frame}>
        <div className={styles.frameBg} style={{ background: project.theme.visualGradient }} />
        <span className={styles.ghost}>{numeral}</span>
        <span className={styles.pointerLight} />

        {atmosphere === 'nexus' && (
          <>
            <span className={`${styles.corner} ${styles.cornerTL}`} />
            <span className={`${styles.corner} ${styles.cornerTR}`} />
            <span className={`${styles.corner} ${styles.cornerBL}`} />
            <span className={`${styles.corner} ${styles.cornerBR}`} />
            <span className={styles.nexusLine} />
          </>
        )}

        {atmosphere === 'coffee' && <span className={styles.halo} />}

        <div className={styles.content}>
          <div className={styles.top}>
            <span className={styles.index}>{numeral}</span>
            <span className={`${styles.category}`}>{project.category}</span>
            {atmosphere === 'nexus' && (
              <span className={styles.scan}>SCAN // {numeral}</span>
            )}
            {atmosphere === 'developer' && (
              <span className={styles.codeFile}>
                {project.id}.tsx <i className={styles.codeStatus} />
              </span>
            )}
            {atmosphere === 'infra' && (
              <span className={styles.waypoint}>R-{numeral}</span>
            )}
          </div>

          <div className={styles.visual}>
            <CanvasVisual project={project} />
            {atmosphere === 'infra' && (
              <span className={styles.route}>
                <span
                  className={styles.routeDot}
                  style={{ ['--route-x' as string]: index % 2 ? '74%' : '86%' }}
                />
              </span>
            )}
            {atmosphere === 'developer' && (
              <span className={styles.devPrompt}>&gt;_ build ok</span>
            )}
            <span className={styles.visualShine} />
          </div>

          <div className={styles.bottom}>
            <div className={styles.titleRow}>
              <h3 className={styles.title}>{project.title}</h3>
              <span className={styles.openArrow} aria-hidden="true">
                &#8599;
              </span>
            </div>
            <p className={styles.desc}>{project.description}</p>
            <div className={styles.metaRow}>
              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <span className={styles.year}>{project.year}</span>
            </div>
          </div>
        </div>

        <span className={styles.openLabel}>OPEN</span>
        <span className={styles.border} />
      </div>
    </div>
  )
}