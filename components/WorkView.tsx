'use client'

import { useEffect, useRef, useCallback, useMemo } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '@/lib/utils'
import { useReveals } from '@/lib/useReveals'
import { Project } from '@/lib/types'
import ProjectCard from './ProjectCard'
import SiteFooter from './SiteFooter'
import styles from '@/components/WorkView.module.css'

interface Props {
  active: boolean
  projects: Project[]
  openProject: (project: Project, cardEl?: HTMLElement | null) => void
  activeFilter: string
  setActiveFilter: (f: string) => void
  setVisibleCount: (n: number) => void
  visibleCount: number
}

export default function WorkView({
  active,
  projects,
  openProject,
  activeFilter,
  setActiveFilter,
  setVisibleCount,
  visibleCount,
}: Props) {
  const viewRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)

  const FILTERS = useMemo(
    () => [
      'all',
      ...Array.from(new Set(projects.map((p) => p.category))),
    ],
    [projects]
  )

  useReveals(active, viewRef)

  const moveIndicator = useCallback(() => {
    if (!filtersRef.current || !indicatorRef.current) return
    const activeEl = filtersRef.current.querySelector('.filter-btn.active')
    if (!activeEl) return
    const fr = filtersRef.current.getBoundingClientRect()
    const ar = activeEl.getBoundingClientRect()
    gsap.to(indicatorRef.current, {
      left: ar.left - fr.left,
      width: ar.width,
      duration: prefersReducedMotion() ? 0 : 0.5,
      ease: 'power3.out',
    })
  }, [])

  useEffect(() => {
    moveIndicator()
  }, [active, activeFilter, moveIndicator])

  useEffect(() => {
    if (!active || !gridRef.current) return

    const cards = gridRef.current.querySelectorAll('.project-card:not(.filtering-out)')
    if (prefersReducedMotion()) {
      cards.forEach((card) => {
        ;(card as HTMLElement).style.opacity = '1'
        ;(card as HTMLElement).style.transform = 'none'
      })
      return
    }

    cards.forEach((card, i) => {
      ;(card as HTMLElement).classList.remove('visible')
      gsap.fromTo(
        card,
        { opacity: 0, y: 44, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          delay: 0.15 + i * 0.09,
          ease: 'power2.out',
          onComplete: () => (card as HTMLElement).classList.add('visible'),
        }
      )
    })
  }, [active])

  const handleFilter = useCallback(
    (filter: string) => {
      if (filter === activeFilter) return
      setActiveFilter(filter)

      if (!gridRef.current) return
      const cards = gridRef.current.querySelectorAll('.project-card')
      let visibleIndex = 0

      cards.forEach((card, i) => {
        const projectIndex = parseInt(
          (card as HTMLElement).dataset.projectIndex || '0'
        )
        const project = projects[projectIndex]
        const matches = filter === 'all' || project.category === filter

        if (matches) {
          ;(card as HTMLElement).classList.remove('filtering-out')
          ;(card as HTMLElement).style.display = ''
          gsap.to(card, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            delay: visibleIndex * 0.05,
            ease: 'power2.out',
          })
          visibleIndex++
        } else {
          gsap.to(card, {
            opacity: 0,
            scale: 0.96,
            y: 12,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
              ;(card as HTMLElement).classList.add('filtering-out')
              ;(card as HTMLElement).style.display = 'none'
            },
          })
        }
      })

      requestAnimationFrame(moveIndicator)
      setVisibleCount(visibleIndex)
    },
    [activeFilter, projects, setActiveFilter, setVisibleCount, moveIndicator]
  )

  return (
    <div
      ref={viewRef}
      className={`view ${active ? 'active' : ''} ${styles.work}`}
      data-view="work"
    >
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headingWrap}>
            <h2 className={`section-title ${styles.sectionTitle}`} data-reveal>
              The Archive
            </h2>
            <p className={styles.headingSub} data-reveal>
              Selected digital constructions, experiments, and clients — each
              one morphs this environment when you approach.
            </p>
          </div>

          <div className={styles.filterGroup}>
            <div ref={filtersRef} className={styles.filters}>
              <span ref={indicatorRef} className={styles.indicator} />
              {FILTERS.map((f) => (
                <button
                  key={f}
                  className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
                  onClick={() => handleFilter(f)}
                  data-filter={f}
                  data-cursor="hover"
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div className={styles.indexReadout}>
              <span className={styles.indexCur}>
                {String(visibleCount).padStart(2, '0')}
              </span>
              <span className={styles.indexSep}>/</span>
              <span className={styles.indexTot}>
                {String(projects.length).padStart(2, '0')}
              </span>
              <span className={styles.indexWord}>PROJECTS</span>
            </div>
          </div>
        </div>
        <div className={styles.headerLine} />
      </div>
      <div ref={gridRef} className={styles.grid}>
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            openProject={openProject}
          />
        ))}
      </div>
      <SiteFooter />
    </div>
  )
}