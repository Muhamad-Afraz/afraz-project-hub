'use client'

import { createContext, useContext, useCallback, useRef, useEffect, ReactNode } from 'react'
import { gsap } from 'gsap'
import { interpolateColors, easeInOutCubic } from '@/lib/utils'
import { Project } from '@/lib/types'

interface ThemeContextValue {
  apply: (project: Project) => void
  applyDefault: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  apply: () => {},
  applyDefault: () => {},
})

export function useThemeSystem() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const fromRef = useRef('#7C3AED')
  const toRef = useRef('#7C3AED')
  const animStartRef = useRef(0)
  const animDurationRef = useRef(1.0)
  const runningRef = useRef(false)

  const tick = useCallback((time: number) => {
    if (!runningRef.current) return
    const progress = (time - animStartRef.current) / animDurationRef.current
    const clamped = Math.min(Math.max(progress, 0), 1)
    const eased = easeInOutCubic(clamped)

    const accent = interpolateColors(fromRef.current, toRef.current, eased)
    document.documentElement.style.setProperty('--theme-accent', accent)

    if (clamped >= 1) {
      runningRef.current = false
    }
  }, [])

  useEffect(() => {
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
    }
  }, [tick])

  const reset = useCallback(() => {
    runningRef.current = false
    const root = document.documentElement
    root.style.removeProperty('--theme-accent')
    root.style.removeProperty('--theme-accent-glow')
    root.style.removeProperty('--theme-bg')
    root.style.removeProperty('--theme-text')

    const ambientGrid = document.getElementById('ambientGrid')
    if (ambientGrid) ambientGrid.classList.remove('visible')

    document.body.style.backgroundColor = ''
    const ambientGrad = document.querySelector('.ambient-gradient') as HTMLElement | null
    if (ambientGrad) ambientGrad.style.background = ''
  }, [])

  const apply = useCallback(
    (project: Project) => {
      if (!project?.theme) return
      const t = project.theme
      const root = document.documentElement

      fromRef.current =
        getComputedStyle(root).getPropertyValue('--theme-accent').trim() || '#7C3AED'
      toRef.current = t.accent

      animStartRef.current = gsap.ticker.time
      animDurationRef.current = 1.0
      runningRef.current = true

      root.style.setProperty('--theme-bg', t.bg)
      root.style.setProperty('--theme-text', t.text)

      const ambientGrid = document.getElementById('ambientGrid')
      if (ambientGrid) {
        ambientGrid.style.opacity = String(t.gridOpacity)
        if (t.gridOpacity > 0) ambientGrid.classList.add('visible')
      }

      const ambientGrad = document.querySelector('.ambient-gradient') as HTMLElement | null
      if (ambientGrad) {
        ambientGrad.style.background = `radial-gradient(ellipse 80% 50% at 50% -20%, ${t.accentGlow} 0%, transparent 60%)`
      }

      gsap.to(document.body, {
        backgroundColor: t.bg,
        duration: 0.8,
        ease: 'power2.inOut',
      })
    },
    []
  )

  const applyDefault = useCallback(() => {
    reset()
  }, [reset])

  return (
    <ThemeContext.Provider value={{ apply, applyDefault }}>
      {children}
    </ThemeContext.Provider>
  )
}
