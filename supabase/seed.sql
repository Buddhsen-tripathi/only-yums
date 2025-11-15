-- Seed a few example cities and places for OnlyYums

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
