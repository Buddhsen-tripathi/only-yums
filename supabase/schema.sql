-- OnlyYums Supabase schema

create extension if not exists "uuid-ossp";

create table if not exists cities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  state text not null,
  country text not null default 'United States',
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists places (
  id uuid primary key default uuid_generate_v4(),
  city_id uuid not null references cities(id) on delete cascade,
  name text not null,
  slug text not null unique,
  short_description text not null,
  full_description text not null,
  address text not null,
  website_url text,
  price_level text not null check (price_level in ('$', '$$', '$$$', '$$$$')),
  avg_rating numeric,
  cover_image_url text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists place_images (
  id uuid primary key default uuid_generate_v4(),
  place_id uuid not null references places(id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order int not null default 0
);

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  clerk_user_id text not null unique,
  display_name text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  place_id uuid not null references places(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, place_id)
);

create table if not exists submissions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  city_id uuid not null references cities(id) on delete set null,
  place_name text not null,
  details text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Basic RLS setup (sketched)

alter table users enable row level security;
alter table favorites enable row level security;
alter table submissions enable row level security;

-- Users: a Clerk-authenticated user can only see/update their own row
create policy "Users can view own profile" on users
  for select
  using (clerk_user_id = auth.jwt()->>'sub');

-- Favorites: user can manage their own favorites
create policy "Users can view own favorites" on favorites
  for select
  using (user_id in (select id from users where clerk_user_id = auth.jwt()->>'sub'));

create policy "Users can insert own favorites" on favorites
  for insert
  with check (user_id in (select id from users where clerk_user_id = auth.jwt()->>'sub'));

create policy "Users can delete own favorites" on favorites
  for delete
  using (user_id in (select id from users where clerk_user_id = auth.jwt()->>'sub'));

-- Submissions: user can manage their own submissions; admins will use service role
create policy "Users can view own submissions" on submissions
  for select
  using (user_id in (select id from users where clerk_user_id = auth.jwt()->>'sub'));

create policy "Users can insert submissions" on submissions
  for insert
  with check (user_id in (select id from users where clerk_user_id = auth.jwt()->>'sub'));
