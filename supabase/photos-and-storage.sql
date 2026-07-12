-- Lentium Gallery v0.9
-- Изпълни целия код веднъж в Supabase → SQL Editor.

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references public.galleries(id) on delete cascade,
  filename text not null,
  storage_path text not null unique,
  public_url text not null,
  sort_order integer default 0,
  file_size bigint,
  mime_type text,
  created_at timestamptz not null default now()
);

create index if not exists photos_gallery_id_idx
on public.photos(gallery_id);

create index if not exists photos_gallery_sort_idx
on public.photos(gallery_id, sort_order);

alter table public.photos enable row level security;

drop policy if exists "Public can read photos from published galleries"
on public.photos;

drop policy if exists "Authenticated users can insert photos"
on public.photos;

drop policy if exists "Authenticated users can update photos"
on public.photos;

drop policy if exists "Authenticated users can delete photos"
on public.photos;

create policy "Public can read photos from published galleries"
on public.photos
for select
to public
using (
  exists (
    select 1
    from public.galleries
    where galleries.id = photos.gallery_id
      and galleries.is_published = true
  )
);

create policy "Authenticated users can insert photos"
on public.photos
for insert
to authenticated
with check (true);

create policy "Authenticated users can update photos"
on public.photos
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete photos"
on public.photos
for delete
to authenticated
using (true);

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'galleries',
  'galleries',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Authenticated users can upload gallery photos"
on storage.objects;

drop policy if exists "Authenticated users can update gallery photos"
on storage.objects;

drop policy if exists "Authenticated users can delete gallery photos"
on storage.objects;

create policy "Authenticated users can upload gallery photos"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'galleries');

create policy "Authenticated users can update gallery photos"
on storage.objects
for update
to authenticated
using (bucket_id = 'galleries')
with check (bucket_id = 'galleries');

create policy "Authenticated users can delete gallery photos"
on storage.objects
for delete
to authenticated
using (bucket_id = 'galleries');
