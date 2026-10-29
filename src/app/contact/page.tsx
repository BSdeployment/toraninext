import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "יצירת קשר",
  description: "צור קשר עם אבן שלמה",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  const { contact, mailerLite } = siteConfig;
  return (
    <div className="container">
      {/* טופס הרשמה של MailerLite (הסקריפט נטען ב-layout.tsx) */}
      <div className="ml-embedded" data-form={mailerLite.formId} />

      <FadeIn className="contact-info contact-info--centered">
        <h1 className="page-title">יצירת קשר</h1>
        <p>שלום וברכה!</p>
        <p>הערות הארות, מידע נוסף ועוד ניתן לפנות</p>
        <p>{contact.name}</p>
        <p>
          <strong>דוא&quot;ל:</strong> <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </p>
        <a href={`mailto:${contact.buttonEmail}`} className="contact-email-btn">
          שלח דוא&quot;ל
        </a>
      </FadeIn>
    </div>
  );
}
