'use client'

import { useEffect, useRef, useState } from 'react'
import { isTouchDevice, lerp, prefersReducedMotion } from '@/lib/utils'
import { CursorState } from '@/lib/types'
import styles from '@/components/Cursor.module.css'

const WORLD_LABELS: Record<string, string> = {
  default: 'VIEW',
  nexus: 'OPEN',
  coffee: 'ENTER',
  developer: 'VIEW',
  infra: 'TRACK',
}

export default function Cursor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const worldRef = useRef('default')
  const [touch, setTouch] = useState(false)

  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) {
      setTouch(true)
      return
    }

    const container = containerRef.current!
    const label = labelRef.current!

    const readWorld = () => {
      worldRef.current = document.body.dataset.world || 'default'
    }

    const onMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX
      targetRef.current.y = e.clientY
      container.style.opacity = '1'
    }

    const onMouseLeave = () => {
      container.classList.add(styles.hidden)
    }

    const onMouseEnter = () => {
      container.classList.remove(styles.hidden)
    }

    const setState = (state: CursorState) => {
      const world = worldRef.current
      container.dataset.world = world
      container.className = styles.cursor

      switch (state) {
        case 'project':
          container.classList.add(styles.project)
          label.textContent = `${WORLD_LABELS[world] || 'VIEW'} \u2197`
          label.style.opacity = '1'
          label.style.transform = 'translateX(0)'
          break
        case 'hover':
          container.classList.add(styles.hover)
          hideLabel()
          break
        case 'nav':
          container.classList.add(styles.nav)
          hideLabel()
          break
        case 'close':
          container.classList.add(styles.close)
          hideLabel()
          break
        case 'text':
          container.classList.add(styles.text)
          hideLabel()
          break
        case 'prev':
        case 'next':
          container.classList.add(styles.hover)
          hideLabel()
          break
        default:
          hideLabel()
          break
      }
    }

    const hideLabel = () => {
      label.style.opacity = '0'
      label.style.transform = 'translateX(-8px)'
    }

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      const targeted = el.closest('[data-cursor]') as HTMLElement | null
      if (targeted) {
        setState((targeted.dataset.cursor as CursorState) || 'hover')
      } else if (el.closest('.project-card')) {
        setState('project')
      } else if (el.closest('a, button, [role="button"]')) {
        setState('hover')
      }
    }

    const onOut = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      const related = e.relatedTarget as Node | null
      const targeted = el.closest(
        '[data-cursor], a, button, [role="button"], .project-card'
      )
      if (targeted && !targeted.contains(related)) {
        setState('default')
      }
    }

    const observer = new MutationObserver(readWorld)
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-world'],
    })
    readWorld()

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    let rafId: number
    const animate = () => {
      posRef.current.x = lerp(posRef.current.x, targetRef.current.x, 0.16)
      posRef.current.y = lerp(posRef.current.y, targetRef.current.y, 0.16)
      container.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    return () => {
      observer.disconnect()
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      cancelAnimationFrame(rafId)
    }
  }, [])

  if (touch) return null

  return (
    <div ref={containerRef} className={styles.cursor}>
      <div ref={dotRef} className={styles.dot} />
      <div ref={ringRef} className={styles.ring} />
      <div ref={labelRef} className={styles.label} />
    </div>
  )
}