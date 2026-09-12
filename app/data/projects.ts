export type ProjectType = 'web' | 'experimental' | 'client' | 'concept'
export type FilterKey = 'all' | ProjectType

export const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'web', label: 'Web' },
  { key: 'experimental', label: 'Experimental' },
  { key: 'client', label: 'Client' },
  { key: 'concept', label: 'Concept' },
]

export type ProjectTheme = {
  accent: string
  accent2: string
  bg: string
}

export type Project = {
  id: string
  index: string
  title: string
  category: string
  type: ProjectType
  status: string
  url: string
  tagline: string
  description: string
  tags: string[]
  images: string[]
  theme: ProjectTheme
}

const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export const hexToRgba = (hex: string, alpha: number): string => {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r},${g},${b},${alpha})`
}

const ph = (accent: string, accent2: string, label: string, shape: number): string => {
  const shapes = [
    `<circle cx="200" cy="200" r="80" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.5"/><circle cx="200" cy="200" r="40" fill="#ffffff" opacity="0.1"/>`,
    `<rect x="130" y="130" width="140" height="140" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.5" transform="rotate(45 200 200)"/><circle cx="200" cy="200" r="24" fill="#ffffff" opacity="0.12"/>`,
    `<path d="M200 90 L290 260 L110 260 Z" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.5"/><path d="M200 150 L245 240 L155 240 Z" fill="#ffffff" opacity="0.1"/>`,
    `<circle cx="200" cy="200" r="86" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.35" stroke-dasharray="4 6"/><circle cx="200" cy="200" r="40" fill="#ffffff" opacity="0.12"/>`,
  ]
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="520" viewBox="0 0 400 520">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="${accent2}"/></linearGradient></defs>` +
    `<rect width="400" height="520" fill="#0a0a0c"/>` +
    `<rect width="400" height="520" fill="url(#g)" opacity="0.5"/>` +
    `<rect width="400" height="520" fill="url(#g)" opacity="0.12"/>` +
    `<circle cx="200" cy="200" r="150" fill="url(#g)" opacity="0.14"/>` +
    shapes[shape % shapes.length] +
    `<text x="24" y="58" font-family="monospace" font-size="14" letter-spacing="3" fill="#ffffff" opacity="0.85">AFRAZ / ${label}</text>` +
    `<text x="200" y="300" text-anchor="middle" font-family="monospace, sans-serif" font-size="26" letter-spacing="6" fill="#ffffff" opacity="0.95">${label}</text>` +
    `<text x="200" y="500" text-anchor="middle" font-family="monospace, sans-serif" font-size="11" letter-spacing="2" fill="#ffffff" opacity="0.4">PROJECT-HUB ARCHIVE</text>` +
    `</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

type ProjectInput = Omit<Project, 'images'>

const image = (folder: string, name: string) => `/${folder}/${encodeURIComponent(name)}`

const withImages = (input: ProjectInput, imageOverrides: string[] = []): Project => ({
  ...input,
  images:
    imageOverrides.length > 0
      ? imageOverrides
      : Array.from({ length: 7 }, (_, i) =>
          ph(input.theme.accent, input.theme.accent2, `${input.index}-${i + 1}`, i)
        ),
})

export const projects: Project[] = [
  withImages({
    id: 'portfolio',
    index: '01',
    title: 'Portfolio',
    category: 'Web / Archive',
    type: 'web',
    status: 'Active · 2026',
    url: 'https://afrazcreates.vercel.app/',
    tagline: 'My Portfolio — Who I am, what I do, how I do it',
    description:
      'My personal portfolio about me, my creations and my skills — designed to showcase what I do and how I think as a developer.',
    tags: ['React', 'Next.js', 'Interaction'],
    theme: { accent: '#b6ff2e', accent2: '#5ca416', bg: '#0c1009' },
  },
    [
      image('Portfolio.image', 'Hero section.png'),
      image('Portfolio.image', 'Cool feature 1.png'),
      image('Portfolio.image', 'Cool feature 2.png'),
    ]
  ),
  withImages({
    id: 'coffee-house',
    index: '02',
    title: 'Coffee-House',
    category: 'Client / Web',
    type: 'client',
    status: 'Active · 2026',
    url: 'https://housecoffee.vercel.app/',
    tagline: 'Coffee Shop based website — Smooth, Luxury, interactive.',
    description:
      'A modern coffee shop website designed with a clean interface, smooth interactions, and a warm, inviting experience.',
    tags: ['Design', 'Type', 'Web'],
    theme: { accent: '#ddc19c', accent2: '#8a5a33', bg: '#2a1508' },
  },
    [
      image('Housecoffee.image', 'Hero section.png'),
      image('Housecoffee.image', 'Cool feature 1.png'),
      image('Housecoffee.image', 'Cool feature 2.png'),
    ]
  ),
  withImages({
    id: 'nexus-2027',
    index: '03',
    title: 'Nexus2027-Event',
    category: 'Web / Event',
    type: 'web',
    status: 'Active · 2026',
    url: 'https://nexus2027.vercel.app/',
    tagline: 'An Event Hub — Futuristic, Cool, Informative',
    description:
      'A futuristic event platform featuring project showcases, speakers, schedules, venue exploration, and registration.',
    tags: ['Events', 'Design', 'Web'],
    theme: { accent: '#a78bfa', accent2: '#38bdf8', bg: '#15052b' },
  },
    [
      image('Nexus.image', 'Hero section.png'),
      image('Nexus.image', 'Cool feature 1.png'),
      image('Nexus.image', 'Cool feature 2.png'),
    ]
  ),
  withImages({
    id: 'building-01',
    index: '04',
    title: 'Building 04',
    category: 'Building',
    type: 'experimental',
    status: 'Under construction',
    url: '',
    tagline: 'Frame set. Walls next.',
    description:
      'Under construction — a placeholder while this entry takes shape. Copy, media and links land here as it builds.',
    tags: ['TBD'],
    theme: { accent: '#97a3b4', accent2: '#64748b', bg: '#10131a' },
  }),
  withImages({
    id: 'building-02',
    index: '05',
    title: 'Building 05',
    category: 'Building',
    type: 'concept',
    status: 'Under construction',
    url: '',
    tagline: 'Slab down. Walls rising.',
    description:
      'Under construction — a placeholder while this entry takes shape. Copy, media and links land here as it builds.',
    tags: ['TBD'],
    theme: { accent: '#8f9bb0', accent2: '#5a6474', bg: '#0e1118' },
  }),
  withImages({
    id: 'building-03',
    index: '06',
    title: 'Building 06',
    category: 'Building',
    type: 'experimental',
    status: 'Under construction',
    url: '',
    tagline: 'Site cleared. Digging in.',
    description:
      'Under construction — a placeholder while this entry takes shape. Copy, media and links land here as it builds.',
    tags: ['TBD'],
    theme: { accent: '#9aa2b8', accent2: '#555d75', bg: '#0d0f16' },
  }),
]