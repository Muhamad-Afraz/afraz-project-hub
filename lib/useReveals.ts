'use client'

import { useEffect } from 'react'
import type { RefObject } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '@/lib/utils'

/**
 * Reveals all `[data-reveal]` elements inside a view when it becomes active.
 * Honors prefers-reduced-motion by showing elements instantly.
 */
export function useReveals(
  active: boolean,
  ref: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!active || !ref.current) return

    const els = ref.current.querySelectorAll('[data-reveal]')

    if (prefersReducedMotion()) {
      els.forEach((el) => {
        const element = el as HTMLElement
        element.style.opacity = '1'
        element.style.transform = 'none'
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
  }, [active, ref])
}