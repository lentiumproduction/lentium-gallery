import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import GalleryClient from "@/components/GalleryClient";
import { getPublishedGallery } from "@/lib/galleries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function GalleryPage({ params }: PageProps) {
  const { slug } = await params;
  const gallery = await getPublishedGallery(slug);

  if (!gallery) notFound();

  return (
    <main className="gallery-page">
      <header className="gallery-hero">
        <Image
          src={gallery.cover}
          alt={`Корица на галерията ${gallery.title}`}
          fill
          priority
          className="gallery-cover"
          sizes="100vw"
        />
        <div className="gallery-overlay" />

        <div className="gallery-hero-content">
          <Link href="/" aria-label="Начална страница">
            <Image
              src="/lentium-logo.png"
              alt="LENTIUM PRODUCTION"
              width={300}
              height={157}
              className="hero-logo"
            />
          </Link>

          <p className="hero-eyebrow">LENTIUM GALLERY</p>
          <h1>{gallery.title}</h1>
          <p className="hero-date">{gallery.date}</p>
          <p className="hero-message">{gallery.message}</p>

          <a className="scroll-button" href="#photos">
            Разгледайте галерията
          </a>
        </div>
      </header>

      <section className="gallery-intro" id="photos">
        <p className="eyebrow">ВАШАТА ИСТОРИЯ</p>
        <h2>Мигове, които остават.</h2>
        <p>
          Разгледайте кадрите, отбележете любимите си снимки и изтеглете
          отделните файлове директно от галерията.
        </p>

        {gallery.downloadAllUrl ? (
          <a
            className="primary-button"
            href={gallery.downloadAllUrl}
            target="_blank"
            rel="noreferrer"
          >
            Отвори всички снимки в MEGA
          </a>
        ) : gallery.photos.length > 0 ? (
          <p className="gallery-photo-count">
            {gallery.photos.length} снимки в галерията
          </p>
        ) : (
          <p className="gallery-photo-count">
            Снимките ще бъдат добавени скоро.
          </p>
        )}
      </section>

      <GalleryClient photos={gallery.photos} />

      <footer>
        Създадено с внимание от LENTIUM PRODUCTION Ltd.
      </footer>
    </main>
  );
}
