import styles from './Header.module.css';

export default function Header({ title }) {
  const now = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.right}>
        <span className={styles.date}>{now}</span>
        <div className={styles.avatar}>IT</div>
      </div>
    </header>
  );
}
