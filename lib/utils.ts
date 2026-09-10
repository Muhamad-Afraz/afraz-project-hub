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
