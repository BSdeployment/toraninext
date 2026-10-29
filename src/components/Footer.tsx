import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          © {new Date().getFullYear()} {siteConfig.title}. כל הזכויות שמורות.
        </p>
      </div>
    </footer>
  );
}
