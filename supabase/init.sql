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

-- Cuisines catalog
create table if not exists cuisines (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  emoji text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Cuisines offered per city (drives voting categories)
create table if not exists city_cuisines (
  city_id uuid not null references cities(id) on delete cascade,
  cuisine_id uuid not null references cuisines(id) on delete cascade,
  is_trending boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  primary key (city_id, cuisine_id)
);

-- Places mapped to cuisines
create table if not exists place_cuisines (
  place_id uuid not null references places(id) on delete cascade,
  cuisine_id uuid not null references cuisines(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (place_id, cuisine_id)
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
  username text unique,
  avatar_url text,
  bio text,
  city_id uuid references cities(id) on delete set null,
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

-- Ranked votes per user / cuisine / city
create table if not exists votes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  city_id uuid not null references cities(id) on delete cascade,
  cuisine_id uuid not null references cuisines(id) on delete cascade,
  place_id uuid not null references places(id) on delete cascade,
  rank smallint not null check (rank between 1 and 3),
  points smallint generated always as (
    case rank when 1 then 3 when 2 then 2 when 3 then 1 end
  ) stored,
  created_at timestamptz not null default now(),
  unique (user_id, city_id, cuisine_id, rank),
  unique (user_id, city_id, cuisine_id, place_id),
  constraint votes_city_cuisine_fk foreign key (city_id, cuisine_id)
    references city_cuisines(city_id, cuisine_id) on delete cascade,
  constraint votes_place_cuisine_fk foreign key (place_id, cuisine_id)
    references place_cuisines(place_id, cuisine_id) on delete cascade
);

create index if not exists votes_city_cuisine_idx on votes (city_id, cuisine_id);
create index if not exists votes_place_idx on votes (place_id);

-- Submissions table
create table if not exists submissions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  city_id uuid references cities(id) on delete set null,
  place_name text not null,
  details text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Social feed: posts + media + reactions
create table if not exists posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  city_id uuid references cities(id) on delete set null,
  place_id uuid references places(id) on delete set null,
  caption text,
  visibility text not null default 'public' check (visibility in ('public', 'friends')),
  like_count int not null default 0,
  comment_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_city_created_idx on posts (city_id, created_at desc);
create index if not exists posts_user_created_idx on posts (user_id, created_at desc);

create table if not exists post_media (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references posts(id) on delete cascade,
  media_url text not null,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  width int,
  height int,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists post_comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists post_reactions (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  reaction_type text not null default 'like' check (reaction_type in ('like', 'yum')),
  created_at timestamptz not null default now(),
  unique (post_id, user_id, reaction_type)
);

create table if not exists follows (
  follower_id uuid not null references users(id) on delete cascade,
  followee_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);

-- Top Picks: shareable ranked restaurant selections
create table if not exists top_picks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  city_id uuid not null references cities(id) on delete cascade,
  cuisine_id uuid not null references cuisines(id) on delete cascade,
  title text not null,
  description text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists top_picks_user_idx on top_picks (user_id);
create index if not exists top_picks_city_cuisine_idx on top_picks (city_id, cuisine_id);

-- Top Picks items (ranked places)
create table if not exists top_picks_items (
  id uuid primary key default uuid_generate_v4(),
  top_picks_id uuid not null references top_picks(id) on delete cascade,
  place_id uuid not null references places(id) on delete cascade,
  rank smallint not null check (rank between 1 and 3),
  created_at timestamptz not null default now(),
  unique (top_picks_id, rank),
  unique (top_picks_id, place_id)
);

-- Row Level Security
alter table users enable row level security;
alter table favorites enable row level security;
alter table submissions enable row level security;
alter table cuisines enable row level security;
alter table city_cuisines enable row level security;
alter table place_cuisines enable row level security;
alter table votes enable row level security;
alter table posts enable row level security;
alter table post_media enable row level security;
alter table post_comments enable row level security;
alter table post_reactions enable row level security;
alter table follows enable row level security;
alter table top_picks enable row level security;
alter table top_picks_items enable row level security;

create policy "Users can view own profile" on users
  for select
  using (clerk_user_id = auth.jwt()->>'sub');

create policy "Users can insert own profile" on users
  for insert
  with check (clerk_user_id = auth.jwt()->>'sub');

create policy "Users can update own profile" on users
  for update
  using (clerk_user_id = auth.jwt()->>'sub')
  with check (clerk_user_id = auth.jwt()->>'sub');

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

-- Service role only access
create policy "Service role manages cuisines" on cuisines
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manages city cuisines" on city_cuisines
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manages place cuisines" on place_cuisines
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manages votes" on votes
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manages posts" on posts
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manages post media" on post_media
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manages post comments" on post_comments
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manages post reactions" on post_reactions
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manages follows" on follows
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Users can create own top picks" on top_picks
  for insert
  with check (user_id in (select id from users where clerk_user_id = auth.jwt()->>'sub'));

create policy "Users can view public top picks" on top_picks
  for select
  using (is_public = true or user_id in (select id from users where clerk_user_id = auth.jwt()->>'sub'));

create policy "Users can update own top picks" on top_picks
  for update
  using (user_id in (select id from users where clerk_user_id = auth.jwt()->>'sub'))
  with check (user_id in (select id from users where clerk_user_id = auth.jwt()->>'sub'));

create policy "Users can delete own top picks" on top_picks
  for delete
  using (user_id in (select id from users where clerk_user_id = auth.jwt()->>'sub'));

create policy "Users can manage top picks items" on top_picks_items
  for all
  using (
    top_picks_id in (
      select id from top_picks
      where user_id in (select id from users where clerk_user_id = auth.jwt()->>'sub')
    )
  )
  with check (
    top_picks_id in (
      select id from top_picks
      where user_id in (select id from users where clerk_user_id = auth.jwt()->>'sub')
    )
  );

-- Seed data: Cities
insert into cities (name, slug, state, country, cover_image_url)
values
  ('New York City', 'new-york-city', 'NY', 'United States', 'https://images.pexels.com/photos/3915857/pexels-photo-3915857.jpeg'),
  ('Los Angeles', 'los-angeles', 'CA', 'United States', 'https://images.pexels.com/photos/462331/pexels-photo-462331.jpeg'),
  ('Chicago', 'chicago', 'IL', 'United States', 'https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg')
  on conflict (slug) do nothing;

-- Seed data: Cuisines
insert into cuisines (name, slug, emoji, description)
values
  ('Pizza', 'pizza', '🍕', 'Classic Italian pies and New York slices'),
  ('Sushi', 'sushi', '🍣', 'Fresh Japanese sushi and rolls'),
  ('Ramen', 'ramen', '🍜', 'Authentic Japanese noodle soups'),
  ('Tacos', 'tacos', '🌮', 'Mexican street food and fusion tacos'),
  ('Burgers', 'burgers', '🍔', 'Gourmet and classic burgers'),
  ('Thai', 'thai', '🌶️', 'Spicy and aromatic Thai cuisine'),
  ('Indian', 'indian', '🍛', 'Curries, breads, and Indian classics'),
  ('Dim Sum', 'dim-sum', '🥟', 'Cantonese dim sum and dumplings'),
  ('Steak', 'steak', '🥩', 'Premium cuts and steakhouse fare'),
  ('Vegan', 'vegan', '🥗', 'Plant-based and vegetarian cuisine')
  on conflict (slug) do nothing;

-- Seed data: City-Cuisine mappings (NYC)
insert into city_cuisines (city_id, cuisine_id, is_trending, sort_order)
select c.id, cu.id, true, row_number() over (order by cu.name)
from cities c, cuisines cu
where c.slug = 'new-york-city'
on conflict (city_id, cuisine_id) do nothing;

-- Seed data: City-Cuisine mappings (LA)
insert into city_cuisines (city_id, cuisine_id, is_trending, sort_order)
select c.id, cu.id, true, row_number() over (order by cu.name)
from cities c, cuisines cu
where c.slug = 'los-angeles'
on conflict (city_id, cuisine_id) do nothing;

-- Seed data: City-Cuisine mappings (Chicago)
insert into city_cuisines (city_id, cuisine_id, is_trending, sort_order)
select c.id, cu.id, true, row_number() over (order by cu.name)
from cities c, cuisines cu
where c.slug = 'chicago'
on conflict (city_id, cuisine_id) do nothing;

-- Seed data: Places (NYC)
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
  'Ichiran Ramen',
  'ichiran-ramen-nyc',
  'Authentic Fukuoka-style tonkotsu ramen with rich pork broth.',
  'Counter seating, customizable spice levels, and perfectly cooked noodles. A ramen lover''s paradise in Midtown.',
  '456 Madison Ave, New York, NY',
  'https://example.com',
  '$$$',
  4.8,
  'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg',
  true
from cities c
where c.slug = 'new-york-city'
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
  'Shake Shack',
  'shake-shack-nyc',
  'Premium burgers made with fresh, never-frozen beef.',
  'Iconic NYC burger chain with a cult following. Crispy fries, creamy shakes, and the famous ShackSauce.',
  '789 Park Ave, New York, NY',
  'https://example.com',
  '$$',
  4.6,
  'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
  true
from cities c
where c.slug = 'new-york-city'
  on conflict (slug) do nothing;

-- Seed data: Place-Cuisine mappings (NYC)
insert into place_cuisines (place_id, cuisine_id)
select p.id, cu.id
from places p, cuisines cu
where p.slug = 'midnight-slice-nyc' and cu.slug = 'pizza'
on conflict (place_id, cuisine_id) do nothing;

insert into place_cuisines (place_id, cuisine_id)
select p.id, cu.id
from places p, cuisines cu
where p.slug = 'ichiran-ramen-nyc' and cu.slug = 'ramen'
on conflict (place_id, cuisine_id) do nothing;

insert into place_cuisines (place_id, cuisine_id)
select p.id, cu.id
from places p, cuisines cu
where p.slug = 'shake-shack-nyc' and cu.slug = 'burgers'
on conflict (place_id, cuisine_id) do nothing;
