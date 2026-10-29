import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import media from "@/data/media.json";

export const metadata: Metadata = {
  title: "מדיה",
  description: "שיעורי וידאו ושמע",
  alternates: { canonical: "/media/" },
};

export default function MediaPage() {
  return (
    <div className="container">
      <h1 className="page-title">מדיה</h1>
      <h3>איזור זה עדיין בעריכה...</h3>

      <FadeIn as="section" className="section">
        <h2 className="section-title">שיעורי וידאו</h2>
        <div className="media-grid" id="video-container">
          {media.videos.map((video) => (
            <div className="media-card" key={video.title}>
              {video.youtube_id ? (
                <iframe
                  src={`https://www.youtube.com/embed/${video.youtube_id}`}
                  title={video.title}
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div className="media-card__placeholder">הסרטון יעלה בקרוב</div>
              )}
              <div className="media-card__body">
                <h3 className="media-card__title">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn as="section" className="section media-list">
        <h2 className="section-title">שיעורים נוספים</h2>
        <div id="links-container">
          {media.links.map((link) => (
            <a key={link.title} href={link.url} target="_blank" rel="noopener" className="media-list-item">
              {link.title}
            </a>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
