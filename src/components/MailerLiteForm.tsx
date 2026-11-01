
'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import '../styles/MailerLiteForm.css'

declare global {
  interface Window {
    ml_webform_success_44977753?: () => void;
  }
}

export default function MailerLiteForm() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.ml_webform_success_44977753 = () => {
      setSubmitted(true);
    };

    return () => {
      delete window.ml_webform_success_44977753;
    };
  }, []);

  return (
    <>
      <Script
        src="https://groot.mailerlite.com/js/w/webforms.min.js?v83147fa8ce2d95cb73ece7f28b469519"
        strategy="afterInteractive"
        onLoad={() => {
          fetch(
            'https://assets.mailerlite.com/jsonp/2584082/forms/196209443631794003/takel'
          ).catch(console.error);
        }}
      />

      <div
        id="mlb2-44977753"
        className="ml-form-embedContainer ml-subscribe-form ml-subscribe-form-44977753"
      >
        <div className="ml-form-align-center">
          <div className="ml-form-embedWrapper embedForm">

            {!submitted ? (
              <div className="ml-form-embedBody ml-form-embedBodyDefault">

                <div className="ml-form-embedContent">
                  <h2>הרשמה לרשימת התפוצה</h2>

                  <p>
                    להרשם לקבלת העלון מדי שבוע במייל.
                    הזן כתובת מייל ולחץ הרשם.
                    שימו לב, ייתכן שהמייל יישלח לאזור הספאם.
                  </p>
                </div>

                <form
                  className="ml-block-form"
                  action="https://assets.mailerlite.com/jsonp/2584082/forms/196209443631794003/subscribe"
                  method="post"
                  target="_blank"
                >
                  <div className="ml-form-formContent">
                    <div className="ml-form-fieldRow ml-last-item">
                      <div className="ml-field-group ml-field-email ml-validate-email ml-validate-required">
                        <input
                          aria-label="email"
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
                    <button type="submit">הרשם</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="ml-form-successBody">
                <div className="ml-form-successContent">
                  <div className="ml-success-icon">✉</div>

                  <h2>ההרשמה הסתיימה בהצלחה</h2>

                  <p>
                    שימו לב! להשלמת התהליך יש להיכנס למייל
                    שלכם ולאשר את ההרשמה, בכדי לאמת את כתובת המייל.
                  </p>

                  <hr />

                  <p>
                    אבן שלמה - לע"נ שלמה בן חסיבה זצ"ל
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
