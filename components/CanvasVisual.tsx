'use client'

import { useRef, useEffect } from 'react'
import { drawVisual } from '@/lib/canvas-renderers'
import { Project } from '@/lib/types'

interface Props {
  project: Project
  width?: number
  height?: number
}

export default function CanvasVisual({ project, width, height }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cleanupRef = useRef<{ stop: () => void } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const container = canvas.parentElement
    if (!container) return

    const resize = () => {
      const rect = container.getBoundingClientRect()
      const w = width || rect.width
      const h = height || rect.height
      const dpr = window.devicePixelRatio || 1
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    cleanupRef.current = drawVisual(ctx, canvas, project)

    return () => {
      cleanupRef.current?.stop()
      cleanupRef.current = null
    }
  }, [project, width, height])

  return <canvas ref={canvasRef} />
}
