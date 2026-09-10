'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { isTouchDevice, elementCenter } from '@/lib/utils'
import { ViewName } from '@/lib/types'
import styles from '@/components/Navigation.module.css'

interface Props {
  currentView: ViewName
  navigateTo: (view: ViewName) => void
  visibleCount: number
  totalCount: number
}

export default function Navigation({
  currentView,
  navigateTo,
  visibleCount,
  totalCount,
}: Props) {
  const counterRef = useRef<HTMLDivElement>(null)

  const addMagnetic = (el: HTMLElement) => {
    if (isTouchDevice()) return
    const center = elementCenter(el)

    el.addEventListener('mousemove', (e: MouseEvent) => {
      const dx = e.clientX - center.x
      const dy = e.clientY - center.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDistance = 100

      if (distance < maxDistance) {
        const power = (1 - distance / maxDistance) * 0.2
        gsap.to(el, {
          x: dx * power,
          y: dy * power,
          duration: 0.3,
          ease: 'power2.out',
        })
      }
    })

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      })
    })
  }

  useEffect(() => {
    const logo = document.querySelector('.nav-logo') as HTMLElement | null
    if (logo) addMagnetic(logo)

    document.querySelectorAll('.filter-btn').forEach((el) => {
      addMagnetic(el as HTMLElement)
    })
  }, [])

  useEffect(() => {
    if (counterRef.current) {
      const currentEl = counterRef.current.querySelector(
        '.nav-counter-current'
      ) as HTMLElement | null
      if (currentEl) {
        gsap.to(currentEl, {
          innerText: String(visibleCount).padStart(2, '0'),
          duration: 0.3,
          snap: { innerText: 1 },
          ease: 'power2.out',
        })
      }
    }
  }, [visibleCount])

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <button
          className={`nav-logo ${styles.logo}`}
          onClick={() => navigateTo('home')}
          data-nav="home"
          data-cursor="nav"
          aria-label="Afraz — Home"
        >
          <span className={styles.logoText}>AFRAZ</span>
          <span className={styles.logoDot} />
        </button>
        <div className={styles.links}>
          <button
            className={`nav-link ${currentView === 'work' || currentView === 'project' ? 'active' : ''}`}
            onClick={() => navigateTo('work')}
            data-cursor="nav"
            aria-current={currentView === 'work' || currentView === 'project' ? 'page' : undefined}
          >
            WORK
          </button>
          <button
            className={`nav-link ${currentView === 'lab' ? 'active' : ''}`}
            onClick={() => navigateTo('lab')}
            data-cursor="nav"
            aria-current={currentView === 'lab' ? 'page' : undefined}
          >
            LAB
          </button>
        </div>
        <div
          ref={counterRef}
          className={styles.counter}
          aria-live="polite"
          aria-label="Project count"
        >
          <span className="nav-counter-current">
            {String(visibleCount).padStart(2, '0')}
          </span>
          <span className="nav-counter-sep">/</span>
          <span className="nav-counter-total">
            {String(totalCount).padStart(2, '0')}
          </span>
        </div>
      </div>
    </nav>
  )
}
