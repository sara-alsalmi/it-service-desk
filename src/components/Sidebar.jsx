import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoMark}>IT</div>
        <div className={styles.logoTextGroup}>
          <span className={styles.logoText}>IT Service Desk</span>
          <span className={styles.logoOrg}>Acme Corp</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <p className={styles.navGroup}>WORKSPACE</p>

        <NavLink to="/" end className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
          <svg className={styles.navIcon} viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
          Dashboard
        </NavLink>

        <NavLink to="/submit" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
          <svg className={styles.navIcon} viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Submit Ticket
        </NavLink>
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.footerUser}>
          <div className={styles.footerAvatar}>AD</div>
          <div className={styles.footerInfo}>
            <span className={styles.footerName}>Admin</span>
            <span className={styles.footerRole}>IT Technician</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
