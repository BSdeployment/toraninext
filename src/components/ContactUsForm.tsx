
'use client';

import { useState, type FormEvent } from 'react';
import styles from '../styles/contactUsForm.module.css';

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
    <section className={styles.card} aria-labelledby="contact-form-title">
      <div className={styles.header}>
        <div className={styles.icon}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 5.5h16v13H4z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="m5 7 7 5.5L19 7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 id="contact-form-title" className={styles.title}>
          שליחת הודעה
        </h2>

        <p className={styles.description}>
          יש לכם שאלה, הערה או הארה?
          <br />
          נשמח לקבל מכם הודעה ולחזור אליכם.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-name">
            שם מלא
          </label>
          <input
            className={styles.input}
            type="text"
            id="contact-name"
            name="name"
            placeholder="הקלידו את שמכם"
            autoComplete="name"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-email">
            כתובת מייל
          </label>
          <input
            className={styles.input}
            type="email"
            id="contact-email"
            name="email"
            placeholder="example@mail.com"
            autoComplete="email"
            dir="ltr"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-message">
            תוכן ההודעה
          </label>
          <textarea
            className={`${styles.input} ${styles.textarea}`}
            id="contact-message"
            name="message"
            placeholder="כתבו כאן את הודעתכם..."
            rows={5}
            required
          />
        </div>

        <button
          className={styles.button}
          type="submit"
          disabled={isSending}
        >
          {isSending ? (
            <>
              <span className={styles.spinner} />
              שולח הודעה...
            </>
          ) : (
            'שליחת הודעה'
          )}
        </button>

        <div aria-live="polite">
          {status === 'success' && (
            <p className={`${styles.status} ${styles.success}`}>
              ✓ ההודעה נשלחה בהצלחה, תודה רבה!
            </p>
          )}

          {status === 'error' && (
            <p className={`${styles.status} ${styles.error}`}>
              השליחה נכשלה. נסו שוב בעוד רגע.
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
