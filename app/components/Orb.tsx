'use client'

import type { CSSProperties } from 'react'

const PH_IMG = (() => {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="520" viewBox="0 0 400 520">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eaf1ff"/><stop offset="1" stop-color="#7aa8ff"/></linearGradient></defs>` +
    `<rect width="400" height="520" fill="#0a0a0c"/>` +
    `<rect width="400" height="520" fill="url(#g)" opacity="0.5"/>` +
    `<rect width="400" height="520" fill="url(#g)" opacity="0.12"/>` +
    `<circle cx="200" cy="200" r="150" fill="url(#g)" opacity="0.14"/>` +
    `<circle cx="200" cy="200" r="96" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.5" stroke-dasharray="3 7"/>` +
    `<circle cx="200" cy="200" r="46" fill="#ffffff" opacity="0.12"/>` +
    `<text x="24" y="58" font-family="monospace" font-size="14" letter-spacing="3" fill="#ffffff" opacity="0.85">AFRAZ / PROJECT HUB</text>` +
    `<text x="200" y="330" text-anchor="middle" font-family="monospace, sans-serif" font-size="30" letter-spacing="8" fill="#ffffff" opacity="0.95">PROJECT</text>` +
    `<text x="200" y="372" text-anchor="middle" font-family="monospace, sans-serif" font-size="30" letter-spacing="8" fill="#ffffff" opacity="0.95">HUB</text>` +
    `<text x="200" y="500" text-anchor="middle" font-family="monospace, sans-serif" font-size="11" letter-spacing="2" fill="#ffffff" opacity="0.4">PROJECT-HUB ARCHIVE</text>` +
    `</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
})()

type OrbEntry = {
  key: string
  name: string
  index: string
  accent: string
  image: string
}

const ENTRIES: OrbEntry[] = [
  {
    key: 'portfolio',
    name: 'Portfolio',
    index: '01',
    accent: '#b6ff2e',
    image: '/Portfolio.image/Hero section.png',
  },
  {
    key: 'nexus',
    name: 'Nexus 2027',
    index: '02',
    accent: '#a78bfa',
    image: '/Nexus.image/Hero section.png',
  },
  {
    key: 'coffee',
    name: 'Coffee House',
    index: '03',
    accent: '#ddc19c',
    image: '/Housecoffee.image/Hero section.png',
  },
  {
    key: 'hub',
    name: 'Project Hub',
    index: '04',
    accent: '#dfe8ff',
    image: PH_IMG,
  },
]

export default function Orb() {
  return (
    <div className="hero-orb" aria-hidden="true">
      <div className="orb">
        <div className="orb-disc">
          {ENTRIES.map((e, i) => (
            <div
              key={e.key}
              className={`orb-seg orb-seg--${i}`}
              style={{ '--seg-i': i, '--seg-accent': e.accent } as CSSProperties}
            >
              <div className="orb-beam" />
              <div className="orb-seg-inner">
                <img className="orb-img" src={e.image} alt="" draggable={false} />
                <div className="orb-tag">
                  <span className="orb-tag-idx">{e.index}</span>
                  <span className="orb-tag-name">{e.name}</span>
                </div>
              </div>
            </div>
          ))}
          <div className="orb-div orb-div--h" />
          <div className="orb-div orb-div--v" />
        </div>

        <div className="orb-scan">
          <span className="orb-scan-tip" />
        </div>
        <div className="orb-core" />
        <div className="orb-ring orb-ring--1" />
        <div className="orb-ring orb-ring--2" />
      </div>
    </div>
  )
}