import { NavLink } from 'react-router-dom';
import styles from './TopNav.module.css';

export default function TopNav({ search, onSearchChange }) {
  return (
    <header className={styles.nav}>
      {/* Left: logo + nav links */}
      <div className={styles.left}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>IT</span>
        </div>
        <nav className={styles.links}>
          <NavLink to="/" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
            <svg className={styles.linkIcon} viewBox="0 0 16 16" fill="none">
              <path d="M3 2h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            TICKETS
          </NavLink>
        </nav>
      </div>

      {/* Center: search — truly centered with grid */}
      <div className={styles.center}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Right: notification + user */}
      <div className={styles.right}>
        <button className={styles.iconBtn} title="Notifications">
          <svg viewBox="0 0 16 16" fill="none" width="15" height="15">
            <path d="M8 2a5 5 0 0 1 5 5v2.5l1 1.5H2l1-1.5V7a5 5 0 0 1 5-5Z" stroke="currentColor" strokeWidth="1.3"/>
            <circle cx="8" cy="14" r="1.2" fill="currentColor"/>
          </svg>
          <span className={styles.notifDot} />
        </button>
        <div className={styles.userMenu}>
          <div className={styles.avatar}>AD</div>
          <span className={styles.userName}>Admin</span>
          <svg viewBox="0 0 10 6" width="9" height="9" fill="none">
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </header>
  );
}