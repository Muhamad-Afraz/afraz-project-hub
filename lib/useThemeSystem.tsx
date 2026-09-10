'use client'

import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from 'react'
import { gsap } from 'gsap'
import {
  parseCssColor,
  toCssColor,
  interpolateRgba,
  lerpNum,
  RGBA,
  prefersReducedMotion,
} from '@/lib/utils'
import { Project, ProjectWorld, Atmosphere } from '@/lib/types'

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

/**
 * Neutral archive world — Project-Hub's resting state.
 * Monochrome by design: the projects are what bring color.
 */
export const DEFAULT_WORLD: ProjectWorld = {
  atmosphere: 'default',
  bg: '#0a0a0b',
  bgSecondary: '#111114',
  text: '#f0f1f4',
  textSecondary: '#a2a6b0',
  textMuted: '#5c616b',
  accent: '#e8e8ea',
  accentLight: '#ffffff',
  glowColor: '#ffffff',
  glowAlpha: 0.18,
  borderAlpha: 0.07,
  gridAlpha: 0.05,
  gridSize: 88,
  grain: 0.035,
  cursorColor: '#c6cad2',
  horizon: '#1c1c21',
  horizonAlpha: 0.5,
  underColor: '#05050a',
}

interface WorldState {
  bg: RGBA
  bgSecondary: RGBA
  text: RGBA
  textSecondary: RGBA
  textMuted: RGBA
  accent: RGBA
  accentLight: RGBA
  cursorColor: RGBA
  glowColor: RGBA
  glowAlpha: number
  borderAlpha: number
  gridAlpha: number
  gridSize: number
  grain: number
  horizon: RGBA
  horizonAlpha: number
  underColor: RGBA
}

function worldToState(w: ProjectWorld): WorldState {
  return {
    bg: parseCssColor(w.bg),
    bgSecondary: parseCssColor(w.bgSecondary),
    text: parseCssColor(w.text),
    textSecondary: parseCssColor(w.textSecondary),
    textMuted: parseCssColor(w.textMuted),
    accent: parseCssColor(w.accent),
    accentLight: parseCssColor(w.accentLight),
    cursorColor: parseCssColor(w.cursorColor),
    glowColor: parseCssColor(w.glowColor),
    glowAlpha: w.glowAlpha,
    borderAlpha: w.borderAlpha,
    gridAlpha: w.gridAlpha,
    gridSize: w.gridSize,
    grain: w.grain,
    horizon: parseCssColor(w.horizon),
    horizonAlpha: w.horizonAlpha,
    underColor: parseCssColor(w.underColor),
  }
}

function snapshotCurrentState(): WorldState {
  const root = document.documentElement
  const cs = getComputedStyle(root)
  const read = (name: string) => cs.getPropertyValue(name).trim()

  const num = (name: string, fallback: number) => {
    const v = parseFloat(read(name))
    return isNaN(v) ? fallback : v
  }

  return {
    bg: parseCssColor(read('--env-bg') || DEFAULT_WORLD.bg),
    bgSecondary:
      parseCssColor(read('--env-bg-secondary') || DEFAULT_WORLD.bgSecondary),
    text: parseCssColor(read('--env-text') || DEFAULT_WORLD.text),
    textSecondary:
      parseCssColor(read('--env-text-secondary') || DEFAULT_WORLD.textSecondary),
    textMuted: parseCssColor(read('--env-text-muted') || DEFAULT_WORLD.textMuted),
    accent: parseCssColor(read('--env-accent') || DEFAULT_WORLD.accent),
    accentLight:
      parseCssColor(read('--env-accent-light') || DEFAULT_WORLD.accentLight),
    cursorColor:
      parseCssColor(read('--env-cursor') || DEFAULT_WORLD.cursorColor),
    glowColor: parseCssColor(read('--env-accent-glow') || DEFAULT_WORLD.glowColor),
    glowAlpha: num('--env-accent-glow-alpha', DEFAULT_WORLD.glowAlpha),
    borderAlpha: num('--env-border-alpha', DEFAULT_WORLD.borderAlpha),
    gridAlpha: num('--env-grid-alpha', DEFAULT_WORLD.gridAlpha),
    gridSize: num('--env-grid-size', DEFAULT_WORLD.gridSize),
    grain: num('--env-grain', DEFAULT_WORLD.grain),
    horizon: parseCssColor(read('--env-horizon') || DEFAULT_WORLD.horizon),
    horizonAlpha: num('--env-horizon-alpha', DEFAULT_WORLD.horizonAlpha),
    underColor: parseCssColor(read('--env-under') || DEFAULT_WORLD.underColor),
  }
}

