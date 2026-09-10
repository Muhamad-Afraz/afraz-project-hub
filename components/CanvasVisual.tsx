'use client'

import { useRef, useEffect } from 'react'
import { drawVisual } from '@/lib/canvas-renderers'
import { Project } from '@/lib/types'
import { prefersReducedMotion } from '@/lib/utils'

interface Props {
  project: Project
  width?: number
  height?: number
}

export default function CanvasVisual({ project, width, height }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cleanupRef = useRef<{ stop: () => void; restart: () => void } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const container = canvas.parentElement
    if (!container) return

    const animate = !prefersReducedMotion()

    const resize = () => {
      const rect = container.getBoundingClientRect()
      const w = width || rect.width
      const h = height || rect.height
      if (w === 0 || h === 0) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()

    const startVisual = () => {
      cleanupRef.current?.stop()
      cleanupRef.current = drawVisual(ctx, canvas, project, animate)
    }

    startVisual()

    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined' && !width && !height) {
      resizeObserver = new ResizeObserver(() => {
        resize()
        startVisual()
      })
      resizeObserver.observe(container)
    }

    const onOrientationChange = () => {
      resize()
      startVisual()
    }
    window.addEventListener('orientationchange', onOrientationChange)

    return () => {
      cleanupRef.current?.stop()
      cleanupRef.current = null
      resizeObserver?.disconnect()
      window.removeEventListener('orientationchange', onOrientationChange)
    }
  }, [project, width, height])

  return <canvas ref={canvasRef} />
}