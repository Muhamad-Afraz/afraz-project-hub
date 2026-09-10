'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { isTouchDevice, lerp, elementCenter } from '@/lib/utils'
import { CursorState } from '@/lib/types'
import styles from '@/components/Cursor.module.css'

export default function Cursor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const [touch, setTouch] = useState(false)

  useEffect(() => {
    if (isTouchDevice()) {
      setTouch(true)
      return
    }

    const container = containerRef.current!
    const label = labelRef.current!

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
      container.className = styles.cursor
      switch (state) {
        case 'project':
          container.classList.add(styles.project)
          label.textContent = 'VIEW PROJECT \u2197'
          label.style.opacity = '1'
          label.style.transform = 'translateX(0)'
          break
        case 'hover':
          container.classList.add(styles.hover)
          label.style.opacity = '0'
          label.style.transform = 'translateX(-8px)'
          break
        case 'nav':
          container.classList.add(styles.nav)
          label.style.opacity = '0'
          label.style.transform = 'translateX(-8px)'
          break
        case 'close':
          container.classList.add(styles.close)
          label.style.opacity = '0'
          label.style.transform = 'translateX(-8px)'
          break
        case 'text':
          container.classList.add(styles.text)
          label.style.opacity = '0'
          label.style.transform = 'translateX(-8px)'
          break
        case 'prev':
        case 'next':
          container.classList.add(styles.hover)
          label.style.opacity = '0'
          label.style.transform = 'translateX(-8px)'
          break
        default:
          label.style.opacity = '0'
          label.style.transform = 'translateX(-8px)'
          break
      }
    }

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-cursor]')
      if (target) {
        setState((target as HTMLElement).dataset.cursor as CursorState)
      } else if (
        (e.target as HTMLElement).closest('a, button, [role="button"]')
      ) {
        setState('hover')
      } else if ((e.target as HTMLElement).closest('.project-card')) {
        setState('project')
      }
    }

    const onOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        '[data-cursor], a, button, [role="button"], .project-card'
      )
      if (target && !target.contains(e.relatedTarget as Node)) {
        setState('default')
      }
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    let rafId: number
    const animate = () => {
      posRef.current.x = lerp(posRef.current.x, targetRef.current.x, 0.15)
      posRef.current.y = lerp(posRef.current.y, targetRef.current.y, 0.15)
      container.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    return () => {
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
