import Image from "next/image";
import Link from "next/link";
import { getPublishedGalleries } from "@/lib/galleries";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const galleries = await getPublishedGalleries();

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <Image
          src="/lentium-logo.png"
          alt="LENTIUM PRODUCTION"
          width={220}
          height={115}
          className="admin-logo"
          priority
        />
        <div>
          <p className="eyebrow">LENTIUM ADMIN</p>
          <h1>Галерии</h1>
          <p className="admin-subtitle">
            Първа връзка между сайта и Supabase.
          </p>
        </div>
      </header>

      <section className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <h2>Публикувани галерии</h2>
            <p>{galleries.length} активни</p>
          </div>
          <button className="primary-button disabled" disabled>
            + Нова галерия — следваща версия
          </button>
        </div>

        <div className="admin-list">
          {galleries.map((gallery) => (
            <article className="admin-card" key={gallery.slug}>
              <div>
                <p className="admin-date">{gallery.date || "Без дата"}</p>
                <h3>{gallery.title}</h3>
                <code>/gallery/{gallery.slug}</code>
              </div>
              <Link
                className="secondary-admin-button"
                href={`/gallery/${gallery.slug}`}
              >
                Отвори
              </Link>
            </article>
          ))}
        </div>
      </section>

      <p className="admin-note">
        Ако тук се вижда „Дарина & Георги“, връзката със Supabase работи.
      </p>
    </main>
  );
}