function writeState(from: WorldState, to: WorldState, t: number) {
  const root = document.documentElement
  const interp = (f: RGBA, tc: RGBA) => interpolateRgba(f, tc, t)
  const set = (name: string, value: string) => root.style.setProperty(name, value)

  const borderAlpha = lerpNum(from.borderAlpha, to.borderAlpha, t)
  const glowAlpha = lerpNum(from.glowAlpha, to.glowAlpha, t)
  const horizonAlpha = lerpNum(from.horizonAlpha, to.horizonAlpha, t)

  set('--env-bg', toCssColor(interp(from.bg, to.bg)))
  set('--env-bg-secondary', toCssColor(interp(from.bgSecondary, to.bgSecondary)))
  set('--env-text', toCssColor(interp(from.text, to.text)))
  set('--env-text-secondary', toCssColor(interp(from.textSecondary, to.textSecondary)))
  set('--env-text-muted', toCssColor(interp(from.textMuted, to.textMuted)))
  set('--env-accent', toCssColor(interp(from.accent, to.accent)))
  set('--env-accent-light', toCssColor(interp(from.accentLight, to.accentLight)))
  set('--env-cursor', toCssColor(interp(from.cursorColor, to.cursorColor)))

  const glow = interp(from.glowColor, to.glowColor)
  glow.a = glowAlpha
  set('--env-accent-glow', toCssColor(glow))
  set('--env-accent-glow-alpha', glowAlpha.toFixed(3))

  set('--env-border', `rgba(255,255,255,${borderAlpha.toFixed(3)})`)
  set('--env-border-strong', `rgba(255,255,255,${Math.min(borderAlpha * 2, 0.34).toFixed(3)})`)
  set('--env-border-alpha', borderAlpha.toFixed(3))

  set('--env-grid-alpha', lerpNum(from.gridAlpha, to.gridAlpha, t).toFixed(3))
  set('--env-grid-size', `${Math.round(lerpNum(from.gridSize, to.gridSize, t))}px`)
  set('--env-grain', lerpNum(from.grain, to.grain, t).toFixed(3))

  const horizon = interp(from.horizon, to.horizon)
  horizon.a = horizonAlpha
  set('--env-horizon', toCssColor(horizon))
  set('--env-horizon-alpha', horizonAlpha.toFixed(3))

  const under = interp(from.underColor, to.underColor)
  under.a = horizonAlpha * 0.82
  set('--env-under', toCssColor(under))
}

const DURATION = 0.85

export function ThemeProvider({ children }: { children: ReactNode }) {
  const fromRef = useRef<WorldState>(worldToState(DEFAULT_WORLD))
  const toRef = useRef<WorldState>(worldToState(DEFAULT_WORLD))
  const startRef = useRef(0)
  const runningRef = useRef(false)
  const skipAnimRef = useRef(false)

  const tick = useCallback((time: number) => {
    if (!runningRef.current) return
    const progress = (time - startRef.current) / DURATION
    const clamped = Math.min(Math.max(progress, 0), 1)
    const eased = clamped < 0.5 ? 4 * clamped ** 3 : 1 - Math.pow(-2 * clamped + 2, 3) / 2
    writeState(fromRef.current, toRef.current, eased)
    if (clamped >= 1) runningRef.current = false
  }, [])

  useEffect(() => {
    gsap.ticker.add(tick)
    const frame = requestAnimationFrame(() => applyWorld(DEFAULT_WORLD, true))
    return () => {
      gsap.ticker.remove(tick)
      cancelAnimationFrame(frame)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick])

  const applyWorld = useCallback((world: ProjectWorld, instant = false) => {
    if (typeof document === 'undefined') return
    const target = worldToState(world)

    document.body.dataset.world = world.atmosphere

    const reduced = prefersReducedMotion()
    skipAnimRef.current = reduced || instant

    if (skipAnimRef.current) {
      fromRef.current = target
      toRef.current = target
      runningRef.current = false
      writeState(target, target, 1)
      return
    }

    fromRef.current = snapshotCurrentState()
    toRef.current = target
    startRef.current = gsap.ticker.time
    runningRef.current = true
  }, [])

  const apply = useCallback(
    (project: Project) => {
      applyWorld(project.world || DEFAULT_WORLD)
    },
    [applyWorld]
  )

  const applyDefault = useCallback(() => {
    applyWorld(DEFAULT_WORLD)
  }, [applyWorld])

  return (
    <ThemeContext.Provider value={{ apply, applyDefault }}>
      {children}
    </ThemeContext.Provider>
  )
}

export type { Atmosphere }