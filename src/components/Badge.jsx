import styles from './Badge.module.css';

const priorityMap = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Critical: 'critical',
};

const statusMap = {
  Open: 'open',
  'In Progress': 'inprogress',
  Resolved: 'resolved',
  Closed: 'closed',
};

const dotColors = {
  Low: '#22c55e',
  Medium: '#f59e0b',
  High: '#f97316',
  Critical: '#ef4444',
};

export function PriorityBadge({ priority }) {
  return (
    <span className={`${styles.badge} ${styles[priorityMap[priority] || 'low']}`}>
      {priority}
    </span>
  );
}

export function StatusBadge({ status }) {
  return (
    <span className={`${styles.badge} ${styles[statusMap[status] || 'open']}`}>
      {status}
    </span>
  );
}

export function PriorityDot({ priority }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: dotColors[priority] || '#9ca3af',
        flexShrink: 0,
      }}
    />
  );
}
