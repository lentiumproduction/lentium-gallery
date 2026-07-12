-- Изпълни веднъж в Supabase → SQL Editor.
-- Създава публичен bucket за корични снимки и позволява качване само на влезли потребители.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'gallery-covers',
  'gallery-covers',
  true,
  6291456,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Authenticated users can upload gallery covers"
on storage.objects;

drop policy if exists "Authenticated users can update gallery covers"
on storage.objects;

drop policy if exists "Authenticated users can delete gallery covers"
on storage.objects;

create policy "Authenticated users can upload gallery covers"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'gallery-covers'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Authenticated users can update gallery covers"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'gallery-covers'
  and owner_id = (select auth.uid()::text)
)
with check (
  bucket_id = 'gallery-covers'
  and owner_id = (select auth.uid()::text)
);

create policy "Authenticated users can delete gallery covers"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'gallery-covers'
  and owner_id = (select auth.uid()::text)
);
