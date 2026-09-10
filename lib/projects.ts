import { Project } from './types'

export const PROJECTS: Project[] = [
  {
    id: 'portfolio',
    title: 'Afraz \u2014 Portfolio',
    shortTitle: 'Portfolio',
    description:
      'Personal portfolio website showcasing design and development capabilities across creative digital experiences.',
    longDescription:
      'A carefully crafted personal portfolio that balances clean minimalism with expressive interaction design. Built to demonstrate range \u2014 from smooth scroll-driven narratives to micro-interactions that make every element feel alive.',
    category: 'web',
    tags: ['Design', 'Frontend', 'Interaction'],
    year: '2025',
    url: '#',
    theme: {
      accent: '#7C3AED',
      accentLight: '#8B5CF6',
      accentGlow: 'rgba(124, 58, 237, 0.3)',
      bg: '#0a0a0f',
      bgSecondary: '#0f0f1a',
      text: '#f4f4f5',
      visualGradient: 'linear-gradient(135deg, #0f0f23, #1a1a2e)',
      gridOpacity: 0.3,
    },
    visualType: 'particles',
  },
  {
    id: 'coffee-house',
    title: 'Coffee House',
    shortTitle: 'Coffee House',
    description:
      'A polished coffee-shop website with warm atmosphere, organic interactions, and rich sensory design.',
    longDescription:
      'A complete digital experience for a coffee house \u2014 from menu browsing to atmosphere creation. Warm color palettes, organic motion, subtle grain textures, and ambient design choices make the website feel like stepping into the caf\u00e9 itself.',
    category: 'client',
    tags: ['Branding', 'Frontend', 'UX'],
    year: '2025',
    url: '#',
    theme: {
      accent: '#D97706',
      accentLight: '#F59E0B',
      accentGlow: 'rgba(217, 119, 6, 0.25)',
      bg: '#0f0a07',
      bgSecondary: '#1a120c',
      text: '#f5f0eb',
      visualGradient: 'linear-gradient(135deg, #2d1810, #1a0f0a)',
      gridOpacity: 0.15,
    },
    visualType: 'waves',
  },
  {
    id: 'nexus-2027',
    title: 'NEXUS 2027',
    shortTitle: 'NEXUS',
    description:
      'Futuristic event platform with geometric precision, electric aesthetics, and immersive digital environments.',
    longDescription:
      'An event platform that feels like it arrived from the future. Geometric structures, electric violet and deep blue palettes, precise grid systems, and futuristic motion design create an experience that transforms how events are presented online.',
    category: 'web',
    tags: ['Concept', 'Animation', 'Design'],
    year: '2025',
    url: '#',
    theme: {
      accent: '#6366F1',
      accentLight: '#818CF8',
      accentGlow: 'rgba(99, 102, 241, 0.3)',
      bg: '#050510',
      bgSecondary: '#0a0a1a',
      text: '#e8e8ff',
      visualGradient: 'linear-gradient(135deg, #1a0033, #0d1b2a)',
      gridOpacity: 0.5,
    },
    visualType: 'geometry',
  },
  {
    id: 'pothole-filler',
    title: 'Pothole Filler',
    shortTitle: 'Pothole',
    description:
      'A practical, functional website built for community utility \u2014 clean design solving real problems.',
    longDescription:
      'Sometimes the best design is invisible. Pothole Filler strips away decorative excess to focus on utility \u2014 fast loading, clear information hierarchy, and straightforward interaction patterns that make reporting and tracking potholes effortless.',
    category: 'concepts',
    tags: ['Utility', 'Frontend', 'Minimal'],
    year: '2025',
    url: '#',
    theme: {
      accent: '#10B981',
      accentLight: '#34D399',
      accentGlow: 'rgba(16, 185, 129, 0.25)',
      bg: '#0a0b0a',
      bgSecondary: '#111311',
      text: '#e8f5e8',
      visualGradient: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
      gridOpacity: 0.2,
    },
    visualType: 'grid',
  },
]
