import { Project } from './types'

type DrawFn = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  theme: Project['theme']
) => void

function drawParticles(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  theme: Project['theme']
) {
  const time = frame * 0.01
  const count = 40

  for (let i = 0; i < count; i++) {
    const seed = i * 137.508
    const x = (Math.sin(seed + time * 0.5) * 0.5 + 0.5) * w
    const y = (Math.cos(seed * 0.7 + time * 0.3) * 0.5 + 0.5) * h
    const size = Math.sin(seed + time) * 1.5 + 2
    const alpha = Math.sin(time + seed) * 0.3 + 0.4

    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fillStyle = theme.accent
    ctx.globalAlpha = alpha
    ctx.fill()
  }

  ctx.globalAlpha = 0.1
  ctx.strokeStyle = theme.accent
  ctx.lineWidth = 0.5

  for (let i = 0; i < count; i++) {
    const seed = i * 137.508
    const x1 = (Math.sin(seed + time * 0.5) * 0.5 + 0.5) * w
    const y1 = (Math.cos(seed * 0.7 + time * 0.3) * 0.5 + 0.5) * h

    for (let j = i + 1; j < Math.min(i + 4, count); j++) {
      const seed2 = j * 137.508
      const x2 = (Math.sin(seed2 + time * 0.5) * 0.5 + 0.5) * w
      const y2 = (Math.cos(seed2 * 0.7 + time * 0.3) * 0.5 + 0.5) * h
      const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

      if (dist < 80) {
        ctx.globalAlpha = (1 - dist / 80) * 0.15
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
    }
  }

  ctx.globalAlpha = 1
}

function drawWaves(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  theme: Project['theme']
) {
  const time = frame * 0.02
  const layers = 3

  for (let l = 0; l < layers; l++) {
    ctx.beginPath()
    ctx.globalAlpha = 0.15 - l * 0.03

    for (let x = 0; x <= w; x += 2) {
      const y =
        h / 2 +
        Math.sin(x * 0.01 + time + l * 1.5) * 20 +
        Math.sin(x * 0.02 + time * 0.7 + l) * 10 +
        l * 25

      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }

    ctx.strokeStyle = theme.accent
    ctx.lineWidth = 1.5
    ctx.stroke()
  }

  for (let i = 0; i < 5; i++) {
    const x = w * 0.2 + i * w * 0.15
    const y = h * 0.3 + Math.sin(time + i) * 15
    const size = 8 + Math.sin(time + i * 2) * 3

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(Math.sin(time * 0.5 + i) * 0.5)
    ctx.beginPath()
    ctx.ellipse(0, 0, size, size * 0.6, 0, 0, Math.PI * 2)
    ctx.globalAlpha = 0.2
    ctx.fillStyle = theme.accent
    ctx.fill()
    ctx.restore()
  }

  ctx.globalAlpha = 1
}

function drawGeometry(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  theme: Project['theme']
) {
  const time = frame * 0.015
  const cx = w / 2
  const cy = h / 2
  const hexSize = 30
  const cols = Math.ceil(w / (hexSize * 1.8)) + 1
  const rows = Math.ceil(h / (hexSize * 1.6)) + 1

  ctx.strokeStyle = theme.accent
  ctx.lineWidth = 0.5

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * hexSize * 1.8 + (row % 2 ? hexSize * 0.9 : 0)
      const y = row * hexSize * 1.5
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
      const maxDist = Math.sqrt(cx * cx + cy * cy)
      const normDist = dist / maxDist
      const pulse = Math.sin(time * 2 - normDist * 5) * 0.5 + 0.5

      ctx.globalAlpha = 0.08 + pulse * 0.12
      ctx.beginPath()

      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + time * 0.2
        const hx = x + Math.cos(angle) * hexSize * (0.8 + pulse * 0.2)
        const hy = y + Math.sin(angle) * hexSize * (0.8 + pulse * 0.2)
        if (i === 0) ctx.moveTo(hx, hy)
        else ctx.lineTo(hx, hy)
      }

      ctx.closePath()
      ctx.stroke()
    }
  }

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80)
  gradient.addColorStop(0, theme.accent)
  gradient.addColorStop(1, 'transparent')
  ctx.globalAlpha = 0.15 + Math.sin(time * 3) * 0.05
  ctx.fillStyle = gradient
  ctx.fillRect(cx - 80, cy - 80, 160, 160)

  ctx.globalAlpha = 1
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  theme: Project['theme']
) {
  const time = frame * 0.01
  const spacing = 20

  ctx.strokeStyle = theme.accent
  ctx.lineWidth = 0.3

  for (let x = 0; x < w; x += spacing) {
    const offset = Math.sin(time + x * 0.01) * 3
    ctx.globalAlpha = 0.08
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x + offset, h)
    ctx.stroke()
  }

  for (let y = 0; y < h; y += spacing) {
    const offset = Math.cos(time + y * 0.01) * 3
    ctx.globalAlpha = 0.08
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y + offset)
    ctx.stroke()
  }

  for (let i = 0; i < 8; i++) {
    const col = Math.floor(
      (Math.sin(time + i * 1.7) * 0.5 + 0.5) * (w / spacing)
    )
    const row = Math.floor(
      (Math.cos(time * 0.7 + i * 2.3) * 0.5 + 0.5) * (h / spacing)
    )
    const pulse = Math.sin(time * 3 + i) * 0.5 + 0.5

    ctx.globalAlpha = 0.1 + pulse * 0.15
    ctx.fillStyle = theme.accent
    ctx.fillRect(col * spacing, row * spacing, spacing, spacing)
  }

  ctx.globalAlpha = 1
}

const RENDERERS: Record<string, DrawFn> = {
  particles: drawParticles,
  waves: drawWaves,
  geometry: drawGeometry,
  grid: drawGrid,
}

export function drawVisual(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  project: Project
): { stop: () => void; restart: () => void } {
  const dpr = window.devicePixelRatio || 1
  const w = canvas.width / dpr
  const h = canvas.height / dpr

  let frame = 0
  let animId: number | null = null
  let running = true
  const renderer = RENDERERS[project.visualType] || drawParticles

  const draw = () => {
    ctx.clearRect(0, 0, w, h)
    frame++
    renderer(ctx, w, h, frame, project.theme)
    if (running) {
      animId = requestAnimationFrame(draw)
    }
  }

  let visObserver: IntersectionObserver | null = null

  if (typeof IntersectionObserver !== 'undefined') {
    visObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          running = entry.isIntersecting
          if (running && !animId) {
            animId = requestAnimationFrame(draw)
          } else if (!running && animId) {
            cancelAnimationFrame(animId)
            animId = null
          }
        })
      },
      { rootMargin: '100px' }
    )
    visObserver.observe(canvas)
  }

  draw()

  return {
    stop() {
      running = false
      if (animId) cancelAnimationFrame(animId)
      animId = null
      visObserver?.disconnect()
    },
    restart() {
      running = true
      if (!animId) animId = requestAnimationFrame(draw)
    },
  }
}
