-- Jalankan sekali di Supabase: SQL Editor > New query > paste > Run
create table if not exists public.gajian_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  version bigint not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.gajian_data enable row level security;

drop policy if exists "gajian: baca punya sendiri" on public.gajian_data;
drop policy if exists "gajian: tambah punya sendiri" on public.gajian_data;
drop policy if exists "gajian: ubah punya sendiri" on public.gajian_data;
drop policy if exists "gajian: hapus punya sendiri" on public.gajian_data;

create policy "gajian: baca punya sendiri" on public.gajian_data
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "gajian: tambah punya sendiri" on public.gajian_data
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "gajian: ubah punya sendiri" on public.gajian_data
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "gajian: hapus punya sendiri" on public.gajian_data
  for delete to authenticated using ((select auth.uid()) = user_id);

-- biar perangkat lain langsung ke-update (realtime)
do $$ begin
  alter publication supabase_realtime add table public.gajian_data;
exception when duplicate_object then null; end $$;
