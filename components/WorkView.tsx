'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '@/lib/utils'
import { Project, ViewName } from '@/lib/types'
import ProjectCard from './ProjectCard'
import styles from '@/components/WorkView.module.css'

interface Props {
  active: boolean
  projects: Project[]
  openProject: (project: Project, cardEl?: HTMLElement | null) => void
  activeFilter: string
  setActiveFilter: (f: string) => void
  setVisibleCount: (n: number) => void
}

const FILTERS = ['all', 'web', 'experiments', 'client', 'concepts']

export default function WorkView({
  active,
  projects,
  openProject,
  activeFilter,
  setActiveFilter,
  setVisibleCount,
}: Props) {
  const gridRef = useRef<HTMLDivElement>(null)

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
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.1,
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
            scale: 0.95,
            y: 10,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
              ;(card as HTMLElement).classList.add('filtering-out')
              ;(card as HTMLElement).style.display = 'none'
            },
          })
        }
      })

      setVisibleCount(visibleIndex)
    },
    [activeFilter, projects, setActiveFilter, setVisibleCount]
  )

  return (
    <div
      className={`view ${active ? 'active' : ''} ${styles.work}`}
      data-view="work"
    >
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h2 className="section-title" data-reveal>Selected Work</h2>
          <div className={styles.filters}>
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
    </div>
  )
}
