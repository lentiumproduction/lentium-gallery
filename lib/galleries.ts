import { createSupabaseServerClient } from "@/lib/supabase";
import { fallbackGallery, type Gallery, type GalleryPhoto } from "@/data/galleries";

type GalleryRow = {
  id: string;
  slug: string;
  title: string;
  wedding_date: string | null;
  message: string | null;
  cover_url: string | null;
  mega_url: string | null;
  is_published: boolean | null;
};

type PhotoRow = {
  id: string;
  filename: string;
  public_url: string;
  sort_order: number | null;
};

function formatDate(value: string | null) {
  if (!value) return "";

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;

  return `${day}.${month}.${year}`;
}

function mapPhoto(row: PhotoRow, title: string): GalleryPhoto {
  return {
    id: row.id,
    src: row.public_url,
    downloadUrl: row.public_url,
    alt: `${title} — ${row.filename}`,
    filename: row.filename,
  };
}

function mapGallery(row: GalleryRow, photos: GalleryPhoto[]): Gallery {
  const isDarinaGallery = row.slug === "darina-georgi";

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: formatDate(row.wedding_date),
    message: row.message ?? "Вашите спомени са готови.",
    cover:
      row.cover_url ??
      photos[0]?.src ??
      (isDarinaGallery
        ? "/galleries/darina-georgi/darina-georgi-03.jpg"
        : "/lentium-logo.png"),
    downloadAllUrl: row.mega_url ?? undefined,
    photos:
      photos.length > 0
        ? photos
        : isDarinaGallery
          ? fallbackGallery.photos
          : [],
  };
}

export async function getPublishedGallery(slug: string): Promise<Gallery | null> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return slug === fallbackGallery.slug ? fallbackGallery : null;
  }

  const decodedSlug = decodeURIComponent(slug);

  const { data: galleryData, error: galleryError } = await supabase
    .from("galleries")
    .select(
      "id,slug,title,wedding_date,message,cover_url,mega_url,is_published"
    )
    .eq("slug", decodedSlug)
    .eq("is_published", true)
    .maybeSingle();

  if (galleryError) {
    console.error("Supabase gallery query failed:", galleryError.message);
    return decodedSlug === fallbackGallery.slug ? fallbackGallery : null;
  }

  if (!galleryData) return null;

  const galleryRow = galleryData as GalleryRow;

  const { data: photoData, error: photoError } = await supabase
    .from("photos")
    .select("id,filename,public_url,sort_order")
    .eq("gallery_id", galleryRow.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (photoError) {
    console.error("Supabase photos query failed:", photoError.message);
  }

  const photos = ((photoData ?? []) as PhotoRow[]).map((row) =>
    mapPhoto(row, galleryRow.title)
  );

  return mapGallery(galleryRow, photos);
}

export async function getPublishedGalleries(): Promise<Gallery[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return [fallbackGallery];
  }

  const { data, error } = await supabase
    .from("galleries")
    .select(
      "id,slug,title,wedding_date,message,cover_url,mega_url,is_published"
    )
    .eq("is_published", true)
    .order("wedding_date", { ascending: false });

  if (error) {
    console.error("Supabase gallery list query failed:", error.message);
    return [fallbackGallery];
  }

  return (data as GalleryRow[]).map((row) => mapGallery(row, []));
}

export async function getAdminGallery(slug: string): Promise<Gallery | null> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;

  const decodedSlug = decodeURIComponent(slug);

  const { data: galleryData, error: galleryError } = await supabase
    .from("galleries")
    .select(
      "id,slug,title,wedding_date,message,cover_url,mega_url,is_published"
    )
    .eq("slug", decodedSlug)
    .maybeSingle();

  if (galleryError || !galleryData) {
    if (galleryError) {
      console.error("Admin gallery query failed:", galleryError.message);
    }
    return null;
  }

  const galleryRow = galleryData as GalleryRow;

  const { data: photoData, error: photoError } = await supabase
    .from("photos")
    .select("id,filename,public_url,sort_order")
    .eq("gallery_id", galleryRow.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (photoError) {
    console.error("Admin photos query failed:", photoError.message);
  }

  const photos = ((photoData ?? []) as PhotoRow[]).map((row) =>
    mapPhoto(row, galleryRow.title)
  );

  return mapGallery(galleryRow, photos);
}
