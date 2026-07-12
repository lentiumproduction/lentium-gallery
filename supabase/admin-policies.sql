-- Изпълни този код веднъж в Supabase → SQL Editor.
-- Той позволява само на влезли потребители да управляват галериите.

drop policy if exists "Authenticated users can insert galleries"
on public.galleries;

drop policy if exists "Authenticated users can update galleries"
on public.galleries;

drop policy if exists "Authenticated users can delete galleries"
on public.galleries;

create policy "Authenticated users can insert galleries"
on public.galleries
for insert
to authenticated
with check (true);

create policy "Authenticated users can update galleries"
on public.galleries
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete galleries"
on public.galleries
for delete
to authenticated
using (true);
