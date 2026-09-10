import { Project } from './types'

type DrawFn = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  project: Project
) => void

type Atmosphere = Project['world'] extends { atmosphere: infer A } ? A : string

function drawParticles(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  project: Project
) {
  const theme = project.theme
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

  if (project.world?.atmosphere === 'developer') {
    ctx.strokeStyle = theme.accent
    ctx.lineWidth = 1
    for (let i = 0; i < 6; i++) {
      const seed = i * 97.31 + time * 0.8
      const sy = (Math.sin(seed) * 0.5 + 0.5) * h
      const sx = ((seed * 37) % (w * 1.2)) - w * 0.1
      const speed = 0.1 + (i % 3) * 0.04

      ctx.globalAlpha = 0.05 + (i % 2) * 0.03
      ctx.beginPath()
      ctx.moveTo(sx, sy)
      ctx.lineTo(sx + speed * 60, sy - speed * 18)
      ctx.stroke()
    }
  }

  ctx.globalAlpha = 1
}

function drawWaves(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  project: Project
) {
  const theme = project.theme
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

  if (project.world?.atmosphere === 'coffee') {
    const cx = w * 0.5
    const cy = h * 0.42
    for (let i = 0; i < 3; i++) {
      const life = (frame * 0.01 + i / 3) % 1
      const radius = 10 + life * (Math.max(w, h) * 0.45)
      ctx.globalAlpha = (1 - life) * 0.12
      ctx.strokeStyle = theme.accent
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.stroke()
    }
  }

  ctx.globalAlpha = 1
}

function drawGeometry(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  project: Project
) {
  const theme = project.theme
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

  if (project.world?.atmosphere === 'nexus') {
    const scanPhase = (frame * 0.02) % 1
    const scanX = scanPhase * w
    ctx.globalAlpha = 0.12
    ctx.fillStyle = theme.accent
    ctx.fillRect(scanX - 1, 0, 2, h)
    ctx.globalAlpha = 0.05
    ctx.fillStyle = 'rgba(255,255,255,1)'
    ctx.fillRect(scanX - 14, 0, 28, h)

    const tick = 12
    ctx.globalAlpha = 0.55
    ctx.strokeStyle = theme.accent
    ctx.lineWidth = 1.5
    const corners: Array<[number, number, number, number]> = [
      [0, 0, 1, 1],
      [w, 0, -1, 1],
      [0, h, 1, -1],
      [w, h, -1, -1],
    ]
    corners.forEach(([x, y, dx, dy]) => {
      ctx.beginPath()
      ctx.moveTo(x + dx * tick, y)
      ctx.lineTo(x, y)
      ctx.lineTo(x, y + dy * tick)
      ctx.stroke()
    })
  }

  ctx.globalAlpha = 1
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  project: Project
) {
  const theme = project.theme
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

  if (project.world?.atmosphere === 'infra') {
    const route: Array<[number, number]> = [
      [w * 0.12, h * 0.86],
      [w * 0.38, h * 0.62],
      [w * 0.66, h * 0.72],
      [w * 0.9, h * 0.3],
    ]
    ctx.strokeStyle = theme.accent
    ctx.lineWidth = 1.5
    ctx.setLineDash([6, 6])
    ctx.globalAlpha = 0.18
    ctx.beginPath()
    route.forEach(([x, y], i) => {
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
    ctx.setLineDash([])

    const travel = (frame * 0.008) % 1
    const segLengths: number[] = []
    let total = 0
    for (let i = 0; i < route.length - 1; i++) {
      const dist = Math.hypot(route[i + 1][0] - route[i][0], route[i + 1][1] - route[i][1])
      segLengths.push(dist)
      total += dist
    }
    let travelled = travel * total
    let px = route[0][0]
    let py = route[0][1]
    for (let i = 0; i < segLengths.length; i++) {
      if (travelled <= segLengths[i]) {
        const t = travelled / segLengths[i]
        px = route[i][0] + (route[i + 1][0] - route[i][0]) * t
        py = route[i][1] + (route[i + 1][1] - route[i][1]) * t
        break
      }
      travelled -= segLengths[i]
    }
    ctx.globalAlpha = 0.9
    ctx.fillStyle = project.world.cursorColor
    ctx.beginPath()
    ctx.arc(px, py, 3.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 0.25
    ctx.beginPath()
    ctx.arc(px, py, 9, 0, Math.PI * 2)
    ctx.stroke()
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
  project: Project,
  animate: boolean = true
): { stop: () => void; restart: () => void } {
  const dpr = window.devicePixelRatio || 1
  const w = canvas.width / dpr
  const h = canvas.height / dpr

  let frame = 0
  let animId: number | null = null
  let running = animate
  const renderer = RENDERERS[project.visualType] || drawParticles

  const draw = () => {
    ctx.clearRect(0, 0, w, h)
    frame++
    renderer(ctx, w, h, frame, project)
    if (running) {
      animId = requestAnimationFrame(draw)
    }
  }

  let visObserver: IntersectionObserver | null = null

  if (animate && typeof IntersectionObserver !== 'undefined') {
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

  if (animate) {
    draw()
  } else {
    renderer(ctx, w, h, 30, project)
  }

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

export type { Atmosphere }