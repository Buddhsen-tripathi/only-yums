-- OnlyYums Database Schema & Seed

-- Create extension
create extension if not exists "uuid-ossp";

-- Cities table
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

-- Places table
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

-- Place images table
create table if not exists place_images (
  id uuid primary key default uuid_generate_v4(),
  place_id uuid not null references places(id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order int not null default 0
);

-- Users table
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  clerk_user_id text not null unique,
  display_name text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Favorites table
create table if not exists favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  place_id uuid not null references places(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, place_id)
);

-- Submissions table
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

-- Row Level Security
alter table users enable row level security;
alter table favorites enable row level security;
alter table submissions enable row level security;

create policy "Users can view own profile" on users
  for select
  using (clerk_user_id = auth.jwt()->>'sub');

create policy "Users can view own favorites" on favorites
  for select
  using (user_id in (select id from users where clerk_user_id = auth.jwt()->>'sub'));

create policy "Users can insert own favorites" on favorites
  for insert
  with check (user_id in (select id from users where clerk_user_id = auth.jwt()->>'sub'));

create policy "Users can delete own favorites" on favorites
  for delete
  using (user_id in (select id from users where clerk_user_id = auth.jwt()->>'sub'));

create policy "Users can view own submissions" on submissions
  for select
  using (user_id in (select id from users where clerk_user_id = auth.jwt()->>'sub'));

create policy "Users can insert submissions" on submissions
  for insert
  with check (user_id in (select id from users where clerk_user_id = auth.jwt()->>'sub'));

-- Seed data
insert into cities (name, slug, state, country, cover_image_url)
values
  ('New York City', 'new-york-city', 'NY', 'United States', 'https://images.pexels.com/photos/140734/pexels-photo-140734.jpeg'),
  ('Los Angeles', 'los-angeles', 'CA', 'United States', 'https://images.pexels.com/photos/462331/pexels-photo-462331.jpeg'),
  ('Chicago', 'chicago', 'IL', 'United States', 'https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg')
  on conflict (slug) do nothing;

insert into places (
  city_id,
  name,
  slug,
  short_description,
  full_description,
  address,
  website_url,
  price_level,
  avg_rating,
  cover_image_url,
  is_featured
)
select
  c.id,
  'Midnight Slice',
  'midnight-slice-nyc',
  'Legendary late-night pizza spot in the heart of Manhattan.',
  'A tiny counter-service shop serving foldable New York slices until 3AM. Crispy crust, perfect cheese-to-sauce ratio, and a cult following among service workers and industry folks.',
  '123 W 3rd St, New York, NY',
  'https://example.com',
  '$$',
  4.7,
  'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
  true
from cities c
where c.slug = 'new-york-city'
  on conflict (slug) do nothing;
