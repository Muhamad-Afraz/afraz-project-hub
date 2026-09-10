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

export interface Project {
  id: string
  title: string
  shortTitle: string
  description: string
  longDescription: string
  category: ProjectCategory
  tags: string[]
  year: string
  url: string
  theme: ProjectTheme
  visualType: VisualType
}

export type ViewName = 'home' | 'work' | 'lab' | 'project'

export type CursorState = 'default' | 'hover' | 'project' | 'close' | 'nav' | 'text' | 'prev' | 'next'
