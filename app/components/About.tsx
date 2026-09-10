'use client'

import { useEffect, useRef } from 'react'

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.classList.add('in-view')

        const num = numRef.current
        if (num) {
          const target = parseInt(num.dataset.total || '0', 10)
          const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          if (reduced) {
            num.textContent = String(target).padStart(2, '0')
          } else {
            const start = performance.now()
            const dur = 1300
            const tick = (t: number) => {
              const p = Math.min(1, (t - start) / dur)
              const eased = 1 - Math.pow(1 - p, 3)
              num.textContent = String(Math.round(eased * target)).padStart(2, '0')
              if (p < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          }
        }
        io.disconnect()
      },
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="about-section">
      <div className="about-rule">
        <p className="about-rule-label">About/_</p>
        <span className="about-rule-line" />
        <p className="about-rule-note">creative statement</p>
      </div>

      <div className="about-top">
        <h2 className="about-heading">
          Built by hand.
          <br />
          Kept close <span className="about-heading-accent">to the machine.</span>
        </h2>
        <div className="about-total" aria-hidden="true">
          <span className="about-total-num" ref={numRef} data-total="6">
            00
          </span>
          <p className="about-total-sub">builds archived</p>
        </div>
      </div>

      <div className="about-body">
        <p className="about-para about-para--lead">
          I&apos;m Afraz — a creative developer. I design and build
          interactive experiences for the web, and I keep everything that
          comes out of that here.
        </p>
        <p className="about-para">
          Project-Hub is the archive itself: the finished builds, the
          experiments that made them, and the ideas still being shaped. It is
          deliberately smaller than a portfolio and closer to the work.
        </p>
        <dl className="about-facts">
          <div className="about-fact">
            <dt>Focus</dt>
            <dd>Web &amp; interactive experiences</dd>
          </div>
          <div className="about-fact">
            <dt>Approach</dt>
            <dd>Design &rarr; Code &rarr; Deploy</dd>
          </div>
          <div className="about-fact">
            <dt>Currently</dt>
            <dd>Building and experimenting</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}