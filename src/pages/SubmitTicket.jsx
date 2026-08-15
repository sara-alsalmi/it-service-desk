import { useState } from 'react';
import { submitTicket } from '../services/ticketService';
import { DEPARTMENTS } from '../data/mockTickets';
import styles from './SubmitTicket.module.css';

const emptyForm = {
  employeeName: '',
  employeeEmail: '',
  department: '',
  issueDescription: '',
};

export default function SubmitTicket() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  function validate() {
    const e = {};
    if (!form.employeeName.trim()) e.employeeName = 'Required';
    if (!form.employeeEmail.trim()) e.employeeEmail = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.employeeEmail))
      e.employeeEmail = 'Enter a valid email address';
    if (!form.department) e.department = 'Required';
    if (!form.issueDescription.trim()) e.issueDescription = 'Required';
    else if (form.issueDescription.trim().length < 20)
      e.issueDescription = 'Please provide at least 20 characters';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await submitTicket(form);
      setResult(res);
      setForm(emptyForm);
    } catch {
      setErrors({ submit: 'Submission failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  return (
    <div className={styles.page}>
      <header className={styles.portalHeader}>
        <div className={styles.portalBrand}>
          <span className={styles.portalMark}>IT</span>
          <div className={styles.portalText}>
            <span className={styles.portalName}>IT Service Desk</span>
            <span className={styles.portalSub}>Employee Support Portal</span>
          </div>
        </div>
      </header>
      <div className={styles.content}>
        {result ? (
          <div className={styles.successBox}>
            <div className={styles.successHeader}>
              <div className={styles.successIcon}>✓</div>
              <div>
                <h2 className={styles.successTitle}>Ticket Submitted</h2>
                <p className={styles.successText}>Your request has been received. The IT team will be in touch shortly.</p>
              </div>
            </div>
            <div className={styles.successBody}>
              <div className={styles.successMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Ticket ID</span>
                  <span className={styles.metaValue}>{result.ticketId}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Status</span>
                  <span className={styles.metaValue}>{result.status}</span>
                </div>
              </div>
              <button className={styles.newBtn} onClick={() => setResult(null)}>
                Submit Another Ticket
              </button>
            </div>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>New IT Support Request</h2>
              <p className={styles.formSubtitle}>
                Fill in the details below. The IT team will respond as soon as possible.
              </p>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Employee Information</h3>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Full Name</label>
                  <input
                    className={`${styles.input} ${errors.employeeName ? styles.inputError : ''}`}
                    type="text"
                    name="employeeName"
                    value={form.employeeName}
                    onChange={handleChange}
                    placeholder="e.g. Jane Smith"
                  />
                  {errors.employeeName && <span className={styles.error}>{errors.employeeName}</span>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email Address</label>
                  <input
                    className={`${styles.input} ${errors.employeeEmail ? styles.inputError : ''}`}
                    type="email"
                    name="employeeEmail"
                    value={form.employeeEmail}
                    onChange={handleChange}
                    placeholder="e.g. jane.smith@company.com"
                  />
                  {errors.employeeEmail && <span className={styles.error}>{errors.employeeEmail}</span>}
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Department</label>
                <select
                  className={`${styles.select} ${errors.department ? styles.inputError : ''}`}
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                >
                  <option value="">— Select department —</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.department && <span className={styles.error}>{errors.department}</span>}
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Issue Details</h3>
              <div className={styles.field}>
                <label className={styles.label}>Issue Description</label>
                <textarea
                  className={`${styles.textarea} ${errors.issueDescription ? styles.inputError : ''}`}
                  name="issueDescription"
                  value={form.issueDescription}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Describe the problem in detail — include what happened, when it started, and any error messages."
                />
                {errors.issueDescription && (
                  <span className={styles.error}>{errors.issueDescription}</span>
                )}
              </div>
            </div>

            {errors.submit && <p className={styles.submitError}>{errors.submit}</p>}

            <div className={styles.actions}>
              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Ticket'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
