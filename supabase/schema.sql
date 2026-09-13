-- ═══════════════════════════════════════════════════════════════════════════
--  Janji Pengharapan — skema database
--  Jalankan di Supabase → SQL Editor (sekali saja, saat setup awal).
-- ═══════════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ── Admin ────────────────────────────────────────────────────────────────────
-- Siapa saja yang boleh masuk admin panel. Baris ditambahkan manual setelah
-- user dibuat lewat Supabase Auth (Authentication → Users → Add user).
create table if not exists admin_users (
  id         uuid primary key references auth.users on delete cascade,
  name       text,
  role       text not null default 'editor' check (role in ('owner', 'editor')),
  created_at timestamptz not null default now()
);

create or replace function is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from admin_users where id = auth.uid());
$$;

-- ── Konten: artikel / berita / renungan ──────────────────────────────────────
create table if not exists posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  excerpt      text,
  body         text,
  cover_url    text,
  category     text not null default 'renungan'
                 check (category in ('renungan', 'artikel', 'berita', 'kesaksian')),
  author       text,
  published    boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists posts_published_idx on posts (published, published_at desc);

-- ── Quotes / kutipan firman ──────────────────────────────────────────────────
create table if not exists quotes (
  id         uuid primary key default gen_random_uuid(),
  content    text not null,
  reference  text,
  author     text,
  published  boolean not null default true,
  featured   boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── Event ────────────────────────────────────────────────────────────────────
create table if not exists events (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  description  text,
  starts_at    timestamptz not null,
  ends_at      timestamptz,
  location     text,
  address      text,
  map_url      text,
  cover_url    text,
  register_url text,
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists events_starts_at_idx on events (starts_at);

-- ── Layanan ──────────────────────────────────────────────────────────────────
create table if not exists services (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  summary     text,
  description text,
  icon        text default 'heart',
  schedule    text,
  sort_order  int not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── Kurasi konten sosial media ───────────────────────────────────────────────
create table if not exists social_posts (
  id            uuid primary key default gen_random_uuid(),
  platform      text not null check (platform in ('instagram', 'tiktok', 'youtube')),
  url           text not null,
  caption       text,
  thumbnail_url text,
  sort_order    int not null default 0,
  published     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ── Form permohonan pertolongan ──────────────────────────────────────────────
create table if not exists help_requests (
  id                 uuid primary key default gen_random_uuid(),
  ref_code           text unique not null,
  name               text,
  is_anonymous       boolean not null default false,
  phone              text,
  email              text,
  city               text,
  category           text not null default 'doa'
                       check (category in ('doa','konseling','kebutuhan','kunjungan','keuangan','lainnya')),
  urgency            text not null default 'biasa'
                       check (urgency in ('biasa','mendesak','darurat')),
  message            text not null,
  contact_preference text not null default 'whatsapp'
                       check (contact_preference in ('whatsapp','telepon','email','tidak_perlu')),
  is_confidential    boolean not null default false,
  status             text not null default 'baru'
                       check (status in ('baru','diproses','selesai','ditutup')),
  handled_by         text,
  admin_notes        text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists help_requests_status_idx on help_requests (status, created_at desc);

-- ── Pesan dari halaman kontak ────────────────────────────────────────────────
create table if not exists contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text,
  phone      text,
  subject    text,
  message    text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── Pengaturan situs (jam ibadah, alamat, sosmed, dll) ───────────────────────
create table if not exists site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════════════
--  Row Level Security
-- ═══════════════════════════════════════════════════════════════════════════
alter table admin_users      enable row level security;
alter table posts            enable row level security;
alter table quotes           enable row level security;
alter table events           enable row level security;
alter table services         enable row level security;
alter table social_posts     enable row level security;
alter table help_requests    enable row level security;
alter table contact_messages enable row level security;
alter table site_settings    enable row level security;

-- Publik hanya boleh membaca yang sudah published.
create policy "public read published posts"   on posts        for select using (published);
create policy "public read published quotes"  on quotes       for select using (published);
create policy "public read published events"  on events       for select using (published);
create policy "public read published services" on services    for select using (published);
create policy "public read published socials" on social_posts for select using (published);
create policy "public read settings"          on site_settings for select using (true);

-- Siapa pun boleh mengirim permohonan / pesan, tapi tidak boleh membacanya.
create policy "anyone submits help"    on help_requests    for insert with check (true);
create policy "anyone submits contact" on contact_messages for insert with check (true);

-- Admin: akses penuh.
create policy "admin all posts"     on posts            for all using (is_admin()) with check (is_admin());
create policy "admin all quotes"    on quotes           for all using (is_admin()) with check (is_admin());
create policy "admin all events"    on events           for all using (is_admin()) with check (is_admin());
create policy "admin all services"  on services         for all using (is_admin()) with check (is_admin());
create policy "admin all socials"   on social_posts     for all using (is_admin()) with check (is_admin());
create policy "admin all help"      on help_requests    for all using (is_admin()) with check (is_admin());
create policy "admin all contact"   on contact_messages for all using (is_admin()) with check (is_admin());
create policy "admin all settings"  on site_settings    for all using (is_admin()) with check (is_admin());
create policy "admin read self"     on admin_users      for select using (id = auth.uid());

-- ── Storage bucket untuk gambar ──────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');
create policy "admin write media" on storage.objects
  for insert with check (bucket_id = 'media' and is_admin());
create policy "admin update media" on storage.objects
  for update using (bucket_id = 'media' and is_admin());
create policy "admin delete media" on storage.objects
  for delete using (bucket_id = 'media' and is_admin());

-- ── updated_at otomatis ──────────────────────────────────────────────────────
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger posts_touch         before update on posts         for each row execute function touch_updated_at();
create trigger events_touch        before update on events        for each row execute function touch_updated_at();
create trigger help_requests_touch before update on help_requests for each row execute function touch_updated_at();
