
'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import '../styles/MailerLiteForm.css';

declare global {
  interface Window {
    ml_webform_success_44977753?: () => void;
  }
}

export default function MailerLiteForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const submissionStarted = useRef(false);

  useEffect(() => {
    window.ml_webform_success_44977753 = () => {
      setSubmitted(true);
      submissionStarted.current = false;
    };

    return () => {
      delete window.ml_webform_success_44977753;
    };
  }, []);

  const handleSubmit = () => {
    submissionStarted.current = true;
  };

  const handleIframeLoad = () => {
    if (submissionStarted.current) {
      submissionStarted.current = false;
      setSubmitted(true);
    }
  };

  return (
    <section className="newsletter-section" dir="rtl">

      <Script
        src="https://groot.mailerlite.com/js/w/webforms.min.js?v83147fa8ce2d95cb73ece7f28b469519"
        strategy="afterInteractive"
        onLoad={() => {
          fetch(
            'https://assets.mailerlite.com/jsonp/2584082/forms/196209443631794003/takel'
          ).catch(console.error);
        }}
      />

      {/* iframe מוסתר לקבלת תשובת MailerLite */}

      <iframe
        name="mailerLiteResponseFrame"
        title="תשובת הרשמה"
        style={{ display: 'none' }}
        onLoad={handleIframeLoad}
      />

      {/* כפתור פתיחת האקורדיון */}

      <button
        type="button"
        className={`newsletter-toggle ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="newsletter-content"
      >
        <span className="newsletter-icon">
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
        </span>

        <span className="newsletter-text">
          <strong>הרשמה לרשימת התפוצה</strong>
          <small>
            קבלו את העלון השבועי ישירות למייל שלכם
          </small>
        </span>

        <span className="newsletter-arrow">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="m7 10 5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* תוכן האקורדיון */}

      <div
        id="newsletter-content"
        className={`newsletter-content ${isOpen ? 'is-open' : ''}`}
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="newsletter-inner">

          {!submitted ? (

            <div className="ml-form-embedBody ml-form-embedBodyDefault">

              <div className="ml-form-embedContent">
                <h2>הצטרפו לרשימת התפוצה</h2>

                <p>
                  הירשמו לקבלת העלון השבועי של אבן שלמה
                  ועדכונים חדשים ישירות לתיבת המייל שלכם.
                </p>
              </div>

              <form
                className="ml-block-form"
                action="https://assets.mailerlite.com/jsonp/2584082/forms/196209443631794003/subscribe"
                method="post"
                target="mailerLiteResponseFrame"
                onSubmit={handleSubmit}
              >
                <div className="ml-form-formContent">
                  <div className="ml-form-fieldRow ml-last-item">
                    <div className="ml-field-group ml-field-email ml-validate-email ml-validate-required">
                      <input
                        aria-label="כתובת מייל"
                        aria-required="true"
                        type="email"
                        name="fields[email]"
                        placeholder="כתובת מייל"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>
                </div>

                <input type="hidden" name="ml-submit" value="1" />
                <input type="hidden" name="anticsrf" value="true" />

                <div className="ml-form-embedSubmit">
                  <button type="submit">
                    הרשמה לרשימת התפוצה
                  </button>
                </div>
              </form>

              <p className="newsletter-note">
                שימו לב: ייתכן שהמייל יגיע לתיקיית הספאם.
              </p>
            </div>

          ) : (

            /* הודעת הצלחה אישית */

            <div className="ml-form-successBody">
              <div className="ml-form-successContent">

                <div className="ml-success-icon">
                  ✓
                </div>

                <h2>נרשמתם בהצלחה!</h2>

                <p>
                  תודה שהצטרפתם לרשימת התפוצה של אבן שלמה.
                </p>

                <p>
                  <strong>
                    נשלח אליכם מייל לאישור ההרשמה.
                  </strong>
                  <br />
                  יש להיכנס לתיבת המייל וללחוץ על קישור האישור
                  כדי להשלים את תהליך ההרשמה.
                </p>

                <div className="newsletter-success-note">
                  לא מצאתם את המייל?
                  כדאי לבדוק גם בתיקיית הספאם.
                </div>

                <hr />

                <p>
                  אבן שלמה – לע"נ שלמה בן חסיבה זצ"ל
                </p>

              </div>
            </div>

          )}

        </div>
      </div>

    </section>
  );
}
