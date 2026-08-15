import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { PriorityBadge, StatusBadge, PriorityDot } from '../components/Badge';
import { getTicketById, updateTicketStatus } from '../services/supabaseService';
import { STATUSES } from '../data/constants';
import styles from './TicketDetail.module.css';

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getTicketById(id).then((data) => {
      setTicket(data);
      setSelectedStatus(data?.status || '');
      setLoading(false);
    });
  }, [id]);

  async function handleStatusUpdate() {
    if (!selectedStatus || selectedStatus === ticket.status) return;
    setSaving(true);
    await updateTicketStatus(id, selectedStatus);
    setTicket((prev) => ({ ...prev, status: selectedStatus }));
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <div className={styles.loading}>Loading…</div>;
  if (!ticket)
    return (
      <div className={styles.shell}>
        <TopNav search="" onSearchChange={() => {}} />
        <div className={styles.notFound}>
          <p>Ticket <strong>{id}</strong> does not exist.</p>
          <button className={styles.backBtn} onClick={() => navigate('/ticket-queue')}>← Back to Ticket Queue</button>
        </div>
      </div>
    );

  return (
    <div className={styles.shell}>
      <TopNav search="" onSearchChange={() => {}} />
      <div className={styles.content}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <button className={styles.breadBtn} onClick={() => navigate('/ticket-queue')}>Ticket Queue</button>
          <span className={styles.sep}>/</span>
          <span className={styles.breadCurrent}>{ticket.id}</span>
        </div>

        {/* Page title banner */}
        <div className={styles.titleBanner}>
          <div className={styles.titleLeft}>
            <h1 className={styles.ticketTitle}>{ticket.category}</h1>
            <div className={styles.titleMeta}>
              <span className={styles.ticketIdBadge}>{ticket.id}</span>
              <span className={styles.metaDot}>·</span>
              <span className={styles.metaText}>{ticket.department}</span>
              <span className={styles.metaDot}>·</span>
              <span className={styles.metaText}>{formatDate(ticket.submittedAt)}</span>
            </div>
          </div>
          <div className={styles.titleRight}>
            <PriorityDot priority={ticket.priority} />
            <span className={styles.priorityLabel}>{ticket.priority}</span>
            <span className={styles.statusPill} data-status={ticket.status.toLowerCase().replace(' ', '-')}>
              {ticket.status}
            </span>
          </div>
        </div>

        <div className={styles.layout}>
          {/* Main Panel */}
          <div className={styles.main}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Issue Description</h2>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.description}>{ticket.issueDescription}</p>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Requester</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.requesterRow}>
                  <div className={styles.requesterAvatar}>
                    {ticket.employeeName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className={styles.requesterInfo}>
                    <span className={styles.requesterName}>{ticket.employeeName}</span>
                    <span className={styles.requesterEmail}>{ticket.employeeEmail}</span>
                  </div>
                  <span className={styles.deptTag}>{ticket.department}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className={styles.side}>
            {/* Status Update */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Update Status</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.statusCurrent}>
                  <span className={styles.statusLabel}>Current</span>
                  <StatusBadge status={ticket.status} />
                </div>
                <select
                  className={styles.statusSelect}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  className={styles.updateBtn}
                  onClick={handleStatusUpdate}
                  disabled={saving || selectedStatus === ticket.status}
                >
                  {saving ? 'Saving…' : 'Save Status'}
                </button>
                {saved && <p className={styles.savedMsg}>✓ Status updated</p>}
              </div>
            </div>

            {/* Ticket Properties */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Properties</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.propList}>
                  <div className={styles.propRow}>
                    <span className={styles.propKey}>Assigned Team</span>
                    <span className={styles.propVal}>{ticket.assignedTeam}</span>
                  </div>
                  <div className={styles.propRow}>
                    <span className={styles.propKey}>Category</span>
                    <span className={styles.propVal}>{ticket.category}</span>
                  </div>
                  <div className={styles.propRow}>
                    <span className={styles.propKey}>Impact</span>
                    <span className={styles.propVal}>{ticket.impact}</span>
                  </div>
                  <div className={styles.propRow}>
                    <span className={styles.propKey}>Urgency</span>
                    <span className={styles.propVal}>{ticket.urgency}</span>
                  </div>
                  <div className={styles.propRow}>
                    <span className={styles.propKey}>Priority</span>
                    <span className={styles.propVal}>
                      <PriorityDot priority={ticket.priority} />
                      <span style={{ marginLeft: 6 }}>{ticket.priority}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
