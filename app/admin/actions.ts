"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function makeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " i ")
    .replace(/[^a-z0-9\u0400-\u04ff]+/g, "-")
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

  const { error } = await supabase.from("galleries").insert({
    slug,
    title,
    wedding_date: weddingDate || null,
    message,
    cover_url: coverUrl || null,
    mega_url: megaUrl || null,
    is_published: isPublished,
  });

  if (error) {
    console.error("Create gallery failed:", error.message);

    if (error.code === "23505") {
      redirect("/admin/new?error=duplicate-slug");
    }

    redirect("/admin/new?error=database");
  }

  revalidatePath("/admin");
  revalidatePath(`/gallery/${slug}`);
  redirect(`/admin?created=${encodeURIComponent(title)}`);
}
