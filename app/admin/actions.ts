"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const transliteration: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p",
  р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch",
  ш: "sh", щ: "sht", ъ: "a", ь: "", ю: "yu", я: "ya",
};

function transliterate(value: string) {
  return value
    .toLowerCase()
    .split("")
    .map((character) => transliteration[character] ?? character)
    .join("");
}

function makeSlug(value: string) {
  return transliterate(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/&/g, " i ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createGallery(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const title = String(formData.get("title") ?? "").trim();
  const weddingDate = String(formData.get("wedding_date") ?? "").trim();
  const message =
    String(formData.get("message") ?? "").trim() ||
    "Вашите спомени са готови.";
  const coverUrl = String(formData.get("cover_url") ?? "").trim();
  const megaUrl = String(formData.get("mega_url") ?? "").trim();
  const requestedSlug = String(formData.get("slug") ?? "").trim();
  const isPublished = formData.get("is_published") === "on";

  if (!title) {
    redirect("/admin/new?error=missing-title");
  }

  const slug = makeSlug(requestedSlug || title);

  if (!slug) {
    redirect("/admin/new?error=invalid-slug");
  }

  const { data, error } = await supabase
    .from("galleries")
    .insert({
      slug,
      title,
      wedding_date: weddingDate || null,
      message,
      cover_url: coverUrl || null,
      mega_url: megaUrl || null,
      is_published: isPublished,
    })
    .select("slug")
    .single();

  if (error) {
    console.error("Create gallery failed:", error.message);

    if (error.code === "23505") {
      redirect("/admin/new?error=duplicate-slug");
    }

    redirect("/admin/new?error=database");
  }

  revalidatePath("/admin");
  revalidatePath(`/gallery/${data.slug}`);
  redirect(`/admin/gallery/${data.slug}/upload?created=1`);
}
