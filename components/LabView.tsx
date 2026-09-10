'use client'

import styles from '@/components/LabView.module.css'

interface Props {
  active: boolean
}

export default function LabView({ active }: Props) {
  return (
    <div
      className={`view ${active ? 'active' : ''} ${styles.lab}`}
      data-view="lab"
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className="section-title" data-reveal>Lab</h2>
          <p className={styles.desc} data-reveal>
            Experimental prototypes, visual tests, and ongoing explorations.
          </p>
        </div>
        <div className={styles.grid}>
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path
                  d="M24 4L28 16H40L30 24L34 36L24 28L14 36L18 24L8 16H20L24 4Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
            <p className={styles.emptyText}>
              Experiments incoming. The lab is being set up.
            </p>
            <span className={styles.emptyStatus}>
              Status: <span className={styles.blink}>Active</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
