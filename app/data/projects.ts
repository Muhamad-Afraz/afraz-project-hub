export type ProjectTheme = {
  accent: string
  accent2: string
}

export type Project = {
  id: string
  index: string
  title: string
  category: string
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

const withImages = (input: ProjectInput): Project => ({
  ...input,
  images: Array.from({ length: 7 }, (_, i) =>
    ph(input.theme.accent, input.theme.accent2, `${input.index}-${i + 1}`, i)
  ),
})

export const projects: Project[] = [
  withImages({
    id: 'nexus',
    index: '01',
    title: 'NEXUS',
    category: 'Web / Experiments',
    tagline: 'A living machine-made playground.',
    description:
      'NEXUS strands particles, grids and slow-moving glows into one interconnected archive. Everything reacts to the pointer and drifts like it is alive.',
    tags: ['Canvas', 'Interaction', 'GPU'],
    theme: { accent: '#a78bfa', accent2: '#7c3aed' },
  }),
  withImages({
    id: 'flux',
    index: '02',
    title: 'FLUX',
    category: 'Motion / Visual',
    tagline: 'Timelines folded into light.',
    description:
      'FLUX is a study of time and movement — frame-shifting gradients, trailing light, and time-stretched type that flows like liquid on a dark screen.',
    tags: ['GSAP', 'Shaders', 'Motion'],
    theme: { accent: '#67e8f9', accent2: '#0891b2' },
  }),
  withImages({
    id: 'ember',
    index: '03',
    title: 'EMBER',
    category: 'Client / Web',
    tagline: 'Heat mapped into interface.',
    description:
      'EMBER is a brand system turned into a living interface — amber fields, ember particles and a moody glow built for a studio that burns bright.',
    tags: ['Product', 'Branding', 'UI'],
    theme: { accent: '#fbbf24', accent2: '#ea580c' },
  }),
  withImages({
    id: 'vortex',
    index: '04',
    title: 'VORTEX',
    category: 'Art / Concept',
    tagline: 'A spiral of noise and bloom.',
    description:
      'VORTEX pulls the viewer into a rotating storm of color noise and bloom. A short, cinematic concept piece about being pulled inward.',
    tags: ['WebGL', 'Noise', 'Concept'],
    theme: { accent: '#f472b6', accent2: '#e11d48' },
  }),
  withImages({
    id: 'orbit',
    index: '05',
    title: 'ORBIT',
    category: 'Data / Tool',
    tagline: 'Satellites of information.',
    description:
      'ORBIT visualizes dense data as circling bodies — every signal an orbit, every reading a glow. A calm, precise instrument for exploring numbers.',
    tags: ['D3', 'Data', 'Dashboard'],
    theme: { accent: '#6ee7b7', accent2: '#059669' },
  }),
  withImages({
    id: 'static',
    index: '06',
    title: 'STATIC',
    category: 'Experiments',
    tagline: 'Signal between the noise.',
    description:
      'STATIC is a series of generative noise studies — pixel storms, tape wobble, and try-too-hard digital decay tuned to a cold electric blue.',
    tags: ['Generative', 'Audio', 'CSS'],
    theme: { accent: '#93c5fd', accent2: '#2563eb' },
  }),
]