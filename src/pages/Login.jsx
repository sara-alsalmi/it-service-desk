import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAdmin } from '../services/supabaseService';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      await signInAdmin(email.trim(), password);
      navigate('/ticket-queue', { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>IT SERVICE DESK</p>
          <h1 className={styles.title}>Admin sign in</h1>
          <p className={styles.subtitle}>
            Sign in to manage tickets and critical incident alerts.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              className={styles.input}
              type="email"
              autoComplete="email"
              placeholder="admin@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={submitting}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              className={styles.input}
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={submitting}
            />
          </div>

          {error && (
            <div className={styles.errorMessage} role="alert">
              {error}
            </div>
          )}

          <button
            className={styles.submitButton}
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}