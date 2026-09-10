'use client'

const LAB_ITEMS = [
  { name: 'Perlin Wind', tag: 'WebGL', state: 'in progress' },
  { name: 'Typeweight', tag: 'Variable type', state: 'prototype' },
  { name: 'Raster Riff', tag: 'Pixels / CSS', state: 'experiment' },
  { name: 'Grid / Grit', tag: 'GSAP study', state: 'series' },
]

export default function Lab() {
  return (
    <section id="lab" className="lab-section">
      <div className="lab-inner">
        <header className="lab-head">
          <p className="lab-label">Lab/_</p>
          <h2 className="lab-title">Experiments</h2>
          <p className="lab-sub">
            Technical explorations and half-finished ideas. Loose, quick, not
            collection-ready — the noise between the projects.
          </p>
        </header>

        <ul className="lab-list">
          {LAB_ITEMS.map((item, i) => (
            <li key={item.name} className="lab-row">
              <span className="lab-idx">{String(i + 1).padStart(2, '0')}</span>
              <span className="lab-name">{item.name}</span>
              <span className="lab-tag">{item.tag}</span>
              <span className="lab-state">{item.state}</span>
            </li>
          ))}
        </ul>

        <p className="lab-note">Projects live upstairs — finished work. This is the workshop.</p>
      </div>
    </section>
  )
}