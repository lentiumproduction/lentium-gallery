import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGallery } from "@/data/galleries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function GalleryPage({ params }: PageProps) {
  const { slug } = await params;
  const gallery = getGallery(slug);

  if (!gallery) notFound();

  return (
    <main className="gallery-page">
      <header className="gallery-header">
        <Link href="/" aria-label="Начална страница">
          <Image
            src="/lentium-logo.png"
            alt="LENTIUM PRODUCTION"
            width={260}
            height={136}
            className="header-logo"
          />
        </Link>

        <div className="gallery-title-block">
          <p className="eyebrow">LENTIUM GALLERY</p>
          <h1>{gallery.title}</h1>
          <p>{gallery.date}</p>
          <p className="gallery-message">{gallery.message}</p>
        </div>

        {gallery.downloadAllUrl ? (
          <a className="primary-button" href={gallery.downloadAllUrl} target="_blank" rel="noreferrer">
            Изтегли всички снимки
          </a>
        ) : (
          <button className="primary-button disabled" disabled>
            Изтеглянето ще бъде добавено
          </button>
        )}
      </header>

      <section className="gallery-grid" aria-label="Снимки">
        {gallery.photos.length > 0 ? (
          gallery.photos.map((photo) => (
            <article className="photo-card" key={photo.id}>
              <Image
                src={photo.src}
                alt={photo.alt}
                width={1600}
                height={1067}
                className="gallery-photo"
              />
              {photo.downloadUrl && (
                <a
                  className="download-photo"
                  href={photo.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Изтегли кадъра
                </a>
              )}
            </article>
          ))
        ) : (
          <div className="empty-gallery">
            <p className="eyebrow">ГАЛЕРИЯТА Е ПОДГОТВЕНА</p>
            <h2>Тук ще се появят снимките.</h2>
            <p>
              Следващата стъпка е да добавим оптимизираните кадри и линковете към
              оригиналите в MEGA.
            </p>
          </div>
        )}
      </section>

      <footer>
        Създадено с внимание от LENTIUM PRODUCTION Ltd.
      </footer>
    </main>
  );
}
