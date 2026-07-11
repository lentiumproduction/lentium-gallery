"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { GalleryPhoto } from "@/data/galleries";

type Props = {
  photos: GalleryPhoto[];
};

export default function GalleryClient({ photos }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lentium-favorites");
      if (saved) setFavorites(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("lentium-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % photos.length
        );
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null ? null : (current - 1 + photos.length) % photos.length
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, photos.length]);

  const activePhoto = useMemo(
    () => (activeIndex === null ? null : photos[activeIndex]),
    [activeIndex, photos]
  );

  const toggleFavorite = (id: string) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  if (photos.length === 0) {
    return (
      <div className="empty-gallery">
        <p className="eyebrow">ГАЛЕРИЯТА Е ПОДГОТВЕНА</p>
        <h2>Тук ще се появят снимките.</h2>
        <p>
          Следващата стъпка е да добавим оптимизираните кадри и линковете към
          оригиналите в MEGA.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="gallery-grid" aria-label="Снимки">
        {photos.map((photo, index) => {
          const isFavorite = favorites.includes(photo.id);

          return (
            <article className="photo-card" key={photo.id}>
              <button
                className="photo-open"
                onClick={() => setActiveIndex(index)}
                aria-label={`Отвори ${photo.alt}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={1600}
                  height={1067}
                  className="gallery-photo"
                />
              </button>

              <button
                className={`favorite-button ${isFavorite ? "active" : ""}`}
                onClick={() => toggleFavorite(photo.id)}
                aria-label={isFavorite ? "Премахни от любими" : "Добави в любими"}
              >
                {isFavorite ? "♥" : "♡"}
              </button>

              {photo.downloadUrl && (
                <a
                  className="download-photo"
                  href={photo.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Изтегли
                </a>
              )}
            </article>
          );
        })}
      </div>

      {activePhoto && activeIndex !== null && (
        <div className="lightbox" role="dialog" aria-modal="true">
          <button
            className="lightbox-close"
            onClick={() => setActiveIndex(null)}
            aria-label="Затвори"
          >
            ×
          </button>

          <button
            className="lightbox-nav lightbox-prev"
            onClick={() =>
              setActiveIndex((activeIndex - 1 + photos.length) % photos.length)
            }
            aria-label="Предишна снимка"
          >
            ‹
          </button>

          <div className="lightbox-content">
            <Image
              src={activePhoto.src}
              alt={activePhoto.alt}
              width={2200}
              height={1467}
              className="lightbox-image"
              priority
            />

            <div className="lightbox-actions">
              <button
                className={`secondary-button ${
                  favorites.includes(activePhoto.id) ? "active" : ""
                }`}
                onClick={() => toggleFavorite(activePhoto.id)}
              >
                {favorites.includes(activePhoto.id)
                  ? "♥ Любима"
                  : "♡ Добави в любими"}
              </button>

              {activePhoto.downloadUrl && (
                <a
                  className="primary-button"
                  href={activePhoto.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Изтегли оригинала
                </a>
              )}
            </div>
          </div>

          <button
            className="lightbox-nav lightbox-next"
            onClick={() => setActiveIndex((activeIndex + 1) % photos.length)}
            aria-label="Следваща снимка"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
