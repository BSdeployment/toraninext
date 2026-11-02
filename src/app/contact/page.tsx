// import type { Metadata } from "next";
// import FadeIn from "@/components/FadeIn";
// import { siteConfig } from "@/config/site";
// import MailerLiteForm from "@/components/MailerLiteForm";
// import ContactForm from "@/components/ContactUsForm";

// export const metadata: Metadata = {
//   title: "יצירת קשר",
//   description: "צור קשר עם אבן שלמה",
//   alternates: { canonical: "/contact/" },
// };

// export default function ContactPage() {
//   const { contact, mailerLite } = siteConfig;
//   return (
//     <div className="container">
//       {/* טופס הרשמה של MailerLite (הסקריפט נטען ב-layout.tsx) */}
     

//      <MailerLiteForm/>

//      <div>
//         <ContactForm/>
//      </div>

//       <FadeIn className="contact-info contact-info--centered">
//         <h1 className="page-title">יצירת קשר</h1>
//         <p>שלום וברכה!</p>
//         <p>הערות הארות, מידע נוסף ועוד ניתן לפנות</p>
//         <p>{contact.name}</p>
//         <p>
//           <strong>דוא&quot;ל:</strong> <a href={`mailto:${contact.email}`}>{contact.email}</a>
//         </p>
//         <a href={`mailto:${contact.buttonEmail}`} className="contact-email-btn">
//           שלח דוא&quot;ל
//         </a>
//       </FadeIn>
//     </div>
//   );
// }

import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import { siteConfig } from "@/config/site";
import MailerLiteForm from "@/components/MailerLiteForm";
import ContactForm from "@/components/ContactUsForm";
import styles from "@/styles/contactPage.module.css";

export const metadata: Metadata = {
  title: "יצירת קשר",
  description: "צור קשר עם אבן שלמה",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  const { contact } = siteConfig;

  return (
    <main className={styles.page} dir="rtl" lang="he">

      <div className={styles.container}>

        {/* כותרת ראשית */}

        <FadeIn className={styles.intro}>
          <span className={styles.eyebrow}>
            אנחנו כאן בשבילכם
          </span>

          <h1 className={styles.title}>
            נשמח לשמוע מכם
          </h1>

          <p className={styles.subtitle}>
            יש לכם שאלה, הערה או הארה?
            <br />
            מוזמנים לפנות אלינו או להצטרף לרשימת התפוצה שלנו.
          </p>
        </FadeIn>

        {/* טופס יצירת קשר */}

        <FadeIn>
          <ContactForm />
        </FadeIn>

        {/* הרשמה לתפוצה - אקורדיון */}

        <FadeIn>
          <MailerLiteForm />
        </FadeIn>

        {/* פרטי קשר */}

        <FadeIn className={styles.contactInfo}>
          <div className={styles.contactDivider} />

          <h2>אפשר גם ליצור איתנו קשר ישירות</h2>

          <p className={styles.contactName}>
            {contact.name}
          </p>

          <a
            href={`mailto:${contact.email}`}
            className={styles.emailLink}
          >
            <span>✉</span>
            {contact.email}
          </a>

          <a
            href={`mailto:${contact.buttonEmail}`}
            className={styles.emailButton}
          >
            שליחת דוא"ל
          </a>

          <p className={styles.footerText}>
            אבן שלמה – לע"נ שלמה בן חסיבה זצ"ל
          </p>
        </FadeIn>

      </div>
    </main>
  );
}
