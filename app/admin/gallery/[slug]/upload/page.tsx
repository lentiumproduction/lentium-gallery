import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FolderUploader from "@/components/FolderUploader";
import { getAdminGallery } from "@/lib/galleries";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ created?: string }>;
};

export const dynamic = "force-dynamic";

export default async function UploadGalleryPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { created } = await searchParams;
  const gallery = await getAdminGallery(slug);

  if (!gallery?.id) notFound();

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
          <h1>Качи снимки</h1>
          <p className="admin-subtitle">
            {gallery.title} · /gallery/{gallery.slug}
          </p>
        </div>
        <Link className="secondary-admin-button" href="/admin">
          Към галериите
        </Link>
      </header>

      {created && (
        <div className="admin-success">
          Галерията е създадена. Сега избери папката със снимките.
        </div>
      )}

      <section className="admin-form-panel">
        <div className="upload-page-heading">
          <div>
            <p className="eyebrow">ДИРЕКТНО ОТ КОМПЮТЪРА</p>
            <h2>{gallery.photos.length} качени снимки</h2>
            <p>
              Файловете се записват в Supabase Storage и се появяват
              автоматично в публичната галерия.
            </p>
          </div>
          <Link
            className="secondary-admin-button"
            href={`/gallery/${gallery.slug}`}
            target="_blank"
          >
            Отвори галерията
          </Link>
        </div>

        <FolderUploader galleryId={gallery.id} slug={gallery.slug} />
      </section>
    </main>
  );
}
