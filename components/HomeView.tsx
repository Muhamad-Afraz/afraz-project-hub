'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion, elementCenter } from '@/lib/utils'
import { ViewName } from '@/lib/types'
import styles from '@/components/HomeView.module.css'

interface Props {
  active: boolean
  navigateTo: (view: ViewName) => void
  projectCount: number
}

export default function HomeView({ active, navigateTo, projectCount }: Props) {
  const viewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active || !viewRef.current) return

    const els = viewRef.current.querySelectorAll('[data-reveal]')
    if (prefersReducedMotion()) {
      els.forEach((el) => {
        ;(el as HTMLElement).style.opacity = '1'
        ;(el as HTMLElement).style.transform = 'none'
      })
      return
    }

    gsap.fromTo(
      els,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        delay: 0.3,
        ease: 'power2.out',
      }
    )
  }, [active])

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
        gsap.to(btn, { x: dx * power, y: dy * power, duration: 0.3, ease: 'power2.out' })
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
        <div className={styles.hero}>
          <div className={styles.eyebrow} data-reveal>
            <span className={styles.line} />
            <span className={styles.tag}>Web Developer &amp; Designer</span>
          </div>
          <h1 className={styles.title}>
            <span className={styles.titleLine} data-reveal>Creative</span>
            <span className={styles.titleLine} data-reveal>Digital</span>
            <span className={`${styles.titleLine} ${styles.titleAccent}`} data-reveal>Playground</span>
          </h1>
          <p className={styles.sub} data-reveal>
            An evolving archive of experiments, projects, and digital constructions.
          </p>
          <div className={styles.cta} data-reveal>
            <button
              className="btn-explore"
              onClick={() => navigateTo('work')}
              data-cursor="hover"
            >
              <span className="btn-explore-text">Explore Work</span>
              <span className="btn-explore-arrow">&rarr;</span>
            </button>
          </div>
        </div>
        <div className={`${styles.footer} ${active ? styles.footerVisible : ''}`}>
          <span className={styles.footerItem}>Currently building</span>
          <span className={styles.footerSep}>&middot;</span>
          <span className={`${styles.footerItem} ${styles.footerHighlight}`}>
            {String(projectCount).padStart(2, '0')} projects
          </span>
          <span className={styles.footerSep}>&middot;</span>
          <span className={styles.footerItem}>and growing</span>
        </div>
      </div>
    </div>
  )
}
