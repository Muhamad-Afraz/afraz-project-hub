'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion, elementCenter } from '@/lib/utils'
import { useReveals } from '@/lib/useReveals'
import { ViewName } from '@/lib/types'
import { PROJECTS } from '@/lib/projects'
import { useThemeSystem } from '@/lib/useThemeSystem'
import styles from '@/components/HomeView.module.css'

interface Props {
  active: boolean
  navigateTo: (view: ViewName) => void
  projectCount: number
}

export default function HomeView({ active, navigateTo, projectCount }: Props) {
  const viewRef = useRef<HTMLDivElement>(null)
  const theme = useThemeSystem()

  useReveals(active, viewRef)

  useEffect(() => {
    const btn = viewRef.current?.querySelector('.btn-explore') as HTMLElement
    if (!btn || prefersReducedMotion()) return

    const center = elementCenter(btn)
    btn.addEventListener('mousemove', (e: MouseEvent) => {
      const dx = e.clientX - center.x
      const dy = e.clientY - center.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 100) {
        const power = (1 - dist / 100) * 0.2
        gsap.to(btn, {
          x: dx * power,
          y: dy * power,
          duration: 0.3,
          ease: 'power2.out',
        })
      }
    })
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' })
    })
  }, [])

  return (
    <div
      ref={viewRef}
      className={`view ${active ? 'active' : ''} ${styles.home}`}
      data-view="home"
    >
      <div className={styles.content}>
        <section className={styles.hero}>
          <div className={styles.eyebrow} data-reveal>
            <span className={styles.dot} />
            <span className={styles.eyebrowText}>Afraz — Project Archive</span>
            <span className={styles.eyebrowRange}>
              {String(projectCount).padStart(2, '0')} PROJECTS
            </span>
          </div>

          <h1 className={styles.title}>
            <span className={styles.line} data-reveal>
              <span className={styles.lineInner}>An archive</span>
            </span>
            <span className={styles.line} data-reveal>
              <span className={styles.lineInner}>
                of{' '}
                <span className={styles.accent}>
                  interactive
                  <svg
                    className={styles.underline}
                    viewBox="0 0 260 14"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 9 C 70 2.5, 190 2.5, 256 8.5"
                      stroke="url(#wav)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="wav" x1="0" y1="0" x2="1" y2="0">
                        <stop stopColor="var(--env-accent-light)" />
                        <stop offset="1" stopColor="var(--env-accent)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </span>
            </span>
            <span className={styles.line} data-reveal>
              <span className={styles.lineInner}>projects.</span>
            </span>
          </h1>

          <div className={styles.meta} data-reveal>
            <p className={styles.sub}>
              A living collection of digital constructions — interfaces,
              environments, and systems. The page responds to every project
              you approach.
            </p>
            <button
              className={`btn-explore ${styles.enterBtn}`}
              onClick={() => navigateTo('work')}
              data-cursor="hover"
            >
              <span className="btn-explore-text">Enter the archive</span>
              <span className="btn-explore-arrow">&rarr;</span>
            </button>
          </div>
        </section>

        <aside className={styles.sideIndex} data-reveal>
          <span className={styles.sideLabel}>INDEX</span>
          {PROJECTS.map((p, i) => (
            <button
              key={p.id}
              className={styles.sideItem}
              data-cursor="nav"
              onMouseEnter={() => theme.apply(p)}
              onMouseLeave={() => theme.applyDefault()}
              onFocus={() => theme.apply(p)}
              onBlur={() => theme.applyDefault()}
              onClick={() => navigateTo('work')}
            >
              <span className={styles.sideNum}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={styles.sideTitle}>{p.shortTitle}</span>
            </button>
          ))}
          <span className={styles.sideRule} />
          <span className={styles.sideNote}>hover a world</span>
        </aside>
      </div>

      <div className={`${styles.footer} ${active ? styles.footerVisible : ''}`}>
        <span>Interactive archive</span>
        <span className={styles.footerSep}>&middot;</span>
        <span className={styles.footerHighlight}>
          {String(projectCount).padStart(2, '0')} projects
        </span>
        <span className={styles.footerSep}>&middot;</span>
        <span>and growing</span>
      </div>
    </div>
  )
}