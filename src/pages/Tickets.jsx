import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { PriorityDot, StatusBadge } from '../components/Badge';
import { getTickets, deleteTicket } from '../services/supabaseService';
import styles from './Tickets.module.css';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);

  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];
const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];
const CATEGORIES = ['Network', 'Hardware', 'Software', 'Access', 'Other'];

const TEAMS = [
  'Network Support',
  'End User Computing',
  'Application Support',
  'Identity & Access Management',
  'Service Desk',
];

function FilterDropdown({ label, value, onChange, options, allLabel }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.customFilter}>
      <span className={styles.filterLabel}>{label}</span>

      <div className={styles.customDropdown}>
        <button
          type="button"
          className={`${styles.dropdownTrigger} ${
            open ? styles.dropdownTriggerOpen : ''
          }`}
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
        >
          <span>{value || allLabel}</span>
          <span
            className={`${styles.dropdownChevron} ${
              open ? styles.dropdownChevronOpen : ''
            }`}
          />
        </button>

        {open && (
          <div className={styles.dropdownMenu}>
            <button
              type="button"
              className={`${styles.dropdownOption} ${
                value === '' ? styles.dropdownOptionActive : ''
              }`}
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
            >
              {allLabel}
            </button>

            {options.map((option) => (
              <button
                type="button"
                key={option}
                className={`${styles.dropdownOption} ${
                  value === option ? styles.dropdownOptionActive : ''
                }`}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Tickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterTeam, setFilterTeam] = useState('');

  const [sortBy, setSortBy] = useState('submittedAt');

  useEffect(() => {
    getTickets()
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch(() => {
        setTickets([]);
        setLoading(false);
      });
  }, []);

  const filtered = tickets
    .filter((ticket) => {
      const q = search.trim().toLowerCase();

      const matchSearch =
        !q ||
        ticket.id?.toLowerCase().includes(q) ||
        ticket.employeeName?.toLowerCase().includes(q) ||
        ticket.category?.toLowerCase().includes(q);

      const matchPriority =
        !filterPriority || ticket.priority === filterPriority;

      const matchStatus =
        !filterStatus || ticket.status === filterStatus;

      const matchCategory =
        !filterCategory || ticket.category === filterCategory;

      const matchTeam =
        !filterTeam || ticket.assignedTeam === filterTeam;

      return (
        matchSearch &&
        matchPriority &&
        matchStatus &&
        matchCategory &&
        matchTeam
      );
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const order = {
          Critical: 0,
          High: 1,
          Medium: 2,
          Low: 3,
        };

        return (order[a.priority] ?? 99) - (order[b.priority] ?? 99);
      }

      return new Date(b.submittedAt) - new Date(a.submittedAt);
    });

  async function confirmDelete() {
    if (!ticketToDelete || deleting) return;

    try {
      setDeleting(true);
      setDeleteError('');

      await deleteTicket(ticketToDelete.id);

      setTickets((prev) =>
        prev.filter((ticket) => ticket.id !== ticketToDelete.id)
      );

      setTicketToDelete(null);
    } catch (error) {
      console.error('Delete failed:', error);
      setDeleteError('Could not delete this ticket. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  function resetFilters() {
    setFilterPriority('');
    setFilterStatus('');
    setFilterCategory('');
    setFilterTeam('');
    setSortBy('submittedAt');
  }

  return (
    <div className={styles.shell}>
      <TopNav search={search} onSearchChange={setSearch} />

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h1 className={styles.pageTitle}>
            Tickets <span className={styles.count}>({tickets.length})</span>
          </h1>
        </div>

        <div className={styles.toolbar}>
          <button
            className={styles.createBtn}
            onClick={() => navigate('/submit')}
          >
            CREATE TICKET
          </button>

          <span className={styles.pager}>
            {filtered.length === 0 ? '0' : `1–${filtered.length}`} of{' '}
            {tickets.length}
          </span>
        </div>

        <div className={styles.tableRow}>
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned Team</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className={styles.stateCell}>
                      Loading…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.stateCell}>
                      No tickets found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((ticket) => (
                    <tr key={ticket.id} className={styles.row}>
                      <td
                        className={styles.tdNum}
                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                      >
                        {ticket.id.replace('TKT-', '')}
                      </td>

                      <td
                        className={styles.tdTitle}
                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                      >
                        {ticket.category}
                      </td>

                      <td
                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                      >
                        <span className={styles.priorityCell}>
                          <PriorityDot priority={ticket.priority} />
                          {ticket.priority}
                        </span>
                      </td>

                      <td
                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                      >
                        <StatusBadge status={ticket.status} />
                      </td>

                      <td
                        className={styles.tdAssignee}
                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                      >
                        {ticket.assignedTeam}
                      </td>

                      <td
                        className={styles.tdDate}
                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                      >
                        {timeAgo(ticket.submittedAt)}
                      </td>

                      <td className={styles.tdActions}>
                        <span className={styles.rowActions}>
                          <button
                            className={styles.iconAction}
                            onClick={() => navigate(`/ticket/${ticket.id}`)}
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

                          <button
                            className={`${styles.iconAction} ${styles.deleteIcon}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteError('');
                              setTicketToDelete(ticket);
                            }}
                            title="Delete ticket"
                            aria-label="Delete ticket"
                          >
                            <svg
                              viewBox="0 0 14 14"
                              fill="none"
                              width="12"
                              height="12"
                            >
                              <path
                                d="M3.5 4.2h7"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                              />
                              <path
                                d="M5 4.2V3.1h4v1.1"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M4.2 4.5l.5 6.3h4.6l.5-6.3"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M6 6.2v2.9M8 6.2v2.9"
                                stroke="currentColor"
                                strokeWidth="1.1"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <aside className={styles.filterPanel}>
            <div className={styles.filterHeader}>
              <div>
                <span className={styles.filterTitle}>Filters</span>
                <span className={styles.filterHint}>
                  Refine ticket queue
                </span>
              </div>

              <button
                className={styles.filterReset}
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>

            <div
              className={`${styles.filterSection} ${styles.sortSection}`}
            >
              <span className={styles.filterLabel}>Sort</span>

              <div
                className={styles.sortChoices}
                role="group"
                aria-label="Sort tickets"
              >
                <button
                  type="button"
                  className={`${styles.sortChoice} ${
                    sortBy === 'submittedAt'
                      ? styles.sortChoiceActive
                      : ''
                  }`}
                  onClick={() => setSortBy('submittedAt')}
                >
                  Newest
                </button>

                <button
                  type="button"
                  className={`${styles.sortChoice} ${
                    sortBy === 'priority'
                      ? styles.sortChoiceActive
                      : ''
                  }`}
                  onClick={() => setSortBy('priority')}
                >
                  Priority
                </button>
              </div>
            </div>

            <div className={styles.filterSection}>
              <FilterDropdown
                label="Priority"
                value={filterPriority}
                onChange={setFilterPriority}
                options={PRIORITIES}
                allLabel="All priorities"
              />
            </div>

            <div className={styles.filterSection}>
              <FilterDropdown
                label="Status"
                value={filterStatus}
                onChange={setFilterStatus}
                options={STATUSES}
                allLabel="All statuses"
              />
            </div>

            <div className={styles.filterSection}>
              <FilterDropdown
                label="Category"
                value={filterCategory}
                onChange={setFilterCategory}
                options={CATEGORIES}
                allLabel="All categories"
              />
            </div>

            <div className={styles.filterSection}>
              <FilterDropdown
                label="Assigned Team"
                value={filterTeam}
                onChange={setFilterTeam}
                options={TEAMS}
                allLabel="All teams"
              />
            </div>
          </aside>
        </div>
      </div>

      {ticketToDelete && (
        <div
          className={styles.modalOverlay}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !deleting) {
              setTicketToDelete(null);
              setDeleteError('');
            }
          }}
        >
          <div
            className={styles.deleteModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-ticket-title"
          >
            <div className={styles.modalIconWrap} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                <path d="M6.5 7.5h11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                <path d="M9 7.5V5.7h6v1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.7 8.2l.8 10.1h7l.8-10.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.4 10.4v5.5M13.6 10.4v5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>

            <h2 id="delete-ticket-title" className={styles.modalTitle}>
              Delete ticket?
            </h2>

            <p className={styles.modalText}>
              You’re about to permanently delete
              <span className={styles.modalTicketId}> {ticketToDelete.id}</span>.
              This action cannot be undone.
            </p>

            {deleteError && (
              <div className={styles.modalError}>{deleteError}</div>
            )}

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalCancel}
                onClick={() => {
                  if (!deleting) {
                    setTicketToDelete(null);
                    setDeleteError('');
                  }
                }}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className={styles.modalDelete}
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Delete ticket'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}