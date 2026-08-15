import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import {
  getAlerts,
  markAlertAsRead,
  signOutAdmin,
  supabase,
} from '../services/supabaseService';

import styles from './TopNav.module.css';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function TopNav({ search, onSearchChange }) {
  const navigate = useNavigate();

  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  const [alerts, setAlerts] = useState([]);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [alertsLoading, setAlertsLoading] = useState(true);

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const data = await getAlerts();
        setAlerts(data);
      } catch (error) {
        console.error('Failed to load alerts:', error);
      } finally {
        setAlertsLoading(false);
      }
    }

    loadAlerts();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('alerts-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'alerts',
        },
        (payload) => {
          const newAlert = {
            id: payload.new.alert_id,
            ticketId: payload.new.ticket_id,
            type: payload.new.alert_type,
            message: payload.new.message,
            isRead: payload.new.is_read,
            createdAt: payload.new.created_at,
          };

          setAlerts((prev) => [newAlert, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        alertsOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setAlertsOpen(false);
      }

      if (
        userMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () =>
      document.removeEventListener('mousedown', handleOutsideClick);
  }, [alertsOpen, userMenuOpen]);

  const unreadCount = alerts.filter((alert) => !alert.isRead).length;
  const unreadAlerts = alerts.filter((alert) => !alert.isRead);

  async function handleAlertClick(alert) {
    try {
      if (!alert.isRead) {
        await markAlertAsRead(alert.id);

        setAlerts((prev) =>
          prev.filter((item) => item.id !== alert.id)
        );
      }
    } catch (error) {
      console.error('Failed to mark alert as read:', error);
    }

    setAlertsOpen(false);
    navigate(`/ticket/${alert.ticketId}`);
  }

  async function handleLogout() {
    try {
      await signOutAdmin();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <header className={styles.nav}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>IT</span>
        </div>

        <nav className={styles.links}>
          <NavLink
            to="/ticket-queue"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            <svg
              className={styles.linkIcon}
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3 2h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"
                stroke="currentColor"
                strokeWidth="1.3"
              />

              <path
                d="M5 6h6M5 9h4"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>

            TICKETS
          </NavLink>
        </nav>
      </div>

      <div className={styles.center}>
        <div className={styles.searchWrap}>
          <svg
            className={styles.searchIcon}
            viewBox="0 0 16 16"
            fill="none"
          >
            <circle
              cx="6.5"
              cy="6.5"
              r="5"
              stroke="currentColor"
              strokeWidth="1.4"
            />

            <path
              d="M10.5 10.5L14 14"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
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

      <div className={styles.right}>
        <div
          className={styles.notifications}
          ref={dropdownRef}
        >
          <button
            className={`${styles.iconBtn} ${
              alertsOpen ? styles.iconBtnActive : ''
            }`}
            title="Notifications"
            aria-label="Notifications"
            aria-expanded={alertsOpen}
            onClick={() => {
              setAlertsOpen((prev) => !prev);
              setUserMenuOpen(false);
            }}
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              width="15"
              height="15"
            >
              <path
                d="M8 2a5 5 0 0 1 5 5v2.5l1 1.5H2l1-1.5V7a5 5 0 0 1 5-5Z"
                stroke="currentColor"
                strokeWidth="1.3"
              />

              <circle
                cx="8"
                cy="14"
                r="1.2"
                fill="currentColor"
              />
            </svg>

            {unreadCount > 0 && (
              <span className={styles.notifBadge}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {alertsOpen && (
            <div className={styles.notificationMenu}>
              <div className={styles.notificationHeader}>
                <div>
                  <span className={styles.notificationTitle}>
                    Notifications
                  </span>

                  <span className={styles.notificationSubtitle}>
                    Critical incident alerts
                  </span>
                </div>

                {unreadCount > 0 && (
                  <span className={styles.unreadLabel}>
                    {unreadCount} unread
                  </span>
                )}
              </div>

              <div className={styles.notificationList}>
                {alertsLoading ? (
                  <div className={styles.notificationEmpty}>
                    Loading…
                  </div>
                ) : unreadAlerts.length === 0 ? (
                  <div className={styles.notificationEmpty}>
                    No unread alerts
                  </div>
                ) : (
                  unreadAlerts.slice(0, 5).map((alert) => (
                    <button
                      key={alert.id}
                      type="button"
                      className={`${styles.notificationItem} ${
                        !alert.isRead
                          ? styles.notificationUnread
                          : ''
                      }`}
                      onClick={() => handleAlertClick(alert)}
                    >
                      <span className={styles.notificationContent}>
                        <span className={styles.notificationMessage}>
                          {alert.message}
                        </span>

                        <span className={styles.notificationMeta}>
                          {alert.ticketId} · {timeAgo(alert.createdAt)}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>

              <div className={styles.notificationFooter}>
                <button
                  type="button"
                  className={styles.viewAllAlerts}
                  onClick={() => {
                    setAlertsOpen(false);
                    navigate('/alerts');
                  }}
                >
                  View all alerts
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          className={styles.userDropdown}
          ref={userMenuRef}
        >
          <button
            type="button"
            className={styles.userMenu}
            onClick={() => {
              setUserMenuOpen((prev) => !prev);
              setAlertsOpen(false);
            }}
          >
            <div className={styles.avatar}>AD</div>

            <span className={styles.userName}>
              Admin
            </span>

            <svg
              viewBox="0 0 10 6"
              width="9"
              height="9"
              fill="none"
              className={
                userMenuOpen
                  ? styles.userChevronOpen
                  : ''
              }
            >
              <path
                d="M1 1l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {userMenuOpen && (
            <div className={styles.userDropdownMenu}>
              <button
                type="button"
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}