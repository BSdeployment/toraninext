'use client';

import { useState, type FormEvent } from 'react';
import styles from '../styles/contactUsForm.module.css'

type Status = 'idle' | 'sending' | 'success' | 'error';

interface Web3FormsResponse {
  success: boolean;
  message?: string;
}

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const WEB3FORMS_ACCESS_KEY = '2fd6daaa-c73f-41f8-9f1a-94fe396c2c9a';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus('sending');

    const formData = new FormData(form);
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        body: formData,
      });
      const data: Web3FormsResponse = await response.json();

      if (data.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const isSending = status === 'sending';

  return (
    <main className={styles.page} dir="rtl" lang="he">
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>כל פנייה, הערה והארה תתקבל בברכה</h1>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <input
              className={styles.input}
              type="text"
              id="name"
              name="name"
              placeholder=" "
              autoComplete="name"
              required
            />
            <label className={styles.label} htmlFor="name">
              שם
            </label>
          </div>

          <div className={styles.field}>
            <input
              className={styles.input}
              type="email"
              id="email"
              name="email"
              placeholder=" "
              autoComplete="email"
              dir="ltr"
              style={{ textAlign: 'right' }}
              required
            />
            <label className={styles.label} htmlFor="email">
              כתובת מייל
            </label>
          </div>

          <div className={styles.field}>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              id="message"
              name="message"
              placeholder=" "
              rows={6}
              required
            />
            <label className={styles.label} htmlFor="message">
              הודעה
            </label>
          </div>

          <button className={styles.button} type="submit" disabled={isSending}>
            {isSending ? 'שולח…' : 'שליחה'}
          </button>

          <div aria-live="polite">
            {status === 'success' && (
              <p className={`${styles.status} ${styles.success}`}>
                ההודעה נשלחה בהצלחה, תודה!
              </p>
            )}
            {status === 'error' && (
              <p className={`${styles.status} ${styles.error}`}>
                השליחה נכשלה. נסו שוב בעוד רגע.
              </p>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}