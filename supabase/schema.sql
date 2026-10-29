-- Labologics — Supabase schema
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run.
-- Requires Supabase Auth (email / magic link). No extensions needed.

-- ── reports table ──────────────────────────────────────────────────────────
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'Lab Report',
  lab text,
  file_name text,
  language text not null default 'English',
  summary text not null,
  image_url text,
  created_at timestamptz not null default now()
);

create index if not exists reports_user_created_idx
  on public.reports (user_id, created_at desc);

-- ── Row Level Security: users see only their own reports ───────────────────
alter table public.reports enable row level security;

drop policy if exists "Users can read their own reports" on public.reports;
create policy "Users can read their own reports"
  on public.reports for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own reports" on public.reports;
create policy "Users can insert their own reports"
  on public.reports for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own reports" on public.reports;
create policy "Users can delete their own reports"
  on public.reports for delete
  using (auth.uid() = user_id);

-- ── Storage bucket for uploaded report images (private) ────────────────────
insert into storage.buckets (id, name, public)
values ('report-images', 'report-images', true)
on conflict (id) do nothing;

-- Storage policies: each user can upload/list only under their own folder
-- (<user_id>/...). The bucket is public for reading so saved reports can
-- show their image; the path itself is unguessable (user id + timestamp).
-- If you prefer fully private images, set public=false and use signed URLs
-- in src/lib/reports.ts instead of getPublicUrl().

drop policy if exists "Users can upload their own report images" on storage.objects;
create policy "Users can upload their own report images"
  on storage.objects for insert
  with check (
    bucket_id = 'report-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Anyone can read report images" on storage.objects;
create policy "Anyone can read report images"
  on storage.objects for select
  using (bucket_id = 'report-images');

drop policy if exists "Users can delete their own report images" on storage.objects;
create policy "Users can delete their own report images"
  on storage.objects for delete
  using (
    bucket_id = 'report-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
