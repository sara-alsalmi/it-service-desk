import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { getAlerts } from '../services/supabaseService';
import styles from './Alerts.module.css';

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

export default function Alerts() {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    getAlerts()
      .then((data) => {
        setAlerts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load alerts:', error);
        setAlerts([]);
        setLoading(false);
      });
  }, []);

  const filteredAlerts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...alerts]
      .filter((alert) => {
        const matchesSearch =
          !query ||
          alert.ticketId?.toLowerCase().includes(query) ||
          alert.message?.toLowerCase().includes(query) ||
          alert.type?.toLowerCase().includes(query);

        const matchesStatus =
          statusFilter === 'All' ||
          (statusFilter === 'Unread' && !alert.isRead) ||
          (statusFilter === 'Read' && alert.isRead);

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'oldest') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }

        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [alerts, search, statusFilter, sortBy]);

  const unreadCount = alerts.filter((alert) => !alert.isRead).length;

  return (
    <div className={styles.shell}>
      <TopNav search={search} onSearchChange={setSearch} />

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <div>
            <h1 className={styles.pageTitle}>
              Alerts <span className={styles.count}>({alerts.length})</span>
            </h1>
            <p className={styles.pageSubtitle}>
              Critical incident alert history
            </p>
          </div>

          {unreadCount > 0 && (
            <span className={styles.unreadSummary}>
              {unreadCount} unread
            </span>
          )}
        </div>

        <div className={styles.toolbar}>
          <div className={styles.segmentGroup} aria-label="Alert status filter">
            {['All', 'Unread', 'Read'].map((option) => (
              <button
                key={option}
                type="button"
                className={`${styles.segmentButton} ${
                  statusFilter === option ? styles.segmentButtonActive : ''
                }`}
                onClick={() => setStatusFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <div className={styles.sortGroup}>
            <span className={styles.sortLabel}>Sort</span>
            <div className={styles.segmentGroup}>
              <button
                type="button"
                className={`${styles.segmentButton} ${
                  sortBy === 'newest' ? styles.segmentButtonActive : ''
                }`}
                onClick={() => setSortBy('newest')}
              >
                Newest
              </button>
              <button
                type="button"
                className={`${styles.segmentButton} ${
                  sortBy === 'oldest' ? styles.segmentButtonActive : ''
                }`}
                onClick={() => setSortBy('oldest')}
              >
                Oldest
              </button>
            </div>
          </div>
        </div>

        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Status</th>
                <th>Alert</th>
                <th>Ticket</th>
                <th>Type</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className={styles.stateCell}>
                    Loading…
                  </td>
                </tr>
              ) : filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.stateCell}>
                    No alerts found.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr
                    key={alert.id}
                    className={`${styles.row} ${
                      !alert.isRead ? styles.rowUnread : ''
                    }`}
                    onClick={() => navigate(`/ticket/${alert.ticketId}`)}
                  >
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          alert.isRead
                            ? styles.statusRead
                            : styles.statusUnread
                        }`}
                      >
                        {alert.isRead ? 'Read' : 'Unread'}
                      </span>
                    </td>

                    <td className={styles.messageCell}>
                      {alert.message}
                    </td>

                    <td className={styles.ticketId}>
                      {alert.ticketId}
                    </td>

                    <td>
                      <span className={styles.typeBadge}>{alert.type}</span>
                    </td>

                    <td className={styles.createdCell}>
                      {timeAgo(alert.createdAt)}
                    </td>

                    <td className={styles.actionCell}>
                      <button
                        type="button"
                        className={styles.viewButton}
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(`/ticket/${alert.ticketId}`);
                        }}
                        title="View ticket"
                        aria-label="View ticket"
                      >
                        <svg
                          viewBox="0 0 14 14"
                          fill="none"
                          width="12"
                          height="12"
                        >
                          <path
                            d="M1 7s2-4.5 6-4.5S13 7 13 7s-2 4.5-6 4.5S1 7 1 7Z"
                            stroke="currentColor"
                            strokeWidth="1.3"
                          />
                          <circle
                            cx="7"
                            cy="7"
                            r="1.8"
                            stroke="currentColor"
                            strokeWidth="1.3"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}