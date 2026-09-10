import styles from '@/components/SiteFooter.module.css'

export default function SiteFooter() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <span className={styles.text}>
        created by <span className={styles.name}>km.afraz</span>
      </span>
    </footer>
  )
}