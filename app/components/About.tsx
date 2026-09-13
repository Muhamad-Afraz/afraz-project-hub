'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const TICKER = [
  'Built by hand',
  'Kept close to the machine',
  'Work · Archive · Interactive',
  'Design → Code → Deploy',
  'Ship · Iterate · Repeat',
]

const TERMINAL = [
  { cmd: 'whoami' },
  { out: 'Afraz — creative developer' },
  { cmd: 'cat ./archive --field=ethos' },
  { out: '"keep it close to the machine"' },
  { cmd: 'ls ./tools' },
  { out: 'design · code · deploy' },
]

const TOOLS = ['React', 'Next.js', 'TypeScript', 'GSAP', 'Node', 'Design']

const FACTS = [
  { k: 'Focus', v: 'Web & interactive' },
  { k: 'Approach', v: 'Design → Code → Deploy' },
  { k: 'Currently', v: 'Building & experimenting' },
]

const pad = (n: number) => String(n).padStart(2, '0')

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)
  const termRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const countUp = (node: HTMLElement, target: number) => {
      if (reduced) {
        node.textContent = pad(target)
        return
      }
      const start = performance.now()
      const dur = 1300
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / dur)
        const eased = 1 - Math.pow(1 - p, 3)
        node.textContent = pad(Math.round(eased * target))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.classList.add('in-view')

        if (numRef.current) {
          countUp(numRef.current, parseInt(numRef.current.dataset.total || '0', 10))
        }
        el.querySelectorAll<HTMLElement>('[data-count]').forEach((node) => {
          countUp(node, parseInt(node.dataset.count || '0', 10))
        })

        if (termRef.current) typeTerminal(termRef.current)
        io.disconnect()
      },
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const glow = glowRef.current
    if (!section || !glow) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || window.innerWidth < 900) return

    const qx = gsap.quickTo(glow, 'x', { duration: 1.15, ease: 'power3.out' })
    const qy = gsap.quickTo(glow, 'y', { duration: 1.15, ease: 'power3.out' })

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect()
      qx(e.clientX - r.left)
      qy(e.clientY - r.top)
      section.classList.add('is-armed')
    }
    const onLeave = () => section.classList.remove('is-armed')

    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)
    return () => {
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(glow)
    }
  }, [])

  return (
    <section id="about" ref={sectionRef} className="about-section">
      <div className="about-ticker" aria-hidden="true">
        <div className="about-ticker-track">
          {[0, 1].map((half) => (
            <div className="about-ticker-half" key={half}>
              {TICKER.map((word) => (
                <span className="about-ticker-item" key={word}>
                  <i className="about-ticker-star">✦</i>
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <span className="about-glow" ref={glowRef} aria-hidden="true" />

      <div className="about-rule">
        <p className="about-rule-label">About/_</p>
        <span className="about-rule-line" />
        <p className="about-rule-note">creative statement</p>
      </div>

      <div className="about-top">
        <h2 className="about-heading">
          <span className="about-line-mask">
            <span className="about-line-inner">Built by hand.</span>
          </span>
          <span className="about-line-mask about-line--b">
            <span className="about-line-inner">
              Kept close <em className="about-line-accent">to the machine.</em>
            </span>
          </span>
        </h2>

        <div className="about-total" aria-hidden="true">
          <span className="about-total-num" ref={numRef} data-total="6">
            00
          </span>
          <p className="about-total-sub">builds archived</p>
          <div className="about-total-meta">
            <span className="about-total-chip">
              live <b data-count="3">00</b>
            </span>
          </div>
        </div>
      </div>

      <div className="about-body">
        <div className="about-terminal" ref={termRef}>
          <div className="about-terminal-head">
            <span className="about-tl about-tl--a" />
            <span className="about-tl about-tl--b" />
            <span className="about-tl about-tl--c" />
            <span className="about-terminal-title">about.sh — /dev/hub</span>
          </div>
          <div className="about-terminal-body" role="log" aria-label="About, in a terminal">
            {TERMINAL.map((line, i) => (
              <div className="about-term-row" key={i}>
                <span className="about-term-prompt">guest@hub:~$</span>
                {line.cmd ? (
                  <>
                    <span className="about-term-cmd" data-type={line.cmd} />
                    <span className="about-term-caret" aria-hidden="true" />
                  </>
                ) : (
                  <span className="about-term-out" data-type={line.out || ''} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="about-copy">
          <p className="about-para about-para--lead">
            I&apos;m Afraz — a creative developer. I design and build
            interactive experiences for the web, and keep everything that
            comes out of that here.
          </p>
          <p className="about-para">
            Project-Hub is the archive itself: the finished builds, the
            experiments that made them, and the ideas still being shaped.
            Deliberately smaller than a portfolio — closer to the work.
          </p>
          <ul className="about-tools" aria-label="Toolchain">
            {TOOLS.map((tool) => (
              <li key={tool} className="about-tool">
                {tool}
              </li>
            ))}
          </ul>
        </div>

        <dl className="about-facts">
          {FACTS.map((fact) => (
            <div className="about-fact" key={fact.k}>
              <span className="about-fact-mark" aria-hidden="true" />
              <dt>{fact.k}</dt>
              <dd>{fact.v}</dd>
            </div>
          ))}
          <div className="about-fact-foot">
            <span className="about-fact-blip" aria-hidden="true" />
            <span>archive grows as the work does</span>
          </div>
        </dl>
      </div>
    </section>
  )
}

function typeTerminal(root: HTMLElement) {
  const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-type]'))
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let i = 0
  let alive = true

  const finishRow = () => {
    const row = rows[i]
    row?.classList.remove('is-active')
    row?.classList.add('is-done')
    i += 1
    if (i < rows.length) {
      window.setTimeout(typeRow, reduced ? 40 : 220)
    }
  }

  const typeRow = () => {
    if (!alive || i >= rows.length) return
    const el = rows[i]
    const row = el.parentElement
    const text = el.dataset.type || ''
    row?.classList.add('is-active')
    if (reduced) {
      el.textContent = text
      finishRow()
      return
    }
    el.textContent = ''
    let c = 0
    const step = () => {
      if (!alive) return
      c += 1
      el.textContent = text.slice(0, c)
      if (c < text.length) {
        window.setTimeout(step, 12 + Math.random() * 26)
      } else {
        window.setTimeout(finishRow, 140)
      }
    }
    window.setTimeout(step, 80)
  }

  window.setTimeout(typeRow, reduced ? 0 : 450)
  return () => {
    alive = false
  }
}