import Image from "next/image";
import Link from "next/link";
import { getPublishedGalleries } from "@/lib/galleries";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ created?: string }>;
};

export default async function AdminPage({ searchParams }: PageProps) {
  const { created } = await searchParams;
  const galleries = await getPublishedGalleries();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
            Влезли сте като {user?.email}
          </p>
        </div>
        <LogoutButton />
      </header>

      {created && (
        <div className="admin-success">
          Галерията „{created}“ беше създадена успешно.
        </div>
      )}

      <section className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <h2>Публикувани галерии</h2>
            <p>{galleries.length} активни</p>
          </div>
          <Link className="primary-button" href="/admin/new">
            + Нова галерия
          </Link>
        </div>

        <div className="admin-list">
          {galleries.map((gallery) => (
            <article className="admin-card" key={gallery.slug}>
              <div>
                <p className="admin-date">{gallery.date || "Без дата"}</p>
                <h3>{gallery.title}</h3>
                <code>/gallery/{gallery.slug}</code>
              </div>
              <div className="admin-card-actions">
                <Link
                  className="secondary-admin-button"
                  href={`/admin/gallery/${gallery.slug}/upload`}
                >
                  Качи снимки
                </Link>
                <Link
                  className="secondary-admin-button"
                  href={`/gallery/${gallery.slug}`}
                  target="_blank"
                >
                  Отвори
                </Link>
              </div>
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
