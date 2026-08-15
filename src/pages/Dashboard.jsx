import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { PriorityDot, StatusBadge } from '../components/Badge';
import { getTickets } from '../services/supabaseService';
import styles from './Dashboard.module.css';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getTickets().then(setTickets);
  }, []);

  const open = tickets.filter((t) => t.status === 'Open');
  const inProgress = tickets.filter((t) => t.status === 'In Progress');
  const critical = tickets.filter((t) => t.priority === 'Critical');
  const resolved = tickets.filter((t) => t.status === 'Resolved');

  // Team workload counts
  const teamCounts = tickets.reduce((acc, t) => {
    acc[t.assignedTeam] = (acc[t.assignedTeam] || 0) + 1;
    return acc;
  }, {});
  const maxCount = Math.max(...Object.values(teamCounts), 1);
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 5);

  return (
    <div className={styles.shell}>
      <TopNav search={search} onSearchChange={setSearch} />

      <div className={styles.body}>
        {/* Page title */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <button className={styles.createBtn} onClick={() => navigate('/submit')}>
            CREATE
          </button>
        </div>

        {/* Stat cards */}
        <div className={styles.statRow}>
          <StatCard label="Open" value={open.length} delta="+2 today" color="#2563eb" bg="#eff6ff" border="#bfdbfe" />
          <StatCard label="In Progress" value={inProgress.length} delta="Active" color="#d97706" bg="#fffbeb" border="#fde68a" />
          <StatCard label="Critical" value={critical.length} delta="Needs attention" color="#dc2626" bg="#fef2f2" border="#fecaca" alert />
          <StatCard label="Resolved" value={resolved.length} delta="This week" color="#16a34a" bg="#f0fdf4" border="#bbf7d0" />
        </div>

        {/* Lower grid */}
        <div className={styles.grid}>
          {/* Recent tickets */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardTitle}>Recent Tickets</span>
              <button className={styles.viewAll} onClick={() => navigate('/tickets')}>View all →</button>
            </div>
            <table className={styles.recentTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map((t) => (
                  <tr key={t.id} className={styles.recentRow} onClick={() => navigate(`/ticket/${t.id}`)}>
                    <td className={styles.recentId}>{t.id.replace('TKT-', '')}</td>
                    <td className={styles.recentCat}>{t.category}</td>
                    <td>
                      <span className={styles.prioCell}>
                        <PriorityDot priority={t.priority} />
                        {t.priority}
                      </span>
                    </td>
                    <td><StatusBadge status={t.status} /></td>
                    <td className={styles.recentDate}>{timeAgo(t.submittedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Team workload */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardTitle}>Team Workload</span>
              <span className={styles.cardSub}>{tickets.length} total tickets</span>
            </div>
            <div className={styles.workload}>
              {Object.entries(teamCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([team, count]) => (
                  <div key={team} className={styles.workloadRow}>
                    <span className={styles.workloadTeam}>{team}</span>
                    <div className={styles.barWrap}>
                      <div
                        className={styles.bar}
                        style={{ width: `${Math.round((count / maxCount) * 100)}%` }}
                      />
                    </div>
                    <span className={styles.workloadCount}>{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, delta, color, bg, border, alert }) {
  return (
    <div className={styles.statCard} style={{ background: bg, borderColor: border }}>
      {alert && value > 0 && <span className={styles.alertDot} />}
      <span className={styles.statValue} style={{ color }}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statDelta}>{delta}</span>
    </div>
  );
}
