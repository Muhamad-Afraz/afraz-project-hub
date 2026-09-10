export interface ProjectTheme {
  accent: string
  accentLight: string
  accentGlow: string
  bg: string
  bgSecondary: string
  text: string
  visualGradient: string
  gridOpacity: number
}

export type VisualType = 'particles' | 'waves' | 'geometry' | 'grid'

export type ProjectCategory = 'web' | 'client' | 'concepts' | 'experiments'

/**
 * World identity of a project. When a project is approached or opened,
 * the whole environment (page) smoothly morphs into this world.
 * Optional — projects without a world fall back to the neutral archive.
 */
export type Atmosphere = 'default' | 'nexus' | 'coffee' | 'developer' | 'infra'

export interface ProjectWorld {
  atmosphere: Atmosphere
  bg: string
  bgSecondary: string
  text: string
  textSecondary: string
  textMuted: string
  accent: string
  accentLight: string
  glowColor: string
  glowAlpha: number
  borderAlpha: number
  gridAlpha: number
  gridSize: number
  grain: number
  cursorColor: string
  horizon: string
  horizonAlpha: number
  underColor: string
}

export interface Project {
  id: string
  title: string
  shortTitle: string
  description: string
  longDescription: string
  category: ProjectCategory
  tags: string[]
  built: string[]
  tech: string[]
  year: string
  url: string
  theme: ProjectTheme
  visualType: VisualType
  world?: ProjectWorld
}

export type ViewName = 'home' | 'work' | 'lab' | 'project'

export type CursorState = 'default' | 'hover' | 'project' | 'close' | 'nav' | 'text' | 'prev' | 'next'
