'use client'

import { useState, useCallback, useEffect } from 'react'
import { gsap } from 'gsap'
import { PROJECTS } from '@/lib/projects'
import { prefersReducedMotion } from '@/lib/utils'
import { Project, ViewName } from '@/lib/types'
import { ThemeProvider, useThemeSystem } from '@/lib/useThemeSystem'
import Cursor from '@/components/Cursor'
import Navigation from '@/components/Navigation'
import HomeView from '@/components/HomeView'
import WorkView from '@/components/WorkView'
import LabView from '@/components/LabView'
import ProjectDetail from '@/components/ProjectDetail'

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewName>('home')
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [visibleCount, setVisibleCount] = useState(PROJECTS.length)
  const [bodyView, setBodyView] = useState('home')
  const theme = useThemeSystem()

  const openProject = useCallback(
    (project: Project, cardEl?: HTMLElement | null) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setCurrentProject(project)

      const reducedMotion = prefersReducedMotion()
      if (!reducedMotion && cardEl) {
        const detailPreview = document.getElementById('projectDetailPreview')
        if (detailPreview) {
          const rect = cardEl.getBoundingClientRect()
          const targetRect = detailPreview.getBoundingClientRect()

          const clone = cardEl.cloneNode(true) as HTMLElement
          clone.style.position = 'fixed'
          clone.style.top = rect.top + 'px'
          clone.style.left = rect.left + 'px'
          clone.style.width = rect.width + 'px'
          clone.style.height = rect.height + 'px'
          clone.style.zIndex = '9999'
          clone.style.margin = '0'
          clone.style.pointerEvents = 'none'
          document.body.appendChild(clone)

          const tl = gsap.timeline({
            onComplete: () => {
              clone.remove()
              gsap.killTweensOf(clone)
              setCurrentView('project')
              setBodyView('project')
              setIsTransitioning(false)
            },
          })

          tl.to(clone, {
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            borderRadius: '16px',
            duration: 0.8,
            ease: 'power3.inOut',
          })

          tl.to(
            document.querySelector('.ambient'),
            {
              opacity: 0.3,
              duration: 0.6,
              ease: 'power2.inOut',
            },
            0
          )
        } else {
          setCurrentView('project')
          setBodyView('project')
          setIsTransitioning(false)
        }
      } else {
        setCurrentView('project')
        setBodyView('project')
        setIsTransitioning(false)
      }

      theme.apply(project)
    },
    [isTransitioning, theme]
  )

  const closeProject = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)

    theme.applyDefault()

    const ambient = document.querySelector('.ambient') as HTMLElement | null
    if (ambient) gsap.killTweensOf(ambient)

    gsap.to(ambient, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        if (ambient) ambient.style.opacity = ''
        setCurrentProject(null)
        setCurrentView('work')
        setBodyView('work')
        setIsTransitioning(false)
      },
    })
  }, [isTransitioning, theme])

  const navigateTo = useCallback(
    (view: ViewName) => {
      if (isTransitioning || view === currentView) return
      setIsTransitioning(true)

      const currentEl = document.querySelector('.view.active') as HTMLElement | null
      const ambient = document.querySelector('.ambient') as HTMLElement | null

      const finish = () => {
        theme.applyDefault()
        if (ambient) {
          gsap.killTweensOf(ambient)
          gsap.to(ambient, {
            opacity: 1,
            duration: prefersReducedMotion() ? 0.01 : 0.3,
            ease: 'power2.inOut',
            onComplete: () => {
              ambient.style.opacity = ''
            },
          })
        }
        setCurrentView(view)
        setBodyView(view)
        setIsTransitioning(false)
      }

      window.scrollTo(0, 0)

      if (currentEl) {
        if (prefersReducedMotion()) {
          currentEl.style.opacity = ''
          currentEl.style.transform = ''
          finish()
        } else {
          gsap.to(currentEl, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
              currentEl.style.opacity = ''
              currentEl.style.transform = ''
              finish()
            },
          })
        }
      } else {
        finish()
      }
    },
    [isTransitioning, currentView, theme]
  )

  useEffect(() => {
    document.body.dataset.view = bodyView
  }, [bodyView])

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Cursor />
      <div className="ambient" id="ambient" aria-hidden="true">
        <div className="ambient-gradient" />
        <div className="ambient-under" />
        <div className="ambient-grain" />
        <div className="ambient-grid" id="ambientGrid" />
      </div>

      <Navigation
        currentView={currentView}
        navigateTo={navigateTo}
        visibleCount={visibleCount}
        totalCount={PROJECTS.length}
      />

      <main id="main-content" className="views">
        <HomeView
          active={currentView === 'home'}
          navigateTo={navigateTo}
          projectCount={PROJECTS.length}
        />
        <WorkView
          active={currentView === 'work'}
          projects={PROJECTS}
          openProject={openProject}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          setVisibleCount={setVisibleCount}
          visibleCount={visibleCount}
        />
        <LabView active={currentView === 'lab'} />
        {currentProject && (
          <ProjectDetail
            active={currentView === 'project'}
            project={currentProject}
            projects={PROJECTS}
            closeProject={closeProject}
            openProject={openProject}
          />
        )}
      </main>
    </>
  )
}

export default function Home() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
