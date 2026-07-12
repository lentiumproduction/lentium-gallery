import { createSupabaseServerClient } from "@/lib/supabase";
import { fallbackGallery, type Gallery } from "@/data/galleries";

type GalleryRow = {
  slug: string;
  title: string;
  wedding_date: string | null;
  message: string | null;
  cover_url: string | null;
  mega_url: string | null;
  is_published: boolean | null;
};

function formatDate(value: string | null) {
  if (!value) return "";

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;

  return `${day}.${month}.${year}`;
}

function mapRow(row: GalleryRow): Gallery {
  const isDarinaGallery = row.slug === "darina-georgi";

  return {
    slug: row.slug,
    title: row.title,
    date: formatDate(row.wedding_date),
    message: row.message ?? "Вашите спомени са готови.",
    cover:
      row.cover_url ??
      (isDarinaGallery
        ? "/galleries/darina-georgi/darina-georgi-03.jpg"
        : "/lentium-logo.png"),
    downloadAllUrl: row.mega_url ?? undefined,
    photos: isDarinaGallery ? fallbackGallery.photos : [],
  };
}

export async function getPublishedGallery(slug: string): Promise<Gallery | null> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return slug === fallbackGallery.slug ? fallbackGallery : null;
  }

  const { data, error } = await supabase
    .from("galleries")
    .select(
      "slug,title,wedding_date,message,cover_url,mega_url,is_published"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("Supabase gallery query failed:", error.message);
    return slug === fallbackGallery.slug ? fallbackGallery : null;
  }

  return data ? mapRow(data as GalleryRow) : null;
}

export async function getPublishedGalleries(): Promise<Gallery[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return [fallbackGallery];
  }

  const { data, error } = await supabase
    .from("galleries")
    .select(
      "slug,title,wedding_date,message,cover_url,mega_url,is_published"
    )
    .eq("is_published", true)
    .order("wedding_date", { ascending: false });

  if (error) {
    console.error("Supabase gallery list query failed:", error.message);
    return [fallbackGallery];
  }

  return (data as GalleryRow[]).map(mapRow);
}
