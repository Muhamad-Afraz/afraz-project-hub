'use client'

import { useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion, formatIndex } from '@/lib/utils'
import { Project } from '@/lib/types'
import { useThemeSystem } from '@/lib/useThemeSystem'
import CanvasVisual from './CanvasVisual'
import styles from '@/components/ProjectDetail.module.css'

interface Props {
  active: boolean
  project: Project
  projects: Project[]
  closeProject: () => void
  openProject: (project: Project, cardEl?: HTMLElement | null) => void
}

export default function ProjectDetail({
  active,
  project,
  projects,
  closeProject,
  openProject,
}: Props) {
  const viewRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const theme = useThemeSystem()

  const projectIndex = projects.findIndex((p) => p.id === project.id)

  const goToNext = useCallback(() => {
    if (projectIndex < projects.length - 1) {
      openProject(projects[projectIndex + 1])
    }
  }, [projectIndex, projects, openProject])

  const goToPrev = useCallback(() => {
    if (projectIndex > 0) {
      openProject(projects[projectIndex - 1])
    }
  }, [projectIndex, projects, openProject])

  useEffect(() => {
    if (!active) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProject()
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToNext()
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToPrev()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [active, goToNext, goToPrev, closeProject])

  useLayoutEffect(() => {
    if (!active || !viewRef.current) return
    if (prefersReducedMotion()) return

    const tl = gsap.timeline()
    tl.fromTo(viewRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
    tl.fromTo(
      headerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      0.1
    )
    tl.fromTo(
      bodyRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      0.3
    )
  }, [active, project.id])

  useEffect(() => {
    if (active) theme.apply(project)
  }, [active, project, theme])

  const prevVisible = projectIndex > 0
  const nextVisible = projectIndex < projects.length - 1

  return (
    <div
      ref={viewRef}
      className={`view ${active ? 'active' : ''} ${styles.project}`}
      data-view="project"
    >
      <div className={styles.detail}>
        <button
          className={styles.close}
          onClick={closeProject}
          data-cursor="close"
          aria-label="Close project"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button>

        <div ref={headerRef} className={styles.header}>
          <span className={styles.index}>
            {formatIndex(projectIndex + 1, projects.length)}
          </span>
          <h2 className={styles.title}>{project.title}</h2>
          <div className={styles.meta}>
            <span className={styles.category}>{project.category}</span>
            <span className={styles.year}>{project.year}</span>
          </div>
        </div>

        <div ref={bodyRef} className={styles.body}>
          <div
            id="projectDetailPreview"
            className={styles.preview}
            aria-hidden="true"
          >
            <CanvasVisual project={project} />
          </div>
          <div className={styles.info}>
            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>About</span>
              <p className={styles.infoValue}>{project.longDescription}</p>
            </div>
            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>What was built</span>
              <ul className={styles.builtList}>
                {project.built.map((item) => (
                  <li key={item} className={styles.builtItem}>
                    <span className={styles.builtMark} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>Technologies</span>
              <div className={styles.tagList}>
                {project.tech.map((tech) => (
                  <span key={tech} className={styles.tag}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            {project.url && project.url !== '#' && (
              <div className={styles.visit}>
                <a
                  href={project.url}
                  className={styles.visitLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.visitLabel}>Visit Project</span>
                  <span className={styles.visitArrow} aria-hidden="true">
                    &#8599;
                  </span>
                </a>
              </div>
            )}
          </div>
        </div>

        <div className={styles.nav}>
          <button
            className={styles.navBtn}
            onClick={goToPrev}
            data-cursor="prev"
            aria-label="Previous project"
            disabled={!prevVisible}
            style={{ visibility: prevVisible ? 'visible' : 'hidden' }}
          >
            <span className={styles.navLabel}>&#8592; Previous</span>
          </button>
          <button
            className={styles.navBtn}
            onClick={goToNext}
            data-cursor="next"
            aria-label="Next project"
            disabled={!nextVisible}
            style={{ visibility: nextVisible ? 'visible' : 'hidden' }}
          >
            <span className={styles.navLabel}>Next &#8594;</span>
          </button>
        </div>
      </div>
    </div>
  )
}