export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin
}

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay = 100
): T {
  let timer: ReturnType<typeof setTimeout>
  return ((...args: unknown[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }) as T
}

export function formatIndex(num: number, total: number): string {
  return (
    String(num).padStart(2, '0') + ' / ' + String(total).padStart(2, '0')
  )
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function elementCenter(el: HTMLElement): { x: number; y: number } {
  const rect = el.getBoundingClientRect()
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  }
}

export function hexToRgb(hex: string) {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  const num = parseInt(full, 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.round(v).toString(16).padStart(2, '0'))
      .join('')
  )
}

export function parseColor(color: string) {
  const trimmed = color.trim()
  if (trimmed.startsWith('#')) return hexToRgb(trimmed)
  const match = trimmed.match(/rgba?\(([^)]+)\)/)
  if (match) {
    const parts = match[1].split(',').map((s) => parseFloat(s.trim()))
    return { r: parts[0], g: parts[1], b: parts[2] }
  }
  return { r: 124, g: 58, b: 237 }
}

export function interpolateColors(from: string, to: string, t: number): string {
  const a = parseColor(from)
  const b = parseColor(to)
  const r = a.r + (b.r - a.r) * t
  const g = a.g + (b.g - a.g) * t
  const bl = a.b + (b.b - a.b) * t
  return rgbToHex(r, g, bl)
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function lerpNum(from: number, to: number, t: number): number {
  return from + (to - from) * t
}

export interface RGBA {
  r: number
  g: number
  b: number
  a: number
}

export function parseCssColor(input: string): RGBA {
  const s = (input || '').trim().toLowerCase()
  if (!s) return { r: 124, g: 58, b: 237, a: 1 }

  if (s[0] === '#') {
    let hex = s.slice(1)
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('')
    if (hex.length === 4) hex = hex.split('').map((c) => c + c).join('')
    const full = hex.length === 6 ? hex + 'ff' : hex
    const num = parseInt(full.slice(0, 6), 16)
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
      a: full.length >= 8 ? parseInt(full.slice(6, 8), 16) / 255 : 1,
    }
  }

  const match = s.match(/rgba?\(([^)]+)\)/)
  if (match) {
    const parts = match[1].split(',').map((p) => parseFloat(p.trim()))
    return {
      r: isNaN(parts[0]) ? 0 : parts[0],
      g: isNaN(parts[1]) ? 0 : parts[1],
      b: isNaN(parts[2]) ? 0 : parts[2],
      a: parts[3] === undefined || isNaN(parts[3]) ? 1 : parts[3],
    }
  }

  return { r: 124, g: 58, b: 237, a: 1 }
}

export function toCssColor(c: RGBA): string {
  const r = Math.round(c.r)
  const g = Math.round(c.g)
  const b = Math.round(c.b)
  return c.a >= 1
    ? `rgb(${r},${g},${b})`
    : `rgba(${r},${g},${b},${c.a.toFixed(3)})`
}

export function interpolateRgba(from: RGBA, to: RGBA, t: number): RGBA {
  return {
    r: from.r + (to.r - from.r) * t,
    g: from.g + (to.g - from.g) * t,
    b: from.b + (to.b - from.b) * t,
    a: from.a + (to.a - from.a) * t,
  }
}

/**
 * Whether JS-driven animation should run at all.
 * Works alongside the global CSS prefers-reduced-motion rule.
 */
export function shouldAnimate(): boolean {
  return !prefersReducedMotion()
}
